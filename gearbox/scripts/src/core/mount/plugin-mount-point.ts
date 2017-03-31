
import { BaseMountPoint } from './mount-point';
import { PluginInstance } from './plugin-instance';
import { Plugin } from '../plugin';

export class PluginsMountPoint extends BaseMountPoint<Plugin, PluginInstance> {

	constructor() {
		super((plugin) => {
			let instance;
			try {
				let code = eval(plugin.code);

				let constructor = code({
					Plugin: PluginInstance,
				});

				instance = <PluginInstance>new constructor(plugin);
			} catch (e) {
				instance = new PluginInstance(plugin);
			}

			return instance;
		});
	}

}
