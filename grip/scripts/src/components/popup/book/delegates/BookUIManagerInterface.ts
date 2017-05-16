
import { Book } from '../../../../core/domain/Book';

export interface BookUIManagerInterface<B extends Book> {
	createBook();
	showBook(uid: string): B;
	editBook(uid: string): B;
	saveBook(uid: string, data);
	removeBook(uid: string);

	listBooks();
}
