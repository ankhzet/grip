
import { ClientConnector } from '../../core/server/ClientConnector';
import { GripActions } from '../../core/actions/GripActions';

export class ActionsConnector extends ClientConnector {

	some(data?: any) {
		return GripActions.some(this, { data });
	}

}
