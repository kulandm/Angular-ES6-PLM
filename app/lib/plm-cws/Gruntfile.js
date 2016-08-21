module.exports = function (grunt) {
	// ================== BEGIN CONFIGURATIONS ==================
	// load all grunt packages
	require('load-grunt-tasks')(grunt, {});

	//Load configs from external gruntConfigs
	var configs = require('load-grunt-configs')(grunt, {
		config: {
			src: "gruntConfigs/*.js"
		}
	});

	//Set version
	configs.version = grunt.template.today('ddmmyyyyhmmss');

	// Reference to NPM package management json
	configs.pkg = grunt.file.readJSON('package.json');

	configs.constants = {
		plmUnderscoreVersion: '1.0.0'
	};

	// Reference to machine specific json
	//configs.localConfig = grunt.file.exists('localConfig.yaml') ? grunt.file.readYAML('localConfig.yaml') : grunt.file.readYAML('defaultConfig.yaml');

	//Init with the configs defined above
	grunt.initConfig(configs);
	// ================== END CONFIGURATIONS ==================


	// ================== BEGIN TASK DECLARATION ==================
	// Default Job
	grunt.registerTask(
		'default',
		'Compiles scss and index.html into app directory.', ['build']
	);

	// Pre-Commit Check
	grunt.registerTask(
		'pre-commit',
		'Builds and then runs lint, gendoc, and tests, for pre-commit check.', ['build', 'lint', 'gendoc', 'test']
	);

	// Unit Tests
	grunt.registerTask(
		'test',
		'Runs both unit and view tests', ['karma']
	);

	// ----------- PLM UI Build Tasks---------------
	grunt.registerTask(
		'build',
		'Compiles scss and index.html into app directory.',
		function () {
			grunt.file.write('settings.txt', 'VERSION=' + configs.pkg.version);
			grunt.task.run('doBuild');
		}
	);
	grunt.registerTask(
		'doBuild',
		'Transpile JS files and Zip up all assets.', ['clean:build','traceur:build','ngtemplates','concat','copy:build','zip','copy:dist']
	);

	// ----------- Code Quality Tool Tasks---------------
	// Documentation
	grunt.registerTask(
		'gendoc',
		'Generates documentation for scripts.', ['clean:doc', 'ngdocs']
	);

	// Linting
	grunt.registerTask(
		'lint',
		'Checks for code quality and documentation.', ['eslint']
	);
	// ================== END TASK DECLARATION ==================
};