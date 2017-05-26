
import * as React from "react";
import { Route } from 'react-router'

export class AboutPage extends React.Component<{}, {}> {

	static PATH = '/about';

	render() {
		return (
			<div>
				This is about page.
			</div>
		)
	}
}

export const AboutPageRoutes = [
	<Route path={ AboutPage.PATH } component={ AboutPage } />
];
