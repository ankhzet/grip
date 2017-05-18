
import { Model } from '../../core/db/data/Model';
import { TocInterface } from './TocInterface';
import { MatcherInterface } from './MatcherInterface';
import { Matcher } from './Matcher';

export class Book extends Model{
	public uid: string;

	public title: string;
	public uri: string;
	public toc?: TocInterface = {};

	public matchers = {
		toc: new Matcher<MatcherInterface<string, TocInterface>, TocInterface>(),
		page: new Matcher<MatcherInterface<string, string>, string>(),
	};

}
