
import { Model } from '../../../../core/db/data/Model';

export class Page extends Model {

	public uid: string;

	public title: string;
	public uri: string;
	public contents: string;
	public state: number;

	public cached: number;

}
