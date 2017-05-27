
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
import { RadioGroup } from '../../../../components/radiogroup';

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

export interface ShowPageState {
	book: Book;
	matcher: string;
}

export class ShowPage extends React.Component<ShowPageProps, ShowPageState> {

	static path(uid: string): string {
		return `${BooksPage.PATH}/${uid}`;
	}

	constructor(props) {
		super(props);

		this.state = {
			book: null,
			matcher: null,
		};
	}

	async pullBook(id: string) {
		this.setState({
			book: null,
			matcher: null,
		});

		this.setState({
			book: await this.props.manager.getOne(id),
			matcher: Object.keys(Book.matchers).shift(),
		});
	}

	componentWillReceiveProps(next) {
		this.pullBook(next.params.id);
	}

	componentWillMount() {
		this.pullBook(this.props.params.id);
	}

	render() {
		let {
			book,
			matcher,
		} = this.state;
		let matchers = Object.keys(Book.matchers);

		return (book || null) && (
			<Panel>
				<PanelHeader>
					Book: { book.title }

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							<Button class="btn-xs btn-danger" onClick={ () => this.removeBook() }>
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
								<label className="col-xs-2">URL:</label>
								<span className="form-control-static">{ book.uri }</span>
							</div>
						</div>

						<div className="form-group">
							<div className="input-group col-xs-12" data-toggle="collapse" data-target={ '#chapter-list-' + book.uid }>
								<label className="col-xs-2">Chapters:</label>
								<span className="form-control-static">{ Object.keys(book.toc).length }</span>
								{ book.cached && (
									<span className="form-control-static pull-right">Last cached: { Utils.formatTimestamp(book.cached) }</span>
								)}
							</div>
							<div className="collapse collapsed col-xs-12" id={ 'chapter-list-' + book.uid }>
								<TocList uid={ book.uid } toc={ book.toc } columns={ 4 } />
							</div>
						</div>

						<div className="form-group">
							<div className="input-group col-xs-12">
								<label className="col-xs-2">
									Matchers:
								</label>

								<RadioGroup
									name="matchers"
									value={ matcher }
									onChange={ (e: any) => this.setState({...this.state, matcher: e.target.value}) }
								>
									{ matchers.map((name) => (
										<label className="form-control-static" style={{ paddingRight: '15px', }}>
											<input type="radio" value={ name } /> { name }
										</label>
									)) }
								</RadioGroup>
							</div>

							<CodeMirror
								className="form-control-static col-xs-12"
								value={ book.matchers[matcher] }
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
