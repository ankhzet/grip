
import { BaseActions } from '../../core/parcel/actions/Base/BaseActions';
import { ClientConnector } from '../../core/server/ClientConnector';

export class GripClientConnector extends ClientConnector {

	constructor(port: chrome.runtime.Port) {
		super('grip', port);
	}

	send(data, error?) {
		return BaseActions.send(this, data, error);
	}

}
