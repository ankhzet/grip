
import { Book } from '../../Collections/Book/Book';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';

export class BookTranscoder implements TranscoderInterface<Book, {}> {

	public encode(book: Book): any {
		return book && ObjectUtils.transform(book, (value, prop) => {
			switch (prop) {
				case 'matchers':
					value = value.code();
					break;
			}

			return [value, prop];
		});
	}

	public decode(data: any, target?: Book): Book {
		return data && ObjectUtils.transform(data, (value, prop, has) => {
			switch (prop) {
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
