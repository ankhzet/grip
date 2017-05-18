
import { DB } from '../db/DB';
import { ClientPort } from '../parcel/ClientPort';
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { PacketHandler } from '../parcel/PacketDispatcher';
import { Packet } from '../parcel/Packet';
import { FetchAction, FetchPacketData } from './actions/Fetch';
import { UpdateAction, UpdatePacketData } from './actions/Update';
import { SendPacketData } from '../parcel/actions/Base/Send';
import { Package } from '../db/data/Package';
import { ModelStore } from '../db/ModelStore';
import { SyncResultInterface } from '../db/SyncResultInterface';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { ContainerInterface } from '../db/data/ContainerInterface';
import { AbstractPacker } from './AbstractPacker';
import { PackageInterface } from '../db/data/PackageInterface';
import { Serializer } from '../db/data/Serializer';
import { Collection } from './data/Collection';

export type Mapper<S extends IdentifiableInterface, D extends IdentifiableInterface> = (data: Package<S>) => Package<D>;
export type Updatable<S extends IdentifiableInterface> = (store: ModelStore<S>, data: SyncResultInterface) => any;

export class DataServer<S extends IdentifiableInterface, D> {
	private _cache: ContainerInterface<Package<any>> = {};
	private mappers: ContainerInterface<Mapper<S, any>> = {};
	private updatables: ContainerInterface<Updatable<S>> = {};

	private packer: EntityPacker<S, D> = new EntityPacker<S, D>();

	public db: DB;

	private collections: {[name: string]: Collection<S>};

	constructor(handler: PacketHandler<ClientPort>, db: DB) {
		this.db = db;

		// todo: mapping/encoding

		handler.on(FetchAction, this.fetch.bind(this));
		handler.on(UpdateAction, this.update.bind(this));
	}

	collection(name: string, factory: (uid: string) => S) {
		return this.collections[name] = new Collection<S>(this.db, name, factory);
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

	fetch({ what, query, payload }: FetchPacketData, client: ClientPort) {
		let collection = this.collections[what];

		if (!collection) {
			return;
		}

		collection.fetch(query)
			.then((data: Package<S>) => (
				this.send(client, {
					data: this.packer.pack(what, data),
					what,
					payload
				})
			))
		;
	}

	update({ what, data, payload }: UpdatePacketData, client: ClientPort) {
		let collection = this.collections[what];

		if (!collection) {
			return;
		}

		collection.update(data)
			.then((result: SyncResultInterface) => (
				this.send(client, {
					data: result.request,
					what,
					payload
				})
			))
			.catch((error) => {
				console.log(`Failed to update "${what}" with data:\n`, data);
				console.log(error);

				throw new Error(`Failed to update "${what}":\n${error}`);
			})
		;
	}

	send(client: ClientPort, data: SendPacketData) {
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
