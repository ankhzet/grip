
import { PortUtils } from '../parcel/PortUtils';
import { Port } from '../parcel/Port';

export class ServerConnector extends Port {

	uid: string = PortUtils.guid('S');

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	notifyDisconnect() {
	}

}
