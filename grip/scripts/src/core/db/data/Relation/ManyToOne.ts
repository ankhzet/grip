
import { Base } from './Base';
import { Model } from '../Model';
import { OneToMany } from './OneToMany';
import { Models } from '../Models';

export class ManyToOne<S extends Model, T extends Model> extends Base<S, T> {
	private model: T;

	public get uid() {
		return this.model ? this.model.uid : undefined;
	}

	public detach() {
		this.set(null);
	}

	public get(): T {
		return this.model;
	}

	public set(to: T): this {
		let from = this.model;

		if (to === from) {
			return;
		}

		this.model = to;

		if (from) {
			(<OneToMany<T, S>>from[this.back]).detach(this.owner);
		}

		if (to) {
			(<OneToMany<T, S>>to[this.back]).add(this.owner);
		}
	}

	protected inferReverse(owner: S): string {
		return super.inferReverse(owner) + 's';
	}

	encode(store: Models<T>) {
		return this.uid;
	}

	decode(store: Models<T>, value: any): Base<S, T> {
		return this.set(store.get(value));
	}

}
