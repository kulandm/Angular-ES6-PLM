module.exports = {  // JSdoc config - currently not used
	dist: {
		src: [
			'app/scripts/**/*.js',
			'test/unit/**/*.js',
			'test/e2e/**/*.js'
		],
		options: {
			destination: 'doc'
		}
	}
};