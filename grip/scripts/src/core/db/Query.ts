
import * as DataStore from 'nedb';

export class Query {
	private factory: () => Query;
	private what: string;
	private query?: Query;
	private _cursor: (what: string) => DataStore;

	constructor(factory: () => Query, cursor: (what: string) => DataStore, what: string, query?: Query) {
		this.factory = factory;
		this._cursor = cursor;
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

			return this.factory();
		}

		return this;
	}

	cursor(): DataStore {
		return this._cursor(this.what);
	}

	fetch<T>(callback: (err: Error, documents: T[]) => any): Query {
		if (this.query) {
			this.cursor().find(this.query, callback);
		}

		return this;
	}

}
