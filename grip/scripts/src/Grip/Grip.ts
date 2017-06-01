
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { Book } from './Domain/Collections/Book/Book';
import { BooksThunk } from './Domain/Collections/Book/BooksThunk';
import { PagesThunk } from './Domain/Collections/Page/PagesThunk';

export class Grip {
	server: GripServer;
	db: GripDB;
	collections: {
		books: BooksThunk,
		pages: PagesThunk,
	};

	constructor() {
		this.db = new GripDB();
		this.server = new GripServer();
		this.collections = {
			books: this.server.thunk(new BooksThunk(this.db)),
			pages: this.server.thunk(new PagesThunk(this.db)),
		};

		this.server.on(CacheAction, this._handle_cache.bind(this));
		this.server.listen();
	}

	async _handle_cache({ uid }: CachePacketData) {
		let { books, pages } = this.collections;
		let book = await books.collection.getOne(uid);

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

				return books.collection.setOne(book)
					.then((book: Book) => {
						this.server.broadcast(GripActions.cached, {uids: [book.uid]});

						return book;
					}).then((book: Book) => {

						let loader = (index: number, done: number[] = []) => {
							return cacher.preload(cache, index)
								.then((contents: string) => {
									let uri = book.getPageUri(index);
									let page = book.pages.by({ uri });
									let promise;

									if (!page) {
										page = pages.collection.create(uri);
										page.uri = uri;
										page.title = book.getPageTitle(index);
										page.book.set(book);

										promise = pages.collection.setOne(page);
									} else {
										promise = Promise.resolve(page);
									}

									return promise.then((page) => {
										page.contents = contents;
										book.cached = +new Date();

										return books.collection.setOne(book);
									});
								})
								.catch((error) => {
									console.error(error);
								})
								.then(() => {
									done.push(index);

									let next = cache.next(index);

									if (next !== index) {
										return loader(next, done);
									} else {
										return done;
									}
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
