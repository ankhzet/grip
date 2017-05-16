
import { ClientPort } from './core/parcel/parcel';
import { GripActions } from './core/actions/actions';
import { Packet } from './core/parcel/packet';
import { ExecuteAction, ExecutePacketData } from './core/actions/execute';

class ConnectorChannel extends ClientPort {

	constructor() {
		super('grip');
		this.on(ExecuteAction, this.executed.bind(this));

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	notifyDisconnect() {
		if (!this.port)
			return;

		// Actions.postpone(this, 'clear');
	}

}

((channel, interval) => {
	console.log('Injecting Grip...');
	window.onbeforeunload = function (e) {
		return channel.notifyDisconnect();
	};

	let timer;
	let checker = () => {
		let prev = channel.touched;
		let delta = (+new Date) - prev;
		if ((delta > interval) || !prev) {
			if (prev)
				console.log(`Last request ${delta} msec ago (${interval} delay for reconnect)`);

			if (!channel.rebind()) {
				console.log('Failed to connect to extension, reloading');
				window.location.reload();
			}
		}

		if (interval && !timer)
			timer = window.setInterval(checker, interval / 10);
	};

	if (document.readyState === 'complete') {
		checker();
	} else
		window.onload = () => {
			checker();
		}

})(new ConnectorChannel(), 0);// 60 * 1000);
