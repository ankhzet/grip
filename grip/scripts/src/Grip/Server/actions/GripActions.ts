
import { BaseActions } from '../../../core/parcel/actions/Base/BaseActions';

import {CacheAction, CachePacketData} from './Cache';
import { ActionPerformer } from '../../../core/parcel/actions/ActionPerformer';

export class GripActions extends BaseActions {

	static get cache(): ActionPerformer<CachePacketData, CacheAction> {
		let action =  CacheAction.uid;

		if (!this.registered(action)) {
			this.register(CacheAction);
		}

		return this.action(action);
	}

}
