// ESLint config
module.exports = {
	options: {
		format: require('eslint-tap'),
		outputFile: 'reports/eslint.txt'
	},
	target: ['src/**/*.js']
};
