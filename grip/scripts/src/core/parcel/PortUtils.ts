
export class PortUtils {

	static portName(port: string): string {
		return `${port}-data-channel`;
	}

	public static guid(prefix: string) {
		return prefix + ':' + `${~~(1000 + Math.random() * 8999)}`.replace(/^0\./, '');
	}

	static rename(uid: string, to: string) {
		return uid.replace(/(\d+)$/, to.replace(/^[^\d]*/, ''));
	}

}
