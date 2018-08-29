
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { Package } from '../../core/db/data/Package';
import { PackageInterface } from '../../core/db/data/PackageInterface';
import { ManagerInterface } from './ManagerInterface';
import { Eventable } from '../../core/utils/Eventable';
import { Models } from '../../core/db/data/Models';
import { Utils } from '../../Grip/Client/Utils';
import { ObjectUtils } from '../../core/utils/ObjectUtils';

export abstract class ObservableList<T extends IdentifiableInterface> extends Eventable implements ManagerInterface<T> {
	private pending: {[uid: string]: Promise<PackageInterface<T>>} = {};
	private data: {[uid: string]: T} = {};

	generateUID(): string {
		return `${(+Object.keys(this.data).sort().pop() || 0) + 1}`;
	}

	getOne(uid: string): Promise<T> {
		return (
			uid
				? this.get([uid]).then((pack: PackageInterface<T>) => pack[uid])
				: Promise.resolve(null)
		);
	}

	get(uids: string[] = []): Promise<PackageInterface<T>> {
		if (!uids.length) {
			return this.acquire([]);
		}

		// split requested invalid uids to 'already loaded' and 'invalidated' groups
		let [ready, load] = Utils.partition(uids, (uid) => this.data[uid]);

		// fill result with already valid entries
		let result = ObjectUtils.extract(this.data, ready, new Package());

		if (!load.length) {
			return Promise.resolve(result);
		}

		// split requested invalid uids to 'already pending' and 'just invalidated' groups
		let fetching = this.fetching();

		// filter 'already pending' uids for distinct promises
		let [pending, hanging] = Utils.partition(load, (uid) => fetching.indexOf(uid) >= 0);
		let distinct = Utils.unique(pending.map((uid) => this.pending[uid]));

		// promise to load 'just invalidated' uids
		let rest = this.acquire(hanging);

		return Promise.all([rest, ...distinct])
			.then((packages: PackageInterface<T>[]) => {
				// append only distinct data to response
				// (previously appended 'already valid' entries can be overwritten)
				for (let promised of packages) {
					for (let uid in promised) {
						result[uid] = promised[uid];
					}
				}

				return result;
			});
	}

	set(values: T[], silent?: boolean): Promise<string[]> {
		let uids = [], uid;

		for (let instance of values) {
			uids.push(uid = instance.uid);
			this.data[uid] = instance;
		}

		return (
			silent
				? Promise.resolve(uids)
				: this.push(new Package(this.serialize(values)))
		)
			.then((uids) => (
				this.fire(Models.CHANGED, uids), uids
			))
		;
	}

	remove(uids: string[]): Promise<string[]> {
		let pack = new Package<T>();

		for (let uid of uids) {
			pack[uid] = null;
		}

		return this.push(pack)
			.then((uids: string[]) => {
				for (let uid of uids) {
					delete this.data[uid];
					delete this.pending[uid];
				}

				return uids;
			})
			.then((uids) => (this.fire(Models.CHANGED, uids), uids))
		;
	}

	invalidate(uids: string[]) {
		for (let uid of uids) {
			this.data[uid] = null;
		}

		this.fire(Models.CHANGED, uids);
	}

	changed(listener: (uids: string[]) => any): number {
		return this.on(Models.CHANGED, listener);
	}

	invalid(): string[] {
		return Object.keys(this.data).filter((uid) => !this.data[uid]);
	}

	fetching(): string[] {
		return Object.keys(this.pending).filter((uid) => !!this.pending[uid]);
	}

	protected acquire(uids: string[]): Promise<PackageInterface<T>> {
		let promise = this.pull(uids)
			.then((data: PackageInterface<IdentifiableInterface>) => {
				let present = Object.keys(data);

				for (let uid of uids) {
					if (this.pending[uid]) {
						delete this.pending[uid];
					}

					if (present.indexOf(uid) < 0) {
						delete this.data[uid];
					}
				}

				return <Promise<PackageInterface<T>>>(
					uids.length
						? this
							.set(this.deserialize(present.map((uid) => data[uid])), true)
							.then((uids) => this.get(uids))
						: Promise.resolve(new Package())
				);
			});

		// mark them as 'pending'
		for (let uid in uids) {
			this.pending[uid] = promise;
		}

		return promise;
	}

	protected abstract serialize(instances: T[]): any[];
	protected abstract deserialize(data: any[]): T[];

	protected abstract pull(uids: string[]): Promise<PackageInterface<IdentifiableInterface>>;
	protected abstract push(pack: PackageInterface<IdentifiableInterface>): Promise<string[]>;
}
