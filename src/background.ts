
import { Grip } from './Grip/Grip';
import { Nyan } from './core/probe/probe';

((sandbox) => {

	console.log('Grip sandbox:', sandbox);

	(<any>window).Nyan = Nyan;
	(<any>window).Grip = sandbox;

	// (<any>(() => {
	// 	console.log('testing...');
	// 	let uniquenessThroughSet = (array) => [...new Set(array)];
	// 	let uniquenessThroughFilter = (array) => array.filter(function (e, index) { return array.indexOf(e) === index; });
	// 	let uniquenessThroughHash = (array) => {
	// 		let hash = {}, u = array.length;
	//
	// 		for (let e of array) {
	// 			hash[e] = true;
	// 		}
	//
	// 		return Object.keys(hash);
	// 	};
	// 	let uniquenessThroughSplice = (array) => {
	// 		let b = array.length, c, u = b;
	//
	// 		while (c = --b) {
	// 			while (c--) {
	// 				array[b] !== array[c] || array.splice(c, 1);
	// 			}
	// 		}
	//
	// 		return array;
	// 	};
	//
	// 	let instantiator = (length) => {
	// 		let portion = length / 10;
	// 		return (new Array(length)).join('.').split('.').map(() => ~~(Math.random() * (length - portion) + portion));
	// 	};
	//
	// 	return Nyan({
	// 		tests: {
	// 			filter: {
	// 				test: uniquenessThroughFilter,
	// 				setup: instantiator,
	// 			},
	// 			splice: {
	// 				test: uniquenessThroughSplice,
	// 				setup: instantiator,
	// 			},
	// 			set: {
	// 				test: uniquenessThroughSet,
	// 				setup: instantiator,
	// 			},
	// 			hash: {
	// 				test: uniquenessThroughHash,
	// 				setup: instantiator,
	// 			},
	// 		},
	// 		steps: [100, 1000, 10000],
	// 		probes: 1,
	// 	});
	// })()).describe((row) => console.log(row));

})(new Grip());

