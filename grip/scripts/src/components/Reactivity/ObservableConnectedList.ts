
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { ObservableList } from './ObservableList';
import { SendAction, SendPacketData } from '../../core/parcel/actions/Base/Send';
import { PackageInterface } from '../../core/db/data/PackageInterface';
import { CollectionConnector } from '../../core/server/CollectionConnector';
import { TranscoderInterface } from '../../core/server/TranscoderInterface';
import { TranscoderAggregate } from '../../core/server/TranscoderAggregate';

export abstract class ObservableConnectedList<T extends IdentifiableInterface> extends ObservableList<T> {
	protected connector: CollectionConnector;
	private resolver: {[request: number]: (any) => any} = [];
	private request = 0;
	private collection: string;

	private transcoders: TranscoderAggregate<T, {}>;

	constructor(namespace: string, table: string) {
		super();

		this.collection = table;
		this.transcoders = new TranscoderAggregate<T, {}>();

		this.connector = new CollectionConnector(namespace, table);
		this.connector.on(SendAction, (data: SendPacketData) => {
			let resolver = this.resolver[data.payload];
			delete this.resolver[data.payload];
			resolver(data.data);
		});
	}

	public addTranscoder(transcoder: TranscoderInterface<any, any>) {
		return this.transcoders.add(transcoder);
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
			this.connector.update(pack, uid);
		});
	}

	protected serialize(instances: T[]): any[] {
		return instances.map((instance) => this.transcoders.encode(instance));
	}

	protected deserialize(data: any[]): T[] {
		return data.map((instance) => this.transcoders.decode(instance));
	}

}
