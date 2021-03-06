
import { BaseActions } from '../../../core/parcel/actions/Base/BaseActions';

import {CacheAction, CachePacketData} from './Cache';
import { ActionPerformer } from '../../../core/parcel/actions/ActionPerformer';
import { UpdatedAction, UpdatedPacketData } from './Updated';
import { CachedAction, CachedPacketData } from './Cached';

export class GripActions extends BaseActions {

	static get cache(): ActionPerformer<CachePacketData, CacheAction> {
		let action =  CacheAction.uid;

		if (!this.registered(action)) {
			this.register(CacheAction);
		}

		return this.action(action);
	}

	static get cached(): ActionPerformer<CachedPacketData, CachedAction> {
		let action =  CachedAction.uid;

		if (!this.registered(action)) {
			this.register(CachedAction);
		}

		return this.action(action);
	}

	static get updated(): ActionPerformer<UpdatedPacketData, UpdatedAction> {
		let action =  UpdatedAction.uid;

		if (!this.registered(action)) {
			this.register(UpdatedAction);
		}

		return this.action(action);
	}

}
