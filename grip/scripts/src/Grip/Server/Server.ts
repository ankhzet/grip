
import { Server } from '../../core/server/Server';
import { PacketDispatcher } from '../../core/parcel/PacketDispatcher';
import { GripClient } from './GripClient';
import { GripActions } from './actions/GripActions';
import { ClientsPool } from '../../core/parcel/ClientsPool';

export class GripServer extends Server<GripClient> {
	constructor() {
		super('grip',
			new PacketDispatcher(GripActions),
			new ClientsPool<GripClient>((port: chrome.runtime.Port) => {
				return new GripClient(port);
			})
		);
	}
}
