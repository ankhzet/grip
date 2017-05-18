
import { State } from './Page/State';
import { TocInterface } from '../../Domain/TocInterface';
import { Matchers } from '../../Domain/Matchers';

export class CacheParams {
	tocURI: string;
	matchers: Matchers;
}

export interface CachedPage {
	index: number;
	uri  : string;
	title: string;
	state: State;
	cache?: string;
}

export class PagesCache extends CacheParams {
	private current?: CachedPage;

	toc: TocInterface = {};
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

	uri(page) {
		return this.pages[page] ? this.pages[page].uri : undefined;
	}

	title(page) {
		return this.pages[page] ? this.pages[page].title : undefined;
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
