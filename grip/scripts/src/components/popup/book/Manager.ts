
import { Book } from '../../../Grip/Domain/Book';
import { ObservableConnectedList } from '../../Reactivity/ObservableConnectedList';
import { PackageInterface } from '../../../core/db/data/PackageInterface';
import { ReactiveInterface } from '../../Reactivity/ReactiveInterface';
import { GripActions } from '../../../Grip/Server/actions/GripActions';
import { BooksPackage } from '../../../Grip/Domain/BooksPackage';
import { BookTranscoder } from '../../../Grip/Domain/Transcoders/Book';
import { CollectionConnector } from '../../../core/server/CollectionConnector';
import { BooksDepot } from '../../../Grip/Domain/BooksDepot';
import { ClientConnector } from '../../../Grip/Client/ClientConnector';

export class BookManager extends ObservableConnectedList<Book> implements ReactiveInterface<Book> {
	protected server: ClientConnector;

	constructor() {
		super(new CollectionConnector('grip', BooksDepot.collection));

		this.addTranscoder(new BookTranscoder());
	}

	public perform(uids: string[], action: string, payload?: any): Promise<BooksPackage> {
		return this.get(uids)
			.then((pack: PackageInterface<any>) => {
				let results = Object.keys(pack).map((uid) => {
					switch (action) {
						case 'fetch':
							return GripActions.cache(this.connector, { uid });
					}
				});

				console.log(`Performed ${action}:`, results);

				return pack;
			})
		;
	}

	public async iterator(): Promise<Iterable<Book>> {
		let data = await this.get();
		let keys = Object.keys(data);
		let current = 0;
		let last = keys.length - 1;

		return Promise.resolve({
			[Symbol.iterator]: () => {
				return {

					next: () => {
						return {
							done: current > last,
							value: (current <= last) ? data[keys[current++]] : undefined,
						};
					}

				}
			}
		});
	}

}

