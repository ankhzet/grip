
import { Action } from '../Action';

export interface SendPacketData {
	what: string;
	data?: any;
	payload?: any;
}

export class SendAction extends Action<SendPacketData> {
	properties = ['what', 'data', 'payload'];
}
