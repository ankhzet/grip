
export interface Packet<T> {
	sender: string;
	action: string;

	data: T;
	error: any;
}
