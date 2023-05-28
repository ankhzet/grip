
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { ObservableList } from './ObservableList';
import { SendAction, SendPacketData } from '../../core/parcel/actions/Base/Send';
import { PackageInterface } from '../../core/db/data/PackageInterface';
import { CollectionConnector } from '../../core/server/CollectionConnector';
import { TranscoderInterface } from '../../core/server/TranscoderInterface';
import { TranscoderAggregate } from '../../core/server/TranscoderAggregate';
import { ServerConnector } from '../../core/client/ServerConnector';
import { CallbackStore } from "./CallbackStore";

export abstract class ObservableConnectedList<T extends IdentifiableInterface> extends ObservableList<T> {
	protected connector: ServerConnector;
	protected collection: CollectionConnector;

	private resolvers: CallbackStore;
	private transcoders: TranscoderAggregate<T, {}>;

	constructor(connector: ServerConnector, collection: CollectionConnector) {
		super();

		this.resolvers = new CallbackStore();
		this.transcoders = new TranscoderAggregate<T, {}>();
		this.collection = collection;
		this.collection.updated(this.invalidate.bind(this));

		this.connector = connector;
		this.connector.listen(SendAction, (data: SendPacketData) => {
			let resolver = this.resolvers.pop(data.payload);

			if (resolver) {
				return resolver(data.data);
			} else {
				console.log('unmet resolver', data.payload);
			}
		});
	}

	public addTranscoder(transcoder: TranscoderInterface<any, any>) {
		return this.transcoders.add(transcoder);
	}

	protected pull(uids: string[]): Promise<PackageInterface<IdentifiableInterface>> {
		return new Promise((resolve) => {
			this.collection.fetch(
				uids.length ? { uid: { $in: uids} } : {},
				this.resolvers.push(resolve)
			);
		});
	}

	protected push(pack: PackageInterface<T>): Promise<string[]> {
		return new Promise((resolve) => {
			this.collection.update(
				pack,
				this.resolvers.push(resolve)
			);
		});
	}

	protected serialize(instances: T[]): any[] {
		return instances.map((instance) => this.transcoders.encode(instance));
	}

	protected deserialize(data: any[]): T[] {
		return data.map((instance) => this.transcoders.decode(instance));
	}

}
