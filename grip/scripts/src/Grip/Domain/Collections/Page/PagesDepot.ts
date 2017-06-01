

import { DB } from '../../../../core/db/DB';
import { Collection } from '../../../../core/server/data/Collection';
import { Page } from './Page';
import { PageTranscoder } from '../../Transcoders/DB/PageTranscoder';
import { Models } from '../../../../core/db/data/Models';

export class PagesDepot extends Collection<Page> {
	static collection = 'books';

	constructor(db: DB, models: Models<Page>) {
		super(db, PagesDepot.collection, models);
		this.transcoder = new PageTranscoder(models);
	}

	public instance(uid: string): Page {
		return new Page(uid);
	}

}
