
import { Book } from '../Book';
import { TranscoderInterface } from '../../../core/server/TranscoderInterface';

export class BookTranscoder implements TranscoderInterface<Book, {}> {

	public encode(book: Book, target?: any): any {
		let raw = ['uid', 'uri', 'title', 'toc'];
		let to = target || {};
		let o = to['matchers'] || (to['matchers'] = {});
		let n = book.matchers;


		for (let prop of raw) {
			to[prop] = book[prop];
		}

		for (let matcher of (Object.keys(n))) {
			o[matcher] = n[matcher].code;
		}

		return to;
	}

	public decode(data: any, target?: Book): Book {
		target = target || new Book(data.uid);

		for (let prop of Object.keys(data)) {
			let n = data[prop];

			if (prop === 'matchers') {
				let o = target.matchers;

				for (let matcher of Object.keys(n)) {
					o[matcher].code = n[matcher];
				}
			} else {
				target[prop] = n;
			}
		}

		return target;
	}
}
