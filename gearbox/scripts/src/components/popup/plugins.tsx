
import * as React from "react";
import { Route, IndexRoute, withRouter } from 'react-router'
import InjectedRouter = ReactRouter.InjectedRouter;

import { Manager } from './plugins/manager';
import { Plugin } from '../../core/plugin';
import { ListPlugins } from './plugins/list';
import { ShowPlugin } from './plugins/show/show';
import { PluginManagementUIDelegate } from './plugins/delegates/plugin-management-ui';
import { Alertify } from '../../core/utils/alertify';
import { EditPlugin } from './plugins/edit/edit';

interface PluginsProps {
	router: InjectedRouter;
	manager: Manager<Plugin>;
}

@withRouter
export class Plugins extends React.Component<PluginsProps, {}> implements PluginManagementUIDelegate<Plugin> {

	static PATH = '/plugins';

	render() {
		let props = { delegate: this, manager: this.props.manager };
		return (
			<div>
				{ React.Children.map(
					this.props.children,
					(child) => React.cloneElement(child as any, props)
				) }
			</div>
		)
	}

	public async removePlugin(uid: string) {
		let plugins = await this.props.manager.get([uid]);
		let plugin = plugins[uid];

		if (plugin)
			Alertify.confirm(`Delete plugin "${plugin.title}"?`, (ok) => {
				if (!ok)
					return;

				this.props.manager.remove([plugin.uid])
					.then((uids) => {
						console.log('successfuly nuked', uids);
						this.props.router.replace(Plugins.PATH);
					});
			});
	}

	public async executePlugin(uid: string) {
		let plugins = await this.props.manager.get([uid]);
		let plugin = plugins[uid];

		Alertify.confirm(`Execute plugin [${plugin.title}]?\n<pre style="max-height: 200px;">${plugin.code}</pre>`, (ok) => {
			if (!ok)
				return;

			this.props.manager.perform([uid], 'fire', 'ACTION');
		});
	}

	public async createPlugin() {
		Alertify.prompt('Which name to assign?', (ok, title) => {
			if (!ok)
				return;

			let plugin = new Plugin(`${ ~~(Math.random() * (100000 - 10000) + 10000) }`);
			plugin.title = title;

			this.props.manager
				.set([plugin])
				.then((uids) => {
					this.props.router.replace(Plugins.PATH + '/' + plugin.uid);
				});

		}, 'Plugin name');
	}

	public async savePlugin(uid: string, data) {
		let plugins = await this.props.manager.get([uid]);
		let plugin = plugins[uid];

		if (!plugin)
			return;

		for (let key in data)
			if (key !== 'uid')
				plugin[key] = data[key];

		this.props.manager.set([plugin]);
	}

}

export const PluginsRoutes = (
	<Route path={ Plugins.PATH } component={ Plugins }>
		<Route path={ Plugins.PATH + '/:id/edit' } component={ EditPlugin } />
		<Route path={ Plugins.PATH + '/:id' } component={ ShowPlugin } />
		<IndexRoute component={ ListPlugins } />
	</Route>
);

// import { PluginItemList } from '../plugins/list';
// import { PluginList } from '../../core/plugin-list';
// import { Plugin } from '../../core/plugin';
// import { PluginItemEditor } from '../plugins/edit/edit';
// import { PluginManagementUIDelegate } from '../plugins/delegates/plugin-management-ui';

// import { Alertify } from '../../core/utils/alertify';
//
// import { PluginItemView } from '../plugins/show';
// import { Packet } from '../../core/parcel/packet';
// import { ClientConnector } from '../../core/client-connector';
// import { SendPacketData } from '../../core/parcel/actions/send';

// export interface PopupProps { }
// export interface PopupState {
// 	list?: PluginList<Plugin>;
// 	selected?: Plugin;
// 	edit?: boolean;
// }
//
// class PluginManager extends PluginList<Plugin> {
// 	private _loaded: boolean;
// 	private connector: ClientConnector;
//
// 	static UPDATED = 'updated';
//
// 	constructor() {
// 		super((uid) => new Plugin(uid));
//
// 		this.connector = new ClientConnector();
// 		this.connector.onsent(this._handle_sent.bind(this));
// 	}
//
// 	protected load() {
// 		let loaded = this._loaded;
// 		if (loaded)
// 			return loaded;
//
// 		this.connector.fetch({});
//
// 		return this._loaded = true;
// 	}
//
// 	private _handle_sent(sender, { what, data }: SendPacketData, packet: Packet<SendPacketData>) {
// 		console.log(`server [${packet.sender}] performed '${packet.action}':`);
// 		console.log(`\trequest data:`, packet.data);
//
// 		for (let fragment of data) {
// 			let plugin = (fragment.uid && this.get(fragment.uid)) || this.create();
//
// 			for (let key in fragment)
// 				if (!key.match(/^_/))
// 					plugin[key] = fragment[key];
//
// 			this.set(plugin);
// 			this.fire(PluginManager.UPDATED, plugin.uid);
// 		}
// 	}
//
// 	get list(): PluginList<Plugin> {
// 		return (this._loaded && this) || (this.load() && this);
// 	}
//
// 	public applyData(uid: string, data: any) {
// 		data.uid = uid;
// 		console.log('saving', uid, data);
// 		this.connector.update(data);
// 	}
//
// 	public execute(uid: string) {
// 		let plugin = this.get(uid);
// 		if (plugin)
// 			return this.connector.fire(plugin.uid, 'EXECUTE');
// 	}
//
// 	onupdated(listener: (...args) => any) {
// 		return this.on(PluginManager.UPDATED, listener);
// 	}
//
// }

// export class Popup extends React.Component<PopupProps, PopupState> implements PluginManagementUIDelegate<Plugin> {
// 	manager: PluginManager = new PluginManager();
//
// 	constructor(props) {
// 		super(props);
// 		this.manager.onchanged(() => {
// 			this.forceUpdate();
// 		});
// 		this.manager.onupdated((evt, uid) => {
// 			this.showPlugin(uid);
// 		});
//
// 		this.createPlugin = this.createPlugin.bind(this);
// 	}
//
// 	render() {
// 		return (
// 			<div>
// 				<h1>Plugin sandbox</h1>
// 				<hr />
//
// 				<div>{this.state.selected
// 					? (this.state.edit
// 							? <PluginItemEditor delegate={ this } plugin={ this.state.selected } />
// 							: <PluginItemView delegate={ this } plugin={ this.state.selected } />)
// 					: (<div>
// 							<PluginItemList
// 								delegate={ this }
// 								list={ this.manager.list } />
//
// 							<div>
// 								<button onClick={ this.createPlugin }>Create</button>
// 							</div>
// 						</div>)
// 				}</div>
// 			</div>
// 		);
// 	}
//
// 	public listPlugins() {
// 		this.setState({
// 			list: this.manager.list,
// 			selected: null,
// 			edit: false,
// 		});
// 	}
//
//
// 	public showPlugin(uid: string): Plugin {
// 		let plugin = this.manager.get(uid);
// 		if (plugin) {
// 			this.setState({
// 				selected: plugin,
// 				edit: false,
// 			});
// 		}
// 		return plugin;
// 	}
//
// 	public editPlugin(uid: string): Plugin {
// 		let plugin = this.manager.get(uid);
// 		if (plugin) {
// 			this.setState({
// 				selected: plugin,
// 				edit: true,
// 			});
// 		}
// 		return plugin;
// 	}
//
// 	public savePlugin(uid: string, data): Plugin {
// 		let plugin = this.manager.get(uid);
// 		if (plugin) {
// 			this.manager.applyData(uid, data);
//
// 			return this.showPlugin(uid);
// 		}
//
// 		return plugin;
// 	}
//
//
// 	public executePlugin(uid: string): Plugin {
// 		let plugin = this.manager.get(uid);
// 		if (plugin) {
// 			console.log('EXECUTE', plugin);
// 			this.manager.execute(uid);
// 		}
//
// 		return plugin;
// 	}
//
// }
