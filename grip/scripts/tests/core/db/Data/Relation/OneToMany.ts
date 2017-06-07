
import { Model } from '../../../../../src/core/db/data/Model';
import { OneToMany } from '../../../../../src/core/db/data/Relation/OneToMany';

describe('DB/Relation/OneToMany', () => {

	describe('.uids', () => {
		let owner = new Model("owner");

		it('should return uids of current models', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			expect(relation.uids).toEqual([]);

			relation.set([reverse1, reverse2]);
			expect(relation.uids).toEqual(["reverse1", "reverse2"]);
		});

	});

	describe('set(models: Model[])', () => {
		let owner = new Model("owner");

		it('should set current models', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			expect(relation.uids).toEqual([]);

			relation.set([reverse1, reverse2]);
			expect(relation.get()).toEqual([reverse1, reverse2]);
		});

		it('should attach new models reverse relations', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			let reverseRelation1 = {
				set: () => {},
			};
			let reverseRelation2 = {
				set: () => {},
			};

			reverse1[relation.back] = reverseRelation1;
			reverse2[relation.back] = reverseRelation2;

			spyOn(reverseRelation1, 'set');
			spyOn(reverseRelation2, 'set');

			relation.set([reverse1, reverse2]);

			expect(reverseRelation1.set).toHaveBeenCalledWith(owner);
			expect(reverseRelation2.set).toHaveBeenCalledWith(owner);
		});

		it('should detach old models reverse relations', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			let reverseRelation1 = {
				set: () => {},
				detach: () => {},
			};
			let reverseRelation2 = {
				set: () => {},
				detach: () => {},
			};

			reverse1[relation.back] = reverseRelation1;
			reverse2[relation.back] = reverseRelation2;

			spyOn(reverseRelation1, 'detach');
			spyOn(reverseRelation2, 'detach');

			relation.set([reverse1, reverse2]);
			relation.set([]);

			expect(reverseRelation1.detach).toHaveBeenCalled();
			expect(reverseRelation2.detach).toHaveBeenCalled();
		});

		it('should do nothing if model is added twice', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			relation.set([reverse1, reverse2, reverse1]);

			expect(relation.get()).toEqual([reverse1, reverse2]);
		});

	});

	describe('detach(model: Model)', () => {
		let owner = new Model("owner");

		it('should detach all models if no param specified', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			relation.set([reverse1, reverse2]);
			expect(relation.get()).toEqual([reverse1, reverse2]);

			relation.detach();
			expect(relation.get()).toEqual([]);
		});

		it('should do nothing if model is not contained', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			spyOn(relation, 'set').and.callThrough();

			relation.set([reverse1]);
			expect(relation.set).toHaveBeenCalledTimes(1);

			relation.detach(reverse2);
			expect(relation.set).toHaveBeenCalledTimes(1);
		});

		it('should unset mentioned model', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			relation.set([reverse1, reverse2]);
			expect(relation.get()).toEqual([reverse1, reverse2]);

			relation.detach(reverse2);
			expect(relation.get()).toEqual([reverse1]);
		});

	});

	describe('add(keys: any)', () => {
		let owner = new Model("owner");

		it('should add new models', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			relation.add(reverse1);
			relation.add(reverse2);

			expect(relation.get()).toContain(reverse2);
			expect(relation.get()).toContain(reverse1);
		});

		it('should do nothing if model is added twice', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");

			let reverseRelation = {
				set: () => {},
			};

			reverse1[relation.back] = reverseRelation;
			spyOn(reverseRelation, 'set').and.callThrough();

			relation.add(reverse1);
			expect(reverseRelation.set).toHaveBeenCalledWith(owner);

			relation.add(reverse1);
			expect(reverseRelation.set).toHaveBeenCalledTimes(1);
		});

	});

	describe('by(keys: any)', () => {
		let owner = new Model("owner");

		it('should return only models with matched keys values', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			relation.set([reverse1, reverse2]);

			let filtered = relation.by({ uid: "reverse2" });

			expect(filtered).toBe(reverse2);
			expect(filtered).not.toBe(reverse1);
		});

		it('should match all keys', () => {
			let relation = new OneToMany(owner);
			let reverse1 = new Model("reverse1");
			let reverse2 = new Model("reverse2");

			(<any>reverse1).key = 2;
			(<any>reverse2).key = 2;

			relation.set([reverse1, reverse2]);

			let filtered1 = relation.by({
				uid: "reverse2",
				key: 1,
			});
			expect(filtered1).toBeFalsy();

			let filtered2 = relation.by({
				uid: "reverse2",
				key: 2,
			});
			expect(filtered2).not.toBe(reverse1);
			expect(filtered2).toBe(reverse2);
		});

	});

});
