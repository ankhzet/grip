
import { Action } from '../../../core/parcel/actions/Action';

export interface CachePacketData {
	uid: string;
}

export class CacheAction extends Action<CachePacketData> {
	properties = ['uid'];
}
