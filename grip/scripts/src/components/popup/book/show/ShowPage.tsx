
import * as React from "react";

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../panel';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';

import { Book } from '../../../../Grip/Domain/Book';
import { BooksPage } from '../../BooksPage';
import { ManagerInterface } from '../../../Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';
import { Link } from 'react-router';

export interface ShowPageProps {
	manager: ManagerInterface<Book>;
	delegate: BookUIDelegateInterface<Book>;
	params: { id: string };
}

export class ShowPage extends React.Component<ShowPageProps, { book: Book }> {

	static path(uid: string): string {
		return `${BooksPage.PATH}/${uid}`;
	}

	async pullBook(id: string) {
		this.setState({
			book: null,
		});

		let pack = await this.props.manager.get([id]);

		this.setState({
			book: pack[id],
		});
	}

	componentWillReceiveProps(next) {
		this.pullBook(next.params.id);
	}

	componentWillMount() {
		this.pullBook(this.props.params.id);
	}

	render() {
		let book = this.state.book;

		return (book || null) && (
			<Panel>
				<PanelHeader>
					Book: { book.title }

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							<Button class="btn-xs" onClick={ () => this.removeBook() }>
								<Glyph name="remove" />
							</Button>
							<Button class="btn-xs" onClick={ () => this.editBook() }>
								<Glyph name="edit" />
							</Button>
						</div>
						<div className="btn-group">
							<Button class="btn-xs" onClick={ () => this.fetchBook() }>
								<Glyph name="play-circle" />
							</Button>
						</div>
					</div>
				</PanelHeader>

				<PanelBody>
					<div className="form-group col-lg-12">
						{ book.uri }
					</div>

					{ book.toc &&
						<div className="form-group col-lg-12">
							<ul>
								{ Object.keys(book.toc).map((uri) => (
									<li key={ uri }><Link to={ uri }>{ book.toc[uri] }</Link></li>
								)) }
							</ul>
						</div>
					}
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ () => this.listBooks() }>
						&larr;
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	listBooks() {
		return this.props.delegate.listBooks();
	}

	editBook() {
		return this.props.delegate.editBook(this.state.book);
	}

	removeBook() {
		return this.props.delegate.removeBook(this.state.book);
	}

	fetchBook() {
		return this.props.delegate.fetchBook(this.state.book);
	}

}
