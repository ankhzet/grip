
import { Action } from './actions/Action';
import { ActionPerformer } from './actions/ActionPerformer';
import { ClientFactory, Port } from './Port';

export class ClientsPool<C extends Port> {
	private factory: ClientFactory<C>;
	private clients: {[uid: string]: C} = {};

	constructor(factory: ClientFactory<C>) {
		this.factory = factory;
	}

	create(port: chrome.runtime.Port): C {
		return this.factory(port);
	}

	add(client: C[]|C): C[]|C {
		return (
			(client instanceof Array)
				? <C[]>client.map((client) => this.add(client))
				: this.clients[client.uid] = client
		);
	}

	remove(client: C): boolean {
		return delete this.clients[client.uid];
	}

	has(client: C): boolean {
		return !!this.clients[client.uid];
	}

	each(callback: (client: C) => boolean) {
		for (let uid in this.clients) {
			if (callback(this.clients[uid]) === false) {
				return false;
			}
		}

		return true;
	}

	filter(callback) {
		let client, all = [];

		for (let uid in this.clients) {
			if (callback(client = this.clients[uid])) {
				all.push(client);
			}
		}

		return new (<any>this.constructor)(all);
	}

	broadcast<T, A extends Action<T>>(action: ActionPerformer<T, A>, data: T) {
		return this.each((client) => {
			return action(client, data);
		});
	}

}
