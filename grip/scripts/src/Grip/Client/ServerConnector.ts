
import { ServerConnector as BaseServerConnector } from '../../core/client/ServerConnector';
import { GripActions } from "../Server/actions/GripActions";
import { Book } from '../Domain/Book';

export class ServerConnector extends BaseServerConnector {

	constructor() {
		super('grip');
	}

	cache(book: Book) {
		return GripActions.cache(this, { uid: book.uid });
	}

}
