
import { BaseActions } from './actions/Base/BaseActions';
import { PacketDispatcher } from './PacketDispatcher';
import { Packet } from './Packet';
import { ActionConstructor } from './actions/Action';
import { ActionHandler } from './ActionHandler';
import { Tracer } from './Tracer';
import { PortUtils } from './PortUtils';
import { HandshakeAction, HandshakePacketData } from "./actions/Base/Handshake";

export class Port {
	private dispatcher: PacketDispatcher = new PacketDispatcher(BaseActions);
	private port: chrome.runtime.Port;

	public tabId: number;

	public name: string;
	public uid: string = PortUtils.guid('P');
	public touched: number = 0;

	constructor(name: string, port?: chrome.runtime.Port) {
		this.name = PortUtils.portName(name);
		console.log('created', this.name, this.uid, this.constructor.name);

		if (!this.rebind(port)) {
			throw new Error('Failed to connect from ' + this.constructor.name);
		}
	}

	disconnect(): boolean {
		if (!this.port) {
			return false;
		}

		try {
			this.port.disconnect();
		} catch (e) {

		} finally {
			this.port = null;
		}

		return true;
	}

	rebind(port?: chrome.runtime.Port) {
		return this.bind(port || this.port || chrome.runtime.connect({ name: this.name }));
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

	listen<T, H extends Port>(action: ActionConstructor<T>, handler: ActionHandler<T, H>): this {
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

		Tracer.trace(' > ', this, packet);
		this.port.postMessage(packet);
	}

	process(packet: Packet<any>) {
		Tracer.trace(' < ', this, packet);
		this.touched = +new Date;

		this.dispatcher.dispatch(this, packet)
			.catch((e) => {
				BaseActions.send(this, { what: 'error', data: packet}, e.toLocaleString());
			});
	}

	handshake(delegate?: ActionHandler<HandshakePacketData, Port>) {
		let done = false;
		let handler = delegate || this._handle_handshake.bind(this);

		this.listen(HandshakeAction, (data: HandshakePacketData, client, packet) => {
			if (done) {
				console.log('repeating handshake', data, client, packet, this);
				return;
			}

			try {
				return handler(data, this, packet);
			} finally {
				done = true;
			}
		});

		BaseActions.handshake(this, { uid: this.uid });

		return this;
	}

	_handle_handshake(data: HandshakePacketData) {
		this.uid = PortUtils.rename(this.uid, data.uid);
		this.touched = +new Date;
	}

}

export type ClientFactory<C extends Port> = (port: chrome.runtime.Port) => C;
