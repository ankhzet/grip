
import { CollectionThunk } from '../../../../core/server/Synchronizer';
import { Collection } from '../../../../core/server/data/Collection';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { DB } from '../../../../core/db/DB';
import { Page } from './Page';
import { PagesDepot } from './PagesDepot';
import { PageTranscoder } from '../../Transcoders/Packet/PageTranscoder';

export class PagesThunk implements CollectionThunk<Page, any> {
	collection: Collection<Page>;
	transcoder: TranscoderInterface<Page, any>;

	public constructor(db: DB) {
		this.collection = new PagesDepot(db);
		this.transcoder = new PageTranscoder();
	}
}
