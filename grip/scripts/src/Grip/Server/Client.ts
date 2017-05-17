
import { ClientPort } from '../../core/parcel/ClientPort';

export class GripClient extends ClientPort {

	constructor(port: chrome.runtime.Port) {
		super('grip', port);
	}

}
