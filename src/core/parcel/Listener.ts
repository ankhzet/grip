
import { Port } from './Port';
import { PortUtils } from './PortUtils';

import { Action } from './actions/Action';
import { ActionPerformer } from './actions/ActionPerformer';

import { ClientsPool } from './ClientsPool';

export abstract class Listener<C extends Port> {
	private pool: ClientsPool<C>;

	public name: string;
	public uid: string = PortUtils.guid('L');

	constructor(name: string, pool: ClientsPool<C>) {
		this.name = PortUtils.portName(name);
		this.pool = pool;
	}

	public listen() {
		chrome.runtime.onConnect.addListener((port) => {
			if (port.name !== this.name) {
				return;
			}

			let client = this.connect(port);

			if (client) {
				if (port.sender.tab) {
					client.tabId = port.sender.tab.id;
				}

				port.onDisconnect.addListener(() => {
					this.disconnect(client);
				});
			}
		});
	}

	get clients(): ClientsPool<C> {
		return this.pool;
	}

	connect(port: chrome.runtime.Port): C {
		return this.pool.create(port);
	}

	add(client: C): C {
		return <C>this.pool.add(client);
	}

	disconnect(client: C): boolean {
		return (
			this.pool.remove(client)
				? client.disconnect()
				: true
		);
	}

	broadcast<T>(action: ActionPerformer<T, Action<T>>, data: T) {
		return this.pool.broadcast(action, data);
	}
}

