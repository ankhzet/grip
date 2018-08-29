
import { Book } from '../../Collections/Book/Book';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { Base } from '../../../../core/db/data/Relation/Base';
import { OneToMany } from '../../../../core/db/data/Relation/OneToMany';
import { Page } from '../../Collections/Page/Page';

export class BookTranscoder implements TranscoderInterface<Book, {}> {

	public encode(book: Book): any {
		return book && ObjectUtils.transform(book, (value, prop) => {
			switch (prop) {
				case 'matchers':
					value = value.code();
					break;

				case 'pages':
					value = (value as Base<any, any>).encode(null);
			}

			return [value, prop];
		});
	}

	public decode(data: any, target?: Book): Book {
		if (!data) {
			return null;
		}

		const book = target || new Book(data.uid);

		return ObjectUtils.transform(data, (value, prop, has) => {
			switch (prop) {
				case 'matchers':
					value = ObjectUtils.transform(value, (code, matcher) => (
						[code, matcher]
					), has);
					break;

				case 'pages':
					value = (new OneToMany<Book, Page>(book)).decode(null, []);
			}

			return [value, prop];
		}, book);
	}
}
