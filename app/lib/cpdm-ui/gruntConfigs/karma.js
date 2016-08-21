module.exports = (function () {
	return {
		main: { // Runs the test once against Chrome
			configFile: 'karma.conf.js',
			autoWatch: false,
			singleRun: true
		}
	};
})();
