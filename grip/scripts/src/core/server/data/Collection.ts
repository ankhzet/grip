
import { IdentifiableInterface } from '../../db/data/IdentifiableInterface';
import { DB } from "../../db/DB";
import { ModelStore } from '../../db/ModelStore';
import { SyncResultInterface } from '../../db/SyncResultInterface';
import { PackageInterface } from '../../db/data/PackageInterface';
import { Package } from '../../db/data/Package';
import { TranscoderInterface } from '../TranscoderInterface';
import { Eventable } from '../../utils/Eventable';
import { Models } from '../../db/data/Models';

export class Collection<M extends IdentifiableInterface> extends Eventable {
	static CHANGED = 'changed';

	private db: DB;
	protected transcoder: TranscoderInterface<M, any>;

	public name: string;
	public store: Models<M>;

	constructor(db: DB, name: string, store: Models<M>) {
		super();
		this.db = db;
		this.name = name;
		this.store = store;
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
		return new Promise((rs, rj) => {
			this.db.query(this.name)
				.specific(null, (table) => {
					let store = new ModelStore(table);
					let encoded = this.transcoder
						? Package.create<M, any>(data, (i) => this.transcoder.encode(i))
						: data
					;

					store.syncModels(encoded)
						.then(({ removed, updated, request }: SyncResultInterface) => {
							let all = [];

							if (removed.length) {
								all.push(this.removed(store, removed));
							}

							if (updated.length) {
								all.push(this.updated(store, updated));
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
						.then(rs)
						.catch(rj);
				})
			;
		});
	}

	public fetch(query): Promise<PackageInterface<M>> {
		return new Promise((rs, rj) => {
			try {
				this.db.query(this.name, query)
					.specific(
						Object.keys(this._cache),
						() => rs(this.cached())
					)
					.fetch((err, data: any[]) => {
						return (
							err
								? rj(err)
								: rs(this.load(data))
						);
					})
				;
			} catch (e) {
				rj(e);
			}
		});
	}

	private updated(store: ModelStore<any>, uids: string[] = null): Promise<PackageInterface<M>> {
		return store.findModels(uids)
			.then((data: any[]) => {
				return this.load(data)
			});
	}

	private removed(store: ModelStore<M>, uids: string[]): Promise<PackageInterface<M>> {
		return Promise.resolve(
			this.cache(uids.reduce((acc, uid) => (acc[uid] = null, acc), {}))
		);
	}

	private cached(uids?: string[]): PackageInterface<M> {
		return (
			uids
				? new Package(this.store.only(uids))
				: this.store.all()
		);
	}

	private cache(pack: PackageInterface<M>): PackageInterface<M> {
		let uids = Object.keys(pack);

		for (let uid of uids) {
			this.store.set(pack[uid]);
		}

		return this.cached(uids);
	}

	private load(documents: any[]): PackageInterface<M> {
		let pack = new Package(documents);
		let decoded = this.transcoder
			? Package.create<any, M>(pack, (i) => this.transcoder.decode(i))
			: pack
		;

		return this.cache(decoded);
	}

}
