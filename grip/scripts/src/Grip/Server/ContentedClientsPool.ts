
import { ClientsPool } from '../../core/parcel/ClientsPool';
import { GripClient } from './Client';
import { GripActions } from './actions/GripActions';
import { Book } from '../Domain/Book';

export class ContentedClientsPool extends ClientsPool<GripClient> {

	cache(book: Book) {
		return this.broadcast(GripActions.cache, { book });
	}

}
