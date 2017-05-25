
import { ServerConnector as BaseServerConnector } from '../../core/client/ServerConnector';
import { GripActions } from "../Server/actions/GripActions";
import { HandshakeAction } from '../../core/parcel/actions/Base/Handshake';
import { BaseActions } from '../../core/parcel/actions/Base/BaseActions';

export class ServerConnector extends BaseServerConnector {

	constructor(port?: chrome.runtime.Port) {
		super('grip');

		console.log('created', this.name, this.uid, this.constructor.name);
		this.listen(HandshakeAction, this.connectable);

		if (this.rebind(port)) {
			this.handshake();
		}
	}

	cache(uid: string) {
		return GripActions.cache(this, { uid });
	}

}
