
import { Book } from '../../Book';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';

export class BookTranscoder implements TranscoderInterface<Book, {}> {

	public encode(book: Book): any {
		return ObjectUtils.transform(book, (value, prop) => {
			switch (prop) {
				case 'toc':
					value = ObjectUtils.transform(value, (title, uri) => (
						console.log('encoding', uri || "", btoa(uri || "")),
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
		return ObjectUtils.transform(data, (value, prop, has) => {
			switch (prop) {
				case 'toc':
					value = ObjectUtils.transform(value, (title, uri) => {
						try {
							console.log('decoding', uri || "", atob(uri || ""));
							return [title, atob(uri || "")];
						} catch (e) {
							return [title, uri];
						}
					});
					break;

				case 'matchers':
					value = ObjectUtils.transform(value, (code, matcher) => (
						[code, matcher]
					), has);
					break;
			}

			return [value, prop];
		}, target || new Book(data.uid));
	}
}