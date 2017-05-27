
import { Matcher } from './Matcher';
import { MatcherInterface } from './MatcherInterface';

export class Matchers {
	private _matchers: {[name: string]: Matcher<any, any, any>};

	constructor(context, ...matchers: string[]) {
		this._matchers = matchers.reduce((m, name) => {
			let matcher = new Matcher(context);

			Object.defineProperty(this, name, {
				enumerable: true,
				configurable: false,
				get: () => { return matcher.code; },
				set: (code) => { matcher.code = code; },
			});

			return (m[name] = matcher, m);
		}, {});
	}

	static create(context, prototype: {[key: string]: string}): Matchers {
		let names = Object.keys(prototype);
		let instance = new this(context, ...names);

		for (let name of names) {
			instance.set(name, prototype[name]);
		}

		return instance;
	}

	public set(name: string, code: string): MatcherInterface<any, any> {
		let matcher = this._matchers[name];

		if (matcher) {
			matcher.code = code;
		}

		return matcher;
	}

	public get(name: string): Matcher<any, any, any> {
		return this._matchers[name];
	}

	public match<T>(matcher: string, content: string): T|boolean {
		return this._matchers[matcher] ? (this._matchers[matcher].match(content) || false) : undefined;
	}

	public code(): {[name: string]: string} {
		return Object.keys(this._matchers)
			.reduce(
				(r, name) => (r[name] = this._matchers[name].code, r),
				{}
			)
			;
	}

	toString() {
		return JSON.stringify(this.code());
	}

}
