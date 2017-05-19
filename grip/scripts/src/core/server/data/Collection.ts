
import { IdentifiableInterface } from '../../db/data/IdentifiableInterface';
import { DB } from "../../db/DB";
import { ModelStore } from '../../db/ModelStore';
import { SyncResultInterface } from '../../db/SyncResultInterface';
import { PackageInterface } from '../../db/data/PackageInterface';
import { Package } from '../../db/data/Package';
import { ObjectUtils } from '../../utils/object';
import { TranscoderInterface } from '../TranscoderInterface';
import { Eventable } from '../../utils/Eventable';

export class Collection<M extends IdentifiableInterface> extends Eventable {
	static CHANGED = 'changed';

	private _cache: PackageInterface<M> = {};
	private db: DB;

	protected transcoder: TranscoderInterface<M, any>;

	public name: string;

	constructor(db: DB, name: string) {
		super();
		this.db = db;
		this.name = name;
	}

	public changed(listener: (uids: string[], event?: string) => any) {
		return this.on(Collection.CHANGED, listener);
	}

	public get(uids: string[]): Promise<PackageInterface<M>> {
		return this.fetch({ uid: { $in: uids } });
	}

	public set(instances: PackageInterface<M>): Promise<PackageInterface<M>> {
		return this.update(instances);
	}

	public remove(uids: string[]): Promise<PackageInterface<M>> {
		let pack = new Package<M>();

		for (let uid of uids) {
			pack[uid] = null;
		}

		return this.update(pack);
	}

	public getOne(uid: string): Promise<M> {
		return this.get([uid])
			.then((pack: PackageInterface<M>) => (
				pack[uid]
			))
			;
	}

	public setOne(instance: M): Promise<M> {
		return this.update(new Package([instance]))
			.then((pack: PackageInterface<M>) => (
				pack[instance.uid]
			))
			;
	}

	public update(data: PackageInterface<M>): Promise<PackageInterface<M>> {
		return new Promise((rs, rj) => {
			this.db.query(this.name)
				.specific(null, (table) => {
					let store = new ModelStore(table);
					let encoded = this.transcoder
						? new Package(
								Object.keys(data)
									.map((uid) => (
										data[uid]
											? this.transcoder.encode(data[uid])
											: data[uid]
									))
							)
						: data
					;

					console.log('updating', store, data, encoded, this);
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
						let decoded = this.transcoder
							? new Package(
								data
									.map((document) => (
										document
											? this.transcoder.decode(document)
											: document
									))
							)
							: new Package(data)
						;

						return (
							err
								? rj(err)
								: rs(this.cache(decoded))
						);
					})
				;
			} catch (e) {
				rj(e);
			}
		});
	}

	private updated(store: ModelStore<M>, uids: string[] = null): Promise<PackageInterface<M>> {
		return store.findModels(uids)
			.then((data: M[]) => {
				return this.cache(new Package(data));
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
				? ObjectUtils.extract(this._cache, uids)
				: this._cache
		);
	}

	private cache(pack: PackageInterface<M>): PackageInterface<M> {
		let uids = Object.keys(pack);

		for (let uid of uids) {
			this._cache[uid] = pack[uid];
		}

		return this.cached(uids);
	}

}
