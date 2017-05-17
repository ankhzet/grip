
import { Model } from '../../core/db/data/Model';

export class Book extends Model{
	public uid: string;

	public title: string;
	public uri: string;

	public toc?: {[uri: string]: string};
}
