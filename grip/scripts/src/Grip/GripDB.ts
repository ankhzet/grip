
import * as DataStore from 'nedb';
import { DB } from '../core/db/DB';

export class GripDB extends DB {

	constructor() {
		super('grip');

		this.scheme('books', (blueprint) => {
			blueprint.index({ fieldName: 'uid', unique: true });
		});
	}

	get books(): DataStore {
		return this.tables['books'];
	}

}
