
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { BooksDepot } from './Domain/BooksDepot';
import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { Book } from './Domain/Book';
import { BooksThunk } from './Domain/BooksThunk';

export class Grip {
	server: GripServer;
	db: GripDB;
	collections: {
		books: BooksThunk,
	};

	constructor() {
		this.db = new GripDB();
		this.server = new GripServer();
		this.collections = {
			books: this.server.thunk(new BooksThunk(this.db)),
		};

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
