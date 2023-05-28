
import { IdentifiableInterface } from '../../db/data/IdentifiableInterface';
import { SyncResultInterface } from '../../db/SyncResultInterface';
import { PackageInterface } from '../../db/data/PackageInterface';
import { Package } from '../../db/data/Package';
import { Eventable } from '../../utils/Eventable';
import { Table } from '../../db/data/Table';
import { Query } from '../../db/Query';

export class Collection<M extends IdentifiableInterface> extends Eventable {
	static CHANGED = 'changed';

	private table: Table<M>;

	constructor(table: Table<M>) {
		super();
		this.table = table;
	}

	public get name(): string {
		return this.table.name;
	}

	public create(): M {
		return this.table.create();
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
				return <Promise<PackageInterface<M>>>new Promise((rs, rj) => {
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

}
