
export class Eventable {
	private static _e_uid: number = 0;
	private _e_listeners: {[event: string]: Function[]} = {};

	on(event, handler): number {
		let listeners = this._e_listeners[event] || (this._e_listeners[event] = []);
		let uid = ++Eventable._e_uid;
		listeners[uid] = handler;

		return uid;
	}

	fire(event: string, ...payload: any[]): number {
		let listeners = this._e_listeners[event];
		let handled = 0;

		if (listeners) {
			let uids = Object.keys(listeners);

			for (let uid of uids) {
				listeners[uid](...payload, event);

				handled++;
			}
		}

		return handled;
	}

	once(event, handler): number {
		let uid;

		return uid = this.on(event, (payload, e) => {
			this.off(event, uid);

			return handler(e, payload);
		});
	}

	off(event, uid?: number) {
		let listeners = this._e_listeners[event];

		if (listeners) {
			if (!uid) {
				delete this._e_listeners[event]
			} else {
				delete listeners[uid];
			}
		}
	}
}
