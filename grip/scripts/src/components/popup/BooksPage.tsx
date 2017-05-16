
import * as React from "react";
import { Route, IndexRoute, withRouter } from 'react-router'
import InjectedRouter = ReactRouter.InjectedRouter;

import { ListPage } from './book/ListPage';
import { ShowPage } from './book/show/ShowPage';

interface BooksPageProps {
	router: InjectedRouter;
}

@withRouter
export class BooksPage extends React.Component<BooksPageProps, {}> {

	static PATH = '/books';

	render() {
		let props = { delegate: this };

		return (
			<div>
				{ React.Children.map(
					this.props.children,
					(child) => React.cloneElement(child as any, props)
				) }
			</div>
		)
	}

}

export const BooksPageRoutes = (
	<Route path={ BooksPage.PATH } component={ BooksPage }>
		<Route path={ BooksPage.PATH + '/:id' } component={ ShowPage } />
		<IndexRoute component={ ListPage } />
	</Route>
);
