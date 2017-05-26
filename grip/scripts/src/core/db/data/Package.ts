
import { PackageInterface } from './PackageInterface';
import { IdentifiableInterface as Identifiable } from './IdentifiableInterface';

export class Package<M extends Identifiable> implements PackageInterface<M> {
	[uid: string]: M;

	constructor(instances?: M[]) {
		if (instances) {
			for (let key in instances) {
				let instance = instances[key];

				this[(instance && instance.uid) ? instance.uid : key] = instance;
			}
		}
	}

	static create<S extends Identifiable, D extends Identifiable>(data: PackageInterface<S>, mapper: (i: S) => D): PackageInterface<D> {
		let pack = new this<D>();

		for (let uid in data) {
			pack[uid] = mapper(data[uid]);
		}

		return pack;
	}

}
