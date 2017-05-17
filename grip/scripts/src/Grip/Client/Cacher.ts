

import { State } from './Book/Page/State';
import { CachedPage, CacheParams, PagesCache } from './Book/PagesCache';
import { Utils } from './Utils';

export class Cacher {

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
			.then((html: string) => Utils.contents(html, data.context))
			.then((contents) => this.links(regexp, Utils.wrap(contents, 'div')))
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

	preload(data: PagesCache, page: number, force?: boolean) {
		if (!force) {
			let contents = data.cache(page);

			if (contents !== undefined) {
				return Promise.resolve(contents);
			}
		}

		return new Promise((rs, rj) => {
			let uri = Object.keys(data.toc)[page];
			let state = data.pages[page].state;

			state.set(State.STATE_LOADING);

			return Utils.download(uri)
				.catch((e) => {
					console.log(e);

					throw new Error('Download failed for uri "' + uri + '"');
				})
				.then((html) => Utils.contents(html, data.context))
				.then((contents) => {
					data.cache(page, contents || false);

					if (contents !== undefined) {
						state.set(State.STATE_LOADED);
						rs(contents);
					} else {
						rj(new Error('Failed to extract contents of "' + uri + '"'));
					}
				})
				.then(() => {
					state.remove(State.STATE_LOADING);
				})
				.catch((e) => {
					state.remove(State.STATE_LOADING);
					state.set(State.STATE_FAILED);

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
