
import { ClientPort } from './parcel/ClientPort';
import { SendAction, SendPacketData } from './parcel/actions/Base/Send';
import { ActionHandler } from "./parcel/ActionHandler";
import { GripActions } from './actions/GripActions';

export class ClientConnector extends ClientPort {

	constructor(namespace: string) {
		super(namespace);

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	onsent<S>(callback: ActionHandler<SendPacketData, S>) {
		return this.on(SendAction, callback);
	}

	fetch(query: any, payload?: any) {
		return GripActions.fetch(this, { what: 'plugins', query, payload });
	}

	update(data: any, payload?: any) {
		return GripActions.update(this, { what: 'plugins', data, payload });
	}

	some(data?: any) {
		return GripActions.some(this, { data });
	}

	fire(sender: string, event: string) {
		return GripActions.fire(this, { sender, event });
	}

}
