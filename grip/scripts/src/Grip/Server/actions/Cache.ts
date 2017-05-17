
import { Action } from '../../../core/parcel/actions/Action';
import { Book } from '../../Domain/Book';

export interface CachePacketData {
	book: Book;
}

export class CacheAction extends Action<CachePacketData> {
	properties = ['book'];
}
