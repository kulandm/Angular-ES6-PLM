module.exports = {  // Linter config
	main: {},
	es5: {
		src:['tmp/**/*.js', '!tmp/src/**/*.js'],
		options:{
			config: 'plm2jscs.json',
			reporter: 'text',
			reporterOutput: 'reports/jscs.txt'
		}
	},
	es6: {
		src:'tmp/src/**/*.js',
		options:{
			config: 'plm2jscs.json',
			esnext: true,
			reporter: 'text',
			reporterOutput: 'reports/jscs-es6.txt'
		}
	}
};