
import { Model } from '../../../../../src/core/db/data/Model';
import { ManyToOne } from '../../../../../src/core/db/data/Relation/ManyToOne';

describe('DB/Relation/ManyToOne', () => {

	describe('inferReverse(owner: Model)', () => {
		let owner = new Model("owner");

		it('should return pluralized reverse relation name', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");

			expect(relation.back).toEqual('models');
		});

	});

	describe('.uid', () => {
		let owner = new Model("owner");

		it('should return uid of current model reverse relation owner', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");

			expect(relation.uid).toBeFalsy();

			relation.set(reverse1);
			expect(relation.uid).toBe("reverse1");
		});

	});

	describe('set(models: Model[])', () => {
		let owner = new Model("owner");

		it('should set current reverse relation owner model', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");

			relation.set(reverse1);
			expect(relation.get()).toBe(reverse1);
		});

		it('should attach new model reverse relation', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");

			let reverseRelation1 = {
				add: () => {},
			};

			reverse1[relation.back] = reverseRelation1;

			spyOn(reverseRelation1, 'add');

			relation.set(reverse1);
			expect(reverseRelation1.add).toHaveBeenCalledWith(owner);
		});

		it('should detach old model reverse relation', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			let reverseRelation1 = {
				add: () => {},
				detach: () => {},
			};
			let reverseRelation2 = {
				add: () => {},
			};

			reverse1[relation.back] = reverseRelation1;
			reverse2[relation.back] = reverseRelation2;

			spyOn(reverseRelation1, 'detach');

			relation.set(reverse1);
			expect(reverseRelation1.detach).not.toHaveBeenCalled();

			relation.set(reverse2);
			expect(reverseRelation1.detach).toHaveBeenCalled();
		});

		it('should do nothing if model is added twice', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");

			let reverseRelation1 = {
				add: () => {},
			};

			reverse1[relation.back] = reverseRelation1;

			spyOn(reverseRelation1, 'add');

			relation.set(reverse1);
			expect(reverseRelation1.add).toHaveBeenCalledWith(owner);
			expect(relation.get()).toBe(reverse1);

			relation.set(reverse1);
			expect(reverseRelation1.add).toHaveBeenCalledTimes(1);
		});

	});

	describe('detach()', () => {
		let owner = new Model("owner");

		it('should detach from parent model', () => {
			let relation = new ManyToOne(owner);
			let reverse1 = new Model("reverse1");

			relation.set(reverse1);
			expect(relation.get()).toEqual(reverse1);

			relation.detach();
			expect(relation.get()).toBeFalsy();
		});

	});

	describe('add(keys: any)', () => {
		let owner = new Model("owner");

	});

});
