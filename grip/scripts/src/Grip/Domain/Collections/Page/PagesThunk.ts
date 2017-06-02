
import { CollectionThunk } from '../../../../core/server/Synchronizer';
import { Collection } from '../../../../core/server/data/Collection';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { Page } from './Page';
import { PagesDepot } from './PagesDepot';
import { PageTranscoder } from '../../Transcoders/Packet/PageTranscoder';
import { PageTable } from './PageTable';

export class PagesThunk implements CollectionThunk<Page, any> {
	collection: Collection<Page>;
	transcoder: TranscoderInterface<Page, any>;

	public constructor(table: PageTable) {
		this.collection = new PagesDepot(table);
		this.transcoder = new PageTranscoder();
	}
}
