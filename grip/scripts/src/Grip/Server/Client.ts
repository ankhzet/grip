
import { ClientPort } from '../../core/parcel/ClientPort';
import { BaseActions } from '../../core/parcel/actions/Base/BaseActions';

export class GripClient extends ClientPort {

	constructor(port: chrome.runtime.Port) {
		super('grip', port);
	}

	send(data, error?) {
		return BaseActions.send(this, data, error);
	}

}
