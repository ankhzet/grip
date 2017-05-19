
import { ServerConnector } from './ServerConnector';

export class Injector {
	private connector: ServerConnector;
	private watch: number = 1000 * 60;
	private aggressive: boolean = true;

	constructor(connector: ServerConnector) {
		this.connector = connector;

		window.onbeforeunload = () => {
			return this.connector.notifyDisconnect();
		};

		if (document.readyState === 'complete') {
			this.check();
		} else {
			window.onload = this.check.bind(this);
		}
	}

	check() {
		let last = this.actual();
		let age = this.age();
		let watch = this.watch;
		let aged = age >= watch;

		if (aged || !last) {
			this.log(`Last request ${age} msec ago (${watch} delay for reconnect)`);

			if (!this.connector.rebind()) {
				if (this.aggressive) {
					this.log('Failed to connect to extension, reloading');

					window.location.reload();
				}
			}
		}

		if (watch) {
			window.setTimeout(this.check.bind(this), watch / 10);
		}
	}

	actual() {
		return +this.connector.touched;
	}

	age() {
		return this.actual() ? (+new Date) - this.actual() : -1;
	}

	log(message?: any, ...args) {
		console.log(`[${this.connector.name.toLocaleUpperCase()}] ${message}`, ...args);
	}
}
