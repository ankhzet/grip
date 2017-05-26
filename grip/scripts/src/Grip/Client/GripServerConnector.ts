
import { ServerConnector } from '../../core/client/ServerConnector';
import { GripActions } from '../Server/actions/GripActions';

export class GripServerConnector extends ServerConnector {

	constructor(port?: chrome.runtime.Port) {
		super('grip', port);
	}

	cache(uid: string) {
		return GripActions.cache(this, { uid });
	}

}
