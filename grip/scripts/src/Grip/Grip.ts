
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { BooksDepot } from './Domain/BooksDepot';
import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { BookTranscoder } from "./Domain/Transcoders/Packet/BookTranscoder";
import { CollectionThunk } from '../core/server/Synchronizer';
import { Package } from '../core/db/data/Package';
import { PackageInterface } from '../core/db/data/PackageInterface';
import { Book } from './Domain/Book';

export class Grip {
	server: GripServer;
	db: GripDB;
	collections: {[name: string]: CollectionThunk<any, any>} = {
		books: {
			collection: null,
			transcoder: null,
		}
	};

	constructor() {
		this.db = new GripDB();
		this.collections = {
			books: {
				collection: new BooksDepot(this.db),
				transcoder: new BookTranscoder(),
			},
		};
		this.server = new GripServer();

		for (let name of Object.keys(this.collections)) {
			let { collection, transcoder } = this.collections[name];
			this.server.collection(collection, transcoder);
			collection.changed((uids: string[]) => {
				this.server.broadcast(GripActions.updated, { what: name, uids});
			});
		}

		this.server.on(CacheAction, this._handle_cache.bind(this));
	}

	async _handle_cache({ uid }: CachePacketData) {
		let books = <BooksDepot>this.collections.books.collection;
		let book = await books.getOne(uid);

		if (!book) {
			throw new Error(`Book with uid "${uid}" not found`);
		}

		return (new Cacher())
			.fetch({
				tocURI: book.uri,
				matchers: book.matchers,
			}).then((cache: PagesCache) => {
				book.toc = cache.toc;
				book.cached = +new Date();

				return books.setOne(book)
					.then((book: Book) => {
						this.server.broadcast(GripActions.cached, { uids: [book.uid], });
					});
			})
		;
	}

}
