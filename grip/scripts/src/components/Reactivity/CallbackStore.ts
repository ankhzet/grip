
export class CallbackStore {
	private callbacks: {[uid: number]: (any) => any} = [];
	private uid = 0;

	push(resolver: (...args: any[]) => any) {
		let uid = this.uid++;
		this.callbacks[uid] = resolver;

		return uid;
	}

	pop(uid: number): (any) => any {
		try {
			return this.callbacks[uid];
		} finally {
			delete this.callbacks[uid];
		}
	}
}
