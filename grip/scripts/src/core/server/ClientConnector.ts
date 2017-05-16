
import { ClientPort } from '../parcel/ClientPort';

export class ClientConnector extends ClientPort {

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to content script');
		}
	}

	notifyDisconnect() {
	}

}
