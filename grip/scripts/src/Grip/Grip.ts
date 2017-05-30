
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { BooksDepot } from './Domain/BooksDepot';
import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { BookTranscoder } from "./Domain/Transcoders/Packet/BookTranscoder";
import { CollectionThunk } from '../core/server/Synchronizer';
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

		let cacher = new Cacher();

		return cacher
			.fetch({
				tocURI: book.uri,
				matchers: book.matchers,
			}).then((cache: PagesCache) => {
				book.toc = cache.toc;
				book.cached = +new Date();

				return books.setOne(book)
					.then((book: Book) => {
						this.server.broadcast(GripActions.cached, {uids: [book.uid]});

						return book;
					}).then((book: Book) => {

						let loader = (page: number, done: number[] = []) => {
							return cacher.preload(cache, page)
								.then((contents: string) => {
									book.contents[page] = contents;
									book.cached = +new Date();

									return books.setOne(book)
										.then(() => {
											done.push(page);

											let next = cache.next(page);

											if (next !== page) {
												return loader(next, done);
											} else {
												return done;
											}
										});
								});
						};

						return loader(0).then((done: number[]) => {
							console.log('Preloaded:', cache, done, book);
						});
					});
			})
		;
	}

}
