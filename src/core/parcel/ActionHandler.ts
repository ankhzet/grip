
import { Packet } from './Packet';
import { Port } from './Port';

export type ActionHandler<T, S extends Port> = (data: T, sender: S, packet: Packet<T>) => any;
