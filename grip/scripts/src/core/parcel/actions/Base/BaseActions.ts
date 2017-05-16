
import { ConnectPacketData, ConnectAction } from './Connect';
import { FetchPacketData, FetchAction } from '../../../server/actions/Fetch';
import { SendAction, SendPacketData } from './Send';
import { UpdatePacketData, UpdateAction } from '../../../server/actions/Update';
import { FirePacketData, FireAction } from './Fire';
import { AbstractActions } from '../AbstractActions';
import { ActionPerformer } from '../ActionPerformer';

export class BaseActions extends AbstractActions {

	static get connect(): ActionPerformer<ConnectPacketData, ConnectAction> {
		let action = ConnectAction.uid;

		if (!this.registered(action)) {
			this.register(ConnectAction);
		}

		return this.action(action);
	}

	static get fetch(): ActionPerformer<FetchPacketData, FetchAction> {
		let action = FetchAction.uid;

		if (!this.registered(action)) {
			this.register(FetchAction);
		}

		return this.action(action);
	}

	static get send(): ActionPerformer<SendPacketData, SendAction> {
		let action = SendAction.uid;

		if (!this.registered(action)) {
			this.register(SendAction);
		}

		return this.action(action);
	}

	static get update(): ActionPerformer<UpdatePacketData, UpdateAction> {
		let action = UpdateAction.uid;

		if (!this.registered(action)) {
			this.register(UpdateAction);
		}

		return this.action(action);
	}

	static get fire(): ActionPerformer<FirePacketData, FireAction> {
		let action = FireAction.uid;

		if (!this.registered(action)) {
			this.register(FireAction);
		}

		return this.action(action);
	}
}

