
import { ModelStore } from '../db/ModelStore';
import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { Package } from '../db/data/Package';
import { DataServer } from './DataServer';
import { PackageInterface } from '../db/data/PackageInterface';

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

	cache(data: PackageInterface<S>): PackageInterface<S> {
		return this.provider.cache(this.name, data);
	}

	serialize(data) {
		return data;
	}

	map(pack: PackageInterface<any>): PackageInterface<any> {
		return pack;
	}

	update(store: ModelStore<S>, {updated, removed}: {updated: string[], removed: string[]}): Promise<PackageInterface<S>[]> {
		let all = [];

		if (removed.length) {
			all.push(this.removed(store, removed));
		}

		if (updated.length) {
			all.push(this.updated(store, updated));
		}

		return Promise.all(all);
	}

	updated(store: ModelStore<S>, uids: string[] = null): Promise<PackageInterface<S>> {
		return store.findModels(uids)
			.then((data: S[]) => {
				return this.cache(new Package(data));
			});
	}

	removed(store: ModelStore<S>, uids: string[]): Promise<PackageInterface<S>> {
		return Promise.resolve(
			this.cache(uids.reduce((acc, uid) => {
				acc[uid] = null;
				return acc;
			}, {}))
		);
	}

}
