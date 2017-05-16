
import { Packet } from "./Packet";

export type ActionHandler<T, S> = (data: T, sender: S, packet: Packet<T>) => any;
