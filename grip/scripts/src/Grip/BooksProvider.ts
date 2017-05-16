
import { ModelStore } from "../core/db/ModelStore";
import { DataServer } from "../core/server/DataServer";
import { EntityProvider } from "../core/server/EntityProvider";

import { Book } from "./Domain/Book";
import { BooksPackage } from "./Domain/BooksPackage";
import { BooksDepot } from "./Domain/BooksDepot";

export class BooksProvider extends EntityProvider<Book, Book> {
	books: BooksDepot;

	constructor(provider: DataServer<any, Book>, books: BooksDepot) {
		super('books', provider);

		this.books = books;
		this.updated(
			new ModelStore(
				provider.db.table('books')
			)
		);
	}

	serialize(data) {
		return data;
	}

	map(pack: BooksPackage): BooksPackage {
		return this.books.load(
			Object.keys(pack)
				.map((uid) => pack[uid])
		);
	}

	removed(store: ModelStore<Book>, uids: string[]) {
		let data = super.removed(store, uids);

		for (let uid in data) {
			this.books.remove(uid);
		}

		return data;
	}

}
