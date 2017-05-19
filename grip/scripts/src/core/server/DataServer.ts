
import { ClientPort } from '../parcel/ClientPort';
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { PacketHandler } from '../parcel/PacketDispatcher';
import { FetchAction, FetchPacketData } from './actions/Fetch';
import { UpdateAction, UpdatePacketData } from './actions/Update';
import { SendPacketData } from '../parcel/actions/Base/Send';
import { Package } from '../db/data/Package';
import { SyncResultInterface } from '../db/SyncResultInterface';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { Collection } from './data/Collection';

export class SyncServer {
	private collections: {[name: string]: Collection<any>};

	constructor(handler: PacketHandler<ClientPort>) {
		handler.on(FetchAction, this.fetch.bind(this));
		handler.on(UpdateAction, this.update.bind(this));
	}

	collection<T extends IdentifiableInterface>(collection: Collection<T>): Collection<IdentifiableInterface> {
		return this.collections[collection.name] = collection;
	}

	fetch({ what, query, payload }: FetchPacketData, client: ClientPort) {
		let collection = this.collections[what];

		if (!collection) {
			return;
		}

		collection.fetch(query)
			.then((data: Package<IdentifiableInterface>) => (
				this.send(client, {
					data: Object.keys(data).map((uid) => data[uid]),
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
