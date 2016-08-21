module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks:['mocha', 'chai-as-promised', 'chai', 'traceur','sinon','sinon-chai'],
		files: [
			'lib/angular/angular.js',
			'lib/angular-animate/angular-animate.min.js',
			'lib/angular-aria/angular-aria.min.js',
			'lib/angular-cache/dist/angular-cache.min.js',
			'lib/angular-dynamic-locale/src/tmhDynamicLocale.js',
			'lib/angular-locale-bundles/dist/angular-locale-bundles.min.js',
			'lib/angular-material/angular-material.min.js',
			'lib/angular-mocks/angular-mocks.js',
			'lib/angular-moment/angular-moment.js',
			'lib/angular-ui-router/release/angular-ui-router.min.js',
			'node_modules/traceur/bin/traceur.js',
			'node_modules/traceur/bin/traceur-runtime.js',
			'lib/jquery/dist/jquery.min.js',
			'lib/moment/min/moment-with-locales.min.js',
			'lib/rangy/rangy-core.js',
			'lib/rangy/rangy-selectionsaverestore.js',
			'lib/restangular/dist/restangular.min.js',
			'lib/semantic-ui/dist/semantic.min.js',
			'lib/textAngular/dist/textAngular-sanitize.min.js',
			'lib/textAngular/dist/textAngular.min.js',
			'lib/underscore/underscore-min.js',
			'lib/adsk-commons/**/*.js',
			'lib/plm-commons/**/*.js',
			'lib/plm-api-models-manager/build/plm-api-models-manager.js',
			'lib/plm-authentication-service/build/plm-authentication-service.js',
			'lib/plm-classic-redirector/build/plm-classic-redirector.js',
			'lib/plm-config/build/PLM360Conf.js',
			'lib/plm-event-service/build/plm-event-service.js',
			'lib/plm-loading-data-service/build/plm-loading-data-service.js',
			'lib/plm-localization/build/*.js',
			'lib/plm-rest-wrapper-service/build/plm-rest-wrapper-service.js',
			'lib/plm-token-service/build/plm-token-service.js',
			'lib/plm-underscore/build/plm-underscore.js',
			'lib/plm-urn-parser/dist/plm-urn-parser.js',
			'lib/plm-unit-tests-mocks/build/mock*/module.js',
			'lib/plm-unit-tests-mocks/build/mock*/Mock*',
			'lib/plm-field-selector/dist/plm-field-selector.js',
			'build/plm-cws.js',
			'test/*Spec.js'
		],

		exclude:[],

		proxies: {
			'/images': '/app/images',
			'/build-legacy': '/app/build-legacy',
			'/components': '/app/components'
		},

		// coverage reporter generates the coverage
		//reporters: ['progress', 'coverage','junit'/*, 'html'*/],

		preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
		//   '../src/**/*.js': ['coverage'],
		//   '../app/build-legacy/scripts/**/*.js': ['coverage'],
		//   '../app/build-legacy/components/**/*.js': ['coverage'],
		//   '../app/build/**/*.js': ['coverage'],
		//   '../app/**/*.html':['ng-html2js'],
				'test/**/*.js': ['babel'],
				'lib/plm-unit-tests-mocks/build/mock*/*.js': ['babel']
		},

		port: 9999,
		colors: true,
		logLevel: config.LOG_ERROR,
		autoWatch: true,
		browsers: ['Chrome'],
		captureTimeout: 60000,
		singleRun: false
	});
};
