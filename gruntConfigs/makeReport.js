module.exports = {  // protractor coverage report config
	src: 'test/coverage/e2e/*.json',
	options: {
		type: 'lcov',
		dir: 'test/coverage/e2e/reports',
		print: 'detail'
	}
};