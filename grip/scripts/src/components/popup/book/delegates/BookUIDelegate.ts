
import { BookUIDelegateInterface } from './BookUIDelegateInterface';
import { Book } from '../../../../Grip/Domain/Book';
import { BookManager } from '../Manager';
import { InjectedRouter } from 'react-router';
import { ShowPage } from '../show/ShowPage';
import { BooksPage } from '../../BooksPage';
import { EditPage } from '../edit/EditPage';
import { ObjectUtils } from '../../../../core/utils/object';

export class BookUIDelegate implements BookUIDelegateInterface<Book> {
	private manager: BookManager;
	private router: InjectedRouter;

	constructor(manager: BookManager, router: InjectedRouter) {
		this.manager = manager;
		this.router = router;
	}

	async fetchBook(book: Book) {
		this.manager.perform([book.uid], 'fetch');
	}

	async createBook(): Promise<Book> {
		return this.saveBook(
			new Book(this.manager.generateUID()),
			{}
		);
	}

	async showBook(book: Book): Promise<Book> {
		this.router.push(ShowPage.path(book.uid));

		return book;
	}

	async editBook(book: Book): Promise<Book> {
		this.router.push(EditPage.path(book.uid));

		return book;
	}

	async saveBook(book: Book, data: any): Promise<Book> {
		return this.manager
			.set([
				ObjectUtils.patch(book, data),
			])
			.then(() => this.manager.getOne(book.uid))
		;
	}

	async removeBook(book: Book): Promise<string|null> {
		return this.manager
			.remove([book.uid])
			.then(() => book.uid)
		;
	}

	async listBooks() {
		this.router.push(BooksPage.path());
	}
}
