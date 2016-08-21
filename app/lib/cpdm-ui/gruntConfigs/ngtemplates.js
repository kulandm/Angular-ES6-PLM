// Configuration for building angular templates files to build directory.
module.exports = {
	'cpdm': {
		cwd: 'src',
		src: ['components/**/**.html'],
		dest: 'build/templates.js',
		options: {
			htmlmin: {
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeComments: true,
				keepClosingSlash: true
			},
			bootstrap: function (module, script) {
				return 'angular.module("com/autodesk/cpdm.js", []).run(["$templateCache", function($templateCache) {' + script + '}]);';
			}
		}
	}
};
