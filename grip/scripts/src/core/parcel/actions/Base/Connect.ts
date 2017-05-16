
import { Action } from '../Action';

export interface ConnectPacketData {
	uid: string;
}

export class ConnectAction extends Action<ConnectPacketData> {
	properties = ['uid'];
}

