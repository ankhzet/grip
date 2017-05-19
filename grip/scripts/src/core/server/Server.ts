
import { ClientPort } from '../parcel/ClientPort';
import { ServerPort } from '../parcel/ServerPort';

import { ClientsPool } from "../parcel/ClientsPool";
import { PacketDispatcher } from "../parcel/PacketDispatcher";

import { SendPacketData, SendAction } from '../parcel/actions/Base/Send';

import { IdentifiableInterface } from '../db/data/IdentifiableInterface';
import { TranscoderInterface } from './TranscoderInterface';
import { Collection } from './data/Collection';
import { CollectionThunk, Synchronizer } from './Synchronizer';
import { ObjectUtils } from '../utils/object';

export class Server<C extends ClientPort> extends ServerPort<C> {
	public transcoder: TranscoderInterface<any, any>;
	public synchronised: Synchronizer;

	constructor(name: string, dispatcher: PacketDispatcher, pool: ClientsPool<C>) {
		super(name, dispatcher, pool);
		this.synchronised = new Synchronizer(this);

		// todo: implement default protocol transcoder
		let converter = (o) => {
			return ObjectUtils.transform(o, (value, prop) => (
				(!prop.match(/^_/) && [
					(typeof value === 'object')
						? converter(value)
						: value,
					prop,
				])
			));
		};

		this.transcoder = {
			encode(model: any): any {
				return converter(model);
			},
			decode(data: any): any {
				return converter(data);
			},
		};

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
		return this.synchronised.collection(
			collection,
			transcoder || this.transcoder
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
		let client = super.connect(port);

		return (
			client
				? this.prepareAfterConnect(client)
				: client
		);
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
