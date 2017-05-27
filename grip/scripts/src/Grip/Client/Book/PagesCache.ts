
import { State } from './Page/State';
import { TocInterface } from '../../Domain/TocInterface';
import { Matchers } from '../../Domain/Matching/Matchers';

export class CacheParams {
	tocURI: string;
	matchers: Matchers;
}

export class CachedPage {
	index: number;
	uri  : string;
	title: string;
	state: State;

	constructor() {
		this.state = new State();
	}
}

export class PagesCache extends CacheParams {
	private current?: CachedPage;

	toc: TocInterface = {};
	pages: CachedPage[];
	cache: Cache;
	state: State;

	constructor() {
		super();

		this.cache = new Cache();
		this.state = new State();
		this.pages = [];
	}

	get page() {
		return this.current ? this.current.index : undefined;
	}

	set page(page) {
		let next = this.pages[page];

		if (!(next && (next !== this.current))) {
			return;
		}

		if (this.current) {
			this.current.state.remove(State.STATE_ACTIVE);
		}

		this.current = next;
		this.current.state.set(State.STATE_ACTIVE);
	}

	prev(page): number {
		return Math.max(page - 1, 0);
	}

	next(page): number {
		return Math.min(page + 1, this.pages.length - 1);
	}

	uri(page) {
		return this.pages[page] ? this.pages[page].uri : undefined;
	}

	title(page) {
		return this.pages[page] ? this.pages[page].title : undefined;
	}

}

interface Bucket {
	expires: number;
	data: any;
}

class Cache {
	private store: {[key: string]: Bucket} = {};

	public put(key: string|number, value: any, ttl: number = 0) {
		let bucket = this.store[key] || (this.store[key] = <Bucket>{});

		bucket.expires = +(ttl && (+new Date) + ttl);
		bucket.data = value;
	}

	public get(key: string|number): any {
		let bucket = this.store[key];
		let valid = bucket && !(bucket.expires && ((+new Date) > bucket.expires));

		if (!valid) {
			if (bucket) {
				delete this.store[key];
			}

			return;
		}

		return bucket.data;
	}
}
