
import { PluginList } from './plugin-list';
import { Plugin } from './plugin';

import { GearboxDB, ModelStore } from './gearbox-db';

import { Packet } from './parcel/packet';

import { GearBoxClient } from './server/client';
import { GearBoxServer } from './server/server';

import { ExecuteAction, ExecutePacketData } from './actions/execute';
import { UnmountAction, UnmountPacketData } from './actions/unmount';

import { PluginInstance } from './mount/plugin-instance';
import { SendPacketData, SendAction } from './parcel/actions/send';
import { ClientActionHandler, ContentedClientsPool } from './server/base';
import { GearBoxActions } from './actions/actions';
import { FireAction, FirePacketData } from './parcel/actions/fire';
import { ActionConstructor } from './parcel/actions/action';
import { ActionHandler } from './parcel/dispatcher';
import { PluginsMountPoint } from './mount/plugin-mount-point';
import { DataServer, Package } from './server/data-server';
import { ObjectUtils } from './utils/object';

export class GearBox extends GearBoxServer {
	db: GearboxDB = new GearboxDB();
	dataServer: DataServer;
	plugins: PluginsDepot = new PluginsDepot(this);
	pluginsHelper: PluginsProviderHelper;

	force: {
		send: ClientActionHandler<SendPacketData>;
		execute: ClientActionHandler<ExecutePacketData>;
	};


	constructor() {
		super();

		this.force.execute = (client: GearBoxClient, data: ExecutePacketData, packet) => {
			return GearBoxActions.execute(client, data);
		};

		this.on(SendAction, this._handle_send);

		this.on(ExecuteAction, this._handle_execute);
		this.on(UnmountAction, this._handle_unmount);
		this.on(FireAction, this._handle_fire);

		this.dataServer = new DataServer(this, this.db);

		this.pluginsHelper = new PluginsProviderHelper(this.dataServer, this.plugins);
	}

	on<T>(action: ActionConstructor<T>, handler: ActionHandler<T, GearBoxClient>): this {
		return <any>super.on(action, (sender, data, packet) => {
			this._handle(sender, packet);

			return handler.call(this, sender, data, packet);
		});
	}

	fire(uid: string, event: string, ...payload: any[]) {
		let instance = this.plugins.instance(uid);
		if (instance)
			return instance.fire(event, this, ...payload);
	}

	execute({uid}, code: any) {
		this.clientsInActiveTab((clients: ContentedClientsPool) => {
			let instance = this.plugins.instance(uid);
			if (instance)
				clients.execute(instance.raw(), (code || '').toString());
		});
	}

	/**
	 * Interacting with clients
	 */

	_handle_send(client: GearBoxClient, { what, data: payload }: SendPacketData, packet: Packet<SendPacketData>) {
		switch (what) {
			case 'error': {
				console.error(
					`Client reported error during ${payload.action}:`, '\n',
					JSON.stringify(payload.data), '\n',
					`\t`, payload.error
				);
				break;
			}
		}
	}

	_handle_unmount(client: GearBoxClient, { uid }: UnmountPacketData, packet: Packet<UnmountPacketData>) {
		let plugin = this.plugins.get(uid);
		if (!plugin) {
			throw new Error(`Plugin with uid "${uid}" not found`);
		}

		this.plugins.unmount(plugin);
	}

	_handle_fire(client: GearBoxClient, { sender, event, payload }: FirePacketData, packet: Packet<FirePacketData>) {
		this.fire(sender, event, payload);
	}

	_handle_execute(client: GearBoxClient, { plugin: data, code }: ExecutePacketData, packet: Packet<ExecutePacketData>) {
		let plugin = this.plugins.get(data.uid);
		if (!plugin) {
			// todo: error handling!
			throw new Error(`Plugin with uid "${data.uid}" not found`);
		}

		this.execute(plugin, code);
	}

	_handle(client: GearBoxClient, packet: Packet<any>) {
		console.log(`Client [${packet.sender}] requested to '${packet.action}':`);
		console.log(`\tsupplied data:`, packet.data);
	}

}

class PluginsDepot extends PluginList<Plugin> {
	context: any;
	mountPoint: PluginsMountPoint = new PluginsMountPoint();

	constructor(context: any) {
		super((uid) => {
			return new Plugin(uid);
		});
		this.context = context;
	}

	public instance(uid: string): PluginInstance {
		return this.mountPoint.instance(uid);
	}

	public mount(plugin: Plugin): PluginInstance {
		return this.mountPoint.mount(this.context, plugin);
	}

	public unmount(plugin: Plugin) {
		return this.mountPoint.unmount(this.context, plugin);
	}

	public load(data: {uid: string}[]): PluginsPackage {
		let result: PluginsPackage = {};
		for (let fragment of data)
			result[fragment.uid] = this.pluginFromData(fragment);
		return result;
	}

	protected pluginFromData(data: { uid: string }): Plugin {
		let uid = data.uid;
		let plugin = uid && this.get(data.uid);
		if (!plugin)
			plugin = this.create();

		for (let key in data)
			if (!key.match(/^_/))
				plugin[key] = data[key];

		this.set(plugin);

		this.mount(plugin);
		return plugin;
	}

}

interface PluginsPackage extends Package<Plugin> { }

class EntityProviderHelper {
	name: string;
	provider: DataServer;

	constructor(name: string, provider: DataServer) {
		this.name = name;
		this.provider = provider;

		this.provider.registerSerializer(this.name, this.serialize.bind(this));
		this.provider.registerMapper(this.name, this.map.bind(this));
		this.provider.registerUpdatable(this.name, this.update.bind(this));
	}

	cache(data: Package<any>) {
		return this.provider.cache(this.name, data);
	}

	serialize(data) {
		return data;
	}

	map(pack: Package<any>): Package<any> {
		return pack;
	}

	update(store: ModelStore, {request, updated, removed}) {
		if (removed.length)
			this.removed(store, removed);

		if (updated.length)
			this.updated(store, updated);
	}

	updated(store: ModelStore, uids: string[] = null) {
		return store.findModels(uids)
			.then((data) => {
				return this.cache(data);
			});
	}

	removed(store: ModelStore, uids: string[]) {
		return this.cache(uids.reduce((acc, uid) => {
			acc[uid] = null;
			return acc;
		}, {}));
	}

}

class PluginsProviderHelper extends EntityProviderHelper {
	plugins: PluginsDepot;

	constructor(provider: DataServer, plugins: PluginsDepot) {
		super('plugins', provider);
		this.plugins = plugins;
		this.updated(
			new ModelStore(
				provider.db.table('plugins')
			)
		);
	}

	serialize(data) {
		return PluginInstance.data(data);
	}

	map(pack: Package<any>): Package<any> {
		return this.plugins.load(
			Object.keys(pack)
				.map((uid) => pack[uid])
		);
	}

	removed(store: ModelStore, uids: string[]) {
		let data = super.removed(store, uids);
		for (let uid in data)
			this.plugins.remove(uid);
		return data;
	}

}
