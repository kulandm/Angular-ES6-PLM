module.exports = {  // ESLint config
	options: {
		format: require('eslint-tap'),
		outputFile: 'reports/eslint.txt',
	},
	target: ['src/*.js']
};
