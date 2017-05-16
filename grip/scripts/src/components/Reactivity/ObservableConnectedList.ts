
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { ObservableList } from './ObservableList';
import { ClientConnector } from '../../core/ClientConnector';
import { SendAction, SendPacketData } from '../../core/parcel/actions/Base/Send';
import { PackageInterface } from '../../core/db/data/PackageInterface';

export abstract class ObservableConnectedList<T extends IdentifiableInterface> extends ObservableList<T> {
	protected connector: ClientConnector;
	private resolver: {[request: number]: (any) => any} = [];
	private request = 0;

	constructor(namespace: string) {
		super();

		this.connector = new ClientConnector(namespace);
		this.connector.on(SendAction, (sender, data: SendPacketData, packet) => {
			let resolver = this.resolver[data.payload];
			delete this.resolver[data.payload];
			resolver(data.data);
		});
	}

	protected pull(uids: string[]): Promise<IdentifiableInterface[]> {
		return new Promise((resolve, reject) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.connector.fetch(
				uids.length ? { uid: { $in: uids} } : {},
				uid
			);
		});
	}

	protected push(pack: PackageInterface<T>): Promise<string[]> {
		return new Promise((resolve, reject) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.connector.update(pack, uid);
		});
	}

}
