
import { Book } from '../../Domain/Book';
import { ObservableConnectedList } from '../../../components/Reactivity/ObservableConnectedList';
import { PackageInterface } from '../../../core/db/data/PackageInterface';
import { ReactiveInterface } from '../../../components/Reactivity/ReactiveInterface';
import { BooksPackage } from '../../Domain/BooksPackage';
import { CollectionConnector } from '../../../core/server/CollectionConnector';
import { BooksDepot } from '../../Domain/BooksDepot';
import { GripServerConnector } from '../../Client/GripServerConnector';
import { BookTranscoder } from '../../Domain/Transcoders/Packet/BookTranscoder';

export class BookManager extends ObservableConnectedList<Book> implements ReactiveInterface<Book> {
	static ACTION_CACHE = 'cache';

	constructor(connector: GripServerConnector) {
		super(
			connector,
			new CollectionConnector(connector, BooksDepot.collection)
		);

		this.addTranscoder(new BookTranscoder());
	}

	public perform(uids: string[], action: string, payload?: any): Promise<BooksPackage> {
		let connector: GripServerConnector = <GripServerConnector>this.connector;

		return this.get(uids)
			.then((pack: PackageInterface<any>) => {
				let results = Object.keys(pack).map((uid) => {
					switch (action) {
						case BookManager.ACTION_CACHE:
							return connector.cache(uid);
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
							done : current > last,
							value: (
								(current <= last)
									? data[keys[current++]]
									: undefined
							),
						};
					}

				}
			}
		});
	}

}

