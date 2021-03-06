
import * as React from "react";

import { Panel, PanelHeader, PanelBody, PanelFooter } from '../../../../components/panel';
import { Button } from '../../../../components/button';
import { Glyph } from '../../../../components/glyph';

import * as CodeMirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import { Book } from '../../../Domain/Collections/Book/Book';
import { ManagerInterface } from '../../../../components/Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';
import { BooksPage } from '../../BooksPage';
import { ObjectUtils } from "../../../../core/utils/ObjectUtils";
import { KeyboardEvent } from 'react';

export interface EditPageProps {
	delegate: BookUIDelegateInterface<Book>;
	manager: ManagerInterface<Book>;
	params: {
		id: string;
	};
}

export interface EditPageState {
	book: Book;
	modified: boolean;
	form: {
		title: string;
		uri: string;
		matchers: {
			[name: string]: string;
		};
	},
}

export class EditPage extends React.Component<EditPageProps, EditPageState> {

	constructor(props) {
		super(props);

		this.state = {
			book: null,
			modified: false,
			form: {
				title: '',
				uri: '',
				matchers: {
				},
			},
		};
	}

	static path(uid: string): string {
		return `${BooksPage.PATH}/${uid}/edit`;
	}

	async pullBook(id: string) {
		return this.props.manager
			.getOne(id)
			.then((book: Book) => {
				this.setState({
					book: book,
					modified: false,
					form: {
						title   : book.title,
						uri     : book.uri,
						matchers: book.matchers.code(),
					},
				});

				return book;
			})
		;
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
			modified,
			form: {
				title,
				uri,
				matchers,
			},
		} = this.state;

		return (book || null) && (
			<Panel>
				<PanelHeader>
					Edit book: { book.title }

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							<Button class="btn-xs btn-danger" onClick={ () => this.removeBook() }>
								<Glyph name="remove" />
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

					<div className="form-horizontal" onKeyDown={ (e) => this.handleKey(e) }>

						<div className="form-group">
							<div className="col-xs-12">
								<div className="input-group">
									<span className="input-group-addon">Title</span>
									<input className="form-control" value={ title } onChange={ (e) => this.titleChanged(e) } />
								</div>
							</div>
						</div>

						<div className="form-group">
							<div className="col-xs-12">
								<div className="input-group">
									<span className="input-group-addon">URI</span>
									<input className="form-control" value={ uri } onChange={ (e) => this.uriChanged(e) } />
								</div>
							</div>
						</div>

						<div className="form-group tabs-left">
							<div className="col-xs-12">
								<div className="input-group">
									<div className="input-group-addon">
										<ul className="nav nav-tabs">
											{ Object.keys(book.matchers).map((matcher, index) => (
												<li className={ index ? '' : 'active' }>
													<a href={ '#matcher-' + matcher } data-toggle="tab">{ matcher }</a>
												</li>
											)) }
										</ul>
									</div>

									<div className="tab-content form-control">
										{ Object.keys(book.matchers).map((matcher, index) => (
											<div className={ "tab-pane" + (index ? "" : " active") } id={ 'matcher-' + matcher }>
												<CodeMirror
													value={ matchers[matcher] }
													options={{
														mode: 'javascript',
														theme: 'base16-oceanicnext-dark',
														lineNumbers: true,
														indentWithTabs: true,
														tabSize: 2,
														readOnly: false,
													}}
													onChange={ (value) => this.matcherChanged(matcher, value) }
												/>
											</div>
										)) }
									</div>
								</div>

							</div>

						</div>
					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ () => this.props.delegate.showBook(book) }>
						&larr;
					</Button>

					<div className="pull-right btn-group">
						<Button class="btn-xs" disabled={ !modified } onClick={ () => this.saveBook() }>
							Save
						</Button>
						<Button class="btn-xs" disabled={ !modified } onClick={ () => this.saveBook(true) }>
							Save and go back
						</Button>
					</div>
				</PanelFooter>
			</Panel>
		);
	}

	private patchState(next) {
		this.setState(
			ObjectUtils.patch(
				this.state,
				ObjectUtils.patch({
					modified: true,
				}, next)
			)
		);
	}

	private titleChanged(e) {
		this.patchState({
			form: {
				title: e.srcElement.value,
			},
		});
	}

	private uriChanged(e) {
		this.patchState({
			form: {
				uri: e.srcElement.value,
			}
		});
	}

	private matcherChanged(matcher, value) {
		this.patchState({
			form: {
				matchers: ObjectUtils.compose(matcher, value),
			}
		});
	}

	private removeBook() {
		return this.props.delegate
			.removeBook(this.state.book)
			.then((uid) => {
				if (uid) {
					this.props.delegate.listBooks()
				}
			})
		;
	}

	private async saveBook(back?: boolean) {
		let book = await this.props.delegate.saveBook(
			this.state.book,
			this.state.form
		);

		return (back && this.props.delegate.showBook(book)) || this.patchState({
			modified: false,
		});
	}

	fetchBook() {
		return this.props.delegate.fetchBook(this.state.book);
	}

	private handleKey(e: KeyboardEvent<HTMLElement>) {
		if((e.ctrlKey || e.metaKey) && e.key == 's') {
			event.preventDefault();

			this.saveBook();
		}

		return false;
	}
}
