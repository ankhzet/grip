
import { Action } from '../../parcel/actions/Action';

export interface CollectionPacketData {
	what: string;
	data: any;
	payload?: any;
}

export class CollectionAction<D extends CollectionPacketData> extends Action<D> {
	properties = ['what', 'data', 'payload'];
}
