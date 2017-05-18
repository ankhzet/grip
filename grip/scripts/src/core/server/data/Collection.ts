
import { Models } from '../../db/data/Models';
import { IdentifiableInterface } from '../../db/data/IdentifiableInterface';
import { DB } from "../../db/DB";
import { ModelStore } from '../../db/ModelStore';
import { SyncResultInterface } from '../../db/SyncResultInterface';
import { PackageInterface } from '../../db/data/PackageInterface';
import { Package } from '../../db/data/Package';
import { ObjectUtils } from '../../utils/object';
import { TranscoderInterface } from '../TranscoderInterface';

export class Collection<M extends IdentifiableInterface> extends Models<M> {
	private _cache: PackageInterface<M> = {};
	private db: DB;
	private transcoder: TranscoderInterface<M, any>;

	public name: string;

	constructor(db: DB, name: string, factory: (uid: string) => M) {
		super(factory);
		this.db = db;
		this.name = name;
	}

	update(data: PackageInterface<M>): Promise<SyncResultInterface> {
		return new Promise((rs, rj) => {
			this.db.query(this.name)
				.specific(null, (table) => {
					let store = new ModelStore(table);
					let encoded = this.transcoder
						? new Package(
								Object.keys(data)
									.map((uid) => this.transcoder.encode(data[uid]))
							)
						: data
					;

					store.syncModels(encoded)
						.then((result: SyncResultInterface) => {
							return result;
						})
						.catch(rj);
				})
			;
		});
	}

	fetch(query): Promise<PackageInterface<M>> {
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
									.map((document) => this.transcoder.decode(document))
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

	cached(uids?: string[]): PackageInterface<M> {
		return uids ? ObjectUtils.extract(this._cache, uids) : this._cache;
	}

	cache(pack: PackageInterface<M>): PackageInterface<M> {
		let uids = Object.keys(pack);

		for (let uid of uids) {
			this._cache[uid] = pack[uid];
		}

		return this.cached(uids);
	}
}
