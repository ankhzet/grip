
import { Collection } from '../../../../core/server/data/Collection';
import { Page } from './Page';
import { PageTable } from './PageTable';

export class PagesDepot extends Collection<Page> {
	static collection = 'books';

	constructor(table: PageTable) {
		super(table);
	}

}
