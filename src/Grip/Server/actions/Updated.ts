
import { Action } from '../../../core/parcel/actions/Action';

export interface UpdatedPacketData {
	what: string;
	uids: string[];
}

export class UpdatedAction extends Action<UpdatedPacketData> {
	properties = ['what', 'uids'];
}
