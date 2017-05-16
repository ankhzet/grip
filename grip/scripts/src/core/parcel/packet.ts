
export interface Packet<T> {
	sender: string;
	action: string;

	data: T;
	error: any;
}

export class PacketUtil {
	private static APPENDAGE = '__appendage';

	static append<T>(dst: Packet<T>, appendage): Packet<T> {
		dst[this.APPENDAGE] = appendage;
		return dst;
	}

	static extract<T>(src: Packet<T>): [any, Packet<T>] {
		let appendage = src[this.APPENDAGE];
		delete src[this.APPENDAGE];
		return [appendage, src];
	}

}
