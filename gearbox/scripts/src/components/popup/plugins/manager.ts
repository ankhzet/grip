
import { Plugin } from '../../../core/plugin';
import { ClientConnector } from '../../../core/client-connector';
import { SendAction, SendPacketData } from '../../../core/parcel/actions/send';
import { ObservableList, Identified, Package } from './observable-list';

export interface Manager<T extends Identified> {

	get(uids?: string[]): Promise<Package<T>>;
	set(values: T[]): Promise<string[]>;
	remove(uids: string[]): Promise<string[]>;
	perform(uids: string[], action: string, payload?: any);

}

abstract class ObservableConnectedList<T extends Identified> extends ObservableList<T> {
	protected connector: ClientConnector;
	private resolver: {[request: number]: (any) => any} = [];
	private request = 0;

	constructor() {
		super();

		this.connector = new ClientConnector();
		this.connector.on(SendAction, (sender, data: SendPacketData, packet) => {
			let resolver = this.resolver[data.payload];
			delete this.resolver[data.payload];
			resolver(data.data);
		});
	}

	protected pull(uids: string[]): Promise<Identified[]> {
		return new Promise((resolve, reject) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.connector.fetch(
				uids.length ? { uid: { $in: uids} } : {},
				uid
			);
		});
	}

	protected push(pack: Package<T>): Promise<string[]> {
		return new Promise((resolve, reject) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.connector.update(pack, uid);
		});
	}

}

export class PluginManager extends ObservableConnectedList<Plugin> implements Manager<Plugin> {

	public perform(uids: string[], action: string, payload?: any) {
		return this.get(uids)
			.then((pack) => {
				for (let uid in pack)
					switch (action) {
						case 'execute': {
							this.connector.execute(uid);
							break;
						}
						case 'fire': {
							console.log(`performing ${action}(${payload}) on '${uid}'`);
							this.connector.fire(uid, payload);
							break;
						}
					}

				return pack;
			});
	}

	protected wrap(data: Identified): Plugin {
		let plugin = new Plugin(data.uid);
		for (let key in data)
			plugin[key] = data[key];
		return plugin;
	}

	public async iterator(): Promise<Iterable<Plugin>> {
		let data = await this.get();
		let keys = Object.keys(data);
		let current = 0;
		let last = keys.length - 1;

		return Promise.resolve({
			[Symbol.iterator]: () => {
				return {

					next: () => {
						if (current <= last) {
							return {
								done: false,
								value: <Plugin>data[keys[current++]],
							};
						} else {
							return {
								done: true,
								value: <Plugin>undefined,
							};
						}
					}

				}
			}
		});
	}

}

