
import { State } from './Page/State';

export interface CacheParams {
	tocURI: string;
	pattern: string|RegExp;
	context: string;
}

export interface CachedPage {
	index: number;
	uri  : string;
	title: string;
	state: State;
	cache?: string;
}

export class PagesCache implements CacheParams {
	private current?: CachedPage;

	tocURI: string;
	pattern: string | RegExp;
	context: string;

	toc?: {[uri: string]: string};
	pages?: CachedPage[];

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

	state(page): State {
		return this.pages[page] ? this.pages[page].state : undefined;
	}

	cache(page, value?): string {
		let cache = this.pages[page];

		if (value !== undefined) {
			if (cache) {
				cache.cache = value;
			}
		}

		return cache ? cache.cache : undefined;
	}
}
