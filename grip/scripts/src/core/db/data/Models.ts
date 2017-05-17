
import { Eventable } from '../../utils/Eventable';
import { Model } from './Model';

export class Models<M extends Model> extends Eventable {
	private instances: {[uid: string]: M} = {};
	private factory: (uid: string) => M;

	static CHANGED = 'changed';

	constructor(factory: (uid: string) => M) {
		super();
		this.factory = factory;
	}

	onchanged(listener: () => any) {
		return this.on(Models.CHANGED, listener);
	}

	private changed() {
		this.fire(Models.CHANGED);
	}

	public create(): M {
		return this.factory(this.genUID());
	}

	public get(uid: string): M {
		return this.instances[uid];
	}

	public set(instance: M): M {
		this.instances[instance.uid] = instance;
		this.changed();

		return instance;
	}

	public remove(uid: string): M {
		let instance = this.instances[uid];

		if (instance) {
			delete this.instances[uid];
			this.changed();
		}

		return instance;
	}

	public each(consumer: (instance: M) => boolean): boolean {
		for (let instance in this.map()) {
			if (!consumer(this.instances[instance])) {
				return false;
			}
		}

		return true;
	}

	public map<T>(consumer?: (instance: M) => T): T[] {
		let collection : T[] = [];

		for (let instance in this.instances) {
			if (this.instances.hasOwnProperty(instance)) {
				collection.push(
					consumer
						? consumer(this.instances[instance])
						: <any>this.instances[instance]
				);
			}
		}

		return collection;
	}

	private genUID(): string {
		return `${Object
			.keys(this.instances)
			.map(Number)
			.reduce((max, uid) => Math.max(uid || 0, max), 0) + 1}`;
	}

}
