
import { ClientConnector as BaseClientConnector } from '../../core/server/ClientConnector';
import { GripActions } from '../Server/actions/GripActions';
import { Book } from '../Domain/Book';

export class ClientConnector extends BaseClientConnector {

	cache(book: Book) {
		return GripActions.cache(this, { book });
	}

}
