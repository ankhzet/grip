
import { State } from './Book/Page/State';
import { CachedPage, CacheParams, PagesCache } from './Book/PagesCache';
import { Utils } from './Utils';
import { TocInterface } from '../Domain/TocInterface';

export class Cacher {

	uri(url: string): string {
		let uri = new URL(url);
		uri.host = '';

		return uri.toString();
	}


	fetch(data: CacheParams) {
		return this.download(data.tocURI)
			.then((html: string) => data.matchers.toc.match(html))
			.then((toc: TocInterface) => {
				let uris = Object.keys(toc);

				return <CacheParams>{
					tocURI: data.tocURI,
					toc: toc,

					matchers: data.matchers,

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
				.then((html: string) => data.matchers.page.match(html) || false)
				.then((contents: string) => {
					data.cache(page, contents);

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
