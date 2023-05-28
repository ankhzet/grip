
import { Model } from '../Model';
import { Models } from '../Models';

export abstract class Base<S extends Model, T extends Model> {
	public owner: S;
	public back: string;

	constructor(owner: S, back?: string) {
		this.owner = owner;
		this.back = back || this.inferReverse(owner);
	}

	protected inferReverse(owner: S): string {
		return owner.constructor.name.toLowerCase();
	}

	abstract encode(store: Models<T>): any;
	abstract decode(store: Models<T>, value: any): Base<S, T>;
}
