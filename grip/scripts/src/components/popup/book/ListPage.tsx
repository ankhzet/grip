
import * as React from 'react';

import { Link, withRouter } from 'react-router'

// import { PluginManagementUIDelegate } from './delegates/plugin-management-ui';
import { Glyph } from '../../glyph';
import { Button } from '../../button';
import { Panel, PanelHeader, PanelList } from '../../panel';
import { Book } from '../../../Grip/Domain/Book';
import { BooksPage } from '../BooksPage';
import { Package } from '../../../core/db/data/Package';
import { ManagerInterface } from '../../Reactivity/ManagerInterface';

interface BookItemRowProps {
	manager: ManagerInterface<Book>;
	book: Book;

	// delegate: PluginManagementUIDelegate<Plugin>;
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
	// delegate: PluginManagementUIDelegate<Plugin>;
	manager: ManagerInterface<Book>;
}

export class ListPage extends React.Component<ListPageProps, { books: Package<Book> }> {

	componentWillMount() {
		return this.pullBooks();
	}

	componentWillReceiveProps() {
		return this.pullBooks();
	}

	async pullBooks(uids: string[] = []) {
		this.setState({
			books: null,
		});

		this.setState({
			books: await this.props.manager.get(uids),
		});
	}

	render() {
		let books = this.state.books || {};

		return (
			<Panel>
				<PanelHeader>
					Books
					<div className="pull-right">
						<Button class="btn-xs" onClick={ this.addBook }>
							<Glyph name="plus" />
						</Button>
					</div>
				</PanelHeader>
				<PanelList>
					{Object.keys(books).map((uid) => (
						<li key={ uid } className="list-group-item">
							<BookItemRow
								manager={ this.props.manager }
								book={ books[uid] } />
						</li>
					))}
				</PanelList>
			</Panel>
		);
	}

	private addBook() {
	// 	return this.props.delegate.createPlugin();
	}
}
