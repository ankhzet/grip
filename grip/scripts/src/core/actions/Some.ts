
import { Action } from "../parcel/actions/Action";

export interface SomePacketData {
	data?: any;
}

export class SomeAction extends Action<SomePacketData> {
	properties = ['data'];
}
