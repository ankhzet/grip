
import { ObjectUtils } from '../../../src/core/utils/ObjectUtils';

describe('ObjectUtils', () => {

	describe('::extract()', () => {
		let source = {
			k1: 1,
			k2: 2,
			k3: 3,
			k4: 4,
		};

		it('should copy whole object if no keys specified', () => {
			let extracted = ObjectUtils.extract<any>(source);

			expect(extracted).toEqual(source);
		});

		it('should copy only specified keys if any', () => {
			let o2 = {
				k2: 2,
				k4: 4,
			};
			let keys = Object.keys(o2);

			let extracted = ObjectUtils.extract(source, keys);

			expect(extracted).toEqual(<any>o2);
		});

		it('should reuse passed target object', () => {
			let o2 = {
				k2: 2,
				k4: 4,
			};
			let o3 = {
				k6: 6,
			};
			let keys = Object.keys(o2);
			let extracted = ObjectUtils.extract<any>(source, keys, o3);

			expect(extracted).toBe(o3);
		});

		it('should override passed target properties', () => {
			let o2 = {
				k4: 6,
			};
			expect(o2.k4).not.toBe(source.k4);

			let extracted = ObjectUtils.extract<any>(source, Object.keys(o2), o2);

			expect(extracted.k4).toBe(source.k4);
		});

	});

	describe('::patch()', () => {

		it('should add missing properties', () => {
			let source = {
				k1: 1,
			};
			let patch = {
				k2: 2,
			};

			expect(ObjectUtils.patch(source, patch)).toEqual({
				k1: 1,
				k2: 2,
			});
		});

		it('should keep properties if new is not specified', () => {
			let source = {
				k1: 1,
			};
			let patch = {
			};

			expect(ObjectUtils.patch(source, patch)).toEqual({
				k1: 1,
			});
		});

		it('should overwrite present properties', () => {
			let source = {
				k1: 1,
				k2: 2,
				k3: 3,
			};
			let patch = {
				k2: -2,
				k3: undefined,
			};

			expect(ObjectUtils.patch(source, patch)).toEqual({
				k1: 1,
				k2: -2,
				k3: undefined,
			});
		});

		it('should patch child objects', () => {
			let source = {
				k1: 1,
				k2: {
					k3: 3,
				},
			};
			let patch = {
				k2: {
					k6: 6,
				},
			};

			expect(ObjectUtils.patch(source, patch)).toEqual({
				k1: 1,
				k2: {
					k3: 3,
					k6: 6,
				},
			});
		});

		it('should replace non-objects if needed', () => {
			let source = {
				k1: 1,
			};
			let patch = {
				k1: {
					k2: 2,
				},
			};

			expect(ObjectUtils.patch(source, patch)).toEqual({
				k1: {
					k2: 2,
				},
			});
		});

	});

	describe('::compose()', () => {

		it('should do one-key composition', () => {
			expect(ObjectUtils.compose('key', 'value')).toEqual({
				key: 'value',
			})
		});

		it('should map pairs array to object composition', () => {
			expect(ObjectUtils.compose([['key1', 'value1'], ['key2', 'value2']])).toEqual({
				key1: 'value1',
				key2: 'value2',
			})
		});

	});

	describe('::transform()', () => {

		it('should call transformation function for each property', () => {
			let source = {
				k1: 1,
				k2: 2,
			};
			let transformer = jasmine.createSpy('s', (v, p) => [v, p]).and.callThrough();

			let transformed = ObjectUtils.transform(source, transformer);

			expect(transformer).toHaveBeenCalledWith(1, 'k1', undefined);
			expect(transformer).toHaveBeenCalledWith(2, 'k2', undefined);
			expect(transformed).toEqual({
				k1: 1,
				k2: 2,
			});
		});

	});

	it('should ignore skippable values', () => {
		let source = {
			k1: 1,
			k2: 2,
			k3: 3,
		};
		let transformer = jasmine.createSpy('s', (value, key) => {
			if (key === 'k2') {
				return;
			}

			return [value, key];
		}).and.callThrough();

		let transformed = ObjectUtils.transform(source, transformer);

		expect(transformed.k2).toBeUndefined();
	});

});
