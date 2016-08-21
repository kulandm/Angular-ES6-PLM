// Karma configuration
// Generated on Wed Aug 13 2014 21:54:19 GMT-0400 (Eastern Daylight Time)

module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon', 'sinon-chai', 'traceur'],


		// list of files / patterns to load in the browser
		files: [
			// Include Required Libs here
			'lib/jquery/dist/jquery.js',
			'lib/angular/angular.js',
			'lib/angular-aria/angular-aria.min.js',
			'lib/angular-route/angular-route.js',
			'lib/angular-mocks/angular-mocks.js',
			'lib/angular-cache/dist/angular-cache.min.js',
			'lib/angular-animate/angular-animate.js',
			'lib/angular-dynamic-locale/dist/tmhDynamicLocale.js',
			'lib/angular-locale-bundles/dist/angular-locale-bundles.js',
			'lib/angular-material/angular-material.min.js',
			'lib/angular-mocks/angular-mocks.js',
			'lib/angular-resource/angular-resource.js',
			'lib/angular-route/angular-route.js',
			'lib/angular-sanitize/angular-sanitize.js',
			'lib/angular-ui-grid/ui-grid.js',
			'lib/angular-ui-router/release/angular-ui-router.min.js',
			'lib/underscore/underscore.js',
			'lib/adsk-commons/**/*.js',
			'lib/plm-commons/**/*.js',
			'lib/restangular/dist/restangular.js',
			'lib/traceur/traceur.js',
			'lib/traceur-runtime/traceur-runtime.js',
			'lib/rangy/rangy-core.js',
			'lib/rangy/rangy-selectionsaverestore.js',
			'lib/textAngular/dist/textAngular-sanitize.min.js',
			'lib/textAngular/dist/textAngular.min.js',
			'lib/plm-authentication-service/build/plm-authentication-service.js',
			'lib/plm-classic-redirector/build/*.js',
			'lib/plm-config/build/*.js',
			'lib/plm-event-service/build/plm-event-service.js',
			'lib/plm-file-overview-service/dist/*.js',
			'lib/plm-loading-data-service/build/plm-loading-data-service.js',
			'lib/plm-localization/dist/plm-localization.js',
			'lib/plm-rest-wrapper-service/dist/plm-rest-wrapper-service.js',
			'lib/plm-token-service/build/plm-token-service.js',
			'lib/plm-underscore/build/*.js',
			'lib/plm-unit-tests-mocks/build/mock*/module.js',
			'lib/plm-unit-tests-mocks/build/mock*/Mock*',
			'lib/plm-urn-parser/dist/*.js',
			'lib/plm-wip-file-browser/dist/*.js',
			'lib/plm-wip-file-type/dist/plm-wip-file-type.js',
			'lib/plm-wip-http/dist/plm-wip-http.js',

			'lib/plm-api-models-manager/dist/*.js',
			'lib/plm-flyout/dist/*.js',
			'lib/plm-notification/dist/*.js',
			'lib/plm-field-selector/dist/plm-field-selector.js',
			
			// Include App Files Here
			'dist/cpdm-ui.js',

			// Include Test Specs Here
			'test/unit/**/*Spec.js',

			'test/unit/mock*/module.js',
			'test/unit/mock*/*'
		],


		// list of files to exclude
		exclude: [
			// Removing Multiple Angular Files
			'lib/angular/*.min.js',
			'lib/angular/index.js',
			'lib/angular-mocks/ngAnimateMock.js',
			'lib/angular-mocks/ngMock.js',
			'lib/angular-mocks/ngMockE2E.js',
			'lib/ng-breadcrumbs/**',

			// Ignoring Bootstrap.js
			'lib/bootstrap/**',

			// Ignore any src or test locations in libs
			'lib/**/src/**',
			'lib/**/test/**'
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'test/unit/**/*.js': ['babel'],
			'test/unit/*.js': ['babel'],
			'lib/plm-unit-tests-mocks/build/mock*/*.js': ['babel']
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		// reporters: ['progress', 'coverage', 'html'],


		// web server port
		port: 9999,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],
		// browsers: ['Firefox'],
		// browsers: ['PhantomJS'],
		// browsers: ['PhantomJS', 'Chrome', 'Firefox'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,
		captureTimeout: 60000
	});
};
