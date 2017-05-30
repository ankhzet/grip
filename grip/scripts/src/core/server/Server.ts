
import { ActionHandler } from '../parcel/ActionHandler';
import { ActionConstructor } from '../parcel/actions/Action';
import { Packet } from '../parcel/Packet';
import { PacketDispatcher, PacketHandler } from "../parcel/PacketDispatcher";

import { HandshakePacketData } from '../parcel/actions/Base/Handshake';
import { SendPacketData, SendAction } from '../parcel/actions/Base/Send';

import { Listener } from '../parcel/Listener';
import { ClientsPool } from "../parcel/ClientsPool";
import { ClientConnector } from './ClientConnector';

import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { TranscoderInterface } from './TranscoderInterface';
import { Collection } from './data/Collection';
import { CollectionThunk, Synchronizer } from './Synchronizer';
import { ObjectTranscoder } from './data/ObjectTranscoder';

export class Server<C extends ClientConnector> extends Listener<C> implements PacketHandler<C> {
	private dispatcher: PacketDispatcher;

	public transcoder: TranscoderInterface<any, any>;
	public synchronised: Synchronizer;

	constructor(name: string, dispatcher: PacketDispatcher, pool: ClientsPool<C>) {
		super(name, pool);
		this.dispatcher = dispatcher;
		this.synchronised = new Synchronizer(this);
		this.transcoder = new ObjectTranscoder();

		// todo: improve default handler
		this.on(null, (data, client, packet) => {
			console.log(
				`Client [${client.uid}: ${packet.sender}] requested to '${packet.action}':\n\t`,
				packet.data
			);
		});
		this.on(SendAction, this._handle_send.bind(this));
	}

	collection<M extends IdentifiableInterface>(collection: Collection<M>, transcoder?: TranscoderInterface<M, any>): CollectionThunk<M, any> {
		let main = this.transcoder;

		if (transcoder && main) {
			let wrap = transcoder;
			transcoder = {
				encode(model) {
					return main.encode(wrap.encode(model))
				},
				decode(data) {
					return wrap.decode(main.decode(data))
				}
			};
		}

		return this.synchronised.collection(
			collection,
			transcoder
		);
	}

	clientsInActiveTab(callback: (clients: ClientsPool<C>) => any) {
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true,
		}, (tabs) => {
			let ids = tabs.map((tab) => tab.id);

			callback(
				this.clients
					.filter((client) => (
						ids.indexOf(client.tabId) >= 0
					))
			);
		});
	}

	connect(port: chrome.runtime.Port): C {
		let handshaked = false;
		return super.connect(port)
			.handshake((data: HandshakePacketData, client: C) => {
				if (handshaked) {
					return false;
				}

				try {
					return this._handle_handshake(data, client);
				} finally {
					handshaked = true;
				}
			})
		;
	}

	disconnect(client: C): boolean {
		return (
			(client = this.clearBeforeDisconnect(client))
				? super.disconnect(client)
				: false
		);
	}

	prepareAfterConnect(client: C): C {
		return client;
	}

	clearBeforeDisconnect(client: C): C {
		return client;
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, C>): this {
		return this.dispatcher.bind(this, { action, handler });
	}

	_handle_handshake(data: HandshakePacketData, client: C) {
		client = this.add(client);
		client = this.prepareAfterConnect(client);

		client.listen(null, (sender: C, data: any, packet: Packet<any>) => {
			return this.dispatcher.dispatch(client, packet);
		});

		return false;
	}

	_handle_send({ what, data: payload }: SendPacketData, client, packet) {
		switch (what) {
			case 'error': {
				console.error(`Client ${client.uid} reported error during ${payload.action}:\n`,
					JSON.stringify(payload.data), '\n',
					`\t`, payload.error, '\n',
					packet
				);

				break;
			}
		}
	}

}
