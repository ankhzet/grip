
export class Utils {
	static wrap(html: string, parent?: string): JQuery {
		return $('<' + (parent || 'html') + '>').html(html);
	}

	static contents(html: string, context: string, parent?: string): Promise<string> {
		return new Promise((rs, rj) => {
			try {
				let filtered = this.wrap(html, parent)
					.find(context)
					.html();

				rs(filtered);
			} catch (e) {
				rj(e);
			}
		});
	}

	static download(uri: string): Promise<string> {
		return new Promise((rs, rj) => {
			$.get(uri)
				.then(rs, (j, t, e) => rj(j.status + ' ' + e));
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
}