
import { Eventable } from '../utils/eventable';
import { Plugin } from '../plugin';
import { MountedInstance } from './mount-point';

export class PluginInstance extends Eventable implements MountedInstance {
	uid: string;
	title: string;

	constructor(plugin: Plugin) {
		super();
		Data.exclude(plugin, ['code'], this);
	}

	static data(src) {
		return Data.include(src);
	}

	raw(props?) {
		if (!props)
			props = Object.keys(this)
				.filter((key) => !!key.match(/^(title|uid)/));

		return Data.include(this, props);
	}

	mount(sandbox) {
		this.mounted(sandbox);
		this.fire('MOUNTED', sandbox);
	}

	unmount(sandbox) {
		this.fire('UNMOUNTED', sandbox);
		this.unmounted(sandbox);
	}

	mounted(sandbox) {
	}

	unmounted(sandbox) {
	}

}

export class Data {

	static include(src, props?: any[], dst = {}) {
		for (let p of (props || Object.keys(src)))
			dst[p] = src[p];
		return dst;
	}

	static exclude(src, props: any[], dst = {}) {
		let keys = Object.keys(src);
		for (let p of keys)
			if (props.indexOf(p) < 0)
				dst[p] = src[p];

		return dst;
	}

}
