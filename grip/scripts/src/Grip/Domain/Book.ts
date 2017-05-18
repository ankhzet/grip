
import { Model } from '../../core/db/data/Model';
import { TocInterface } from './TocInterface';
import { Matcher } from './Matcher';
import { MatcherInterface } from './MatcherInterface';
import { ObjectUtils } from '../../core/utils/object';

const EMPTY_MATCHER = `
(() => {
	class Matcher {
		constructor(grip, context) {
			this.grip = grip;
			this.context = context;
		}

		match(content) {
			throw new Error('Not implemented.');
		}
	}

	return (grip, context) => new Matcher(grip, context);
})();
`;

export class Book extends Model{
	public uid: string;

	public title: string;
	public uri: string;
	public toc: TocInterface = {};

	public matchers: Matchers = Matchers.create(Book.matchers);

	static MATCHER_TOC = 'toc';
	static MATCHER_PAGE= 'page';

	static matchers = ObjectUtils.compose([
		[Book.MATCHER_TOC , EMPTY_MATCHER],
		[Book.MATCHER_PAGE, EMPTY_MATCHER],
	]);
}

class Matchers {
	private matchers = {};

	constructor(...matchers: string[]) {
		for (let name of matchers) (() => {
			let matcher = this.matchers[name] = new Matcher();

			Object.defineProperty(this, name, {
				enumerable: true,
				configurable: false,
				get: () => { return matcher; },
				set: (code) => { matcher.code = code; },
			})
		})();
	}

	static create(prototype: {[key: string]: string}): Matchers {
		let names = Object.keys(prototype);
		let instance = new this(...names);

		for (let name of names) {
			instance.set(name, prototype[name]);
		}

		return instance;
	}

	public set(name: string, code: string): MatcherInterface<any, any> {
		let matcher = this.matchers[name];

		if (matcher) {
			matcher.code = code;
		}

		return matcher;
	}

	public get(name: string): string {
		return this.matchers[name] ? this.matchers[name].code : undefined;
	}

	public match<T>(matcher: string, content: string): T {
		return this[matcher] ? this[matcher].match(content) : undefined;
	}

	public fetch() {
		let matchers = {};

		for (let name of Object.keys(this.matchers)) {
			matchers[name] = (content) => this.match(name, content);
		}

		return matchers;
	}

	public code() {
		let matchers = {};

		for (let name of Object.keys(this.matchers)) {
			matchers[name] = this.matchers[name].code;
		}

		return matchers;
	}

	toString() {
		return JSON.stringify(this.code());
	}

}
