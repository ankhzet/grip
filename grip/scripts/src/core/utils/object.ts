
export class ObjectUtils {

	public static extract<T>(o: T, keys: (string|number)[] = null): T {
		let n = <T>{};

		for (let key of keys || Object.keys(o)) {
			n[key] = o[key];
		}

		return n;
	}

	public static patch(current, next) {
		for (let prop in next) {
			if (next.hasOwnProperty(prop)) {
				let o = current[prop];
				let n = next[prop];

				current[prop] = (typeof n === 'object')
					? this.patch(o, n)
					: n
				;
			}
		}

		return current;
	}

}
