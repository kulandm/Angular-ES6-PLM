module.exports = {  // Watch files for any changes
	scripts: {
		files: ['src/**/*', 'app/scripts/**/*', 'app/components/**/*'],
		tasks: ['default']
	},
	css: {
		files: ['app/css/**/*'],
		tasks: []
	},
	scss: {
		files: ['app/scss/**/*'],
		tasks: ['sass']
	},
	templates: {
		files: [
			'app/templates/**/*',
			'app/partials/**/*',
			'app/index.tpl.html'
		],
		tasks: []
	},
	tests: {
		files: ['tests/**/*'],
		tasks: []
	},
	assets: {
		files: [
			'Gruntfile.js',
			'app/fonts/**/*.js',
			'app/images/**/*.js',
			'app/translations/**/*'
		],
		tasks: []
	}
};
