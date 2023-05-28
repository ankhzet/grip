
let probe = ({ test, setup, step}, times) => {
	let got = 0;

	for (let i = 0; i < times; i++) {
		let data = setup(step);

		let n = +new Date();
		let processed = test(data);
		got += (+new Date()) - n;

		setup(data, processed || true);
	}

	return [got, got/ times];
};

export let Nyan = ({ tests, steps, probes }) => {
	let statistics = {};
	let from = +new Date();

	for (let step of steps) {
		for (let name of Object.keys(tests)) {
			let { test, setup } = tests[name];
			let chunk = (statistics[name] || (statistics[name] = {}));

			chunk[step] = probe({
				test,
				setup,
				step,
			}, probes);
		}
	}
	let to = +new Date();

	Object.defineProperty(statistics, 'describe', {
		enumerable: false,

		value: function (callback) {
			let rows = [];
			for (let test of Object.keys(this)) {
				rows.push(`Test: ${test}`);
				let steps = Object.keys(this[test]).map(Number).sort();

				for (let step of steps) {
					let sample = this[test][step];
					rows.push(`\t${step} samples: ${sample[1]}/${probes} msec\n\t\tavg: ${sample[0]}`);
				}

				let degradation = [];
				let current = 1, i = 0, step;

				while (step = steps[i++]) {
					degradation.push(step / current);
					current = step;
				}

				rows.push(`\tDegradation: ${degradation.map((v, i) => i ? 'x' + v : v).join('->')}`);
			}
			rows.push(`Total: ${to - from} msec`);

			return callback ? rows.map(callback) : rows;
		},
	});

	return statistics;
};
