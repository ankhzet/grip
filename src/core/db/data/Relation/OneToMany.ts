
import { Base } from './Base';
import { Model } from '../Model';
import { Models } from '../Models';
import { ManyToOne } from "./ManyToOne";

export class OneToMany<S extends Model, T extends Model> extends Base<S, T> {
	private models: T[] = [];

	public get uids() {
		return this.models.length ? this.models.map((model) => model.uid) : [];
	}

	public detach(one?: T) {
		if (one === undefined) {
			return this.models.length && this.set([]);
		}

		let index = this.models.indexOf(one);

		if (index < 0) {
			return;
		}

		this.set(this.models.filter((model) => model !== one));
	}

	public get(): T[] {
		return this.models;
	}

	public by(keys: any): T {
		let names = Object.keys(keys);

		for (let model of this.models) {
			let wrong = false;

			for (let key of names) {
				if (wrong = (model[key] !== keys[key])) {
					break;
				}
			}

			if (!wrong) {
				return model;
			}
		}

		return null;
	}

	public set(to: T[]): this {
		let from = this.models;
		this.models = to = Array.from(new Set(to));

		let detach = from.filter((model) => to.indexOf(model) < 0);
		let attach = to.filter((model) => from.indexOf(model) < 0);

		for (let model of detach) {
			let reverse: ManyToOne<T, S> = model[this.back];

			if (reverse) {
				reverse.detach();
			}
		}

		for (let model of attach) {
			let reverse: ManyToOne<T, S> = model[this.back];

			if (reverse) {
				reverse.set(this.owner);
			}
		}

		return this;
	}

	public add(one: T) {
		if (this.models.indexOf(one) >= 0) {
			return;
		}

		this.set(this.models.concat([one]));
	}

	encode(store: Models<T>) {
		return this.uids;
	}

	decode(store: Models<T>, value: string[]): Base<S, T> {
		return this.set(value ? value.map((uid) => store.get(uid)) : []);
	}

}
