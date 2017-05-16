
import { ClientsPool } from "../../core/parcel/ClientsPool";
import { GripClient } from "./Client";
import { GripActions } from "../../core/actions/GripActions";
import { ActionHandler } from "../../core/parcel/ActionHandler";

export class ContentedClientsPool extends ClientsPool<GripClient> {

	some(data?: any) {
		return this.broadcast(GripActions.some, data);
	}

}

export type ClientActionHandler<T> = ActionHandler<T, GripClient>;
