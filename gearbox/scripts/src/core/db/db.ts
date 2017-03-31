
import * as DataStore from 'nedb';

export class DB {
	protected tables: {[table: string]: DataStore} = {};

	constructor() {
	}

	table(name: string, callback?: (error: Error) => void): DataStore {
		let table = this.tables[name];

		if (!table) {
			table = this.tables[name] = new DataStore({
				filename: DB.tableDB(name),
				autoload: !callback
			});

			if (callback)
				table.loadDatabase(callback);
		}

		return table;
	}

	static tableDB(name: string) {
		return `gearbox/${name}.db`;
	}

	scheme(table: string, callback) {
		let db = this.table(table);

		return callback({
			index(options, cb) {
				return db.ensureIndex(options, cb);
			}
		});
	}

	query(what: string, query?: any) {
		return new Query(this, what, query);
	}

}

export class Query {
	private db: DB;
	private what: string;
	private query: any;

	constructor(db: DB, what: string, query: any) {
		this.db = db;
		this.what = what;
		this.query = query;
	}

	hasQuery(): boolean {
		return !!(this.query && Object.keys(this.query).length);
	}

	specific(what: string[], callback: (cursor: DataStore) => any): Query {
		let hasQuery = this.hasQuery();
		let isSpecific = (!what) || (what.indexOf(this.what) >= 0);

		if (isSpecific && !hasQuery) {
			callback(this.cursor());
			return new Query(this.db, this.what, null);
		}

		return this;
	}

	cursor(): DataStore {
		return this.db.table(this.what);
	}

	fetch<T>(callback: (err: Error, documents: T[]) => any): Query {
		if (this.query)
			this.cursor().find(this.query, callback);

		return this;
	}

}
