
import { BaseServer, ContentedClientsPool, ClientActionHandler } from './base';
import { GearBoxClient } from './client';
import { GearBoxActions } from '../actions/actions';
import { SendPacketData } from '../parcel/actions/send';

export class GearBoxServer extends BaseServer {

	force: {
		send: ClientActionHandler<SendPacketData>;
	};

	constructor() {
		super();

		this.force = {
			send: (client: GearBoxClient, data: SendPacketData, packet) => {
				return GearBoxActions.send(client, data);
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
