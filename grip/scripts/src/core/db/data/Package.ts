
import { PackageInterface } from './PackageInterface';
import { IdentifiableInterface } from "./IdentifiableInterface";

export class Package<M extends IdentifiableInterface> implements PackageInterface<M> {
	[uid: string]: M;

	constructor(instances?: M[]) {
		if (instances) {
			for (let instance of instances) {
				this[instance.uid] = instance;
			}
		}
	}

}
