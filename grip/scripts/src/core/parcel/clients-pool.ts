
import { ClientPort } from './parcel';

export class ClientsPool<C extends ClientPort> {
	private clients: {[uid: string]: C} = {};

	constructor(from?: C[]) {
		if (from)
			for (let client of from)
				this.add(client);
	}

	add(client: C) {
		this.clients[client.uid] = client;
	}

	remove(client: C) {
		delete this.clients[client.uid];
	}

	has(client: C): boolean {
		return !!this.clients[client.uid];
	}

	each(callback: (client: C) => boolean) {
		for (let uid in this.clients)
			if (!callback(this.clients[uid]))
				return false;

		return true;
	}

	filter(callback) {
		let client, all = [];

		for (let uid in this.clients)
			if (callback(client = this.clients[uid]))
				all.push(client);

		return new (<any>this.constructor)(all);
	}

}
