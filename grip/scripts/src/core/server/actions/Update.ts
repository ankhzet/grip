
import { CollectionAction, CollectionPacketData } from './Collection';

export interface UpdatePacketData extends CollectionPacketData {
}

export class UpdateAction extends CollectionAction<UpdatePacketData> {
}
