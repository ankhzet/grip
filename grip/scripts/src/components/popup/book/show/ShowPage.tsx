
import * as React from "react";

import { Link } from 'react-router';

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../panel';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';

import { Book } from '../../../../Grip/Domain/Book';
import { BooksPage } from '../../BooksPage';
import { ManagerInterface } from '../../../Reactivity/ManagerInterface';
import { EditPage } from '../edit/EditPage';
import { BookUIManagerInterface } from '../delegates/BookUIManagerInterface';

export interface ShowPageProps {
	manager: ManagerInterface<Book>;
	delegate: BookUIManagerInterface<Book>;
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

		return book && (
			<Panel>
				<PanelHeader>
					Book: { book.title }
					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							<Button class="btn-xs" onClick={ () => this.removeBook() }>
								<Glyph name="remove" />
							</Button>
							<Button class="btn-xs">
								<Link to={ EditPage.path(book.uid) }>
									<Glyph name="edit" />
								</Link>
							</Button>
						</div>
						<div className="btn-group">
							<Button class="btn-xs" onClick={ null }>
								<Glyph name="play-circle" />
							</Button>
						</div>
					</div>
				</PanelHeader>

				<PanelBody>
					<div className="form-group col-lg-12">
						{ book.uri }
					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs">
						<Link to={ BooksPage.path() }>&larr;</Link>
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	removeBook() {
		return this.props.delegate.removeBook(this.state.book);
	}

}
