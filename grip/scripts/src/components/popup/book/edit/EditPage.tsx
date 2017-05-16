
import * as React from "react";

import { Panel, PanelHeader, PanelBody, PanelFooter } from '../../../panel';
import { Button } from '../../../button';

import { Book } from '../../../../Grip/Domain/Book';
import { ManagerInterface } from '../../../Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';
import { BooksPage } from '../../BooksPage';
import { BooksPackage } from '../../../../Grip/Domain/BooksPackage';

export interface EditPageProps {
	delegate: BookUIDelegateInterface<Book>;
	manager: ManagerInterface<Book>;
	params: {
		id: string;
	};
}

export interface EditPageState {
	book?: Book;
	form?: {
		title: string;
		uri: string;
	},
}

export class EditPage extends React.Component<EditPageProps, EditPageState> {

	static path(uid: string): string {
		return `${BooksPage.PATH}/${uid}/edit`;
	}

	async pullBook(id: string) {
		this.setState({
			book: null,
			form: {
				title: '',
				uri: '',
			},
		});

		return this.props.manager.get([id])
			.then((books: BooksPackage) => {
				let book = books[id];

				this.setState({
					book : book,
					form: {
						title: book.title,
						uri  : book.uri,
					},
				});

				return book;
			});
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
							<div className="col-lg-12">
								<div className="input-group">
									<span className="input-group-addon">Title</span>
									<input className="form-control" value={ this.state.form.title } onChange={ (e) => this.titleChanged(e) } />
								</div>
							</div>
						</div>


						<div className="form-group">
							<div className="col-lg-12">
								<div className="input-group">
									<span className="input-group-addon">URI</span>
									<input className="form-control" value={ this.state.form.uri } onChange={ (e) => this.uriChanged(e) } />
								</div>
							</div>
						</div>

					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ () => this.props.delegate.showBook(book) }>
						&larr;
					</Button>
					<Button class="btn-xs btn-primary pull-right" onClick={ () => this.saveBook() }>
						Save
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	private titleChanged(e) {
		this.setState({
			form: {
				title: e.srcElement.value,
				uri: this.state.form.uri,
			},
		});
	}

	private uriChanged(e) {
		this.setState({
			form: {
				title: this.state.form.title,
				uri: e.srcElement.value,
			}
		});
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
