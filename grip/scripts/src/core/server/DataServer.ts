
import { DB } from '../db/DB';
import { ClientPort } from '../parcel/ClientPort';
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { PacketHandler } from '../parcel/PacketDispatcher';
import { Packet } from '../parcel/Packet';
import { FetchAction, FetchPacketData } from '../parcel/actions/Base/Fetch';
import { UpdateAction, UpdatePacketData } from './actions/Update';
import { SendPacketData } from '../parcel/actions/Base/Send';
import { Package } from '../db/data/Package';
import { ModelStore } from '../db/ModelStore';
import { SyncResultInterface } from '../db/SyncResultInterface';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { ContainerInterface } from '../db/data/ContainerInterface';
import { AbstractPacker } from './AbstractPacker';
import { PackageInterface } from '../db/data/PackageInterface';
import { Serializer } from "../db/data/Serializer";

export type Mapper<S extends IdentifiableInterface, D extends IdentifiableInterface> = (data: Package<S>) => Package<D>;
export type Updatable<S extends IdentifiableInterface> = (store: ModelStore<S>, data: SyncResultInterface) => any;

export class DataServer<S extends IdentifiableInterface, D> {
	db: DB;
	private _cache: ContainerInterface<Package<any>> = {};
	mappers: ContainerInterface<Mapper<S, any>> = {};
	updatables: ContainerInterface<Updatable<S>> = {};

	packer: EntityPacker<S, D> = new EntityPacker<S, D>();

	constructor(handler: PacketHandler<ClientPort>, db: DB) {
		this.db = db;

		handler.on(FetchAction, this.fetch.bind(this));
		handler.on(UpdateAction, this.update.bind(this));
	}

	registerSerializer(name: string, serializer: Serializer<S, D>) {
		return this.packer.registerSerializer(name, serializer);
	}

	registerMapper(name: string, mapper: Mapper<S, any>) {
		return this.mappers[name] = mapper;
	}

	registerUpdatable(name: string, updatable: Updatable<S>) {
		return this.updatables[name] = updatable;
	}

	cache(what: string, data: Package<S>) {
		let store = this._cache[what];

		if (!store) {
			store = this._cache[what] = {};
		}

		let mapped = this.mapped(what, data);

		for (let uid in mapped) {
			let fragment = mapped[uid];

			if (fragment) {
				store[uid] = fragment;
			} else {
				if (store[uid]) {
					delete store[uid];
				}
			}
		}

		return mapped;
	}

	cached<I extends S>(what: string): Package<I> {
		let cache = this._cache[what];

		return cache ? this.mapped(what, cache) : <Package<I>>{};
	}

	mapped(what: string, data: Package<any>): Package<any> {
		let mapper = this.mappers[what];

		return mapper ? mapper(data) : data;
	}

	fetch(client: ClientPort, { what, query, payload: requestID }: FetchPacketData, packet: Packet<FetchPacketData>) {
		let sender = (data: Package<S>) => {
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
				let pack = <PackageInterface<S>>{};

				for (let fragment of data) {
					pack[fragment.uid] = fragment;
				}

				return sender(this.cache(what, pack));
			});
	}

	update(client: ClientPort, { what, data, payload: requestID }: UpdatePacketData, packet: Packet<UpdatePacketData>) {
		this.db.query(what)
			.specific(null, (table) => {
				let store = new ModelStore(table);

				store.syncModels(data)
					.then((result: SyncResultInterface) => {
						let updatable = this.updatables[what];

						if (updatable) {
							updatable(store, result);
						}

						this.send(client, { what, data: result.request, payload: requestID }, packet);
					})
					.catch((error) => {
						console.log(`Failed to update "${what}" with data:\n`, data);

						throw new Error(`Failed to update "${what}":\n${error}`);
					});
			});
	}

	send(client: ClientPort, data: SendPacketData, packet) {
		return BaseActions.send(client, data);
	}

}

class EntityPacker<T extends IdentifiableInterface, R> extends AbstractPacker<T, R|T> {

	pack(what: string, data: Package<T>): (R|T)[] {
		let serializer = this.serializers[what];

		let uids = Object.keys(data);

		return serializer
			? uids.map((key) => serializer(data[key]))
			: uids.map((key) => data[key]);
	}

}
