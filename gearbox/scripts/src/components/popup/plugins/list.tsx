
import * as React from 'react';

import { Link, withRouter } from 'react-router'
import { Plugin } from '../../../core/plugin';
import { Manager } from './manager';
import { Package } from './observable-list';
import { Plugins } from '../plugins';

import { PluginManagementUIDelegate } from './delegates/plugin-management-ui';
import { Glyph } from '../../glyph';
import { Button } from '../../button';
import { Panel, PanelHeader, PanelList } from '../../panel';

interface PluginItemRowProps {
	manager: Manager<Plugin>;
	plugin: Plugin;

	delegate: PluginManagementUIDelegate<Plugin>;
}

@withRouter
class PluginItemRow extends React.Component<PluginItemRowProps, {}> {

	constructor(props) {
		super(props);

		this.executePlugin= this.executePlugin.bind(this);
		this.removePlugin = this.removePlugin.bind(this);
	}

	pluginPath(relative: string = ''): string {
		return Plugins.PATH + '/' + this.props.plugin.uid + (relative && ('/' + relative));
	}

	render() {
		return (
			<div className="row">
				<div className="col-lg-12">
					<div className="input-group">
						<div className="input-group-btn">
							<Button class="btn-xs" onClick={ this.removePlugin }>
								<Glyph name="remove" />
							</Button>
						</div>

						<Link className="col-xs-9" to={ this.pluginPath() }>Plugin "{ this.props.plugin.title }"</Link>

						<div className="input-group-btn">
							<Button class="btn-xs" onClick={ this.executePlugin }>
								<Glyph name="play-circle" />
							</Button>
							<Button class="btn-xs dropdown-toggle" data-toggle="dropdown">
								Actions <span className="caret" />
							</Button>
							<ul className="dropdown-menu pull-right">
								<li><Link to={ this.pluginPath('edit') }>Edit</Link></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}

	private executePlugin() {
		return this.props.delegate.executePlugin(this.props.plugin.uid);
	}

	private removePlugin() {
		return this.props.delegate.removePlugin(this.props.plugin.uid);
	}

}

export interface ListPluginsProps {
	delegate: PluginManagementUIDelegate<Plugin>;
	manager: Manager<Plugin>;
}

export class ListPlugins extends React.Component<ListPluginsProps, { plugins: Package<Plugin> }> {

	constructor(props) {
		super(props);

		this.addPlugin = this.addPlugin.bind(this);
	}

	componentWillMount() {
		this.pullPlugins();
	}

	componentWillReceiveProps(next) {
		this.pullPlugins();
	}

	async pullPlugins(uids: string[] = []) {
		this.setState({
			plugins: null,
		});

		this.setState({
			plugins: await this.props.manager.get(uids),
		});
	}

	render() {
		let plugins = this.state.plugins || {};
		return (
			<Panel>
				<PanelHeader>
					Plugins
					<div className="pull-right">
						<Button class="btn-xs" onClick={ this.addPlugin }>
							<Glyph name="plus" />
						</Button>
					</div>
				</PanelHeader>
				<PanelList>
					{Object.keys(plugins).map((uid) => {
						let plugin = plugins[uid];
						return (
							<li key={ plugin.uid } className="list-group-item">
								<PluginItemRow
									delegate={ this.props.delegate }
									manager={ this.props.manager }
									plugin={ plugin } />
							</li>
						);
					})}
				</PanelList>
			</Panel>
		);
	}

	private addPlugin() {
		return this.props.delegate.createPlugin();
	}
}
