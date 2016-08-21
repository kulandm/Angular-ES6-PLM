module.exports = function (grunt) {

	// load all grunt packages
	require('load-grunt-tasks')(grunt, {
		// pattern: ['grunt-*','karma-*'], // defaults to grunt-*
		// config: 'path to package.json',
		// scope: ['dependencies', 'devDependencies', 'peerDependencies']
	});

	var configs = {
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['PLM360*/*.js'],
				dest: 'plm-commons.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'plm-commons.min.js': ['plm-commons.js']
				}
			}
		}
	};

	grunt.initConfig(configs);

	// Build Tasks
	grunt.registerTask(
		'plm-commons-build',
		'Concatenate all files into one single file.  Generates two versions: minimized and unminimized.  ',
		['concat:dist', 'uglify:dist']
	);

	grunt.registerTask(
		'default',
		'Default task is plm-commons-build',
		['plm-commons-build']
	);
};
