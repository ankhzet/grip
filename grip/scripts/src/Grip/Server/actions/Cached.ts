
import { Action } from '../../../core/parcel/actions/Action';

export interface CachedPacketData {
	uids: string[];
}

export class CachedAction extends Action<CachedPacketData> {
	properties = ['uids'];
}
