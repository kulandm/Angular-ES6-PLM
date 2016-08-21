module.exports = {  // ESLint config
	options: {
		format: require('eslint-tap'),
		outputFile: 'reports/eslint.txt'
	},
	target: [
		'src/**/*.js',
		'app/scripts/**/*.js',
		'app/components/**/*.js',
		'test/automation/**/*.js',
		'test/unit/*Spec/*.js'
	]
};
