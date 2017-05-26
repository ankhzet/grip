
import { ServerConnector as BaseServerConnector } from '../../core/client/ServerConnector';
import { GripActions } from "../Server/actions/GripActions";
import { HandshakeAction } from '../../core/parcel/actions/Base/Handshake';

export class ServerConnector extends BaseServerConnector {

	constructor(port?: chrome.runtime.Port) {
		super('grip', port);
		this.listen(HandshakeAction, this._handle_handshake);

		console.log('created', this.name, this.uid, this.constructor.name);
	}

	cache(uid: string) {
		return GripActions.cache(this, { uid });
	}

}
