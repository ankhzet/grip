
import * as React from 'react';

import { Router, Route, Link, hashHistory } from 'react-router'

import { DashboardRoutes, Dashboard } from './dashboard';
import { AboutRoutes, About } from './about';
import { PluginsRoutes, Plugins } from './plugins';
import { Plugin } from '../../core/plugin';
import { Manager, PluginManager } from './plugins/manager';
// import { Breadcrumbs } from '../breadcrumbs';

interface LocationProps {
	location: { action: "PUSH" | "POP", pathname: string };
}

class Navbar extends React.Component<LocationProps, {}> {

	static routeActivated(action) {
		return ['PUSH', 'REPLACE'].indexOf(action) >= 0;
	}

	isRoute(name) {
		let location = this.props.location;
		if (Navbar.routeActivated(location.action))
			return location.pathname === name;
	}

	link(path, title) {
		return (
			<li className={ this.isRoute(path) && 'active' }><Link to={ path }>{ title }</Link></li>
		);
	}

	render() {
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
						<Link to={ Dashboard.PATH } className="navbar-brand">GearBox - Plugin sandbox</Link>
					</div>

					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul className="nav navbar-nav">
							{ this.link(Dashboard.PATH, 'Dashboard') }
						</ul>
						<ul className="nav navbar-nav navbar-right">
							{ this.link(Plugins.PATH, 'Plugins') }
							{ this.link(About.PATH, 'About') }
						</ul>
					</div>
				</div>
			</nav>
		);
	}

}

interface AppState {
	manager: Manager<Plugin>,
}

class App extends React.Component<LocationProps, AppState> {

	componentWillMount() {
		let manager = new PluginManager();
		this.setState({
			manager,
		});
	}

// 	breadcrumbs() {
// 		return [
// 			{title: 'Plugins', link: '#plugins'},
// 			{title: 'Plugin', link: '#plugin/1/'},
// 			{title: 'Edit', link: '#plugin/1/edit'},
// 		];
// 	}
//
	render() {
		let navprops = {
			location: this.props.location,
		};

		let childrenprops = {
			manager: this.state.manager,
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
					{ PluginsRoutes }
					{ AboutRoutes }
					{ DashboardRoutes }
				</Route>
			</Router>
		);
	}

}
