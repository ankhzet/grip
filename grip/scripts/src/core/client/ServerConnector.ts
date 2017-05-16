
import { ClientPort } from '../parcel/ClientPort';

export class ServerConnector extends ClientPort {

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	notifyDisconnect() {
	}

}
