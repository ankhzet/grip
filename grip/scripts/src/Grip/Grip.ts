
import { GripDB } from './GripDB';
import { Packet } from '../core/parcel/Packet';
import { GripServer } from './Server/Server';
import { GripClient } from './Server/Client';

import { BooksProvider } from './BooksProvider';
import { BooksDepot } from './Domain/BooksDepot';
import { CacheAction, CachePacketData } from './Server/actions/Cache';
import { SendAction, SendPacketData } from '../core/parcel/actions/Base/Send';
import { Cacher } from './Client/Cacher';
import { PagesCache } from './Client/Book/PagesCache';
import { Book } from './Domain/Book';
import { GripActions } from './Server/actions/GripActions';
import { ModelStore } from '../core/db/ModelStore';

export class Grip {
	server: GripServer;
	db: GripDB;
	books: BooksDepot;
	provider: BooksProvider;

	constructor() {
		this.db = new GripDB();
		this.server = new GripServer(this.db);

		this.books = new BooksDepot();
		this.provider = new BooksProvider(this.server.dataServer, this.books);

		this.server.on(SendAction, this._handle_send.bind(this));
		this.server.on(CacheAction, this._handle_cache.bind(this));

		this.books.changed((uids: string[]) => {
			this.server.broadcast(GripActions.updated, { what: 'books', uids});
		})
	}

	_handle_send({ what, data: payload }: SendPacketData, client: GripClient, packet: Packet<SendPacketData>) {
		switch (what) {
			case 'error': {
				console.log(`Client ${client.uid} reported error during ${payload.action}:\n`,
					JSON.stringify(payload.data), '\n',
					`\t`, payload.error, '\n',
					packet
				);

				break;
			}
		}
	}

	_handle_cache({ book: { uid, title } }: CachePacketData) {
		let book = this.books.get(uid);

		if (!book) {
			throw new Error(`Book "${title}" with uid "${uid}" not found`);
		}

		(new Cacher())
			.fetch({
				tocURI: book.uri,
				matchers: book.matchers,
			}).then((cache: PagesCache) => {
				book.toc = cache.toc;

				return this.provider.update(new ModelStore('books'), {
					updated: {},
					removed: {},
				});
			}).then((book: Book) => {
			})
		;
	}

}
