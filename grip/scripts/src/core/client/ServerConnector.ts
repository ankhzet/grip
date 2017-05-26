
import { PortUtils } from '../parcel/PortUtils';
import { Port } from '../parcel/Port';
import { HandshakePacketData } from '../parcel/actions/Base/Handshake';
import { BaseActions } from '../parcel/actions/Base/BaseActions';

export class ServerConnector extends Port {
	public uid: string = PortUtils.guid('S');

	constructor(namespace: string, port?: chrome.runtime.Port) {
		super(namespace);

		if (!this.rebind(port)) {
			throw new Error('Failed to connect to background script');
		}
	}

	handshake() {
		return BaseActions.handshake(this, { uid: this.uid });
	}

	_handle_handshake(data: HandshakePacketData) {
		this.uid = PortUtils.rename(this.uid, data.uid);
		this.touched = +new Date;
	}

	notifyDisconnect() {
	}

}
