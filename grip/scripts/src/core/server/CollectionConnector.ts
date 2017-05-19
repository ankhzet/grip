
import { BaseActions } from '../parcel/actions/Base/BaseActions';
import { ClientConnector } from './ClientConnector';

export class CollectionConnector extends ClientConnector {
	private collection: string;

	constructor(namespace: string, collection: string) {
		super(namespace);
		this.collection = collection;
	}

	fetch(query: any, payload?: any) {
		return BaseActions.fetch(this, { what: this.collection, data: query, payload });
	}

	update(data: any, payload?: any) {
		return BaseActions.update(this, { what: this.collection, data, payload });
	}

}
