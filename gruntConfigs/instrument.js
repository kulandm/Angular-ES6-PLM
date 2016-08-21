module.exports = {  // instrument config
	files: ['app/build/**/*.js', 'app/components/**/*.js', 'app/scripts/**/*.js'],
	options: {
		lazy: true,
		basePath: "instrumented"
	}
};