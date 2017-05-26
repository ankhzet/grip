

import { DB } from '../../core/db/DB';
import { Collection } from '../../core/server/data/Collection';
import { Book } from './Book';
import { BookTranscoder } from './Transcoders/DB/BookTranscoder';

export class BooksDepot extends Collection<Book> {
	static collection = 'books';

	constructor(db: DB) {
		super(db, BooksDepot.collection, (uid: string) => new Book(uid));
		this.transcoder = new BookTranscoder();
	}

	public instance(uid: string): Book {
		return new Book(uid);
	}

}
