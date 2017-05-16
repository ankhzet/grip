
import { Book } from '../../../core/domain/Book';
import { IdentifiableInterface } from '../../../core/db/data/IdentifiableInterface';
import { ObservableConnectedList } from '../../Reactivity/ObservableConnectedList';
import { ManagerInterface } from '../../Reactivity/ManagerInterface';

export class BookManager extends ObservableConnectedList<Book> implements ManagerInterface<Book> {

	constructor() {
		super('grip');
	}

	public perform(uids: string[], action: string, payload?: any) {
		return this.get(uids)
			.then((pack) => {
				for (let uid in pack)
					switch (action) {
						case 'execute': {
							this.connector.execute(uid);
							break;
						}
						case 'fire': {
							console.log(`performing ${action}(${payload}) on '${uid}'`);
							this.connector.fire(uid, payload);
							break;
						}
					}

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

