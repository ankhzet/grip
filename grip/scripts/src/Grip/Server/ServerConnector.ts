
import { ServerConnector } from '../../core/client/ServerConnector';
import { SomeAction, SomePacketData } from './actions/Some';
import { Packet } from '../../core/parcel/Packet';

export class GripConnector extends ServerConnector {

	constructor() {
		super('grip');

		this.on(SomeAction, this.some.bind(this));
	}

	some({ data }: SomePacketData, sender, packet: Packet<SomePacketData>) {
		console.log('fired some', data, packet);
	}

}
