
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { ObservableList } from './ObservableList';
import { SendAction, SendPacketData } from '../../core/parcel/actions/Base/Send';
import { PackageInterface } from '../../core/db/data/PackageInterface';
import { CollectionConnector } from '../../core/server/CollectionConnector';
import { TranscoderInterface } from '../../core/server/TranscoderInterface';
import { TranscoderAggregate } from '../../core/server/TranscoderAggregate';
import { ServerConnector } from '../../Grip/Client/ServerConnector';

export abstract class ObservableConnectedList<T extends IdentifiableInterface> extends ObservableList<T> {
	protected connector: ServerConnector;
	protected collection: CollectionConnector;
	private resolver: {[request: number]: (any) => any} = [];
	private request = 0;

	private transcoders: TranscoderAggregate<T, {}>;

	constructor(connector: ServerConnector, collection: CollectionConnector) {
		super();

		this.transcoders = new TranscoderAggregate<T, {}>();
		this.collection = collection;
		this.collection.updated(this.invalidate.bind(this));

		this.connector = connector;
		this.connector.listen(SendAction, (data: SendPacketData) => {
			let resolver = this.resolver[data.payload];

			if (resolver) {
				delete this.resolver[data.payload];
				resolver(data.data);
			}
		});
	}

	public addTranscoder(transcoder: TranscoderInterface<any, any>) {
		return this.transcoders.add(transcoder);
	}

	protected pull(uids: string[]): Promise<PackageInterface<IdentifiableInterface>> {
		return new Promise((resolve) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.collection.fetch(
				uids.length ? { uid: { $in: uids} } : {},
				uid
			);
		});
	}

	protected push(pack: PackageInterface<T>): Promise<string[]> {
		return new Promise((resolve) => {
			let uid = this.request++;
			this.resolver[uid] = resolve;
			this.collection.update(pack, uid);
		});
	}

	protected serialize(instances: T[]): any[] {
		return instances.map((instance) => this.transcoders.encode(instance));
	}

	protected deserialize(data: any[]): T[] {
		return data.map((instance) => this.transcoders.decode(instance));
	}

}
