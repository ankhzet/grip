

import { ClientFactory, ClientPort } from './ClientPort';
import { Port } from './Port';
import { PacketDispatcher, PacketHandler } from './PacketDispatcher';
import { RepositoryInterface } from './actions/RepositoryInterface';
import { Packet } from './Packet';
import { ActionConstructor } from './actions/Action';
import { ActionHandler } from './ActionHandler';

export abstract class ServerPort<C extends ClientPort> extends Port implements PacketHandler<C> {
	private factory: ClientFactory<C>;
	private dispatcher: PacketDispatcher;

	constructor(name: string, repository: RepositoryInterface, factory: ClientFactory<C>) {
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

		return client.listen(null, (sender: C, data: any, packet: Packet<any>) => {
			return this.dispatcher.dispatch(client, packet);
		});
	}

	disconnect(client: C) {
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, C>): this {
		return this.dispatcher.bind(this, { action, handler });
	}

}

