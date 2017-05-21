
import { Port } from './Port';
import { PortUtils } from './PortUtils';

import { PacketDispatcher, PacketHandler } from './PacketDispatcher';
import { Packet } from './Packet';

import { Action, ActionConstructor } from './actions/Action';
import { ActionHandler } from './ActionHandler';
import { ActionPerformer } from './actions/ActionPerformer';

import { ClientsPool } from './ClientsPool';
import { HandshakeAction, HandshakePacketData } from './actions/Base/Handshake';

export abstract class Listener<C extends Port> implements PacketHandler<C> {
	private pool: ClientsPool<C>;
	private dispatcher: PacketDispatcher;

	public name: string;
	public uid: string = PortUtils.guid('L');

	constructor(name: string, dispatcher: PacketDispatcher, pool: ClientsPool<C>) {
		this.name = PortUtils.portName(name);
		this.dispatcher = dispatcher;
		this.pool = pool;

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
		return this.pool
			.create(port)
			.listen(HandshakeAction, this.handshake.bind(this));
	}

	disconnect(client: C): boolean {
		return (
			this.pool.remove(client)
				? client.disconnect()
				: true
		);
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, C>): this {
		return this.dispatcher.bind(this, { action, handler });
	}

	broadcast<T>(action: ActionPerformer<T, Action<T>>, data: T) {
		return this.pool.broadcast(action, data);
	}

	handshake(data: HandshakePacketData, client: C) {
		this.pool.add(client);
		console.log('handshaked', data);

		return client.listen(null, (sender: C, data: any, packet: Packet<any>) => {
			return this.dispatcher.dispatch(client, packet);
		});
	}

}

