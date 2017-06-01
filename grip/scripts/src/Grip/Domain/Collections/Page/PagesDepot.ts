

import { DB } from '../../../../core/db/DB';
import { Collection } from '../../../../core/server/data/Collection';
import { Page } from './Page';
import { PageTranscoder } from '../../Transcoders/DB/PageTranscoder';

export class PagesDepot extends Collection<Page> {
	static collection = 'books';

	constructor(db: DB) {
		super(db, PagesDepot.collection, (uid: string) => new Page(uid));
		this.transcoder = new PageTranscoder();
	}

	public instance(uid: string): Page {
		return new Page(uid);
	}

}
