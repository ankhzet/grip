
import { Model } from './Model';
import { PackageInterface } from './PackageInterface';

export class Package<M extends Model> implements PackageInterface<M> {
	[uid: string]: M;

	constructor(...instances: M[]) {
		for (let instance of instances) {
			this[instance.uid] = instance;
		}
	}

}
