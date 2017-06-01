
import { Model } from '../Model';

export class OneToMany<S extends Model, T extends Model> {
	private models: T[] = [];
	private owner: S;
	private back: string;

	constructor(owner: S, back: string) {
		this.owner = owner;
		this.back = back;
	}

	public get uids() {
		return this.models.length ? this.models.map((model) => model.uid) : [];
	}

	public clear() {
		this.set([]);
	}

	public get(): T[] {
		return this.models;
	}

	public set(to: T[]) {
		let from = this.models;
		let detach = from.filter((model) => to.indexOf(model) < 0);
		let attach = to.filter((model) => from.indexOf(model) < 0);
		this.models = to;

		for (let model of detach) {
			model[this.back].set(undefined);
		}

		for (let model of attach) {
			model[this.back].set(this.owner);
		}
	}

	public add(one: T) {
		if (this.models.indexOf(one) >= 0) {
			return;
		}

		this.set(this.models.concat([one]));
	}

	public remove(one: T) {
		if (this.models.indexOf(one) < 0) {
			return;
		}

		this.set(this.models.filter((model) => model !== one));
	}

	public static attach<S extends Model, T extends Model>(to: S, reverse?: string): OneToMany<S, T> {
		return new OneToMany<S, T>(to, reverse || to.constructor.name.toLowerCase());
	}
}
