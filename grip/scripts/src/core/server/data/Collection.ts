
import { IdentifiableInterface } from '../../db/data/IdentifiableInterface';
import { ModelStore } from '../../db/ModelStore';
import { SyncResultInterface } from '../../db/SyncResultInterface';
import { PackageInterface } from '../../db/data/PackageInterface';
import { Package } from '../../db/data/Package';
import { Eventable } from '../../utils/Eventable';
import { Table } from '../../db/data/Table';
import { Query } from '../../db/Query';

export class Collection<M extends IdentifiableInterface> extends Eventable {
	static CHANGED = 'changed';

	public table: Table<M>;

	constructor(table: Table<M>) {
		super();
		this.table = table;
	}

	public changed(listener: (uids: string[], event?: string) => any) {
		return this.on(Collection.CHANGED, listener);
	}

	public get(uids: string[]): Promise<PackageInterface<M>> {
		return this.fetch({ uid: { $in: uids } });
	}

	public remove(uids: string[]): Promise<PackageInterface<M>> {
		let pack = new Package<M>();

		for (let uid of uids) {
			pack[uid] = null;
		}

		return this.set(pack);
	}

	public getOne(uid: string): Promise<M> {
		return this.get([uid])
			.then((pack: PackageInterface<M>) => (
				pack[uid]
			))
		;
	}

	public setOne(instance: M): Promise<M> {
		return this.set(new Package([instance]))
			.then((pack: PackageInterface<M>) => (
				pack[instance.uid]
			))
		;
	}

	public set(data: PackageInterface<M>): Promise<PackageInterface<M>> {
		return this.table.store
			.syncModels(this.table.encode(data))
			.then(({ removed, updated, request }: SyncResultInterface) => {
				let all = [];

				if (removed.length) {
					all.push(this.table.removed(removed));
				}

				if (updated.length) {
					all.push(this.table.updated(updated));
				}

				return Promise.all(all)
					.then((pair) => {
						if (request.length) {
							this.fire(Collection.CHANGED, request, pair);
						}

						return pair;
					})
					.then((pair: PackageInterface<M>[]) => {
						let result = new Package<M>();

						for (let pack of pair) {
							for (let uid of Object.keys(pack)) {
								result[uid] = pack[uid];
							}
						}

						return result;
					});
			})
		;
	}

	public fetch(query): Promise<PackageInterface<M>> {
		return this.table.query(query)
			.then((query: Query) => {
				return new Promise((rs, rj) => {
					query
						.specific(null, () => rs(this.table.cached()))
						.fetch((err, data: any[]) => {
							return (
								err
									? rj(err)
									: rs(this.table.load(data))
							);
						})
				});
			})
		;
	}

	private updated(store: ModelStore<any>, uids: string[] = null): Promise<PackageInterface<M>> {
		return store.findModels(uids)
			.then((data: any[]) => {
				return this.table.load(data)
			});
	}

	private removed(store: ModelStore<M>, uids: string[]): Promise<PackageInterface<M>> {
		return Promise.resolve(
			this.table.cache(uids.reduce((acc, uid) => (acc[uid] = null, acc), {}))
		);
	}

}
