
import * as React from "react";
import { Route, IndexRoute, withRouter } from 'react-router'
import InjectedRouter = ReactRouter.InjectedRouter;

import { ListPage } from './book/ListPage';
import { ShowPage } from './book/show/ShowPage';
import { EditPage } from './book/edit/EditPage';
import { Book } from '../../Grip/Domain/Book';
import { BookManager } from './book/Manager';
import { BookUIDelegate } from './book/delegates/BookUIDelegate';
import { BooksPackage } from '../../Grip/Domain/BooksPackage';

interface BooksPageProps {
	router: InjectedRouter;
	manager: BookManager;
}

@withRouter
export class BooksPage extends React.Component<BooksPageProps, {}> implements BookUIManagerInterface<Book> {

	static PATH = '/books';

	static path() {
		return this.PATH;
	}

	render() {
		let props = { delegate: this, manager: this.props.manager, };

		return (
			<div>
				{ React.Children.map(
					this.props.children,
					(child) => React.cloneElement(child as any, props)
				) }
			</div>
		)
	}

	async getBookByUid(uid: string) {
		return this.props.manager.get([uid]).then((pack) => {
			return pack[uid];
		});
	}

	async createBook(): Promise<Book> {
		let uids: string[] = await this.props.manager.set([
			new Book("000")
		]);

		return this.getBookByUid(uids.shift());
	}

	async showBook(book: Book): Promise<Book> {
		this.props.router.push(ShowPage.path(book.uid));

		return book;
	}

	async editBook(book: Book): Promise<Book> {
		this.props.router.push(EditPage.path(book.uid));

		return book;
	}

	async saveBook(book: Book, data: any): Promise<Book> {
		for (let prop in data) {
			if (data.hasOwnProperty(prop)) {
				book[prop] = data[prop];
			}
		}

		let uids = await this.props.manager.set([
			book,
		]);

		return await this.getBookByUid(uids.shift());
	}

	async removeBook(book: Book): Promise<string> {
		return (await this.props.manager.remove([book.uid]))
			.shift()
		;
	}

	async listBooks() {
		this.props.router.push(BooksPage.PATH);
	}

}

export const BooksPageRoutes = (
	<Route path={ BooksPage.PATH } component={ BooksPage }>
		<Route path={ EditPage.path(':id') } component={ EditPage } />
		<Route path={ ShowPage.path(':id') } component={ ShowPage } />
		<IndexRoute component={ ListPage } />
	</Route>
);
