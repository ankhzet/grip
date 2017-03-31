
import { DB } from '../db/db';
import { ClientPort } from '../parcel/parcel';
import { Actions } from '../parcel/actions/actions';
import { PacketHandler } from '../parcel/dispatcher';
import { Packet } from '../parcel/packet';
import { FetchAction, FetchPacketData } from '../parcel/actions/fetch';
import { UpdateAction, UpdatePacketData } from '../parcel/actions/update';
import { SendPacketData } from '../parcel/actions/send';
import { ModelStore, SyncResult } from '../gearbox-db';

export type Serializer = (data: any) => any;

export type Mapper = (data: Package<any>) => Package<any>;

export type Updatable = (store: ModelStore, data: SyncResult) => any;

export interface Container<T> {
	[name: string]: T;
}

export interface Package<T extends Identifiable> {
	[uid: string]: T;
}

export interface Identifiable {
	uid: string;
}

export class DataServer {
	db: DB;
	private _cache: Container<Package<any>> = {};
	mappers: Container<Mapper> = {};
	updatables: Container<Updatable> = {};

	packer: EntityPacker = new EntityPacker();

	constructor(handler: PacketHandler<ClientPort>, db: DB) {
		this.db = db;

		handler.on(FetchAction, this.fetch.bind(this));
		handler.on(UpdateAction, this.update.bind(this));
	}

	registerSerializer(name: string, serializer: Serializer) {
		return this.packer.registerSerializer(name, serializer);
	}

	registerMapper(name: string, mapper: Mapper) {
		return this.mappers[name] = mapper;
	}

	registerUpdatable(name: string, updatable: Updatable) {
		return this.updatables[name] = updatable;
	}

	cache(what: string, data: Package<any>) {
		let store = this._cache[what];
		if (!store)
			store = this._cache[what] = {};

		let mapped = this.mapped(what, data);
		for (let uid in mapped) {
			let fragment = mapped[uid];
			if (fragment)
				store[uid] = fragment;
			else
				if (store[uid])
					delete store[uid];
		}

		return mapped;
	}

	cached<I extends Identifiable>(what: string): Package<I> {
		let cache = this._cache[what];
		if (!cache)
			return <Package<I>>{};

		return this.mapped(what, cache);
	}

	mapped(what: string, data: Package<any>): Package<any> {
		let mapper = this.mappers[what];
		return mapper
			? mapper(data)
			: data;
	}

	fetch(client: ClientPort, { what, query, payload: requestID }: FetchPacketData, packet: Packet<FetchPacketData>) {
		let sender = (data: Package<Identifiable>) => {
			return this.send(client, {
				what,
				data: this.packer.pack(what, data),
				payload: requestID
			}, packet);
		};


		this.db.query(what, query)
			.specific(
				Object.keys(this.cache),
				() => sender(this.cached(what))
			)
			.fetch((err, data: any[]) => {
				let pack = <Package<Identifiable>>{};
				for (let fragment of data)
					pack[fragment.uid] = fragment;

				return sender(this.cache(what, pack));
			});
	}

	update(client: ClientPort, { what, data, payload: requestID }: UpdatePacketData, packet: Packet<UpdatePacketData>) {
		this.db.query(what)
			.specific(null, (table) => {
				let store = new ModelStore(table);

				store.syncModels(data)
					.then((result: SyncResult) => {
						let updatable = this.updatables[what];
						if (updatable)
							updatable(store, result);

						this.send(client, { what, data: result.request, payload: requestID }, packet);
					})
					.catch((error) => {
						console.log(`Failed to update "${what}" with data:\n`, data);
						throw new Error(`Failed to update "${what}":\n${error}`);
					});
			});
	}

	send(client: ClientPort, data: SendPacketData, packet) {
		return Actions.send(client, data);
	}

}

abstract class Packer<T extends Identifiable, R> {
	serializers: Container<Serializer> = {};

	registerSerializer(name: string, serializer: Serializer) {
		this.serializers[name] = serializer;
	}

	abstract pack(what: string, data: Package<T>): R;
}

class EntityPacker extends Packer<Identifiable, any[]> {

	pack(what: string, data: Package<Identifiable>): any[] {
		let serializer = this.serializers[what];

		let uids = Object.keys(data);
		return serializer
			? uids.map((key) => serializer(data[key]))
			: uids.map((key) => data[key]);
	}

}
