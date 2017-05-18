
import { GripClient } from './Client';
import { ServerPort } from '../../core/parcel/ServerPort';

import { DataServer } from '../../core/server/DataServer';
import { GripDB } from '../GripDB';

import { ActionConstructor } from '../../core/parcel/actions/Action';
import { ActionHandler } from '../../core/parcel/ActionHandler';

import { GripActions } from './actions/GripActions';
import { SendAction, SendPacketData } from '../../core/parcel/actions/Base/Send';
import { CacheAction, CachePacketData } from './actions/Cache';
import { Packet } from '../../core/parcel/Packet';
import { ConnectAction, ConnectPacketData } from '../../core/parcel/actions/Base/Connect';
import { ClientActionHandler, ContentedClientsPool } from './ContentedClientsPool';
import { ActionPerformer } from '../../core/parcel/actions/ActionPerformer';
import { UpdatedAction, UpdatedPacketData } from './actions/Updated';

export class GripServer extends ServerPort<GripClient> {
	private contented: ContentedClientsPool = new ContentedClientsPool();
	public db: GripDB;
	public dataServer: DataServer<any, any>;

	constructor(db: GripDB) {
		super('grip', GripActions, (port: chrome.runtime.Port) => {
			return (new GripClient(port))
				.listen(ConnectAction, this.connected.bind(this));
		});

		this.db = db;
		this.dataServer = new DataServer(this, this.db);
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, GripClient>): this {
		return super.on(action, (data, sender, packet) => {
			this._handle(sender, packet);

			return handler.call(this, data, sender, packet);
		});
	}

	_handle(client: GripClient, packet: Packet<any>) {
		console.log(`Client [${client.uid}: ${packet.sender}] requested to '${packet.action}':`);
		console.log(`\tsupplied data:`, packet.data);
	}

	broadcast(callback: (client: GripClient) => any) {
		return this.contented.each(callback);
	}

	clientsInActiveTab(callback: (clients: ContentedClientsPool) => any) {
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		}, (tabs) => {
			let ids = tabs.map((tab) => tab.id);
			callback(
				this.contented
					.filter((client) => ids.indexOf(client.tabId) >= 0)
			);
		});
	}

	disconnect(client: GripClient) {
		try {
			this.clearAfterDisconnect(client);
		} finally {
			this.contented.remove(client);
		}
	}

	clearAfterDisconnect(client: GripClient) {
		console.log(`Disconnected ${client.uid}, cleaning...`);
	}

	connected(data: ConnectPacketData, client: GripClient) {
		console.log(`Connected ${client.uid}:`, data);
		return this.contented.add(client);
	}

}
