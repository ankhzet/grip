
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { Book } from './Domain/Book';
import { BooksDepot } from './Domain/BooksDepot';
import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { Collection } from '../core/server/data/Collection';

export class Grip {
	server: GripServer;
	db: GripDB;
	collections: {[name: string]: Collection<any>} = {
		books: null,
	};

	constructor() {
		this.db = new GripDB();
		this.collections = {
			books: new BooksDepot(this.db),
		};

		this.server = new GripServer();

		for (let name of Object.keys(this.collections)) {
			let collection = this.collections[name];

			this.server.collection(collection);
			collection.changed((uids: string[]) => {
				this.server.broadcast(GripActions.updated, { what: name, uids});
			});
		}

		this.server.on(CacheAction, this._handle_cache.bind(this));
	}

	async _handle_cache({ book: { uid, title } }: CachePacketData) {
		let book = await this.collections.books.getOne(uid);

		if (!book) {
			throw new Error(`Book "${title}" with uid "${uid}" not found`);
		}

		(new Cacher())
			.fetch({
				tocURI: book.uri,
				matchers: book.matchers,
			}).then((cache: PagesCache) => {
				book.toc = cache.toc;

				return this.collections.books.setOne(book);
			}).then((book: Book) => {
				console.log('Updated cache:', book);
			})
		;
	}

}
