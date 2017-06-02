

import { Collection } from '../../../../core/server/data/Collection';
import { Book } from './Book';
import { Table } from "../../../../core/db/data/Table";

export class BooksDepot extends Collection<Book> {
	static collection = 'books';

	constructor(table: Table<Book>) {
		super(table);
	}

}
