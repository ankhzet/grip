
let probe = (f, times) => {
	let n = +new Date(), got;

	for (let i = 0; i < times; i++) f();

	got = (+new Date()) - n;

	return [got, got/ times];
};

export let Nyan = ({ tests, steps, probes }) => {
	let statistics = {};

	for (let length of steps) {

		let sample = (new Array(length)).join('.').split('.').map(() => ~~(Math.random() * 899 + 100));

		for (let test of Object.keys(tests)) {
			let [total, avg] = probe(tests[test](sample), probes);

			let chunk = statistics[test] || (statistics[test] = {});
			chunk[length] = [avg, total];
		}
	}

	Object.defineProperty(statistics, 'describe', {
		enumerable: false,
		value: function (callback) {
			let rows = [];
			for (let test of Object.keys(this)) {
				rows.push(`Test: ${test}`);

				for (let length of Object.keys(this[test])) {
					let sample = this[test][length];
					rows.push(`\t${length} samples: ${sample[1]}/${probes} msec\n\t\tavg: ${sample[0]}`);
				}
			}

			return callback ? rows.map(callback) : rows;
		},
	});

	return statistics;
};
