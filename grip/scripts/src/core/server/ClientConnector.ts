
import { Port } from '../parcel/Port';

export class ClientConnector extends Port {

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to content script');
		}
	}

	notifyDisconnect() {
	}

}
