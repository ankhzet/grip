
import * as React from "react";

import plugins = chrome.contentSettings.plugins;
import { Panel, PanelHeader, PanelBody, PanelFooter } from '../../../panel';
import { Button } from '../../../button';

import { Book } from '../../../../Grip/Domain/Book';
import { ManagerInterface } from '../../../Reactivity/ManagerInterface';
import { BookUIManagerInterface } from '../delegates/BookUIManagerInterface';
import { BooksPage } from '../../BooksPage';

export interface EditPageProps {
	delegate: BookUIManagerInterface<Book>;
	manager: ManagerInterface<Book>;
	uid: string;
}

export interface EditPageState {
	book?: Book;
	title?: string;
	uri?: string;
}

export class EditPage extends React.Component<EditPageProps, EditPageState> {

	static path(book: Book): string {
		return BooksPage.PATH + '/' + book.uid + '/edit';
	}

	async pullBook(id: string) {
		this.setState({
			book: null,
		});

		let pack = await this.props.manager.get([id]);
		let book = pack[id];

		this.setState({
			book : book,
			title: book.title,
			uri  : book.uri,
		});
	}

	componentWillReceiveProps(next) {
		return this.pullBook(next.uid);
	}

	componentWillMount() {
		return this.pullBook(this.props.uid);
	}

	render() {
		let book = this.state.book;

		if (!book) {
			return null;
		}

		return (
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
									<input className="form-control" value={ this.state.title } onChange={ this.titleChanged } />
								</div>
							</div>
						</div>


						<div className="form-group">
							<div className="col-lg-12">
								<div className="input-group">
									<span className="input-group-addon">URI</span>
									<input className="form-control" value={ this.state.uri } onChange={ this.uriChanged } />
								</div>
							</div>
						</div>

					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ this.navBack }>
						&larr;
					</Button>
					<Button class="btn-xs" onClick={ this.saveBook }>
						Save
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	private titleChanged(e) {
		this.setState({
			title: e.srcElement.value,
		});
	}

	private uriChanged(uri) {
		this.setState({
			uri: uri,
		});
	}

	private navBack() {
		// validate
		// if (!this.valid(this.state)) {
		//
		// 	return;
		// }

		return this.props.delegate.showBook(this.props.uid)
	}

	private saveBook() {
		// validate
		// if (!this.valid(this.state)) {
		//
		// 	return;
		// }

		this.props.delegate.saveBook(this.props.uid, {
			title: this.state.title,
			code: this.state.uri,
		});
	}

}
