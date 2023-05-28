
import { Action } from '../Action';

export interface HandshakePacketData {
	uid: string;
}

export class HandshakeAction extends Action<HandshakePacketData> {
	properties: string[] = ['uid'];
}

