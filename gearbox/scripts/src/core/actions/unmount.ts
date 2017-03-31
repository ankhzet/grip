
import { Action } from '../parcel/actions/action';

export interface UnmountPacketData {
	uid: string;
}

export class UnmountAction extends Action<UnmountPacketData> {
	properties = ['uid'];
}
