
import { Book } from '../Book';
import { TranscoderInterface } from '../../../core/server/TranscoderInterface';

export class BookTranscoder implements TranscoderInterface<Book, {}> {

	deep(src: any, c: (value: any, prop: string, has: any) => any, r: any = {}) {
		let props = Object.keys(src);

		for (let prop of props) {
			let [n, p] = c(src[prop], prop, r[prop]);

			if (n !== undefined) {
				r[p] = n;
			}
		}

		return r;
	}

	public encode(book: Book): any {
		return this.deep(book, (value, prop) => {
			switch (prop) {
				case 'toc':
					value = this.deep(value, (title, uri) => (
						[title, btoa(uri || "")]
					));
					break;

				case 'matchers':
					value = value.code();
					break;
			}

			return [value, prop];
		});
	}

	public decode(data: any, target?: Book): Book {
		return this.deep(data, (value, prop, has) => {
			switch (prop) {
				case 'toc':
					value = this.deep(value, (title, uri) => {
						try {
							return [title, atob(uri || "")];
						} catch (e) {
							return [title, uri];
						}
					});
					break;

				case 'matchers':
					value = this.deep(value, (code, matcher) => (
						[code, matcher]
					), has);
					break;
			}

			return [value, prop];
		}, target || new Book(data.uid));
	}
}
