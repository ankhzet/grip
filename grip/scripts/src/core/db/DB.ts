
import * as DataStore from 'nedb';
import { Query } from './Query';

export class DB {
	public namespace: string;
	protected tables: {[table: string]: DataStore} = {};

	constructor(namespace: string) {
		this.namespace = namespace;
	}

	table(name: string, callback?: (error: Error) => void): DataStore {
		let table = this.tables[name];

		if (!table) {
			table = this.tables[name] = new DataStore({
				filename: DB.tableDB(name, this.namespace),
				autoload: !callback
			});

			if (callback)
				table.loadDatabase(callback);
		}

		return table;
	}

	static tableDB(name: string, namespace: string) {
		return `${namespace}/${name}.db`;
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
		return new Query(
			this.query.bind(this),
			this.table.bind(this),
			what,
			query
		);
	}

}

