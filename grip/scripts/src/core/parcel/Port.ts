
export abstract class Port {
	port: chrome.runtime.Port;
	name: string;

	constructor(name: string) {
		this.name = Port.portName(name);
	}

	static portName(port: string): string {
		return `${port}-data-channel`;
	}

}
