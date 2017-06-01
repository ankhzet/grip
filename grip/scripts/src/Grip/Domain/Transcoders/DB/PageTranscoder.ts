
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { Page } from '../../Collections/Page/Page';

export class PageTranscoder implements TranscoderInterface<Page, {}> {

	public encode(page: Page): any {
		return page && ObjectUtils.transform(page, (value, prop) => {
			return [value, prop];
		});
	}

	public decode(data: any, target?: Page): Page {
		return data && ObjectUtils.transform(data, (value, prop, has) => {
			return [value, prop];
		}, target || new Page(data.uid));
	}
}
