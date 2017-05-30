
import { PacketDispatcher } from '../../core/parcel/PacketDispatcher';
import { GripActions } from './actions/GripActions';

import { Server } from '../../core/server/Server';
import { ClientsPool } from '../../core/parcel/ClientsPool';
import { GripClientConnector } from './GripClientConnector';
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { CollectionThunk } from '../../core/server/Synchronizer';
import { Collection } from '../../core/server/data/Collection';
import { TranscoderInterface } from '../../core/server/TranscoderInterface';

export class GripServer extends Server<GripClientConnector> {
	constructor() {
		super('grip',
			new PacketDispatcher(GripActions),
			new ClientsPool<GripClientConnector>((port: chrome.runtime.Port) => {
				return new GripClientConnector(port);
			})
		);
	}

	public collection<M extends IdentifiableInterface, D>(collection: Collection<M>, transcoder?: TranscoderInterface<M, D>): CollectionThunk<M, D> {
		collection.changed((uids: string[]) => {
			this.broadcast(GripActions.updated, { what: name, uids});
		});

		return super.collection(collection, transcoder);
	}

	public thunk<M extends IdentifiableInterface, D>(thunk: CollectionThunk<M, D>): CollectionThunk<M, D> {
		return this.collection(thunk.collection, thunk.transcoder);
	}

}
