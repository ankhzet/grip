
import { Action } from '../Action';

export interface FirePacketData {
	sender: string;
	event: string;
	payload?: any[];
}

export class FireAction extends Action<FirePacketData> {
	properties = ['sender', 'event', 'payload'];
}
