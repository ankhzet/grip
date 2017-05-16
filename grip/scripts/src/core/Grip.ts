
import { Books } from './domain/Books';
import { Book } from './domain/Book';

import { GripDB } from './GripDB';

import { Packet } from './parcel/packet';

import { GripClient } from './server/client';
import { GripServer } from './server/server';

import { ExecuteAction, ExecutePacketData } from './actions/execute';
import { UnmountAction, UnmountPacketData } from './actions/unmount';

import { SendPacketData, SendAction } from './parcel/actions/send';
import { ClientActionHandler, ContentedClientsPool } from './server/base';
import { GripActions } from './actions/actions';
import { FireAction, FirePacketData } from './parcel/actions/fire';
import { ActionConstructor } from './parcel/actions/action';
import { ActionHandler } from './parcel/dispatcher';
import { DataServer } from './server/data-server';
import { EntityProvider } from './server/entity-provider';
import { Package } from './db/data/Package';
import { ModelStore } from './db/ModelStore';
import { PackageInterface } from './db/data/PackageInterface';

export class Grip extends GripServer {
	db: GripDB = new GripDB();
	dataServer: DataServer;
	books: BooksDepot = new BooksDepot(this);
	provider: BooksProviderHelper;

	force: {
		send: ClientActionHandler<SendPacketData>;
		execute: ClientActionHandler<ExecutePacketData>;
	};

	constructor() {
		super();

		this.force.execute = (client: GripClient, data: ExecutePacketData) => {
			return GripActions.execute(client, data);
		};

		this.on(SendAction, this._handle_send);

		this.on(ExecuteAction, this._handle_execute);
		this.on(FireAction, this._handle_fire);

		this.dataServer = new DataServer(this, this.db);

		this.provider = new BooksProviderHelper(this.dataServer, this.books);
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, GripClient>): this {
		return <any>super.on(action, (sender, data, packet) => {
			this._handle(sender, packet);

			return handler.call(this, sender, data, packet);
		});
	}

	fire(uid: string, event: string, ...payload: any[]) {
		let instance = this.books.instance(uid);

		if (instance) {
			// return instance.fire(event, this, ...payload);
		}
	}

	execute({uid}, code: any) {
		this.clientsInActiveTab((clients: ContentedClientsPool) => {
			let instance = this.books.instance(uid);

			if (instance) {
				clients.execute(instance, (code || '').toString());
			}
		});
	}

	/**
	 * Interacting with clients
	 */

	_handle_send(client: GripClient, { what, data: payload }: SendPacketData, packet: Packet<SendPacketData>) {
		switch (what) {
			case 'error': {
				console.error(
					`Client reported error during ${payload.action}:`, '\n',
					JSON.stringify(payload.data), '\n',
					`\t`, payload.error
				);
				break;
			}
		}
	}

	_handle_fire(client: GripClient, { sender, event, payload }: FirePacketData, packet: Packet<FirePacketData>) {
		this.fire(sender, event, payload);
	}

	_handle_execute(client: GripClient, { plugin: data, code }: ExecutePacketData, packet: Packet<ExecutePacketData>) {
		let plugin = this.books.get(data.uid);
		if (!plugin) {
			// todo: error handling!
			throw new Error(`Plugin with uid "${data.uid}" not found`);
		}

		this.execute(plugin, code);
	}

	_handle(client: GripClient, packet: Packet<any>) {
		console.log(`Client [${packet.sender}] requested to '${packet.action}':`);
		console.log(`\tsupplied data:`, packet.data);
	}

}

interface BookPackage extends PackageInterface<Book> { }

class BooksDepot extends Books {
	context: any;

	constructor(context: any) {
		super((uid) => {
			return new Book(uid);
		});
		this.context = context;
	}

	public instance(uid: string): Book {
		return new Book(uid);
	}

	public load(data: {uid: string}[]): BookPackage {
		let result: BookPackage = {};

		for (let fragment of data) {
			result[fragment.uid] = this.bookFromData(fragment);
		}

		return result;
	}

	protected bookFromData(data: { uid: string }): Book {
		let book = data.uid && this.get(data.uid);

		if (!book) {
			book = this.create();
		}

		for (let key in data) {
			if (!key.match(/^_/)) {
				book[key] = data[key];
			}
		}

		this.set(book);

		return book;
	}

}

class BooksProviderHelper extends EntityProvider {
	books: BooksDepot;

	constructor(provider: DataServer, books: BooksDepot) {
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

	map(pack: BookPackage): BookPackage {
		return this.books.load(
			Object.keys(pack)
				.map((uid) => pack[uid])
		);
	}

	removed(store: ModelStore, uids: string[]) {
		let data = super.removed(store, uids);

		for (let uid in data) {
			this.books.remove(uid);
		}

		return data;
	}

}
