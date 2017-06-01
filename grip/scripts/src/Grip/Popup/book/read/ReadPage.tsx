
import * as React from "react";

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../../components/panel';
import { Button } from '../../../../components/button';

import { Book } from '../../../Domain/Collections/Book/Book';
import { BooksPage } from '../../BooksPage';
import { ManagerInterface } from '../../../../components/Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';
import { Page } from '../../../Domain/Collections/Page/Page';

export interface ReadPageProps {
	manager: ManagerInterface<Book>;
	delegate: BookUIDelegateInterface<Book>;
	params: { book_uid: string, page_uid: string };
}

export interface ReadPageState {
	book: Book;
	page: Page;
}

export class ReadPage extends React.Component<ReadPageProps, ReadPageState> {

	static path(book_uid: string, page_uid: string): string {
		return `${BooksPage.PATH}/${book_uid}/read/${page_uid}`;
	}

	constructor(props) {
		super(props);

		this.state = {
			book: null,
			page: null,
		};
	}

	async pullBook(uid: string) {
		this.setState({
			book: null,
			page: null,
		});

		let book = await this.props.manager.getOne(uid);
		let page = book.pages.by({ uid: this.props.params.page_uid });

		this.setState({
			book,
			page,
		});
	}

	componentWillReceiveProps(next) {
		this.pullBook(next.params.book_uid);
	}

	componentWillMount() {
		this.pullBook(this.props.params.book_uid);
	}

	render() {
		let {
			book,
			page,
		} = this.state;

		return (book || null) && (
			<Panel>
				<PanelHeader>
					<h4>
						{ book.title }
					</h4>
					<h5>
						{ page
							? page.title
							: <span>Page with UID { this.props.params.page_uid } not found</span>
						}
					</h5>

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
						</div>
					</div>
				</PanelHeader>

				{ (page || null) && (
					<PanelBody>
						<div className="col-xs-12" dangerouslySetInnerHTML={{ __html: page.contents }} />
					</PanelBody>
				) }

				<PanelFooter>
					<Button class="btn-xs" onClick={ () => this.showBook() }>
						&larr;
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	showBook() {
		return this.props.delegate
			.showBook(this.state.book)
		;
	}

}
