
import { IdentifiableInterface } from './IdentifiableInterface';

export interface PackageInterface<T extends IdentifiableInterface> {
	[uid: string]: T;
}
