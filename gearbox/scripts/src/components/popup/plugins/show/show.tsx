
import * as React from "react";

import { Link } from 'react-router';

import { Plugin } from "../../../../core/plugin";
import { PluginManagementUIDelegate } from '../delegates/plugin-management-ui';
import { Manager } from '../manager';
import { Panel, PanelFooter, PanelHeader, PanelBody } from '../../../panel';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';

import * as Codemirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import { Plugins } from '../../plugins';

export interface ShowPluginProps {
	delegate: PluginManagementUIDelegate<Plugin>;
	manager: Manager<Plugin>;
	params: { id: string };
}

export class ShowPlugin extends React.Component<ShowPluginProps, { plugin: Plugin }> {

	constructor(props) {
		super(props);

		this.navBack      = this.navBack.bind(this);
		this.editPlugin   = this.editPlugin.bind(this);
		this.removePlugin = this.removePlugin.bind(this);
		this.executePlugin= this.executePlugin.bind(this);
	}

	async pullPlugin(id: string) {
		this.setState({
			plugin: null,
		});

		let pack = await this.props.manager.get([id]);
		let plugin = pack[id];
		this.setState({
			plugin: plugin,
		});
	}

	componentWillReceiveProps(next) {
		this.pullPlugin(next.params.id);
	}

	componentWillMount() {
		this.pullPlugin(this.props.params.id);
	}

	render() {
		let plugin = this.state.plugin;
		if (!plugin)
			return null;

		return (
			<Panel>
				<PanelHeader>
					Plugin: { plugin.title }
					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							<Button class="btn-xs" onClick={ this.removePlugin }>
								<Glyph name="remove" />
							</Button>
							<Button class="btn-xs">
								<Link to={ Plugins.PATH + '/' + plugin.uid + '/edit' }>
									<Glyph name="edit" />
								</Link>
							</Button>
						</div>
						<div className="btn-group">
							<Button class="btn-xs" onClick={ this.executePlugin }>
								<Glyph name="play-circle" />
							</Button>
						</div>
					</div>
				</PanelHeader>

				<PanelBody>
					<div className="form-group col-lg-12">

						<Codemirror
							value={ plugin.code }
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

	executePlugin() {
		this.props.delegate.executePlugin(this.state.plugin.uid);
	}

	editPlugin() {
		// this.props.delegate.editPlugin(this.props.plugin.uid);
	}

	removePlugin() {
		this.props.delegate.removePlugin(this.state.plugin.uid);
	}

}
