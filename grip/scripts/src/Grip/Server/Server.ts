
import { PacketDispatcher } from '../../core/parcel/PacketDispatcher';
import { GripActions } from './actions/GripActions';

import { Server } from '../../core/server/Server';
import { ClientsPool } from '../../core/parcel/ClientsPool';
import { GripClientConnector } from './GripClientConnector';

export class GripServer extends Server<GripClientConnector> {
	constructor() {
		super('grip',
			new PacketDispatcher(GripActions),
			new ClientsPool<GripClientConnector>((port: chrome.runtime.Port) => {
				return new GripClientConnector(port);
			})
		);
	}
}
