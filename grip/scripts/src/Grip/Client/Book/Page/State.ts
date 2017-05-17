
import { Eventable } from '../../../../core/utils/Eventable';

export class State {
	static STATE_NONE    = 0;
	static STATE_ACTIVE  = 1;
	static STATE_LOADING = 2;
	static STATE_LOADED  = 4;
	static STATE_FAILED  = 8;

	static EVENT_CHANGED = "changed";

	private state: number = State.STATE_NONE;
	private eventable: Eventable;

	constructor(initial?: number) {
		if (initial) {
			this.state = initial;
		}

		this.eventable = new Eventable();
	}

	get(): number {
		return this.state || State.STATE_NONE;
	}

	set(state: number): number {
		this.state = this.state | state;
		this.eventable.fire(State.EVENT_CHANGED, this.state);

		return this.state;
	}

	remove(state: number) {
		if (this.state | state) {
			this.state = this.state ^ state;
			this.eventable.fire(State.EVENT_CHANGED, this.state);
		}

		return this.state;
	}

	changed(callback, once?: boolean): number {
		return (
			once
				? this.eventable.once(State.EVENT_CHANGED, callback)
				: this.eventable.on(State.EVENT_CHANGED, callback)
		);
	}

	each(callback: (bit: number) => any): any[] {
		let bit = 1;
		let max = 0;
		let state = this.state;
		let v = [];

		while (max < state) {
			if (state & bit) {
				v.push(callback(bit));
			}

			max = max | bit;
			bit *= 2;
		}

		return v;
	}
}
