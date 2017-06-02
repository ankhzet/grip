
module.exports = function (wallaby) {
	return {
		files: [
			'grip/scripts/src/core/**/*.ts',
		],

		tests: [
			'grip/scripts/tests/**/*.ts',
		],

		compilers: {
			'**/*.ts*': wallaby.compilers.typeScript({
				module: "commonjs",
				target: "es5",
				jsx: "react",
			})
		},

		env: {
			type: 'node',
		},

		testFramework: 'jasmine',
	};
};
