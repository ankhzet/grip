
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';

export interface ReactiveInterface<T extends IdentifiableInterface> {

	perform(uids: string[], action: string, payload?: any);

}
