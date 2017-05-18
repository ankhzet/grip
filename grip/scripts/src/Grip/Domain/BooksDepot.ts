

import { Books } from './Books';
import { Book } from './Book';
import { BooksPackage } from './BooksPackage';
import { BookTranscoder } from './Transcoders/Book';

export class BooksDepot extends Books {
	context: any;
	transcoder: BookTranscoder;

	constructor(context: any) {
		super((uid) => {
			return new Book(uid);
		});
		this.context = context;
		this.transcoder = new BookTranscoder();
	}

	public instance(uid: string): Book {
		return new Book(uid);
	}

	public load(data: {uid: string}[]): BooksPackage {
		console.log('depot load', data);
		let result: BooksPackage = {};

		for (let fragment of data) {
			if (fragment) {
				result[fragment.uid] = this.bookFromData(fragment);
			}
		}

		return result;
	}

	protected bookFromData(data: { uid: string }): Book {
		let book = data.uid && this.get(data.uid);

		this.set(
			book = this.transcoder.decode(data, book)
		);


		return book;
	}

}
