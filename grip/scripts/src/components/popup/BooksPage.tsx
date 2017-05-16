
import * as React from "react";
import { Route, IndexRoute, withRouter } from 'react-router'
import InjectedRouter = ReactRouter.InjectedRouter;

import { ListPage } from './book/ListPage';
import { ShowPage } from './book/show/ShowPage';
import { EditPage } from './book/edit/EditPage';
import { BookManager } from './book/Manager';
import { BookUIDelegate } from './book/delegates/BookUIDelegate';

interface BooksPageProps {
	router: InjectedRouter;
	manager: BookManager;
}

interface BooksPageState {
	delegate: BookUIDelegate;
}

@withRouter
export class BooksPage extends React.Component<BooksPageProps, BooksPageState> {
	static PATH = '/books';

	static path() {
		return this.PATH;
	}

	delegate(props: BooksPageProps) {
		return new BookUIDelegate(props.manager, props.router);
	}

	componentWillReceiveProps(next) {
		this.setState({
			delegate: this.delegate(next),
		});
	}

	componentWillMount() {
		this.setState({
			delegate: this.delegate(this.props),
		});
	}

	render() {
		let props = { manager: this.props.manager, delegate: this.state.delegate, };

		return (
			<div>
				{ props.delegate && React.Children.map(
					this.props.children,
					(child) => React.cloneElement(child as any, props)
				) }
			</div>
		)
	}

}

export const BooksPageRoutes = (
	<Route path={ BooksPage.PATH } component={ BooksPage }>
		<Route path={ EditPage.path(':id') } component={ EditPage } />
		<Route path={ ShowPage.path(':id') } component={ ShowPage } />
		<IndexRoute component={ ListPage } />
	</Route>
);
