
import { Packet } from './Packet';
import { ClientPort } from './ClientPort';

export type ActionHandler<T, S extends ClientPort> = (data: T, sender: S, packet: Packet<T>) => any;
