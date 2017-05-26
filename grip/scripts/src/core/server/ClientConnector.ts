
import { Port } from '../parcel/Port';
import { PortUtils } from '../parcel/PortUtils';

export class ClientConnector extends Port {
	public uid: string = PortUtils.guid('C');

}
