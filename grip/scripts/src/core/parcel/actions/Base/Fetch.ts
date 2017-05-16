
import { Action } from '../Action';

export interface FetchPacketData {
	what: string;
	query?: any;
	payload?: any;
}

export class FetchAction extends Action<FetchPacketData> {
	properties = ['what', 'query', 'payload'];
}
