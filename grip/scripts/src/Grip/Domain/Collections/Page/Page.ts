
import { Model } from '../../../../core/db/data/Model';
import { Book } from '../Book/Book';
import { ManyToOne } from '../../../../core/db/data/Relation/ManyToOne';

export class Page extends Model {
	public uid: string;

	public book = ManyToOne.attach<Page, Book>(this);

	public title: string;
	public uri: string;
	public contents: string;
	public state: number;

	public cached: number;
}
