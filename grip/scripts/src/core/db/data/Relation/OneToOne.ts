
import { Base } from './Base';
import { Model } from '../Model';

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

	public set(to: T) {
		let from = this.model;

		if (to === from) {
			return;
		}

		this.model = to;

		if (from) {
			(<OneToOne<T, S>>from[this.back]).detach();
		}

		if (to) {
			(<OneToOne<T, S>>to[this.back]).set(this.owner);
		}
	}

}
