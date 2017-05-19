
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { ClientConnector } from './ClientConnector';
import { UpdatedAction, UpdatedPacketData } from '../../Grip/Server/actions/Updated';

export class CollectionConnector extends ClientConnector {
	public collection: string;

	constructor(namespace: string, collection: string) {
		super(namespace);
		this.collection = collection;
	}

	public updated(listener: (uids: string[]) => any): this {
		return this.listen(UpdatedAction, (data: UpdatedPacketData) => {
			if (data.what === this.collection) {
				listener(data.uids);
			}
		});
	}

	fetch(query: any, payload?: any) {
		return BaseActions.fetch(this, { what: this.collection, data: query, payload });
	}

	update(data: any, payload?: any) {
		return BaseActions.update(this, { what: this.collection, data, payload });
	}

}
