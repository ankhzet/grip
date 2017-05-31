
import * as React from "react";

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../../components/panel';
import { Button } from '../../../../components/button';

import { Book } from '../../../Domain/Book';
import { BooksPage } from '../../BooksPage';
import { ManagerInterface } from '../../../../components/Reactivity/ManagerInterface';
import { BookUIDelegateInterface } from '../delegates/BookUIDelegateInterface';

export interface ReadPageProps {
	manager: ManagerInterface<Book>;
	delegate: BookUIDelegateInterface<Book>;
	params: { id: string, page: number };
}

export interface ReadPageState {
	book: Book;
}

export class ReadPage extends React.Component<ReadPageProps, ReadPageState> {

	static path(uid: string, page: string|number = 0): string {
		return `${BooksPage.PATH}/${uid}/read/${page}`;
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
		let {
			params: {
				page,
			},
		} = this.props;

		let {
			book,
		} = this.state;

		return (book || null) && (
			<Panel>
				<PanelHeader>
					<h4>
						{ book.title }
					</h4>
					<h5>
						{ book.getPageTitle(page) }
					</h5>

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
						</div>
					</div>
				</PanelHeader>

				<PanelBody>
					<div className="col-xs-12" dangerouslySetInnerHTML={{ __html: book.getPageContents(page) }} />
				</PanelBody>

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
