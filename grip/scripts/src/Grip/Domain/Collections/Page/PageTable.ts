
import { Table } from '../../../../core/db/data/Table';
import { Page } from './Page';
import { PageTranscoder } from '../../Transcoders/DB/PageTranscoder';

export class PageTable extends Table<Page> {
	protected transcoder = new PageTranscoder(this);
}
