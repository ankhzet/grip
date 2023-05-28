
import { StringUtils } from '../../../src/core/utils/StringUtils';

describe('StringUtils', () => {

	describe('::extract()', () => {

		it('should convert uppercase to dash-lower case', () => {
			expect(StringUtils.camelCaseToHyphenCase('CamelCaseString')).toEqual('camel-case-string');
		});

		it('should hyphenize single chars', () => {
			expect(StringUtils.camelCaseToHyphenCase('CAMEL')).toEqual('c-a-m-e-l');
		});

	});

});
