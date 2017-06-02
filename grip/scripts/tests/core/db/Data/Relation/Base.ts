
import { Base } from '../../../../../src/core/db/data/Relation/Base';

describe('DB/Relation/Base', () => {

	describe('constructor()', () => {

		class Sample {

		}

		class Mock extends Base<any, any> {
			encode(store: any) {
				throw new Error("Method not implemented.");
			}

			decode(store: any, value: any): Base<any, any> {
				throw new Error("Method not implemented.");
			}

		}

		it('should infer reverse relation name from owner class name', () => {
			let owner = new Sample();
			let relation = new Mock(owner);

			expect(relation.back).toBe('sample');
		});

	});

});
