
import { ClientPort } from './core/parcel/ClientPort';
// import {GripActions} from "./core/actions/actions";
// import { GripActions } from './core/actions/actions';
// import { Packet } from './core/parcel/packet';

class ConnectorChannel extends ClientPort {

	constructor() {
		super('grip');
		// this.on(SomeAction, this.some.bind(this));

		if (!this.rebind()) {
			throw new Error('Failed to connect to background script');
		}
	}

	notifyDisconnect() {
		if (!this.port)
			return;

		// BaseActions.postpone(this, 'clear');
	}

	// some(sender, { data }: SomeData, packet: Packet<SomePacketData>) {
	// 	console.log('fired some', data, packet);
	// 	let reaction = (data) => GripActions.react(this, data);
	// 	$(this).click(() => {
	// 		reaction($(this).data('data'));
	// 	});
	// }

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
