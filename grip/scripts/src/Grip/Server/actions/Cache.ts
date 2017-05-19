
import { Action } from '../../../core/parcel/actions/Action';
import { Book } from '../../Domain/Book';

export interface CachePacketData {
	uid: string;
}

export class CacheAction extends Action<CachePacketData> {
	properties = ['uid'];
}
