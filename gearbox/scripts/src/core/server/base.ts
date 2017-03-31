
import { ClientsPool } from '../parcel/clients-pool';
import { GearBoxClient } from './client';

import { ServerPort } from '../parcel/parcel';
import { ActionHandler } from '../parcel/dispatcher';
import { GearBoxActions } from '../actions/actions';
import { ConnectAction } from '../parcel/actions/connect';

export type ClientActionHandler<T> = ActionHandler<T, GearBoxClient>;

export class BaseServer extends ServerPort<GearBoxClient> {
	contented: ContentedClientsPool = new ContentedClientsPool();

	constructor() {
		super('gearbox', GearBoxActions, (port: chrome.runtime.Port) => {
			return (new GearBoxClient(port))
				.on(ConnectAction, this.connected.bind(this));
		});
	}

	disconnect(client: GearBoxClient) {
		this.clearAfterDisconnect(client);
		this.contented.remove(client);
	}

	clearAfterDisconnect(client: GearBoxClient) {
	}

	connected(client: GearBoxClient) {
		return this.contented.add(client);
	}

}

export class ContentedClientsPool extends ClientsPool<GearBoxClient> {

	fire(sender: string, event: string, payload?: any[]) {
		return this.each((client) => {
			return GearBoxActions.fire(client, { sender, event, payload });
		});
	}

	execute(plugin: any, code: string) {
		return this.each((client) => {
			return GearBoxActions.execute(client, { plugin, code });
		});
	}

}

