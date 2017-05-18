
import * as React from "react";

import { Panel, PanelHeader, PanelBody, PanelFooter } from '../../../panel';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';

import * as CodeMirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import { Book } from '../../../../Grip/Domain/Book';
import { ManagerInterface } from '../../../Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';
import { BooksPage } from '../../BooksPage';
import { ObjectUtils } from "../../../../core/utils/object";

export interface EditPageProps {
	delegate: BookUIDelegateInterface<Book>;
	manager: ManagerInterface<Book>;
	params: {
		id: string;
	};
}

export interface EditPageState {
	book: Book;
	form: {
		title: string;
		uri: string;
		matchers: {
			toc: string;
		};
	},
}

const TOC_MATCHER = '(() => {\n' +
	'	 class Matcher {\n' +
	'    constructor(grip, context) {\n' +
	'      this.grip = grip;\n' +
	'      this.context = context;\n' +
	'    }\n' +
	'\n' +
	'    match(content) {\n' +
	'      return {\n' +
	'        uri: "Title",\n' +
	'      };\n' +
	'    }\n' +
	'  }\n' +
	'\n' +
	'  return (grip, context) => new Matcher(grip, context);\n' +
	'})()\n';

export class EditPage extends React.Component<EditPageProps, EditPageState> {

	constructor(props) {
		super(props);

		this.state = {
			book: null,
			form: {
				title: '',
				uri: '',
				matchers: {
					toc: TOC_MATCHER,
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
					form: {
						title  : book.title,
						uri    : book.uri,
						matchers: {
							toc: book.matchers.toc.code,
						},
					},
				});

				return book;
			})
		;
	}

	componentWillReceiveProps(next) {
		this.pullBook(next.uid);
	}

	componentWillMount() {
		this.pullBook(this.props.params.id);
	}

	render() {
		let book = this.state.book;

		return (book || null) && (
			<Panel>
				<PanelHeader>
					Edit book: { book.title }

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
						</div>
					</div>
				</PanelHeader>

				<PanelBody>

					<div className="form-horizontal">

						<div className="form-group">
							<div className="col-xs-12">
								<div className="input-group">
									<span className="input-group-addon">Title</span>
									<input className="form-control" value={ this.state.form.title } onChange={ (e) => this.titleChanged(e) } />
								</div>
							</div>
						</div>

						<div className="form-group">
							<div className="col-xs-12">
								<div className="input-group">
									<span className="input-group-addon">URI</span>
									<input className="form-control" value={ this.state.form.uri } onChange={ (e) => this.uriChanged(e) } />
								</div>
							</div>
						</div>

						<div className="form-group">
							<CodeMirror
								className="col-xs-12"
								value={ this.state.form.matchers.toc }
								options={{
									mode: 'javascript',
									theme: 'base16-oceanicnext-dark',
									lineNumbers: true,
									indentWithTabs: true,
									tabSize: 2,
									readOnly: false,
								}}
								onChange={ (value) => this.tocMatcherChanged(value) }
							/>
						</div>
					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ () => this.props.delegate.showBook(book) }>
						&larr;
					</Button>

					<div className="pull-right">
						<Button class="btn-xs btn-danger" onClick={ () => this.removeBook() }>
							<Glyph name="remove" />
						</Button>

						<Button class="btn-xs btn-primary" onClick={ () => this.saveBook() }>
							Save
						</Button>
					</div>
				</PanelFooter>
			</Panel>
		);
	}

	private patchState(next) {
		this.setState(ObjectUtils.patch(this.state, next));
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

	private tocMatcherChanged(value) {
		this.patchState({
			form: {
				matchers:{
					toc: value,
				},
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

	private async saveBook() {
		return this.props.delegate.showBook(
			await this.props.delegate.saveBook(
				this.state.book,
				this.state.form
			)
		);
	}

}
