module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks:['mocha', 'chai-as-promised', 'chai', 'traceur'],
    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-locale-bundles/dist/angular-locale-bundles.js',
      'lib/angular-dynamic-locale/dist/tmhDynamicLocale.js',
      'node_modules/traceur/bin/traceur.js',
      'node_modules/traceur/bin/traceur-runtime.js',
      'build/plm-localization.js',
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

    //preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
    //   '../src/**/*.js': ['coverage'],
    //   '../app/build-legacy/scripts/**/*.js': ['coverage'],
    //   '../app/build-legacy/components/**/*.js': ['coverage'],
    //   '../app/build/**/*.js': ['coverage'],
    //   '../app/**/*.html':['ng-html2js'],
    //   '../test/**/*.js': ['babel']
    // },

    port: 9999,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: false
  });
};
