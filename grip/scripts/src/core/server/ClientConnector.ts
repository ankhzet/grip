
import { ClientPort } from '../parcel/ClientPort';
import { BaseActions } from '../parcel/actions/Base/BaseActions';

export class ClientConnector extends ClientPort {

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	fire(sender: string, event: string) {
		return BaseActions.fire(this, { sender, event });
	}

}
