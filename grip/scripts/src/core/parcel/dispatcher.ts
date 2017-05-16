
import { Packet } from './packet';
import { ActionsRepository } from './actions/actions';
import { ActionConstructor } from './actions/action';

export type ActionHandler<T, S> = (sender: S, data: T, packet: Packet<T>) => any;
export type PacketHandlerDescriptor<T, S> = {handler: ActionHandler<T, S>, action: ActionConstructor<T>};

export interface PacketDispatchDelegate<T> {
	dispatch<S>(sender: S, packet: Packet<T>): boolean;
}

export interface PacketHandler<S> {
	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, S>): this;
}

export class PacketDispatcher implements PacketDispatchDelegate<any> {
	repository: ActionsRepository;
	actionHandlers: {[handler: string]: Function[]} = { };

	private static DEFAULT = '*';

	constructor(repository: ActionsRepository) {
		this.repository = repository;
	}

	bind<T, C, S>(context: C, descriptors: PacketHandlerDescriptor<T, S>|(PacketHandlerDescriptor<any, S>[])): C {
		if (descriptors instanceof Array) {
			for (let descriptor of descriptors)
				this.bind(context, descriptor);

			return context;
		}

		let descriptor = <PacketHandlerDescriptor<T, S>>descriptors;
		let method = descriptor.handler;
		let handler, name = PacketDispatcher.DEFAULT;

		if (descriptor.action) {
			name = descriptor.action.uid;

			let action = this.repository.get(descriptor.action);
			handler = function (sender: S, packet) {
				return method.call(context, sender, action.unpack(packet.data), packet);
			};
		} else {
			handler = function (sender: S, packet) {
				return method.call(context, sender, packet.data, packet);
			};
		}

		let bound = this.actionHandlers[name];
		if (!bound)
			bound = this.actionHandlers[name] = [];
		bound.push(handler);

		return context;
	}

	dispatch<S>(sender: S, packet: Packet<any>) {
		let handled = false;

		try {

			for (let action of [packet.action, PacketDispatcher.DEFAULT]) {
				let handlers = this.actionHandlers[action];
				if (handlers) {
					handled = true;

					for (let handler of handlers) {
						handler(sender, packet);
					}
				}
			}

		} catch (e) {
			// let address = e.stack.match(/[^\s]+:\d+(:\d+)/)[0].split(':');
			let stack = e.stack.split("\n").slice(1).join("\n");
			packet.error = `${e}\n${stack}`;
			console.error(`Error while dispatching request:`, e);
		}

		return handled;
	}

}
