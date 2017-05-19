
import { Matcher } from './Matcher';
import { MatcherInterface } from './MatcherInterface';

export class Matchers {
	private _matchers = {};

	constructor(context, ...matchers: string[]) {
		for (let name of matchers) (() => {
			let matcher = this._matchers[name] = new Matcher(context);

			Object.defineProperty(this, name, {
				enumerable: true,
				configurable: false,
				get: () => { return matcher.code; },
				set: (code) => { matcher.code = code; },
			})
		})();
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
		return this[matcher] ? (this[matcher].match(content) || false) : undefined;
	}

	public fetch() {
		let matchers = {};

		for (let name of Object.keys(this._matchers)) {
			matchers[name] = (content) => this.match(name, content);
		}

		return matchers;
	}

	public code() {
		let matchers = {};

		for (let name of Object.keys(this._matchers)) {
			matchers[name] = this._matchers[name].code;
		}

		return matchers;
	}

	toString() {
		return JSON.stringify(this.code());
	}

}
