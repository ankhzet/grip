
export abstract class Port {
	port: chrome.runtime.Port;
	name: string;

	constructor(name: string) {
		this.name = Port.portName(name);
	}

	static portName(port: string): string {
		return `${port}-data-channel`;
	}

	public static guid(prefix: string) {
		return prefix + ':' + `${~~(1000 + Math.random() * 8999)}`.replace(/^0\./, '');
	}

}
