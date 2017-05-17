
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { ObservableList } from './ObservableList';
import { SendAction, SendPacketData } from '../../core/parcel/actions/Base/Send';
import { PackageInterface } from '../../core/db/data/PackageInterface';
import { CollectionConnector } from '../../core/server/CollectionConnector';
import { Serializer } from '../../core/db/data/Serializer';
import { Package } from '../../core/db/data/Package';

export abstract class ObservableConnectedList<T extends IdentifiableInterface> extends ObservableList<T> {
	protected connector: CollectionConnector;
	private resolver: {[request: number]: (any) => any} = [];
	private request = 0;
	private collection: string;

	private serializers: Serializer<T, any>[] = [];

	constructor(namespace: string, table: string) {
		super();

		this.collection = table;
		this.connector = new CollectionConnector(namespace, table);
		this.connector.on(SendAction, (data: SendPacketData) => {
			let resolver = this.resolver[data.payload];
			delete this.resolver[data.payload];
			resolver(data.data);
		});
	}

	public addSerializer(serializer: Serializer<T, any>) {
		return this.serializers.push(serializer);
	}

	protected pull(uids: string[]): Promise<IdentifiableInterface[]> {
		return new Promise((resolve) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.connector.fetch(
				uids.length ? { uid: { $in: uids} } : {},
				uid
			);
		});
	}

	protected push(pack: PackageInterface<T>): Promise<string[]> {
		return new Promise((resolve) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;

			this.connector.update(
				this.serialize(pack),
				uid
			);
		});
	}

	protected serialize(pack: PackageInterface<T>) {
		let got = [];

		for (let key of Object.keys(pack)) {
			let instance = pack[key];

			for (let serializer of this.serializers) {
				instance = serializer(instance);
			}

			got.push(instance);
		}

		return new Package(got);
	}

}
