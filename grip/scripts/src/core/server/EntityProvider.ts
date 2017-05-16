
import { ModelStore } from '../db/ModelStore';
import { IdentifiableInterface } from "../db/data/IdentifiableInterface";
import { Package } from "../db/data/Package";
import { DataServer } from './DataServer';

export class EntityProvider<S extends IdentifiableInterface, D> {
	name: string;
	provider: DataServer<S, D>;

	constructor(name: string, provider: DataServer<S, D>) {
		this.name = name;
		this.provider = provider;

		this.provider.registerSerializer(this.name, this.serialize.bind(this));
		this.provider.registerMapper(this.name, this.map.bind(this));
		this.provider.registerUpdatable(this.name, this.update.bind(this));
	}

	cache(data: Package<S>) {
		return this.provider.cache(this.name, data);
	}

	serialize(data) {
		return data;
	}

	map(pack: Package<any>): Package<any> {
		return pack;
	}

	update(store: ModelStore<S>, {updated, removed}) {
		let all = [];

		if (removed.length) {
			all.push(this.removed(store, removed));
		}

		if (updated.length) {
			all.push(this.updated(store, updated));
		}

		return Promise.all(all);
	}

	updated(store: ModelStore<S>, uids: string[] = null) {
		return store.findModels(uids)
			.then((data: S[]) => {
				return this.cache(new Package(data));
			});
	}

	removed(store: ModelStore<S>, uids: string[]) {
		return this.cache(uids.reduce((acc, uid) => {
			acc[uid] = null;
			return acc;
		}, {}));
	}

}
