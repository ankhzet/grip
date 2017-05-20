
import { ClientPort } from '../parcel/ClientPort';

export class ServerConnector extends ClientPort {

	uid: string = ClientPort.guid('listener');

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	notifyDisconnect() {
	}

}
