
import { ModelStore, Package } from '../db/model-store';
import { DataServer } from './data-server';

export class EntityProvider {
	name: string;
	provider: DataServer;

	constructor(name: string, provider: DataServer) {
		this.name = name;
		this.provider = provider;

		this.provider.registerSerializer(this.name, this.serialize.bind(this));
		this.provider.registerMapper(this.name, this.map.bind(this));
		this.provider.registerUpdatable(this.name, this.update.bind(this));
	}

	cache(data: Package<any>) {
		return this.provider.cache(this.name, data);
	}

	serialize(data) {
		return data;
	}

	map(pack: Package<any>): Package<any> {
		return pack;
	}

	update(store: ModelStore, {updated, removed}) {
		let all = [];

		if (removed.length) {
			all.push(this.removed(store, removed));
		}

		if (updated.length) {
			all.push(this.updated(store, updated));
		}

		return Promise.all(all);
	}

	updated(store: ModelStore, uids: string[] = null) {
		return store.findModels(uids)
			.then((data) => {
				return this.cache(data);
			});
	}

	removed(store: ModelStore, uids: string[]) {
		return this.cache(uids.reduce((acc, uid) => {
			acc[uid] = null;
			return acc;
		}, {}));
	}

}
