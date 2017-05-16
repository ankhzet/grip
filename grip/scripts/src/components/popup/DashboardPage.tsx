
import * as React from "react";
import { Route } from 'react-router'

export class DashboardPage extends React.Component<{}, {}> {

	static PATH = '/dashboard';

	render() {
		return (
			<div>
				This is dashboard page.
			</div>
		)
	}
}

export const DashboardPageRoutes = [
	<Route path={ DashboardPage.PATH } component={ DashboardPage } />,
	<Route path="*" component={ DashboardPage } />
];
