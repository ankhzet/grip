
import { ClientPort } from '../parcel/parcel';

export class GearBoxClient extends ClientPort {

	constructor(port: chrome.runtime.Port) {
		super('gearbox', port);
	}

	connect() {
	}

}
