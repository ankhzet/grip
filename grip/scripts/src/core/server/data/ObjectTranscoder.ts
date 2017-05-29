
import { TranscoderInterface } from '../TranscoderInterface';
import { ObjectUtils } from '../../utils/ObjectUtils';

export class ObjectTranscoder<S, D> implements TranscoderInterface<S, D> {

	encode(model: S): D {
		return model && ObjectUtils.transform(model, (value, prop) => (
			(!prop.match(/^_/) && [
				(typeof value === 'object')
					? this.encode(value)
					: value,
				prop,
			])
		));
	}

	decode(data: D, use?: S): S {
		return (
			use
				? ObjectUtils.patch(use, data)
				: <any>data
		);
	}

}
