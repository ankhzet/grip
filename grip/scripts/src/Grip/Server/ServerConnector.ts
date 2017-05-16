
import { ServerConnector } from '../../core/client/ServerConnector';
import { CacheAction, CachePacketData } from './actions/Cache';
import { Cache, Cacher } from '../Client/Cacher';

export class GripConnector extends ServerConnector {

	constructor() {
		super('grip');

		this.on(CacheAction, this.cache.bind(this));
	}

	cache({ book }: CachePacketData) {
		let cacher = new Cacher();

		cacher.fetch({
			tocURI: book.uri,
			pattern: /\/(xray-|xray\/)/,
			context: '.entry-content',
		}).then((cache: Cache) => {
			console.log('cached:', cache)
		});
	}

}
