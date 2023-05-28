
import { ObjectUtils } from '../../../../core/utils/ObjectUtils';
import { IdentifiableInterface } from '../../../../core/db/data/IdentifiableInterface';
import { TranscoderInterface } from '../../../../core/server/TranscoderInterface';
import { Models } from '../../../../core/db/data/Models';
import { Base } from '../../../../core/db/data/Relation/Base';

export class BaseTranscoder<S extends IdentifiableInterface> implements TranscoderInterface<S, {}> {
	private store: Models<S>;

	constructor(store: Models<S>) {
		this.store = store;
	}

	public encode(model: S): any {
		return model && ObjectUtils.transform(model, this.encodeProperty.bind(this, model));
	}

	public decode(data: any, target?: S): S {
		if (!data) {
			return data;
		}

		target = target || this.store.create();

		return ObjectUtils.transform(data, this.decodeProperty.bind(this, target), target);
	}

	protected encodeProperty(model: S, value, prop): [any, string] {
		if (value instanceof Base) {
			value = value.encode(this.store);
		}

		return [value, prop];
	}

	protected decodeProperty(model: S, value, prop, has): [any, string] {
		if (has instanceof Base) {
			value = has.decode(this.store, value);
		}

		return [value, prop];
	}
}
