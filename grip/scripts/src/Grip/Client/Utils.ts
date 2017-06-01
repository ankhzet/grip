
import * as JQuery from 'jquery';
import * as moment from 'moment';

export class Utils {
	static wrap(html: string, parent?: string): JQuery {
		return JQuery('<' + (parent || 'html') + '>').html(html);
	}

	static contents(html: string, context: string, parent?: string): string {
		return this.wrap(html, parent)
			.find(context)
			.html()
			;
	}

	static download(uri: string): Promise<string> {
		return new Promise((rs, rj) => {
			JQuery.get(uri)
				.then(rs, (j, t, e) => rj(j.status + ' ' + e));
		}).catch((e) => {
			throw new Error('Download failed for uri "' + uri + '" (' + e + ')');
		});
	}

	static chunks<T>(array: T[], block: number): T[][] {
		return (new Array(~~Math.ceil(array.length / block)))
			.fill(undefined)
			.map((v, index) => {
				return array.slice(index * block, (index + 1) * block);
			})
			;
	}

	static relative(url: string): string {
		let uri = new URL(url);

		return uri.toString().replace(uri.origin, '');
	}

	static ensure<T>(resolve: () => Promise<T>, state: (finished: boolean) => boolean|void) {
		return new Promise((rs, rj) => {
			if (state(false) === false) {
				return;
			}

			resolve()
				.then((value) => {
					state(true);

					rs(value);
				})
				.catch((e) => {
					state(true);

					rj(e);
				})
		});
	}

	static formatTimestamp(timestamp: number, format: string = 'DD-MM-YYYY HH:mm') {
		return moment(timestamp).format(format);
	}

	static partition(array: any[], predicate: (element: any, index: number, context: any) => any) {
		let pass = new Array(array.length);
		let fail = new Array(array.length);

		for (let index in array) {
			let element = array[index];

			if (predicate(element, <any>index, array)) {
				pass.push(element);
			} else {
				fail.push(element);
			}
		}

		return [pass, fail];
	}
}
