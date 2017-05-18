
import { TranscoderInterface } from './TranscoderInterface';

export class TranscoderAggregate<S, T> implements TranscoderInterface<S, T> {
	private transcoders: TranscoderInterface<any, any>[];

	public add(transcoder: TranscoderInterface<any, any>): number {
		return this.transcoders.push(transcoder);
	}

	encode(model: S): T {
		let result: any = model;

		for (let transcoder of this.transcoders) {
			result = transcoder.encode(result);
		}

		return result;
	}

	decode(data: T): S {
		let result: any = data;

		for (let transcoder of this.transcoders.reverse()) {
			result = transcoder.decode(result);
		}

		return result;
	}

}
