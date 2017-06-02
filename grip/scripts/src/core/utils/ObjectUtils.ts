
export class ObjectUtils {

	public static extract<T>(o: T, keys: (string|number)[] = null, n: T = <T>{}): T {
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

				if (o && (typeof n === 'object')) {
					n = this.patch(o, n);
				}

				current[prop] = n;
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

	public static transform(src: any, c: (value: any, prop: string, has: any) => any, r: any = {}) {
		let props = Object.keys(src);

		for (let prop of props) {
			let [n = undefined, p = undefined] = c(src[prop], prop, r[prop]) || [];

			if (n !== undefined) {
				r[p] = n;
			}
		}

		return r;
	}

}
