
import { CollectionThunk } from '../../core/server/Synchronizer';
import { Book } from './Book';
import { Collection } from '../../core/server/data/Collection';
import { TranscoderInterface } from '../../core/server/TranscoderInterface';
import { DB } from '../../core/db/DB';
import { BooksDepot } from './BooksDepot';
import { BookTranscoder } from './Transcoders/Packet/BookTranscoder';

export class BooksThunk implements CollectionThunk<Book, any> {
	collection: Collection<Book>;
	transcoder: TranscoderInterface<Book, any>;

	public constructor(db: DB) {
		this.collection = new BooksDepot(db);
		this.transcoder = new BookTranscoder();
	}
}
