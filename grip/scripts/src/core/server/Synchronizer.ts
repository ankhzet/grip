
import { Port } from '../parcel/Port';
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { PacketHandler } from '../parcel/PacketDispatcher';
import { FetchAction, FetchPacketData } from './actions/Fetch';
import { UpdateAction, UpdatePacketData } from './actions/Update';
import { SendPacketData } from '../parcel/actions/Base/Send';
import { Package } from '../db/data/Package';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { Collection } from './data/Collection';
import { PackageInterface } from '../db/data/PackageInterface';
import { TranscoderInterface } from './TranscoderInterface';
import { ActionConstructor } from '../parcel/actions/Action';
import { CollectionPacketData } from './actions/Collection';

export interface CollectionThunk<M extends IdentifiableInterface, D> {
	collection: Collection<M>;
	transcoder: TranscoderInterface<M, D>;
}

export class Synchronizer {
	private collections: {[name: string]: CollectionThunk<any, any>};

	constructor(handler: PacketHandler<Port>) {
		this.collections = {};

		this.thunked(handler, FetchAction , this.fetch);
		this.thunked(handler, UpdateAction, this.update);
	}

	collection<T extends IdentifiableInterface>(collection: Collection<T>, transcoder: TranscoderInterface<T, any>): CollectionThunk<T, any> {
		return this.collections[collection.name] = {
			collection,
			transcoder,
		};
	}

	thunked<T extends CollectionPacketData>(handler: PacketHandler<Port>, action: ActionConstructor<T>, listener: (thunk: CollectionThunk<any, any>, data: T, client: Port) => Promise<any>) {
		handler.on(action, (data: T, client: Port) => {
			let thunk = this.collections[data.what];

			if (thunk) {
				listener.call(this, thunk, data, client);
			}
		});
	}

	fetch(thunk: CollectionThunk<any, any>, { what, data: query, payload }: FetchPacketData, client: Port) {
		return thunk.collection
			.fetch(query)
			.then((data: Package<IdentifiableInterface>) => {
				this.send(client, {
					data: this.encode(thunk, data),
					what,
					payload
				})
			})
		;
	}

	update(thunk: CollectionThunk<any, any>, { what, data, payload }: UpdatePacketData, client: Port) {
		return thunk.collection
			.update(this.decode(thunk, data))
			.then((pack: PackageInterface<any>) => (
				this.send(client, {
					data: Object.keys(pack),
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

	send(client: Port, data: SendPacketData) {
		return BaseActions.send(client, data);
	}

	encode<T extends IdentifiableInterface>(thunk: CollectionThunk<T, any>, data?: PackageInterface<T>): PackageInterface<any> {
		return Package.create<T, any>(data, (i: T) => thunk.transcoder.encode(i));
	}

	decode<T extends IdentifiableInterface>(thunk: CollectionThunk<T, any>, data?: PackageInterface<any>): PackageInterface<T> {
		return Package.create<any, T>(data, (i: any) => thunk.transcoder.decode(i));
	}

}
