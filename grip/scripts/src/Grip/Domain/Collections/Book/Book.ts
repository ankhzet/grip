
import { Model } from '../../../../core/db/data/Model';
import { TocInterface } from '../../TocInterface';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { Matchers } from '../../Matching/Matchers';
import { Utils } from '../../../Client/Utils';

const EMPTY_MATCHER = `

({ grip, $ }) => {
	class Matcher {
		constructor(context) {
			this.context = context;
			this.pattern = /^.+$/;
		}

		match(content) {
			throw new Error('Not implemented.');
		}

	}

	return (context) => new Matcher(context);
};
`;

export class Book extends Model {
	public uid: string;

	public title: string;
	public uri: string;
	public toc: TocInterface = {};
	public contents: {[page: number]: string} = {};

	public cached: number;

	public matchers: Matchers = Matchers.create({ Utils, $: jQuery }, Book.matchers);

	static MATCHER_TOC = 'toc';
	static MATCHER_PAGE= 'page';

	static matchers = ObjectUtils.compose([
		[Book.MATCHER_TOC , EMPTY_MATCHER],
		[Book.MATCHER_PAGE, EMPTY_MATCHER],
	]);

	public getPageUri(page: number): string {
		return Object.keys(this.toc)[page];
	}

	public getPageTitle(page: number): string {
		let uri = this.getPageUri(page);

		return (
			uri
				? this.toc[uri]
				: uri
		);
	}

	public getPageContents(page: number): string {
		return this.contents[page];
	}
}
