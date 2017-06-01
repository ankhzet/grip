
import { CollectionThunk } from '../../../../core/server/Synchronizer';
import { Collection } from '../../../../core/server/data/Collection';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { DB } from '../../../../core/db/DB';
import { Page } from './Page';
import { PagesDepot } from './PagesDepot';
import { PageTranscoder } from '../../Transcoders/Packet/PageTranscoder';
import { Models } from '../../../../core/db/data/Models';

export class PagesThunk implements CollectionThunk<Page, any> {
	collection: Collection<Page>;
	transcoder: TranscoderInterface<Page, any>;

	public constructor(db: DB, models: Models<Page>) {
		this.collection = new PagesDepot(db, models);
		this.transcoder = new PageTranscoder();
	}
}
