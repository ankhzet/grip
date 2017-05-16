
import * as React from "react";

import { Link } from 'react-router';

import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../panel';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';

import * as Codemirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import { Book } from '../../../../Grip/Domain/Book';
import { BooksPage } from '../../BooksPage';
import { ManagerInterface } from '../../../Reactivity/ManagerInterface';

export interface ShowPageProps {
	manager: ManagerInterface<Book>;
	params: { id: string };
}

export class ShowPage extends React.Component<ShowPageProps, { book: Book }> {

	static path(book: Book): string {
		return BooksPage.PATH + '/' + book.uid + '/show';
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
		return this.pullBook(next.params.id);
	}

	componentWillMount() {
		return this.pullBook(this.props.params.id);
	}

	render() {
		let book = this.state.book;

		if (!book) {
			return null;
		}

		return (
			<Panel>
				<PanelHeader>
					Book: { book.title }
					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							<Button class="btn-xs" onClick={ this.removeBook }>
								<Glyph name="remove" />
							</Button>
							<Button class="btn-xs">
								<Link to={ BooksPage.PATH + '/' + book.uid + '/edit' }>
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

						<Codemirror
							value={ book.uri }
							options={{
									mode: 'javascript',
									theme: 'base16-oceanicnext-dark',
									lineNumbers: true,
									indentWithTabs: true,
									tabSize: 2,
									readOnly: true,
								}} />

					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ this.navBack }>
						&larr;
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	navBack() {
		// this.props.delegate.listPlugins();
	}

	removeBook() {
		// this.props.delegate.removePlugin(this.state.book.uid);
	}

}
