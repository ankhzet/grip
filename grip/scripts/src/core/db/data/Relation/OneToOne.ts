
import { Base } from './Base';
import { Model } from '../Model';
import { Models } from '../Models';

export class OneToOne<S extends Model, T extends Model> extends Base<S, T> {
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
			let reverse: OneToOne<T, S> = from[this.back];

			if (reverse) {
				reverse.detach();
			}
		}

		if (to) {
			let reverse: OneToOne<T, S> = to[this.back];

			if (reverse) {
				reverse.set(this.owner);
			}
		}

		return this;
	}

	encode(store: Models<T>) {
		return this.uid;
	}

	decode(store: Models<T>, value: any): Base<S, T> {
		return this.set(store.get(value));
	}

}
