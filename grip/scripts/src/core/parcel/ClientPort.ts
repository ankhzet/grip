
import { Port } from './Port';
import { BaseActions } from './actions/Base/BaseActions';
import { PacketDispatcher } from './PacketDispatcher';
import { Packet } from './Packet';
import { ActionConstructor } from './actions/Action';
import { ConnectAction, ConnectPacketData } from './actions/Base/Connect';
import { ActionHandler } from './ActionHandler';

export class ClientPort extends Port {
	tabId: number;

	uid: string = Port.guid('c');
	touched: number = 0;
	dispatcher: PacketDispatcher = new PacketDispatcher(BaseActions);

	constructor(name: string, port?: chrome.runtime.Port) {
		super(name);

		this.listen(ConnectAction, this.connectable);

		if (this.rebind(port)) {
			this.connect();
		}
	}

	disconnect() {
		if (this.port) {
			this.port.disconnect();
		}
	}

	rebind(port?: chrome.runtime.Port) {
		return this.bind(port || chrome.runtime.connect({ name: this.name }));
	}

	connect() {
		return BaseActions.connect(this, { uid: this.uid });
	}

	fire(sender: string, event: string) {
		return BaseActions.fire(this, { sender, event });
	}

	bind(port) {
		if (!port) {
			return;
		}

		port.onMessage.addListener(this.process.bind(this));
		port.onDisconnect.addListener(() => { this.port = null; });

		return this.port = port;
	}

	listen<T, H extends ClientPort>(action: ActionConstructor<T>, handler: ActionHandler<T, H>): this {
		return this.dispatcher.bind(this, <any>{ handler, action });
	}

	sendPacket(action, data?, error?) {
		if (!this.port) {
			return;
		}

		let packet: Packet<any> = {
			sender: this.uid,
			action: action,
			data: data,
			error: error || null,
		};

		this.port.postMessage(packet);
	}

	process(packet: Packet<any>) {
		this.touched = +new Date;

		this.dispatcher.dispatch(this, packet)
			.catch((e) => {
				BaseActions.send(this, { what: 'error', data: packet}, e.toLocaleString());
			});
	}

	connectable(data: ConnectPacketData, sender: ClientPort, packet: Packet<ConnectPacketData>) {
		this.uid = packet.sender;
		this.touched = +new Date;
	}

}

export type ClientFactory<C extends ClientPort> = (port: chrome.runtime.Port) => C;
