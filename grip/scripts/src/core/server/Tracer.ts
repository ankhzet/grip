
import { ClientPort } from '../parcel/ClientPort';
import { Packet } from '../parcel/Packet';

export class Tracer {
	private static instance: Tracer;
	private index: number = 0;

	private trace(message: string, port: ClientPort, packet: Packet<any>) {
		return this.log({
			index: this.index++,
			timestamp: new Date(),
			port,
			packet,
			message,
			stack: this.processStackTrace((new Error()).stack)
		});
	}

	private processStackTrace(stack) {
		return stack.split('\n')
			.slice(1)
			.map((line) => {
				return '\t' + line.replace(/^\s*at\s*/, '').trim();
			}).filter((line) => {
				return !line.match(/(Tracer|Function)\.trace/);
			}).join(
				'\n'
			)
		;
	}

	private log(entry: TraceEntry) {
		console.log(
			`[${entry.index} - ${Tracer.dateStr(entry.timestamp)}] [${entry.port.uid}]${entry.message}[${(entry.packet.sender == entry.port.uid) ? '*:????' : entry.packet.sender}] PROTOCOL TRACE:`,
			entry.packet, '\n',
			entry.stack
		);

		return entry;
	}

	static trace(message: string, port: ClientPort, packet: Packet<any>) {
		if (!this.instance) {
			this.instance = new Tracer();
		}

		return this.instance.trace(message, port, packet);
	}

	static dateStr(time: Date) {
		return time.toISOString().replace(/[TZ]|\..*/g, ' ').trim();
	}
}

interface TraceEntry {
	index: number;
	timestamp: Date;
	message: string;
	port: ClientPort;
	packet: Packet<any>;
	stack: string
}
