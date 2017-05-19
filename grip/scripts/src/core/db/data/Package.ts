
import { PackageInterface } from './PackageInterface';
import { IdentifiableInterface } from './IdentifiableInterface';

export class Package<M extends IdentifiableInterface> implements PackageInterface<M> {
	[uid: string]: M;

	constructor(instances?: M[]) {
		if (instances) {
			for (let key in instances) {
				let instance = instances[key];

				this[(instance && instance.uid) ? instance.uid : key] = instance;
			}
		}
	}

}
