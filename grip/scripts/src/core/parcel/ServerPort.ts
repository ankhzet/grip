

import { ClientPort } from './ClientPort';
import { Port } from './Port';
import { PacketDispatcher, PacketHandler } from './PacketDispatcher';
import { Packet } from './Packet';
import { Action, ActionConstructor } from './actions/Action';
import { ActionHandler } from './ActionHandler';
import { ClientsPool } from './ClientsPool';
import { ActionPerformer } from './actions/ActionPerformer';

export abstract class ServerPort<C extends ClientPort> extends Port implements PacketHandler<C> {
	private pool: ClientsPool<C>;
	private dispatcher: PacketDispatcher;

	uid: string = ClientPort.guid('listener');

	constructor(name: string, dispatcher: PacketDispatcher, pool: ClientsPool<C>) {
		super(name);
		this.dispatcher = dispatcher;
		this.pool = pool;

		chrome.runtime.onConnect.addListener((port) => {
			if (port.name === this.name) {
				let client = this.connect(port);

				if (client) {
					if (port.sender.tab) {
						client.tabId = port.sender.tab.id;
					}

					port.onDisconnect.addListener(() => {
						this.disconnect(client);
					});
				}
			}
		});
	}

	get clients(): ClientsPool<C> {
		return this.pool;
	}

	connect(port: chrome.runtime.Port): C {
		let client = this.pool.create(port);

		return client.listen(null, (sender: C, data: any, packet: Packet<any>) => {
			return this.dispatcher.dispatch(client, packet);
		});
	}

	disconnect(client: C): boolean {
		return this.pool.remove(client);
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, C>): this {
		return this.dispatcher.bind(this, { action, handler });
	}

	broadcast<T>(action: ActionPerformer<T, Action<T>>, data: T) {
		return this.pool.broadcast(action, data);
	}

}

