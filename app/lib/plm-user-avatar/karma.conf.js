module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks:['mocha', 'chai-as-promised', 'chai', 'traceur','sinon','sinon-chai'],
    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-dynamic-locale/src/tmhDynamicLocale.js',
      'lib/angular-locale-bundles/dist/angular-locale-bundles.min.js',
      'node_modules/traceur/bin/traceur.js',
      'node_modules/traceur/bin/traceur-runtime.js',
      'lib/underscore/underscore-min.js',
      'lib/plm-underscore/build/*.js',
      'lib/plm-localization/dist/*.js',
      'dist/plm-userAvatar.js',
      'test/*Spec.js'
    ],

    exclude:[],

    proxies: {
      '/images': '/app/images',
      '/build-legacy': '/app/build-legacy',
      '/components': '/app/components'
    },

    preprocessors: {
      'test/*.js': ['babel']
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
