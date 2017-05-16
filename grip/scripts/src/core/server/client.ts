
import { ClientPort } from '../parcel/parcel';

export class GripClient extends ClientPort {

	constructor(port: chrome.runtime.Port) {
		super('grip', port);
	}

	connect() {
	}

}
