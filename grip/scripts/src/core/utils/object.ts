
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

	public static compose(key: string[][]|string, value?: any, target?: any) {
		if (<any>key instanceof Array) {
			target = value || {};

			for (let [k, v] of key) {
				target = this.compose(k, v, target);
			}
		} else {
			target = target || {};
			target[<string>key] = value;
		}

		return target;
	}

}
