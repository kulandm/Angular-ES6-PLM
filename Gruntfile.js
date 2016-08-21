module.exports = function (grunt) {
	// ================== BEGIN CONFIGURATIONS ==================
	// load all grunt packages
	require('load-grunt-tasks')(grunt, {});

	var projectProps = grunt.file.readYAML('projectProperties.yaml');
	// Define Certain Project Paths and Tasks by the variables (defined in projectProperties.yaml)
	var projectTitle = projectProps.Title + '';
	var projectName = projectProps.Name + '';
	var projectAbbrv = projectProps.Abbrv + '';
	var cpdmUIFiles = projectProps['cpdm-ui-files'];
	var projectTaskPrefix = projectAbbrv + '-';
	var hostname = require('os').hostname();
	var localTenant = 'SELENIUM';

	// Load configs from external gruntConfigs
	var configs = require('load-grunt-configs')(grunt, {
		config: {
			src: 'gruntConfigs/*.js'
		}
	});

	// Define internal constants
	configs.constants = {
		projectTitle: projectTitle,
		projectName: projectName,
		projectAbbrv: projectAbbrv,
		projectTaskPrefix: projectTaskPrefix,
		hostname: hostname,
		localTenant: localTenant
	};

	// Set version
	configs.version = grunt.template.today('ddmmyyyyhmmss');

	// A temp file for processing
	configs.tmpIndexFile = 'processed-index.tpl.html';

	// Template file name
	configs.tplFile = 'index.tpl.html';

	// Template file name prod
	configs.tplFileProd = 'index.mintpl.html';

	// Main index file
	configs.indexFile = 'index.html';

	// Reference to NPM package management json
	configs.pkg = grunt.file.readJSON('package.json');

	// Reference to machine specific json
	configs.localConfig = grunt.file.exists('localConfig.yaml') ? grunt.file.readYAML('localConfig.yaml') : grunt.file.readYAML('defaultConfig.yaml');

	// Define output directory
	configs.buildPath = 'app';

	// Init with the configs defined above
	grunt.initConfig(configs);
	// ================== END CONFIGURATIONS ==================

	// ================== BEGIN TASK DECLARATION ==================
	// ----------- High Level Tasks ---------------
	// Get Available Tasks List
	grunt.registerTask(
		'tasks',
		'Lists available grunt tasks.', ['exec:tasks_list']
	);

	// Default Job
	grunt.registerTask(
		'default',
		'Compiles scss and index.html into app directory.', ['build']
	);

	// Pre-Commit Check
	grunt.registerTask(
		'pre-commit',
		'Builds and then runs lint, gendoc, and tests, for pre-commit check.', ['build', 'lint', 'csslint', 'gendoc', 'test']
	);

	grunt.registerTask(
		'pre-commit-simple',
		'Builds and then runs lint and gendoc, for pre-commit check',
		['build', 'lint', 'csslint', 'gendoc']
	);

	// Unit and View Tests
	grunt.registerTask(
		'test',
		'Runs both unit and view tests', ['unit', 'view']
	);

	// ----------- Get Build Libs Tasks---------------

	// Build Libs
	grunt.registerTask(
		'build-commons',
		'Fetches the latest commons specified by the configuration.  ',
		function () {
			// grunt.task.run('clean:commons');
			// if (configs.constants.plmCommonsVersion) {
			// 	grunt.task.run('curl:plm-commons');
			// } else {
			// 	grunt.task.run('exec:update_plm_commons');
			// }
			// if (configs.constants.adskCommonsVersion) {
			// 	grunt.task.run('curl:adsk-commons');
			// } else {
			// 	grunt.task.run('exec:update_adsk_commons');
			// }
			// if (configs.constants.cpdmUIReleaseVersion) {
			// 	// Create url from file names.
			// 	configs.constants.cpdmUIFiles = [];
			// 	for (var fileName in cpdmUIFiles) {
			// 		configs.constants.cpdmUIFiles.push('http://veyron.autodesk.com/artifactory/simple/libs-release-local/com/autodesk/plm/cpdm-ui-release/' + configs.constants.cpdmUIReleaseVersion + '/' + cpdmUIFiles[fileName]);
			// 	}
			// 	grunt.task.run('curl-dir:cpdm-ui-release');
			// } else {
			// 	grunt.task.run('exec:update_cpdm_ui_release');
			// }
			// grunt.task.run('build');
		}
	);

	// Build From Artifactory
	grunt.registerTask(
		'build-commons-artifactory',
		'Fetches the latest commons specified by the configuration.  ',
		function () {
			// grunt.task.run('clean:commons');
			// grunt.task.run('curl');
			// grunt.task.run('unzip');

			// configs.constants.cpdmUIFiles = [];
			// for (var fileName in cpdmUIFiles) {
			// 	configs.constants.cpdmUIFiles.push('http://veyron.autodesk.com/artifactory/simple/libs-release-local/com/autodesk/plm/cpdm-ui-release/' + configs.constants.cpdmUIReleaseVersion + '/' + cpdmUIFiles[fileName]);
			// }
			// grunt.task.run('curl-dir:cpdm-ui-release');

			// grunt.task.run('build');
		}
	);

	// ----------- PLM UI Build Tasks---------------
	grunt.registerTask(
		'build',
		'Compiles scss and index.html into app directory.', ['clean:dev', 'babel', 'traceur:build', 'copy:dev', 'sass:dev', 'htmlbuild:dev', 'includeSource:dev', 'clean:devtmpfiles']
	);

	grunt.registerTask(
		'build-stage',
		'Compiles all of the assets and copies the files to the build directory.',
		function () {
			configs.buildPath = 'build';
			grunt.task.run(['clean:stage', 'babel', 'traceur:build', 'copy:main', 'sass:stage', 'ngtemplates', 'concat', 'htmlbuild:stage', 'includeSource:stage', 'clean:stagetmpfiles', 'uglify']);
		}
	);


	// ----------- Code Quality Tool Tasks---------------
	// Documentation
	grunt.registerTask(
		'gendoc',
		'Generates documentation for ' + projectAbbrv + ' scripts.', ['clean:doc', 'copy:doc', 'ngdocs']
	);

	// Linting
	grunt.registerTask(
		'lint',
		'Checks for code quality and documentation.', ['eslint']
	);

	// CSS sorting
	grunt.registerTask(
		'csscomb',
		'Formats and cleans up the SCSS files.', ['csscomb:dev', 'regex-replace:styleguide_number']
	);

	// Clean Dev
	grunt.registerTask(
		'clean-dev',
		'Cleans up local dev environment', ['clean:devtmpfiles', 'clean:stagetmpfiles', 'clean:sasscache', 'clean:doc', 'clean:testCoverage']
	);

	// ----------- Testing Tasks---------------
	// Unit Tests
	grunt.registerTask(
		'unit',
		'Runs unit tests', ['karma']
	);

	// View Tests
	grunt.registerTask(
		'view',
		'Runs view tests', ['protractor:dev']
	);

	// View Tests Code Coverage Reporter
	grunt.registerTask(
		'view-cc',
		'Perform code coverage on e2e tests.', ['clean:e2e', 'copy:e2e', 'instrument', 'protractor_coverage', 'makeReport']
	);
	// ================== END TASK DECLARATION ==================
	grunt.registerTask(
		'css-lint',
		'Linter for scss files',
		function () {
			grunt.task.run('csslint');
		}
	);
};
