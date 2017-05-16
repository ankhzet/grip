
import { ActionConstructor } from "./Action";

export interface RepositoryInterface {

	get<T>(constructor: ActionConstructor<T>);

}
