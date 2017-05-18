
import * as React from "react";

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../panel';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';

import * as CodeMirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

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
		let links = (book && book.toc && Object.keys(book.toc)) || [];

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
					<form className="form-vertical">

						<div className="form-group">
							<div className="input-group col-xs-12">
								<label className="col-xs-2 form-control-static">URL:</label>
								<span className="col-xs-10 form-control-static">{ book.uri }</span>
							</div>
						</div>

						<div className="form-group">
							<div className="input-group col-xs-12 reactive-editor">
								<CodeMirror
									className="form-control-static col-xs-12"
									value={ book.matcher }
									options={{
										mode: 'javascript',
										theme: 'base16-oceanicnext-dark',
										lineNumbers: true,
										indentWithTabs: true,
										tabSize: 2,
										readOnly: true,
									}}
								/>
							</div>
						</div>

						{ (links.length || null) &&
						<div className="form-group">
							<div className="input-group">
								<label className="col-xs-2 form-control-static">Chapters:</label>
								<span className="col-xs-10 form-control-static">{ links.length }</span>
							</div>
							<ul className="collapse collapsed">
								{ links.map((uri) => (
									<li key={ uri }><Link to={ uri }>{ book.toc[uri] }</Link></li>
								)) }
							</ul>
						</div>
						}

					</form>
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
		return this.props.delegate
			.removeBook(this.state.book)
			.then((uid) => {
				if (uid) {
					this.props.delegate.listBooks()
				}
			})
		;
	}

	fetchBook() {
		return this.props.delegate.fetchBook(this.state.book);
	}

}
