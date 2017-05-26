
import { Book } from '../../../Domain/Book';

export interface BookUIDelegateInterface<B extends Book> {
	createBook(): Promise<B>;
	showBook(book: B): Promise<B>;
	editBook(book: B): Promise<B>;
	saveBook(book: B, data): Promise<B>;
	removeBook(book: B): Promise<string|null>;

	listBooks();

	fetchBook(book: Book);
}
