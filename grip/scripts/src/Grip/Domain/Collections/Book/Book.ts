
import { Model } from '../../../../core/db/data/Model';
import { TocInterface } from '../../TocInterface';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { EMPTY_MATCHER, Matchers } from '../../Matching/Matchers';
import { Utils } from '../../../Client/Utils';
import { Page } from '../Page/Page';
import { OneToMany } from '../../../../core/db/data/Relation/OneToMany';

export class Book extends Model {
	public uid: string;

	public title: string;
	public uri: string;
	public toc: TocInterface = {};

	public pages = OneToMany.attach<Book, Page>(this);
	public cached: number;

	public matchers = new BookMatchers();

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

	public getPageContents(uid: string): string {
		let page = this.pages.by({ uid });

		return (
			page
				? page.contents
				: null
		);
	}
}

export class BookMatchers extends Matchers {
	static TOC = 'toc';
	static PAGE= 'page';

	constructor() {
		super({ Utils, $: jQuery }, ...Object.keys(BookMatchers.matchers));
	}

	static matchers = ObjectUtils.compose([
		[BookMatchers.TOC , EMPTY_MATCHER],
		[BookMatchers.PAGE, EMPTY_MATCHER],
	]);
}
