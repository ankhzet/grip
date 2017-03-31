
import { Actions, ActionPerformer } from '../parcel/actions/actions';

import { ExecuteAction, ExecutePacketData } from './execute';
import { UnmountPacketData, UnmountAction } from './unmount';

export class GearBoxActions extends Actions {

	static get execute(): ActionPerformer<ExecutePacketData, ExecuteAction> {
		let action =  ExecuteAction.uid;
		if (!this.registered(action))
			this.register(ExecuteAction);

		return this.action(action);
	}

	static get unmount(): ActionPerformer<UnmountPacketData, UnmountAction> {
		let action =  UnmountAction.uid;
		if (!this.registered(action))
			this.register(UnmountAction);

		return this.action(action);
	}

}

