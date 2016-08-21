module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks:['mocha', 'chai-as-promised', 'chai', 'traceur','sinon','sinon-chai'],
    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-ui-router/release/angular-ui-router.min.js',
      'node_modules/traceur/bin/traceur.js',
      'node_modules/traceur/bin/traceur-runtime.js',
      'lib/restangular/dist/restangular.min.js',
      'lib/plm-authentication-service/build/*.js',
      'lib/angular-cache/dist/angular-cache.min.js',
      'lib/underscore/underscore-min.js',
      'lib/plm-authentication-service/build/*.js',
      'lib/plm-event-service/build/*.js',
      'lib/plm-loading-data-service/build/*.js',
      'lib/plm-token-service/build/*.js',
      'lib/plm-underscore/build/*.js',
      'lib/plm-config/build/*.js',
      'lib/plm-commons/**/*.js',
      'lib/adsk-commons/**/*.js',
      'lib/plm-rest-wrapper-service/build/plm-rest-wrapper-service.js',
      'build/plm-flyout.js',
      'test/*Spec.js'
    ],

    exclude:[],

    proxies: {
      '/images': '/app/images',
      '/build-legacy': '/app/build-legacy',
      '/components': '/app/components'
    },

    // coverage reporter generates the coverage
    // reporters: ['progress', 'coverage','junit'/*, 'html'*/],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'test/*Spec.js': ['babel'],
      'lib/plm-unit-tests-mocks/build/**/Mock*.js': ['babel']
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
