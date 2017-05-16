
import { Model } from '../db/data/Model';

export class Book extends Model{
	public uid: string;

	public title: string;
	public uri: string;
}
