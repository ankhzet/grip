
import { Port } from './port';
import { Actions, ActionsRepository } from './actions/actions';
import { PacketDispatcher, ActionHandler, PacketHandler } from './dispatcher';
import { Packet } from './packet';
import { ActionConstructor } from './actions/action';
import { ConnectAction, ConnectPacketData } from './actions/connect';

export class ClientPort extends Port {
	tabId: number;

	uid: string = `${Math.random()}`;
	touched: number = 0;
	dispatcher: PacketDispatcher = new PacketDispatcher(Actions);

	constructor(name: string, port?: chrome.runtime.Port) {
		super(name);
		this.on(ConnectAction, this.connectable);

		this.rebind(port);
		if (!port)
			this.connect();
	}

	disconnect() {
		if (this.port) {
			this.port.disconnect();
		}
	}

	rebind(port?: chrome.runtime.Port) {
		return this.bind(port || chrome.runtime.connect({ name: this.name }));
	}

	connect() {
		return Actions.connect(this, { uid: this.uid });
	}

	bind(port) {
		if (!port) {
			return;
		}

		port.onMessage.addListener(this.process.bind(this));
		port.onDisconnect.addListener(() => { this.port = null; });

		return this.port = port;
	}

	on<T, H>(action: ActionConstructor<T>, handler: ActionHandler<T, H>): this {
		return this.dispatcher.bind(this, { handler, action });
	}

	send(action, data?, error?) {
		if (!this.port) {
			return;
		}

		let packet = {
			sender: this.uid,
			action: action,
			data: data,
			error: null,
		};

		if (error) {
			packet.error = error;
		}

		this.port.postMessage(packet);
	}

	process(packet: Packet<any>) {
		console.log(arguments);
		this.touched = +new Date;

		if (this.dispatcher.dispatch(this, packet)) {
			if (packet.error) {
				Actions.send(this, { what: 'error', data: packet });
			}
		}
	}

	connectable(sender, { uid }, packet: Packet<ConnectPacketData>) {
		this.uid = uid;
	}

}

type ClientFactory<C extends ClientPort> = (port: chrome.runtime.Port) => C;

export abstract class ServerPort<C extends ClientPort> extends Port implements PacketHandler<C> {
	private factory: ClientFactory<C>;
	private dispatcher: PacketDispatcher;

	constructor(name: string, repository: ActionsRepository, factory: ClientFactory<C>) {
		super(name);
		this.factory = factory;
		this.dispatcher = new PacketDispatcher(repository);

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

	connect(port: chrome.runtime.Port): C {
		let client = this.factory(port);

		return client.on(null, (sender: C, data: any, packet: Packet<any>) => {
			return this.dispatcher.dispatch(client, packet);
		});
	}

	disconnect(client: C) {
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, C>): this {
		return this.dispatcher.bind(this, { action, handler });
	}

}

