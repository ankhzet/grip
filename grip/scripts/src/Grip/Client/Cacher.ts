
import { Utils } from './Utils';
import { ObjectUtils } from '../../core/utils/ObjectUtils';
import { State } from './Book/Page/State';
import { CachedPage, CacheParams, PagesCache } from './Book/PagesCache';
import { TocInterface } from '../Domain/TocInterface';
import { Book } from '../Domain/Book';
import { Matcher } from '../Domain/Matching/Matcher';

export class Cacher {

	match(uri: string, matcher: Matcher<string, any, any>) {
		return Utils.download(uri)
			.then((html: string) => matcher.match(html));
	}

	fetch(data: CacheParams): Promise<PagesCache> {
		return this.match(data.tocURI, data.matchers.get(Book.MATCHER_TOC))
			.then((toc: TocInterface) => {
				let { tocURI, matchers } = data;

				return ObjectUtils.patch(new PagesCache(), {
					tocURI,
					matchers,
					toc,

					pages: Object.keys(toc).map((uri, index) =>
						ObjectUtils.patch(new CachedPage(), {
							index: index,
							uri  : uri,
							title: toc[uri],
						})
					),
				});
			})
		;
	}

	preload(data: PagesCache, page: number, force?: boolean): Promise<string> {
		return new Promise((rs, rj) => {
			if (!force) {
				let contents = data.cache.get(page);

				if (contents !== undefined) {
					return rs(contents);
				}
			}

			let uri = Object.keys(data.toc)[page];
			let { state } = data.pages[page];

			return Utils.ensure(() => this.match(uri, data.matchers.get(Book.MATCHER_PAGE)), (finished: boolean) => {
					if (finished) {
						state.remove(State.STATE_LOADING);
					} else {
						state.set(State.STATE_LOADING);
					}
				})
				.then((contents: string) => {
					data.cache.put(page, contents);

					if (contents !== undefined) {
						state.set(State.STATE_LOADED);

						return contents;
					}

					throw new Error('Failed to extract contents of "' + uri + '"');
				})
				.then(rs)
				.catch((e) => {
					state.set(State.STATE_FAILED);

					rj(e);
				});
		});
	}

}
