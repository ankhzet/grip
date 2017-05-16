
import { ClientPort } from './parcel/parcel';
import { ActionHandler } from './parcel/dispatcher';
import { GripActions } from './actions/actions';
import { SendAction, SendPacketData } from './parcel/actions/send';

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

	unmount(uid: string) {
		return GripActions.unmount(this, { uid });
	}

	execute(uid: string, code?: string) {
		return GripActions.execute(this, { plugin: { uid: uid }, code });
	}

	fire(sender: string, event: string) {
		return GripActions.fire(this, { sender, event });
	}

}
