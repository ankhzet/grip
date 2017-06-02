
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { Book } from './Domain/Collections/Book/Book';
import { BooksThunk } from './Domain/Collections/Book/BooksThunk';
import { PagesThunk } from './Domain/Collections/Page/PagesThunk';
import { Page } from "./Domain/Collections/Page/Page";
import { BookTable } from './Domain/Collections/Book/BookTable';
import { PageTable } from './Domain/Collections/Page/PageTable';

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
			books: this.server.thunk(
				new BooksThunk(
					new BookTable(this.db, (uid) => new Book(uid))
				)
			),

			pages: this.server.thunk(
				new PagesThunk(
					new PageTable(this.db, (uid) => new Page(uid))
				)
			),
		};

		this.server.on(CacheAction, this._handle_cache.bind(this));
		this.server.listen();
	}

	async _handle_cache({ uid }: CachePacketData) {
		let { books: {collection: books} } = this.collections;
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
					}).then((book: Book) => (
						this.preload(book, cacher, cache)
					))
				;
			})
		;
	}

	private preload(book: Book, cacher: Cacher, cache: PagesCache) {
		let { books: {collection: books}, pages: {collection: pages} } = this.collections;
		let uids = Object.keys(book.toc);

		let load = (index: number = 0, done: string[] = []) => {
			return cacher.preload(cache, index)
				.then((contents: string) => {
					let uri = uids[index];
					let page = book.pages.by({ uid: uri });

					return new Promise((rs, rj) => {
						if (page) {
							return rs(page);
						}

						page = pages.create();
						page.uri = uri;
						page.title = book.toc[uri];
						page.book.set(book);

						pages
							.setOne(page)
							.then(rs, rj);
					}).then((page: Page) => {
						page.contents = contents;
						book.cached = +new Date();

						return books.setOne(book)
							.then(() => page)
						;
					});
				})
				.catch((error) => {
					console.error(error);
				})
				.then((page: Page) => {
					done.push(page.uid);

					let next = cache.next(index);

					if (next !== index) {
						return load(next, done);
					} else {
						return done;
					}
				})
			;
		};

		return (
			load()
			.then((done: string[]) => {
				console.log('Preloaded:', cache, done, book);
			})
		);
	}

}
