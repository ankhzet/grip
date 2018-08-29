
import { PortUtils } from '../parcel/PortUtils';
import { Port } from '../parcel/Port';

export class ServerConnector extends Port {
  public uid: string = PortUtils.guid('S');

  notifyDisconnect() {
  }
}
