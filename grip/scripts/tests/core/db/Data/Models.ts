

import { Models } from '../../../../src/core/db/data/Models';
import createSpy = jasmine.createSpy;
import { Model } from '../../../../src/core/db/data/Model';

describe('DB/Models', () => {
	let uid1 = "model1";
	let uid2 = "model2";
	let uid3 = "model3";

	describe('constructor(factory: (uid: string) => M)', () => {

		it('should use passed factory for instances construction', () => {
			let instance = {};
			let factory = createSpy('factory', () => instance).and.callThrough();
			let models = new Models(factory);

			expect(models.create()).toBe(instance);
			expect(factory).toHaveBeenCalled();
		});

	});

	describe('genUID(): string', () => {

		class MockModels extends Models<Model> {

			public genUID() {
				return super.genUID();
			}
		}

		it('should provide unique ids', () => {
			let models = new MockModels(null);
			let uid1, uid2, uid3;

			models.set(new Model(uid1 = models.genUID()));
			models.set(new Model(uid2 = models.genUID()));
			models.set(new Model(uid3 = models.genUID()));

			expect(uid2).not.toEqual(uid1);
			expect(uid3).not.toEqual(uid1);
			expect(uid2).not.toEqual(uid3);
		});

		it('should not reuse old uids if model was deleted', () => {
			let models = new MockModels(null);
			let uid1, uid2, uid3;

			models.set(new Model(uid1 = models.genUID()));
			models.set(new Model(uid2 = models.genUID()));
			models.set(new Model(uid3 = models.genUID()));

			models.remove(uid2);
			expect([uid1, uid2, uid3]).not.toContain(models.genUID());

			models.remove(uid3);
			expect([uid1, uid2, uid3]).not.toContain(models.genUID());
		});

	});

	describe('get(uid: string): Model', () => {

		it('should return instance by uid', () => {
			let instance1 = new Model(uid1);
			let instance2 = new Model(uid2);
			let models = new Models(null);

			models.set(instance1);
			models.set(instance2);

			expect(models.get(uid1)).toBe(instance1);
			expect(models.get(uid2)).toBe(instance2);
			expect(models.get(uid3)).toBeFalsy();
		});

	});

	describe('set(instance: Model): Model', () => {

		it('should set passed instance', () => {
			let instance = new Model(uid1);
			let models = new Models(null);

			expect(models.set(instance)).toBe(instance);
			expect(models.get(uid1)).toBe(instance);
		});

		it('should generate CHANGED event', () => {
			let instance = new Model(uid1);
			let models = new Models(null);
			let spy = createSpy('handler', () => {});
			models.changed(spy);

			models.set(instance);

			expect(spy).toHaveBeenCalledWith([instance.uid], Models.CHANGED);
		});

	});

	describe('remove(uid: string): Model', () => {

		it('should remove instance by uid', () => {
			let instance = new Model(uid1);
			let models = new Models(null);
			models.set(instance);

			expect(models.get(uid1)).toBe(instance);

			models.remove(uid1);
			expect(models.get(uid1)).toBeFalsy();
		});

		it('should generate CHANGED event', () => {
			let instance = new Model(uid1);
			let models = new Models(null);
			let spy = createSpy('handler', () => {});
			models.changed(spy);

			models.set(instance);
			models.remove(uid1);

			expect(spy).toHaveBeenCalledWith([instance.uid], Models.CHANGED);
		});

	});

});
