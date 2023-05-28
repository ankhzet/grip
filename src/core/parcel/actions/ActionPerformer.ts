
import { Action } from './Action';
import { Port } from '../Port';

export type ActionPerformer<T, A extends Action<T>> = (port: Port, data?: T, error?: string) => any;
