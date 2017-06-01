

import { DB } from '../../../../core/db/DB';
import { Collection } from '../../../../core/server/data/Collection';
import { Book } from './Book';
import { BookTranscoder } from '../../Transcoders/DB/BookTranscoder';
import { Models } from '../../../../core/db/data/Models';

export class BooksDepot extends Collection<Book> {
	static collection = 'books';

	constructor(db: DB, models: Models<Book>) {
		super(db, BooksDepot.collection, models);
		this.transcoder = new BookTranscoder(models);
	}

}
