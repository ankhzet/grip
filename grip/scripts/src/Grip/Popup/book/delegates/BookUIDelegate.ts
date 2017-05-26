
import { BookUIDelegateInterface } from './BookUIDelegateInterface';
import { Book } from '../../../Domain/Book';
import { BookManager } from '../Manager';
import { InjectedRouter } from 'react-router';
import { ShowPage } from '../show/ShowPage';
import { BooksPage } from '../../BooksPage';
import { EditPage } from '../edit/EditPage';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { Alertify } from "../../../../core/utils/alertify";

export class BookUIDelegate implements BookUIDelegateInterface<Book> {
	private manager: BookManager;
	private router: InjectedRouter;

	constructor(manager: BookManager, router: InjectedRouter) {
		this.manager = manager;
		this.router = router;
	}

	async fetchBook(book: Book) {
		this.manager.perform([book.uid], BookManager.ACTION_CACHE);
	}

	async createBook(): Promise<Book> {
		return this.saveBook(
			new Book(this.manager.generateUID()),
			{
				title: 'No title',
				uri: 'http://example.com',
				matchers: {

				},
			}
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
		let response = await (new Promise((rs, rj) => {
			Alertify.confirm(`You sure want to delete "${book.title}"?`, rs);
		}));

		if (response) {
			return this.manager
				.remove([book.uid])
				.then(() => book.uid)
			;
		} else {
			return Promise.resolve(null);
		}
	}

	async listBooks() {
		this.router.push(BooksPage.path());
	}
}
