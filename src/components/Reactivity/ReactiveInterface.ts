
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';
import { PackageInterface } from '../../core/db/data/PackageInterface';

export interface ReactiveInterface<T extends IdentifiableInterface> {

	perform(uids: string[], action: string, payload?: any): Promise<PackageInterface<T>>;

}
