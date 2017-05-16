
import { BaseServer, ContentedClientsPool, ClientActionHandler } from './base';
import { GripClient } from './client';
import { GripActions } from '../actions/actions';
import { SendPacketData } from '../parcel/actions/send';

export class GripServer extends BaseServer {

	force: {
		send: ClientActionHandler<SendPacketData>;
	};

	constructor() {
		super();

		this.force = {
			send: (client: GripClient, data: SendPacketData, packet) => {
				return GripActions.send(client, data);
			}
		};
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

}
