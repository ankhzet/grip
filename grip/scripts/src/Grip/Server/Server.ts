
import { Server } from '../../core/server/Server';
import { PacketDispatcher } from '../../core/parcel/PacketDispatcher';
import { GripClient } from './GripClient';
import { GripActions } from './actions/GripActions';
import { ContentedClientsPool } from './ContentedClientsPool';

export class GripServer extends Server<GripClient> {
	constructor() {
		super('grip',
			new PacketDispatcher(GripActions),
			new ContentedClientsPool((port: chrome.runtime.Port) => {
				return new GripClient(port);
			})
		);
	}
}
