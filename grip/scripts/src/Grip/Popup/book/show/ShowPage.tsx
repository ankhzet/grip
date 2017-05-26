
import * as React from "react";

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../../components/panel';
import { Button } from '../../../../components/button';
import { Glyph } from '../../../../components/glyph';

import * as CodeMirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import { Book } from '../../../Domain/Book';
import { BooksPage } from '../../BooksPage';
import { ManagerInterface } from '../../../../components/Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';
import { Link } from 'react-router';
import { Utils } from '../../../Client/Utils';
import { TocInterface } from '../../../Domain/TocInterface';

interface TocListProps {
	uid: string;
	toc: TocInterface;
	columns?: number;
}

class TocList extends React.Component<TocListProps, {}> {
	static DEFAULT_COLUMNS = 3;

	render() {
		let { uid, toc, columns } = this.props;
		let links = Object.keys(toc);
		let col = 12 / Math.min(columns || TocList.DEFAULT_COLUMNS, 12);

		return (links.length || null) && (
			<div id={ 'chapter-list-' + uid } style={{ marginBottom: "10px", }}>
				{ Utils.chunks(links, 10).map((chunk, offset) => (
					<ul className={ 'col-xs-' + col }>
						{ chunk.map((uri) => (
							<li key={ uri }><Link to={ uri }>{ toc[uri] }</Link></li>
						)) }
					</ul>
				)) }
			</div>
		);
	}
}


export interface ShowPageProps {
	manager: ManagerInterface<Book>;
	delegate: BookUIDelegateInterface<Book>;
	params: { id: string };
}

export class ShowPage extends React.Component<ShowPageProps, { book: Book }> {

	static path(uid: string): string {
		return `${BooksPage.PATH}/${uid}`;
	}

	constructor(props) {
		super(props);

		this.state = {
			book: null,
		};
	}

	async pullBook(id: string) {
		this.setState({
			book: null,
		});
		this.setState({
			book: await this.props.manager.getOne(id),
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
					<form className="form-vertical">

						<div className="form-group">
							<div className="input-group col-xs-12">
								<label className="col-xs-2 form-control-static">URL:</label>
								<span className="col-xs-10 form-control-static">{ book.uri }</span>
							</div>
						</div>

						<div className="form-group">
							<div className="input-group col-xs-12" data-toggle="collapse" data-target={ '#chapter-list-' + book.uid }>
								<label className="col-xs-2 form-control-static">Chapters:</label>
								<span className="col-xs-10 form-control-static">{ Object.keys(book.toc).length }</span>
							</div>
							<div className="collapse collapsed col-xs-12" id={ 'chapter-list-' + book.uid }>
								<TocList uid={ book.uid } toc={ book.toc } columns={ 4 } />
							</div>
						</div>

						<div className="form-group">
							<div className="col-xs-12">
								<ul className="nav nav-tabs">
									{ Object.keys(Book.matchers).map((matcher, index) => (
										<li className={ index ? '' : 'active' }>
											<a href={ '#matcher-' + matcher } data-toggle="tab">{ matcher }</a>
										</li>
									)) }
								</ul>

								<div className="tab-content">
									{ Object.keys(Book.matchers).map((matcher, index) => (
										<div className={ "tab-pane" + (index ? "" : " active") } id={ 'matcher-' + matcher }>
											<CodeMirror
												className="form-control-static"
												value={ book.matchers.get(matcher) }
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
									)) }
								</div>
							</div>
						</div>

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
