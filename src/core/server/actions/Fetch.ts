
import { CollectionAction, CollectionPacketData } from './Collection';

export interface FetchPacketData extends CollectionPacketData {
}

export class FetchAction extends CollectionAction<FetchPacketData> {
}
