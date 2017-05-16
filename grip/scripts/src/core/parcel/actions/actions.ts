
import { ClientPort } from '../parcel';
import { ActionConstructor, Action } from './action';

import { ConnectPacketData, ConnectAction } from './connect';
import { FetchPacketData, FetchAction } from './fetch';
import { SendAction, SendPacketData } from './send';
import { UpdatePacketData, UpdateAction } from './update';
import { FirePacketData, FireAction } from './fire';

export type ActionPerformer<T, A extends Action<T>> = (port: ClientPort, data?: T, error?: string) => any;

export interface ActionsRepository {

	get<T>(constructor: ActionConstructor<T>);

}

class BaseActions {
	private static _cache: {[action: string]: ActionPerformer<any, any>} = {};
	private static _registry: {[action: string]: Action<any>} = {};

	static register(constructor: ActionConstructor<any>) {
		return this._registry[constructor.uid] = new constructor();
	}

	static get<T>(constructor: ActionConstructor<T>) {
		return this._registry[constructor.uid] || this.register(constructor);
	}

	static registered(name: string) {
		return this._registry[name];
	}

	static action<T, A extends Action<T>>(name: string): ActionPerformer<T, A> {
		let performer = this._cache[name];
		if (performer)
			return performer;

		let action = this._registry[name];

		return this._cache[name] = action.send.bind(action);
	}

}

export class Actions extends BaseActions {

	static get connect(): ActionPerformer<ConnectPacketData, ConnectAction> {
		let action =  ConnectAction.uid;
		if (!this.registered(action))
			this.register(ConnectAction);

		return this.action(action);
	}

	static get fetch(): ActionPerformer<FetchPacketData, FetchAction> {
		let action =  FetchAction.uid;
		if (!this.registered(action))
			this.register(FetchAction);

		return this.action(action);
	}

	static get send(): ActionPerformer<SendPacketData, SendAction> {
		let action =  SendAction.uid;
		if (!this.registered(action))
			this.register(SendAction);

		return this.action(action);
	}

	static get update(): ActionPerformer<UpdatePacketData, UpdateAction> {
		let action =  UpdateAction.uid;
		if (!this.registered(action))
			this.register(UpdateAction);

		return this.action(action);
	}

	static get fire(): ActionPerformer<FirePacketData, FireAction> {
		let action =  FireAction.uid;
		if (!this.registered(action))
			this.register(FireAction);

		return this.action(action);
	}
}

