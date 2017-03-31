
import * as React from 'react';

import { Plugin } from '../../../core/plugin';
import { Manager } from './manager';

import { Link } from 'react-router'
import { Plugins } from '../plugins';

export interface ShowPluginItemProps {
	manager: Manager<Plugin>;
	plugin: Plugin;
}

export class ShowPluginItem extends React.Component<ShowPluginItemProps, {}> {

	// async pullPlugin(id: string) {
	// 	this.setState({
	// 		plugin: null,
	// 	});
  //
	// 	let plugin = await this.props.manager.get(id);
	// 	this.setState({
	// 		plugin: plugin,
	// 	});
	// }
  //
	// componentWillReceiveProps(next) {
	// 	this.pullPlugin(next.params.id);
	// }
  //
	// componentWillMount() {
	// 	this.pullPlugin(this.props.params.id);
	// }

	render() {
		// if (!this.state.plugin)
		// 	return null;

		return (
			<div className="plugin">
				<Link to={ Plugins.PATH + '/' + this.props.plugin.uid }>Plugin "{ this.props.plugin.title }"</Link>
			</div>
		);
	}

}
