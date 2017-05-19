
import { ServerPort } from '../../core/parcel/ServerPort';
import { SyncServer } from '../../core/server/DataServer';

import { ClientPort } from '../../core/parcel/ClientPort';
import { ClientsPool } from '../../core/parcel/ClientsPool';
import { PacketDispatcher } from '../../core/parcel/PacketDispatcher';
import { Collection } from '../../core/server/data/Collection';

export class GripServer<C extends ClientPort> extends ServerPort<C> {
	public synchronised: SyncServer;

	constructor(dispatcher: PacketDispatcher, pool: ClientsPool<C>) {
		super('grip', dispatcher, pool);
		this.synchronised = new SyncServer(this);

		this.on(null, (data, client, packet) => {
			console.log(`Client [${client.uid}: ${packet.sender}] requested to '${packet.action}':`);
			console.log(`\tsupplied data:`, packet.data);
		});
	}

	collection(collection: Collection<any>) {
		return this.synchronised.collection(collection);
	}

	clientsInActiveTab(callback: (clients: ClientsPool<C>) => any) {
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		}, (tabs) => {
			let ids = tabs.map((tab) => tab.id);

			callback(
				this.clients
					.filter((client) => (
						ids.indexOf(client.tabId) >= 0
					))
			);
		});
	}

	disconnect(client: C): boolean {
		let deleted = false;

		try {
			this.clearAfterDisconnect(client);
		} finally {
			deleted = super.disconnect(client);
		}

		return deleted;
	}

	clearAfterDisconnect(client: C) {
		console.log(`Disconnected ${client.uid}, cleaning...`);
	}

}
