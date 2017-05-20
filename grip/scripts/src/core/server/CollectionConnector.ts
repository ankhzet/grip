
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { UpdatedAction, UpdatedPacketData } from '../../Grip/Server/actions/Updated';
import { ServerConnector } from '../client/ServerConnector';

export class CollectionConnector {
	public collection: string;
	private connector: ServerConnector;

	constructor(connector: ServerConnector, collection: string) {
		this.connector = connector;
		this.collection = collection;
	}

	public updated(listener: (uids: string[]) => any): this {
		this.connector.listen(UpdatedAction, (data: UpdatedPacketData) => {
			if (data.what === this.collection) {
				listener(data.uids);
			}
		});

		return this;
	}

	fetch(query: any, payload?: any) {
		return BaseActions.fetch(this.connector, { what: this.collection, data: query, payload });
	}

	update(data: any, payload?: any) {
		return BaseActions.update(this.connector, { what: this.collection, data, payload });
	}

}
