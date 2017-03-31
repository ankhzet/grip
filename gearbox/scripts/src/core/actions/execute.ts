
import { Action } from '../parcel/actions/action';

export interface ExecutePacketData {
	plugin: any;
	code: string;
}

export class ExecuteAction extends Action<ExecutePacketData> {
	properties = ['plugin', 'code'];
}
