module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks:['mocha', 'chai-as-promised', 'chai', 'traceur','sinon','sinon-chai'],
    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'node_modules/traceur/bin/traceur.js',
      'node_modules/traceur/bin/traceur-runtime.js',
      'lib/underscore/underscore-min.js',
      'lib/plm-event-service/build/*.js',
      'lib/plm-underscore/build/*.js',
      'lib/adsk-commons/**/*.js',
      'lib/plm-commons/**/*.js',
      'lib/angular-ui-router/release/angular-ui-router.min.js',
      'lib/angular-cache/dist/angular-cache.min.js',
      'lib/restangular/dist/restangular.js',
      'lib/plm-config/build/*.js',
      'lib/plm-token-service/build/plm-token-service.js',
      'lib/plm-loading-data-service/build/plm-loading-data-service.js',
      'lib/plm-authentication-service/build/plm-authentication-service.js',
      'lib/plm-classic-redirector/build/*.js',
      'lib/plm-rest-wrapper-service/build/plm-rest-wrapper-service.js',
      'lib/plm-api-models-manager/dist/*.js',
      'lib/plm-wip-file-type/dist/plm-wip-file-type.js',
      'lib/plm-wip-http/dist/plm-wip-http.js',
      'lib/plm-unit-tests-mocks/build/mock*/module.js',
      'lib/plm-unit-tests-mocks/build/mock*/Mock*',
      'lib/plm-api-models-manager.js/dist/*.js',
      'dist/plm-wipFileBrowser.js',
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
