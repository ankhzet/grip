
import * as React from "react";

import { Plugin } from '../../../../core/plugin';
import { PluginManagementUIDelegate } from '../delegates/plugin-management-ui';

import { Panel, PanelHeader, PanelBody, PanelFooter } from '../../../panel';

import * as Codemirror from 'react-codemirror';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import { Button } from '../../../button';
import { Glyph } from '../../../glyph';
import { Manager } from '../manager';
import plugins = chrome.contentSettings.plugins;

export interface EditPluginProps {
	delegate: PluginManagementUIDelegate<Plugin>;
	manager: Manager<Plugin>;
	params: { id: string };
}

export interface EditPluginState {
	plugin?: Plugin;
	title?: string;
	code?: string;
}

export class EditPlugin extends React.Component<EditPluginProps, EditPluginState> {

	constructor(props) {
		super(props);

		this.titleChanged = this.titleChanged.bind(this);
		this.codeChanged  = this.codeChanged.bind(this);

		this.navBack      = this.navBack.bind(this);
		this.savePlugin   = this.savePlugin.bind(this);
	}

	async pullPlugin(id: string) {
		this.setState({
			plugin: null,
		});

		let pack = await this.props.manager.get([id]);
		let plugin = pack[id];
		this.setState({
			plugin: plugin,
			title: plugin.title,
			code: plugin.code,
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
					Edit plugin: { plugin.title }

					<div className="btn-toolbar pull-right">
						<div className="btn-group">
							{/*<Button class="btn-xs" onClick={ this.executePlugin }>*/}
								{/*<Glyph name="play-circle" />*/}
							{/*</Button>*/}
						</div>
					</div>
				</PanelHeader>

				<PanelBody>

					<div className="form-horizontal">

						<div className="form-group">
							<div className="col-lg-12">
								<div className="input-group">
									<span className="input-group-addon">Title</span>
									<input className="form-control" value={ this.state.title } onChange={ this.titleChanged } />
								</div>
							</div>
						</div>


						<div className="form-group">
							<div className="col-lg-12">
								<Codemirror
									value={ this.state.code }
									onChange={ this.codeChanged }
									options={{
										mode: 'javascript',
										theme: 'base16-oceanicnext-dark',
										styleActiveLine: true,
										lineNumbers: true,
										lineWiseCopyCut: false,
										indentWithTabs: true,
										tabSize: 2,
									}} />
							</div>
						</div>

					</div>
				</PanelBody>

				<PanelFooter>
					<Button class="btn-xs" onClick={ this.navBack }>
						&larr;
					</Button>
					<Button class="btn-xs" onClick={ this.savePlugin }>
						Save
					</Button>
				</PanelFooter>
			</Panel>
		);
	}

	private titleChanged(e) {
		this.setState({
			title: e.srcElement.value,
		});
	}

	private codeChanged(code) {
		this.setState({
			code: code,
		});
	}

	private navBack() {
		// validate
		// if (!this.valid(this.state)) {
		//
		// 	return;
		// }

		// this.props.delegate.showPlugin(this.props.plugin.uid);
	}

	private savePlugin() {
		// validate
		// if (!this.valid(this.state)) {
		//
		// 	return;
		// }

		this.props.delegate.savePlugin(this.props.params.id, {
			title: this.state.title,
			code: this.state.code,
		});
	}

}
