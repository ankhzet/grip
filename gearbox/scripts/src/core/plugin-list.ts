
import { Plugin } from "./plugin";
import { Eventable } from './utils/eventable';

export class PluginList<P extends Plugin> extends Eventable {
	private plugins: {[uid: string]: P} = {};
	private factory: (uid: string) => P;

	static CHANGED = 'changed';

	constructor(factory: (uid: string) => P) {
		super();
		this.factory = factory;
	}

	onchanged(listener: () => any) {
		return this.on(PluginList.CHANGED, listener);
	}

	private changed() {
		this.fire(PluginList.CHANGED);
	}

	public create(): P {
		return this.factory(this.genUID());
	}

	public get(uid: string): P {
		return this.plugins[uid];
	}

	public set(plugin: P): P {
		this.plugins[plugin.uid] = plugin;
		this.changed();
		return plugin;
	}

	public remove(uid: string): P {
		let plugin = this.plugins[uid];
		if (plugin) {
			delete this.plugins[uid];
			this.changed();
		}
		return plugin;
	}

	public each(consumer: (plugin: P) => boolean): boolean {
		for (let plugin in this.map())
			if (!consumer(this.plugins[plugin]))
				return false;

		return true;
	}

	public map<T>(consumer?: (plugin: P) => T): T[] {
		let collection : T[] = [];
		for (let plugin in this.plugins)
			if (this.plugins.hasOwnProperty(plugin))
				collection.push(
					consumer
						? consumer(this.plugins[plugin])
						: <any>this.plugins[plugin]
				);

		return collection;
	}
	private genUID(): string {
		return `${Object
			.keys(this.plugins)
			.map(Number)
			.reduce((max, uid) => Math.max(uid || 0, max), 0) + 1}`;
	}

}
