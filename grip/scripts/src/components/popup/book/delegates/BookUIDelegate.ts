
import { BookUIDelegateInterface } from './BookUIDelegateInterface';
import { Book } from '../../../../Grip/Domain/Book';
import { BookManager } from '../Manager';
import { InjectedRouter } from 'react-router';
import { ShowPage } from '../show/ShowPage';
import { BooksPage } from '../../BooksPage';
import { EditPage } from '../edit/EditPage';

export class BookUIDelegate implements BookUIDelegateInterface<Book> {
	private manager: BookManager;
	private router: InjectedRouter;

	constructor(manager: BookManager, router: InjectedRouter) {
		this.manager = manager;
		this.router = router;
	}

	async getBookByUid(uid: string) {
		return this.manager.get([uid]).then((pack) => {
			return pack[uid];
		});
	}

	async createBook(): Promise<Book> {
		let uids: string[] = await this.manager.set([
			new Book(this.manager.generateUID())
		]);

		return this.editBook(
			await this.getBookByUid(uids.shift())
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
		for (let prop in data) {
			if (data.hasOwnProperty(prop)) {
				book[prop] = data[prop];
			}
		}

		let uids = await this.manager.set([
			book,
		]);

		return await this.getBookByUid(uids.shift());
	}

	async removeBook(book: Book): Promise<string> {
		return (await this.manager.remove([book.uid]))
			.shift()
		;
	}

	async listBooks() {
		this.router.push(BooksPage.path());
	}
}
