
import * as React from 'react';

import { Link, withRouter } from 'react-router'

import { Glyph } from '../../glyph';
import { Button } from '../../button';
import { Panel, PanelHeader, PanelList } from '../../panel';

import { Book } from '../../../Grip/Domain/Book';
import { BooksPackage } from "../../../Grip/Domain/BooksPackage";
import { ManagerInterface } from '../../Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from "./delegates/BookUIDelegateInterface";
import { ShowPage } from './show/ShowPage';
import { EditPage } from './edit/EditPage';

interface BookItemRowProps {
	delegate: BookUIDelegateInterface<Book>;
	book: Book;
}

@withRouter
class BookItemRow extends React.Component<BookItemRowProps, {}> {

	render() {
		let book = this.props.book;

		return (book || null) && (
			<div className="row">
				<div className="col-lg-12">
					<div className="input-group">
						<div className="input-group-btn">
							<Button class="btn-xs" onClick={ () => this.removeBook() }>
								<Glyph name="remove" />
							</Button>
						</div>

						<Link className="col-xs-9" to={ ShowPage.path(book.uid) }>Book "{ book.title }"</Link>

						<div className="input-group-btn">
							<Button class="btn-xs" onClick={ () => this.fetchBook() }>
								<Glyph name="play-circle" />
							</Button>
							<Button class="btn-xs dropdown-toggle" data-toggle="dropdown">
								Actions <span className="caret" />
							</Button>
							<ul className="dropdown-menu pull-right">
								<li><Link to={ EditPage.path(book.uid) }>Edit</Link></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}

	fetchBook() {
		return this.props.delegate.fetchBook(this.props.book);
	}

	removeBook () {
		return this.props.delegate
			.removeBook(this.props.book)
		;
	}

}

export interface ListPageProps {
	delegate: BookUIDelegateInterface<Book>;
	manager: ManagerInterface<Book>;
}

export class ListPage extends React.Component<ListPageProps, { books: BooksPackage }> {

	componentWillMount() {
		this.pullBooks();
	}

	componentWillReceiveProps() {
		this.pullBooks();
	}

	pullBooks(uids: string[] = []) {
		return this.props.manager
			.get(uids)
			.then((books: BooksPackage) => {
				this.setState({
					books,
				});
			});
	}

	render() {
		let books = this.state.books || {};
		let uids = Object.keys(books);

		return (
			<Panel>
				<PanelHeader>
					Books
					<div className="pull-right">
						<Button class="btn-xs" onClick={ () => this.addBook() }>
							<Glyph name="plus" />
						</Button>
					</div>
				</PanelHeader>
				<PanelList>
					{uids.length
						? uids.map((uid) => (
							<li key={ uid } className="list-group-item">
								<BookItemRow
									delegate={ this.props.delegate }
									book={ books[uid] } />
							</li>
						))
						: (
							<span className="col-md-12 text-center text-info">No books yet</span>
						)
					}
				</PanelList>
			</Panel>
		);
	}

	private addBook() {
		return this.props.delegate
			.createBook()
		;
	}
}
