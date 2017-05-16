
import * as React from 'react';

import { Link, withRouter } from 'react-router'

import { Glyph } from '../../glyph';
import { Button } from '../../button';
import { Panel, PanelHeader, PanelList } from '../../panel';

import { Book } from '../../../Grip/Domain/Book';
import { BooksPackage } from "../../../Grip/Domain/BooksPackage";
import { BooksPage } from '../BooksPage';
import { ManagerInterface } from '../../Reactivity/ManagerInterface';
import { BookUIManagerInterface } from "./delegates/BookUIManagerInterface";

interface BookItemRowProps {
	manager: ManagerInterface<Book>;
	delegate: BookUIManagerInterface<Book>;
	book: Book;
}

@withRouter
class BookItemRow extends React.Component<BookItemRowProps, {}> {

	render() {
		return (
			<div className="row">
				<div className="col-lg-12">
					<div className="input-group">
						<div className="input-group-btn">
							<Button class="btn-xs" onClick={ this.removeBook }>
								<Glyph name="remove" />
							</Button>
						</div>

						<Link className="col-xs-9" to={ "/fetcher/1" }>Book "{ this.props.book.title }"</Link>

						<div className="input-group-btn">
							<Button class="btn-xs" onClick={ null }>
								<Glyph name="play-circle" />
							</Button>
							<Button class="btn-xs dropdown-toggle" data-toggle="dropdown">
								Actions <span className="caret" />
							</Button>
							<ul className="dropdown-menu pull-right">
								<li><Link to={ BooksPage.PATH + "/" + this.props.book.uid + "/fetch" }>Fetch</Link></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}

	removeBook () {

	}

}

export interface ListPageProps {
	delegate: BookUIManagerInterface<Book>;
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
		this.setState({
			books: null,
		});

		(async () => {
			this.setState({
				books: await this.props.manager.get(uids),
			});
		})();
	}

	render() {
		let books = this.state.books || {};

		return (
			<Panel>
				<PanelHeader>
					Books
					<div className="pull-right">
						<Button class="btn-xs" onClick={ this.addBook.bind(this) }>
							<Glyph name="plus" />
						</Button>
					</div>
				</PanelHeader>
				<PanelList>
					{Object.keys(books).map((uid) => (
						<li key={ uid } className="list-group-item">
							<BookItemRow
								manager={ this.props.manager }
								delegate={ this.props.delegate }
								book={ books[uid] } />
						</li>
					))}
				</PanelList>
			</Panel>
		);
	}

	private addBook() {
		return this.props.delegate.createBook();
	}
}
