
import { ClientConnector } from '../../core/server/ClientConnector';
import { GripActions } from './actions/GripActions';

export class ActionsConnector extends ClientConnector {

	some(data?: any) {
		return GripActions.some(this, { data });
	}

}
