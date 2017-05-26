
import { Matcher } from './Matcher';
import { MatcherInterface } from './MatcherInterface';

export class Matchers {
	private _matchers = {};

	constructor(context, ...matchers: string[]) {
		for (let name of matchers) {
			this._matchers[name] = (() => {
				let matcher = new Matcher(context);

				Object.defineProperty(this, name, {
					enumerable: true,
					configurable: false,
					get: () => { return matcher.code; },
					set: (code) => { matcher.code = code; },
				});

				return matcher;
			})();
		}
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

	public get(name: string): string {
		return this._matchers[name] ? this._matchers[name].code : undefined;
	}

	public match<T>(matcher: string, content: string): T|boolean {
		return this._matchers[matcher] ? (this._matchers[matcher].match(content) || false) : undefined;
	}

	public fetch() {
		let matchers = {};

		for (let name of Object.keys(this._matchers)) {
			matchers[name] = (content) => this.match(name, content);
		}

		return matchers;
	}

	public code() {
		let code = {};

		for (let name of Object.keys(this._matchers)) {
			code[name] = this._matchers[name].code;
		}

		return code;
	}

	toString() {
		return JSON.stringify(this.code());
	}

}