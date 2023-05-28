
import { OneToOne } from '../../../../../src/core/db/data/Relation/OneToOne';
import { Model } from '../../../../../src/core/db/data/Model';

describe('DB/Relation/OneToOne', () => {


	describe('.uid', () => {
		let owner = new Model("owner");

		it('should return uid of current model', () => {
			let relation = new OneToOne(owner);
			let reverse = new Model("reverse");

			expect(relation.uid).not.toBe("reverse");

			relation.set(reverse);
			expect(relation.uid).toBe("reverse");
		});

	});

	describe('set(model)', () => {
		let owner = new Model("owner");

		it('should set owned model', () => {
			let relation = new OneToOne(owner);
			let reverse = new Model("reverse");

			relation.set(reverse);

			expect(relation['model']).toBe(reverse); // todo: private access hack
		});

		it('should apply back references for attached model', () => {
			let relation = new OneToOne(owner);
			let reverse = new Model("reverse");
			let reverseRelation = {
				set: () => {},
			};

			reverse[relation.back] = reverseRelation;
			spyOn(reverseRelation, 'set');

			relation.set(reverse);

			expect(relation['model']).toBe(reverse);
			expect(reverseRelation.set).toHaveBeenCalledWith(owner);
		});

		it('should not apply references again for same instance', () => {
			let relation = new OneToOne(owner);
			let reverse = new Model("reverse");
			let reverseRelation = {
				set: () => {},
			};

			reverse[relation.back] = reverseRelation;
			spyOn(reverseRelation, 'set');

			relation.set(reverse);
			relation.set(reverse);
			expect(reverseRelation.set).toHaveBeenCalledTimes(1);
		});

		it('should detach from old instance', () => {
			let relation = new OneToOne(owner);
			let reverse1 = new Model("reverse1");
			let reverseRelation1 = {
				set: () => {},
				detach: () => {}
			};

			reverse1[relation.back] = reverseRelation1;
			spyOn(reverseRelation1, 'detach');

			relation.set(reverse1);
			relation.set(null);
			expect(reverseRelation1.detach).toHaveBeenCalledTimes(1);
		});

	});

	describe('detach()', () => {
		let owner = new Model("owner");

		it('should detach old instance', () => {
			let relation = new OneToOne(owner);
			let reverse = new Model("reverse");

			relation.set(reverse);
			expect(relation.get()).toBe(reverse);

			relation.detach();
			expect(relation.get()).not.toBe(reverse);
		});

	});

});
