

import { Books } from './Books';
import { Book } from './Book';
import { BooksPackage } from './BooksPackage';

export class BooksDepot extends Books {
	context: any;

	constructor(context: any) {
		super((uid) => {
			return new Book(uid);
		});
		this.context = context;
	}

	public instance(uid: string): Book {
		return new Book(uid);
	}

	public load(data: {uid: string}[]): BooksPackage {
		let result: BooksPackage = {};

		for (let fragment of data) {
			result[fragment.uid] = this.bookFromData(fragment);
		}

		return result;
	}

	protected bookFromData(data: { uid: string }): Book {
		let book = data.uid && this.get(data.uid);

		if (!book) {
			book = this.create();
		}

		for (let key in data) {
			if (!key.match(/^_/)) {
				book[key] = data[key];
			}
		}

		this.set(book);

		return book;
	}

}
