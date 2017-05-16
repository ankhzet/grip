
import * as React from "react";
import { Route, IndexRoute, withRouter } from 'react-router'
import InjectedRouter = ReactRouter.InjectedRouter;

import { ListPage } from './book/ListPage';
import { ShowPage } from './book/show/ShowPage';
import { EditPage } from './book/edit/EditPage';
import { BookUIManagerInterface } from './book/delegates/BookUIManagerInterface';
import { Book } from '../../Grip/Domain/Book';
import { BookManager } from './book/Manager';

interface BooksPageProps {
	router: InjectedRouter;
	manager: BookManager;
}

@withRouter
export class BooksPage extends React.Component<BooksPageProps, {}> implements BookUIManagerInterface<Book> {

	static PATH = '/books';

	render() {
		let props = { delegate: this, manager: this, };

		return (
			<div>
				{ React.Children.map(
					this.props.children,
					(child) => React.cloneElement(child as any, props)
				) }
			</div>
		)
	}

	createBook() {
		return this.props.manager.set([
			new Book("")
		]);
	}

	getBookByUid(uid: string): Book {
		let book = null;

		(async () => {
			book = (await this.props.manager.get([uid]))[uid];
		})();

		return book;
	}

	showBook(uid: string): Book {
		let book = this.getBookByUid(uid);
		this.props.router.push(ShowPage.path(book));

		return book;
	}

	editBook(uid: string): Book {
		let book = this.getBookByUid(uid);
		this.props.router.push(EditPage.path(book));

		return book;
	}

	saveBook(uid: string, data: any) {
		let book = this.getBookByUid(uid);

		for (let prop in data) {
			book[prop] = data[prop];
		}

		return this.props.manager.set([
			book,
		]);
	}

	removeBook(uid: string) {
		return this.props.manager.remove([uid]);
	}

	listBooks() {
		this.props.router.push(BooksPage.PATH);
	}

}

export const BooksPageRoutes = (
	<Route path={ BooksPage.PATH } component={ BooksPage }>
		<Route path={ BooksPage.PATH + '/:id' } component={ ShowPage } />
		<Route path={ BooksPage.PATH + '/:id/edit' } component={ EditPage } />
		<IndexRoute component={ ListPage } />
	</Route>
);
