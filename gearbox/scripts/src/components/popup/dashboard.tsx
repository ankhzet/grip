
import * as React from "react";
import { Route } from 'react-router'

export class Dashboard extends React.Component<{}, {}> {

	static PATH = '/dashboard';

	render() {
		return (
			<div>
				This is dashboard page.
			</div>
		)
	}
}

export const DashboardRoutes = [
	<Route path={ Dashboard.PATH } component={ Dashboard } />,
	<Route path="*" component={ Dashboard } />
];
