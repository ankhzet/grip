
import { Book } from '../Book';
import { TranscoderInterface } from '../../../core/server/TranscoderInterface';

export class BookTranscoder implements TranscoderInterface<Book, {}> {

	public encode(book: Book): any {
		return {
			uid: book.uid,
			uri: book.uri,
			title: book.title,
			toc: book.toc,
			matchers: book.matchers.code(),
		};
	}

	public decode(data: any, target?: Book): Book {
		target = target || new Book(data.uid);

		target.uri = data.uri;
		target.title = data.title;
		target.toc = data.toc;

		for (let matcher of Object.keys(data.matchers)) {
			target.matchers.set(matcher, data.matchers[matcher]);
		}

		return target;
	}
}
