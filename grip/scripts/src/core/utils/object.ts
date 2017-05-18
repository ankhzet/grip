
export class ObjectUtils {

	public static extract<T>(o: T, keys: (string|number)[] = null): T {
		let n = <T>{};

		for (let key of keys || Object.keys(o)) {
			n[key] = o[key];
		}

		return n;
	}

}
