
import { PackageInterface } from '../../core/db/data/PackageInterface';
import { IdentifiableInterface } from '../../core/db/data/IdentifiableInterface';

export interface ManagerInterface<T extends IdentifiableInterface> {

	get(uids?: string[]): Promise<PackageInterface<T>>;
	set(values: T[], silent?: boolean): Promise<string[]>;
	remove(uids: string[]): Promise<string[]>;

}
