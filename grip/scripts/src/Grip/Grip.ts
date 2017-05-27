
import { GripDB } from './GripDB';
import { GripServer } from './Server/Server';

import { GripActions } from './Server/actions/GripActions';
import { CacheAction, CachePacketData } from './Server/actions/Cache';

import { Book } from './Domain/Book';
import { BooksDepot } from './Domain/BooksDepot';
import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { Collection } from '../core/server/data/Collection';
import { TranscoderInterface } from '../core/server/TranscoderInterface';
import { BookTranscoder } from "./Domain/Transcoders/Packet/BookTranscoder";
import { ObjectUtils } from '../core/utils/ObjectUtils';

export class Grip {
	server: GripServer;
	db: GripDB;
	collections: {[name: string]: Collection<any>} = {
		books: null,
	};
	transcoders: {[name: string]: TranscoderInterface<any, any>} = {
		books: null,
	};

	constructor() {
		this.db = new GripDB();
		this.collections = {
			books: new BooksDepot(this.db),
		};
		this.transcoders = {
			books: new BookTranscoder(),
		};

		this.server = new GripServer();
		let dtr = this.server.transcoder;

		for (let name of Object.keys(this.collections)) {
			let collection = this.collections[name];
			let transcoder = this.transcoders[name];

			if (transcoder && dtr) {
				transcoder = ((transcoder: TranscoderInterface<any, any>) => ({
					encode(model) {
						return dtr.encode(transcoder.encode(model))
					},
					decode(data) {
						return dtr.decode(transcoder.decode(data))
					}
				}))(transcoder);
			}

			this.server.collection(collection, this.transcoders[name]);

			collection.changed((uids: string[]) => {
				this.server.broadcast(GripActions.updated, { what: name, uids});
			});
		}

		this.server.on(CacheAction, this._handle_cache.bind(this));
	}

	async _handle_cache({ uid }: CachePacketData) {
		let books = <BooksDepot>this.collections.books;
		let book = await books.getOne(uid);

		if (!book) {
			throw new Error(`Book with uid "${uid}" not found`);
		}

		return (new Cacher())
			.fetch({
				tocURI: book.uri,
				matchers: book.matchers,
			}).then((cache: PagesCache) => books.setOne(ObjectUtils.patch(book, {
				toc: cache.toc,
			}))).then((book: Book) => {
			})
		;
	}

}
