
import { Model } from '../../core/db/data/Model';
import { TocInterface } from './TocInterface';
import { TocMatcherInterface } from './TocMatcherInterface';
import { Matcher } from './Matcher';

export class Book extends Model{
	public uid: string;

	public title: string;
	public uri: string;
	public toc?: TocInterface;

	public matchers = {
		toc: new Matcher<TocMatcherInterface, Book>(),
	};

}
