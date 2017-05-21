
import { Packet } from './Packet';
import { ActionConstructor } from './actions/Action';
import { ActionHandler } from './ActionHandler';
import { RepositoryInterface } from './actions/RepositoryInterface';
import { Port } from './Port';

export type PacketHandlerDescriptor<T, S extends Port> = {handler: ActionHandler<T, S>, action: ActionConstructor<T>};

export interface PacketDispatchDelegate<T> {
	dispatch<S extends Port>(sender: S, packet: Packet<T>): Promise<boolean>;
}

export interface PacketHandler<S extends Port> {
	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, S>): this;
}

export class PacketDispatcher implements PacketDispatchDelegate<any> {
	repository: RepositoryInterface;
	actionHandlers: {[handler: string]: Function[]} = { };

	private static DEFAULT = '*';

	constructor(repository: RepositoryInterface) {
		this.repository = repository;
	}

	bind<T, C, S extends Port>(context: C, descriptors: PacketHandlerDescriptor<T, S>|(PacketHandlerDescriptor<T, S>[])): C {
		if (descriptors instanceof Array) {
			for (let descriptor of descriptors) {
				this.bind(context, descriptor);
			}

			return context;
		}

		let descriptor = <PacketHandlerDescriptor<T, S>>descriptors;
		let method = descriptor.handler;
		let name = PacketDispatcher.DEFAULT;
		let unpack = null;

		if (descriptor.action) {
			let action = this.repository.get(descriptor.action);
			unpack = (packet) => action.unpack(packet.data);
			name = descriptor.action.uid;
		}

		let bound = this.actionHandlers[name] || (this.actionHandlers[name] = []);
		bound.push(
			unpack
				? (sender: S, packet) => method.call(context, unpack(packet), sender, packet)
				: (sender: S, packet) => method.call(context, packet.data, sender, packet)
		);

		return context;
	}

	async dispatch<S extends Port>(sender: S, packet: Packet<any>): Promise<boolean> {
		let handled = false;

		try {
			let promises = [], promise;

			for (let action of [packet.action, PacketDispatcher.DEFAULT]) {
				let handlers = this.actionHandlers[action];

				if (handlers) {
					handled = true;

					for (let handler of handlers) {
						if (promise = handler(sender, packet)) {
							promises.push(promise);
						}
					}

				}
			}

			await Promise.all(promises);
		} catch (e) {
			// let address = e.stack.match(/[^\s]+:\d+(:\d+)/)[0].split(':');
			let stack = e.stack.split("\n").slice(1).join("\n");
			packet.error = `${e}\n${stack}`;

			if (!e.logged) {
				console.error(`Error while dispatching request:`, e);
				e.logged = true;
			}

			throw e;
		}

		return handled;
	}

}
