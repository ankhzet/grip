
import { Models } from './Models';
import { Model } from './Model';
import { DB } from '../DB';
import { ModelStore } from '../ModelStore';
import { Query } from '../Query';
import { PackageInterface } from './PackageInterface';
import { Package } from "./Package";
import { TranscoderInterface } from '../../server/TranscoderInterface';

export class Table<M extends Model> extends Models<M> {
	private db: DB;
	private _store: ModelStore<M>;

	public name: string;
	protected transcoder: TranscoderInterface<M, any>;

	constructor(db: DB, name: string, transcoder: TranscoderInterface<M, any>, factory: (uid: string) => M) {
		super(factory);

		this.db = db;
		this.name = name;
		this.transcoder = transcoder;
	}

	public get store(): ModelStore<M> {
		if (!this._store) {
			this._store = new ModelStore<M>(
				this.db
					.query(this.name)
					.cursor()
			);
		}

		return this._store;
	}

	public query(query?: any): Promise<Query> {
		return new Promise((rs, rj) => {
			try {
				rs(this.db.query(this.name, query));
			} catch (e) {
				rj(e);
			}
		});
	}

	public cached(uids?: string[]): PackageInterface<M> {
		return (
			uids
				? new Package(this.only(uids))
				: this.all()
		);
	}

	public cache(pack: PackageInterface<M>): PackageInterface<M> {
		let uids = Object.keys(pack);

		for (let uid of uids) {
			this.set(pack[uid]);
		}

		return this.cached(uids);
	}

	public load(documents: any[]): PackageInterface<M> {
		return this.cache(this.decode(documents));
	}

	public decode(documents: any[]): PackageInterface<M> {
		let pack = new Package(documents);

		 return this.transcoder
			? Package.create<any, M>(pack, (i) => this.transcoder.decode(i))
			: pack
		;
	}

	public encode(data: PackageInterface<M>): PackageInterface<any> {
		return this.transcoder
			? Package.create<M, any>(data, (i) => this.transcoder.encode(i))
			: data;
	}

	public updated(uids: string[] = null): Promise<PackageInterface<M>> {
		return this.store
			.findModels(uids)
			.then((data: any[]) => this.load(data))
		;
	}

	public removed(uids: string[]): Promise<PackageInterface<M>> {
		return Promise.resolve(
			this.cache(uids.reduce((acc, uid) => (acc[uid] = null, acc), {}))
		);
	}

}
