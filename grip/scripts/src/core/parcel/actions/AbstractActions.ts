
import { Action, ActionConstructor } from "./Action";
import { ActionPerformer } from "./ActionPerformer";

export abstract class AbstractActions {
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

		if (!performer) {
			let action = this._registry[name];
			performer = action.send.bind(action);
			this._cache[name] = performer;
		}

		return performer;
	}

}
