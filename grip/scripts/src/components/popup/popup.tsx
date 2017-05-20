
import * as React from 'react';

import { Router, Route, Link, hashHistory } from 'react-router'

import { DashboardPageRoutes, DashboardPage } from './DashboardPage';
import { AboutPageRoutes, AboutPage } from './AboutPage';
import { BooksPageRoutes, BooksPage } from './BooksPage';
import { BookManager } from './book/Manager';
import { ManagerInterface } from '../Reactivity/ManagerInterface';
import { Book } from '../../Grip/Domain/Book';
import { ServerConnector } from '../../Grip/Client/ServerConnector';
import { SendAction } from '../../core/parcel/actions/Base/Send';
import { Alertify } from "../../core/utils/alertify";
// import { Breadcrumbs } from '../breadcrumbs';

interface PageLink {
	title: string;
	link: string;
}

interface Menu extends PageLink {
	children?: Menu[];
}

interface LocationProps {
	location: { action: "PUSH" | "POP", pathname: string };
	menu: Menu;
}

class Navbar extends React.Component<LocationProps, {}> {

	static routeActivated(action) {
		return ['PUSH', 'REPLACE'].indexOf(action) >= 0;
	}

	isRoute(name) {
		let location = this.props.location;

		if (Navbar.routeActivated(location.action)) {
			return location.pathname === name;
		}
	}

	link(path, title) {
		return (
			<li className={ this.isRoute(path) && 'active' }><Link to={ path }>{ title }</Link></li>
		);
	}

	render() {
		let menu = this.props.menu;

		return (
			<nav className="navbar navbar-default navbar-fixed.top" role="navigation">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar" />
							<span className="icon-bar" />
							<span className="icon-bar" />
						</button>
						<Link to={ menu.link } className="navbar-brand" target="_blank">{ menu.title }</Link>
					</div>

					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						{ menu.children ? (
							<ul className="nav navbar-nav navbar-right">
								{ menu.children.map((child) =>
									this.link(child.link, child.title)
								) }
							</ul>
						) : null }
					</div>
				</div>
			</nav>
		);
	}

}

interface AppState {
	books: ManagerInterface<Book>,
}

class App extends React.Component<LocationProps, AppState> {
	private server: ServerConnector;

	constructor(props) {
		super(props);

		this.server = new ServerConnector();
		this.state = {
			books: new BookManager(this.server),
		};
	}

	componentWillMount() {
		this.server.listen(SendAction, ({ what, data: { action, error } }) => {
			switch (what) {
				case 'error':
					console.log('Server:', error);
					Alertify.alert(`
<div class="col-xs-12">
<h4 class="text-danger">Failed "${action}" action:</h4>
<pre class="text-danger">${error.replace('\n', '<br />')}</pre>
</div>`);
					break;
			}
		});
	}

	breadcrumbs(): Menu {
		let fetched = [];

		return {
			title: 'Grip',
			link: DashboardPage.PATH,
			children: [
				{
					title: 'Books',
					link: BooksPage.PATH,
					children: fetched.map((page, index) => {
						return {
							title: 'Book ' + index,
							link: BooksPage.PATH + '/' + index,
						};
					})
				},
				{
					title: 'About',
					link: AboutPage.PATH,
				},
			],
		};
	}

	render() {
		let navprops: LocationProps = {
			location: this.props.location,
			menu: this.breadcrumbs(),
		};

		let childrenprops = {
			manager: this.state.books,
		};
		const childrenWithProps = React.Children.map(
			this.props.children,
			(child) => React.cloneElement(child as any, childrenprops)
		);

		return (
			<div>

				<Navbar {...navprops} />

				{/*<Breadcrumbs crumbs={ this.breadcrumbs() } />*/}
				<div>
					<div className="col-lg-12">
						{ childrenWithProps }
					</div>
				</div>
			</div>
		)
	}
}

export class Popup extends React.Component<{}, {}> {

	render() {
		return (
			<Router history={ hashHistory }>
				<Route component={ App }>
					{ BooksPageRoutes }
					{ AboutPageRoutes }
					{ DashboardPageRoutes }
				</Route>
			</Router>
		);
	}

}
