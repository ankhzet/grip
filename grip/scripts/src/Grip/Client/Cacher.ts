
import { Eventable } from '../../core/utils/Eventable';

const STATE_NONE    = 0;
const STATE_ACTIVE  = 1;
const STATE_LOADING = 2;
const STATE_LOADED  = 4;
const STATE_FAILED  = 8;

const EVENT_CHANGED = "changed";

class State {
	private state: number = STATE_NONE;
	private eventable: Eventable;

	constructor(initial?) {
		if (initial) {
			this.state = initial;
		}

		this.eventable = new Eventable();
	}

	get() {
		return this.state || STATE_NONE;
	}

	set(state) {
		this.state = this.state | state;
		this.eventable.fire(EVENT_CHANGED, this.state);

		return this.state;
	}

	remove(state) {
		if (this.state | state) {
			this.state = this.state ^ state;
			this.eventable.fire(EVENT_CHANGED, this.state);
		}

		return this.state;
	}

	changed(callback, once) {
		return (
			once
				? this.eventable.once(EVENT_CHANGED, callback)
				: this.eventable.on(EVENT_CHANGED, callback)
		);
	}

	each(callback) {
		let bit = 1;
		let max = 0;
		let state = this.state;
		let v = [];

		while (max < state) {
			if (state & bit) {
				v.push(callback(bit));
			}

			max = max | bit;
			bit *= 2;
		}

		return v;
	}
}

export class CacheParams {
	tocURI: string;
	pattern: string|RegExp;
	context: string;
}

export class Cache extends CacheParams {
	private current?: CachedPage;
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
			this.current.state.remove(STATE_ACTIVE);
		}

		this.current = next;
		this.current.state.set(STATE_ACTIVE);
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

export interface CachedPage {
	index: number;
	uri  : string;
	title: string;
	state: State;
	cache?: string;
}

export class Cacher {
	// private hostRE: RegExp;

	constructor() {
		// this.hostRE = new RegExp('.*' + (new URL(uri)).host);
	}

	uri(url: string): string {
		let uri = new URL(url);
		uri.host = '';

		return uri.toString();
	}

	links(pattern, context) {
		let self = this;
		let toc = {}, href;

		$('a[href]', context).each(function ()  {
			let href = this.getAttribute('href');

			if (href && href.match(pattern)) {
				toc[self.uri(href)] = this.innerHTML;
			}
		});

		return toc;
	}

	fetch(data: CacheParams) {
		let regexp = (data.pattern instanceof RegExp) ? data.pattern : new RegExp(data.pattern);

		return this.download(data.tocURI)
			.then((html: string) => Util.contents(html, data.context))
			.then((contents) => this.links(regexp, Util.wrap(contents, 'div')))
			.then((toc) => {
				let uris = Object.keys(toc);

				return <CacheParams>{
					tocURI: data.tocURI,
					pattern: data.pattern,
					context: data.context,
					toc: toc,

					pages: uris.map((uri, index) => {
						return <CachedPage>({
							index   : index,
							uri     : uri,
							title   : toc[uri],
							state   : new State(),
							contents: undefined,
						});
					}),
				};
			})
		;
	}

	preload(data: CacheParams, page: number, force?: boolean) {
		if (!force) {
			let contents = data.cache(page);

			if (contents !== undefined) {
				return Promise.resolve(contents);
			}
		}

		return new Promise((rs, rj) => {
			let uri = Object.keys(data.toc)[page];
			let state = data.pages[page].state;

			state.set(STATE_LOADING);

			return Util.download(uri)
				.catch((e) => {
					console.log(e);

					throw new Error('Download failed for uri "' + uri + '"');
				})
				.then((html) => Util.contents(html, data.context))
				.then((contents) => {
					data.cache(page, contents || false);

					if (contents !== undefined) {
						state.set(STATE_LOADED);
						rs(contents);
					} else {
						rj(new Error('Failed to extract contents of "' + uri + '"'));
					}
				})
				.then(() => {
					state.remove(STATE_LOADING);
				})
				.catch((e) => {
					state.remove(STATE_LOADING);
					state.set(STATE_FAILED);

					rj(e);
				});
		});
	}

	download(uri: string, ...args): Promise<string> {
		return new Promise((rs, rj) => {
			$.get(uri)
				.then(
					rs.bind(null, ...args),
					(j, t, e) => rj(j.status + ' ' + e)
				);
		}).catch((e) => {
			throw new Error('Download failed for uri "' + uri + '" (' + e.getMessage() + ')');
		});
	}
}

let Util = {
	wrap(html: string, parent?: string) {
		return $('<' + (parent || 'html') + '>').html(html);
	},
	contents(html: string, context: string, parent?: string) {
		return new Promise((rs, rj) => {
			try {
				let filtered = this.wrap(html, parent)
					.find(context)
					.html();

				rs(filtered);
			} catch (e) {
				rj(e);
			}
		});
	},
	download(uri: string): Promise<string> {
		return new Promise((rs, rj) => {
			$.get(uri)
				.then(rs, (j, t, e) => rj(j.status + ' ' + e));
		});
	},
	chunks(array: any[], block: number) {
		return (new Array(~~Math.ceil(array.length / block)))
			.fill(undefined)
			.map((v, index) => {
				return array.slice(index * block, (index + 1) * block);
			})
		;
	}
};
