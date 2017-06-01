
import { Model } from '../Model';

export class OneToOne<S extends Model, T extends Model> {
	private model: T;
	private owner: S;
	private back: string;
	private reverse: OneToOne<T, S>;

	constructor(owner: S, back: string) {
		this.owner = owner;
		this.back = back;
	}

	public get uid() {
		return this.model ? this.model.uid : undefined;
	}

	public clear() {
		this.set(null);
	}

	public get(): T {
		return this.model;
	}

	public set(to: T) {
		if (to === this.model) {
			return;
		}

		this.model = to;

		if (this.reverse) {
			this.reverse.clear();
		}

		if (to) {
			this.reverse = to[this.back];
			this.reverse.set(this.owner);
		} else {
			this.reverse = null;
		}
	}

	public static attach<S extends Model, T extends Model>(to: S, reverse?: string): OneToOne<S, T> {
		return new OneToOne<S, T>(to, reverse || to.constructor.name.toLowerCase());
	}
}
