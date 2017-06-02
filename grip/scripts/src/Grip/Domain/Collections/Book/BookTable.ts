
import { Table } from '../../../../core/db/data/Table';
import { Book } from './Book';
import { BookTranscoder } from '../../Transcoders/DB/BookTranscoder';

export class BookTable extends Table<Book> {
	protected transcoder = new BookTranscoder(this);
}
