
import { Model } from '../Model';

export abstract class Base<S extends Model, T extends Model> {
	protected owner: S;
	protected back: string;

	constructor(owner: S, back: string) {
		this.owner = owner;
		this.back = back || this.inferReverse(owner);
	}

	protected inferReverse(owner: S): string {
		return owner.constructor.name.toLowerCase();
	}
}
