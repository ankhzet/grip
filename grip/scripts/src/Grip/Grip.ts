
import { GripDB } from './GripDB';
import { Packet } from "../core/parcel/Packet";
import { GripServer } from './Server/Server';
import { GripClient } from "./Server/Client";

import { BooksProvider } from "./BooksProvider";
import { BooksDepot } from "./Domain/BooksDepot";
import { SomeAction, SomePacketData } from "../core/actions/Some";
import { SendAction, SendPacketData } from "../core/parcel/actions/Base/Send";
import { ContentedClientsPool } from "./Server/ContentedClientsPool";

export class Grip {
	server: GripServer;
	db: GripDB;
	books: BooksDepot = new BooksDepot(this);
	provider: BooksProvider;

	constructor() {
		this.db = new GripDB();
		this.server = new GripServer(this.db);

		this.provider = new BooksProvider(this.server.dataServer, this.books);

		this.server.on(SendAction, this._handle_send.bind(this));
		this.server.on(SomeAction, this._handle_some.bind(this));
	}

	some({ uid }) {
		this.server.clientsInActiveTab((clients: ContentedClientsPool) => {
			let instance = this.books.instance(uid);

			if (instance) {
				clients.some(instance.uri);
			}
		});
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

	_handle_some({ data }: SomePacketData) {
		let book = this.books.get(data.uid);

		if (!book) {
			// todo: error handling!
			throw new Error(`Book with uid "${data.uid}" not found`);
		}

		this.some(book);
	}

}
