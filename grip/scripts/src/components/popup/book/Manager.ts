
import { Book } from '../../../Grip/Domain/Book';
import { IdentifiableInterface } from '../../../core/db/data/IdentifiableInterface';
import { ObservableConnectedList } from '../../Reactivity/ObservableConnectedList';
import { ManagerInterface } from '../../Reactivity/ManagerInterface';
import { PackageInterface } from "../../../core/db/data/PackageInterface";

export class BookManager extends ObservableConnectedList<Book> implements ManagerInterface<Book> {

	constructor() {
		super('grip');
	}

	public perform(uids: string[], action: string, payload?: any) {
		return this.get(uids)
			.then((pack: PackageInterface<any>) => {
				let results = Object.keys(pack).map((uid) => {
					switch (action) {
						case 'some': {
							return this.connector.some(uid);
						}
					}
				});

				console.log(`Performed ${action}:`, results);

				return pack;
			});
	}

	protected wrap(data: IdentifiableInterface): Book {
		let book = new Book(data.uid);

		for (let key in data) {
			book[key] = data[key];
		}

		return book;
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

