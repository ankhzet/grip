
import { ClientsPool } from '../parcel/clients-pool';
import { GripClient } from './client';

import { ServerPort } from '../parcel/parcel';
import { ActionHandler } from '../parcel/dispatcher';
import { GripActions } from '../actions/actions';
import { ConnectAction } from '../parcel/actions/connect';

export type ClientActionHandler<T> = ActionHandler<T, GripClient>;

export class BaseServer extends ServerPort<GripClient> {
	contented: ContentedClientsPool = new ContentedClientsPool();

	constructor() {
		super('gearbox', GripActions, (port: chrome.runtime.Port) => {
			return (new GripClient(port))
				.on(ConnectAction, this.connected.bind(this));
		});
	}

	disconnect(client: GripClient) {
		this.clearAfterDisconnect(client);
		this.contented.remove(client);
	}

	clearAfterDisconnect(client: GripClient) {
	}

	connected(client: GripClient) {
		return this.contented.add(client);
	}

}

export class ContentedClientsPool extends ClientsPool<GripClient> {

	fire(sender: string, event: string, payload?: any[]) {
		return this.each((client) => {
			return GripActions.fire(client, { sender, event, payload });
		});
	}

	execute(plugin: any, code: string) {
		return this.each((client) => {
			return GripActions.execute(client, { plugin, code });
		});
	}

}

