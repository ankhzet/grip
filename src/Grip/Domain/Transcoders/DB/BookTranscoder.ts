
import { Book } from '../../Collections/Book/Book';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { BaseTranscoder } from './BaseTranscoder';

export class BookTranscoder extends BaseTranscoder<Book> {

	protected encodeProperty(model: Book, value, prop): [any, string] {
		switch (prop) {
			case 'toc':
				value = ObjectUtils.transform(value, (title, uri) => (
					[title, btoa(uri || "")]
				));
				break;

			case 'matchers':
				value = value.code();
				break;
		}

		return super.encodeProperty(model, value, prop);
	}

	protected decodeProperty(model: Book, value, prop, has): [any, string] {
		switch (prop) {
			case 'toc':
				value = ObjectUtils.transform(value, (title, uri) => {
					try {
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

		return super.decodeProperty(model, value, prop, has);
	}

}
