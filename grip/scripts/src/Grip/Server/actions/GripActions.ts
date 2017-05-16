
import { BaseActions } from '../../../core/parcel/actions/Base/BaseActions';

import {SomeAction, SomePacketData} from './Some';
import { ActionPerformer } from '../../../core/parcel/actions/ActionPerformer';

export class GripActions extends BaseActions {

	static get some(): ActionPerformer<SomePacketData, SomeAction> {
		let action =  SomeAction.uid;

		if (!this.registered(action)) {
			this.register(SomeAction);
		}

		return this.action(action);
	}

}
