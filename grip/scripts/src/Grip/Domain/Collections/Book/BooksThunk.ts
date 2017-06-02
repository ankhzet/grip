
import { CollectionThunk } from '../../../../core/server/Synchronizer';
import { Collection } from '../../../../core/server/data/Collection';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { Book } from './Book';
import { BooksDepot } from './BooksDepot';
import { BookTranscoder } from '../../Transcoders/Packet/BookTranscoder';
import { BookTable } from './BookTable';

export class BooksThunk implements CollectionThunk<Book, any> {
	collection: Collection<Book>;
	transcoder: TranscoderInterface<Book, any>;

	public constructor(table: BookTable) {
		this.collection = new BooksDepot(table);
		this.transcoder = new BookTranscoder();
	}
}
