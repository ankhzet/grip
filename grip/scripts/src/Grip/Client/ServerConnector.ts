
import { ServerConnector as BaseServerConnector } from '../../core/client/ServerConnector';
import { GripActions } from "../Server/actions/GripActions";

export class ServerConnector extends BaseServerConnector {

	constructor() {
		super('grip');
	}

	cache(uid: string) {
		return GripActions.cache(this, { uid });
	}

}
