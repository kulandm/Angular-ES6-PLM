module.exports = function (grunt) {

	// ================== BEGIN CONFIGURATIONS =================
	// Load all grunt packages
	require('load-grunt-tasks')(grunt, {});

	// Load configs from external gruntConfigs
	var configs = require('load-grunt-configs')(grunt, {
		config: {
			src: 'gruntConfigs/*.js'
		}
	});

	configs.constants = {
		plmUnderscoreVersion: '1.0.0'
	};

	// Set version
	configs.version = grunt.template.today('ddmmyyyyhmmss');

	// Reference to NPM package management json
	configs.pkg = grunt.file.readJSON('package.json');

	// Init with the configs defined above
	grunt.initConfig(configs);
	// ================== END CONFIGURATIONS ===================

	// ================== BEGIN TASK DECLARATION ==================
	// Default Job
	grunt.registerTask(
		'default',
		'Compiles SCSS and Index into a Build Folder.',
		['build']
	);

	// Pre-Commit Check
	grunt.registerTask(
		'pre-commit',
		'Builds and then runs lint, gendoc, and tests, for pre-commit check.',
		['build', 'lint', 'gendoc', 'unit']
	);

	// Unit Tests
	grunt.registerTask(
		'unit',
		'Starts karma and runs unit tests once using Chrome',
		['karma']
	);

	// ----------- PLM UI Build Tasks---------------
	grunt.registerTask(
		'build',
		'Compiles JS and SCSS files',
		function () {
			grunt.file.write('settings.txt', 'VERSION=' + configs.pkg.version);
			grunt.task.run('doBuild');
		}
	);

	grunt.registerTask(
		'doBuild',
		'Transpile JS files and Zip up all assets.',
		['clean:build', 'clean:dist', 'traceur:build', 'sass', 'ngtemplates', 'concat', 'copy:build', 'zip', 'copy:dist', 'uglify:dist', 'cssmin:dist']
	);

	// ----------- Code Quality Tool Tasks---------------
	// Documentation
	grunt.registerTask(
		'gendoc',
		'Generates documentation for CPDM scripts.',
		['clean:doc', 'ngdocs']
	);

	// Linting
	grunt.registerTask(
		'lint',
		'Checks for code quality and documentation. ',
		['eslint']
	);
	// ================== END TASK DECLARATION ==================
};
