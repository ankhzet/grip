
import { Action } from './Action';
import { ClientPort } from '../ClientPort';

export type ActionPerformer<T, A extends Action<T>> = (port: ClientPort, data?: T, error?: string) => any;
