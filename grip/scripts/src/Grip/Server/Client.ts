
import { Port } from '../../core/parcel/Port';
import { BaseActions } from '../../core/parcel/actions/Base/BaseActions';

export class GripClient extends Port {

	constructor(port: chrome.runtime.Port) {
		super('grip', port);
	}

	send(data, error?) {
		return BaseActions.send(this, data, error);
	}

}
