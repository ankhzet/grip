
import { IdentifiableInterface } from './IdentifiableInterface';

export class Model implements IdentifiableInterface {
	uid: string;

	constructor(uid: string) {
		this.uid = uid;
	}
}
