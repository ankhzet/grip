
import { BaseActions } from '../../core/parcel/actions/Base/BaseActions';
import { ServerConnector } from '../../core/client/ServerConnector';

export class GripClient extends ServerConnector {

	constructor(port: chrome.runtime.Port) {
		super('grip', port);
	}

	send(data, error?) {
		return BaseActions.send(this, data, error);
	}

}
