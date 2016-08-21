module.exports = function(config) {

  /**
  Note we have to override node_modules/karma/lib/launchers/process.js so karma kills Chrome instances properly.  
  Until we're able to upgrade karma to 1.0.0+ we'll need that override.  
  The line cp -r test/unit/overrides/ node_modules/ 2>/dev/null || :   in jenkins is used to copy the override
  */


  config.set({
    basePath: '../app',
    frameworks:['mocha', 'chai-as-promised', 'chai', 'sinon', 'traceur', 'sinon-chai', 'source-map-support'],

    proxies: {
      '/images': '/app/images',
      '/build-legacy': '/app/build-legacy',
      '/components': '/app/components'
    },

    // coverage reporter generates the coverage
    reporters: ['progress', 'spec' /*, 'coverage','junit'/*, 'html'*/],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      '../src/**/*.js': ['coverage'],
      '../app/build-legacy/scripts/**/*.js': ['coverage'],
      '../app/build-legacy/components/**/*.js': ['coverage'],
      '../app/build/**/*.js': ['coverage'],
      '../app/**/*.html':['ng-html2js'],
      '../test/**/*.js': ['babel'],
      '../app/lib/plm-unit-tests-mocks/build/mock*/*.js': ['babel']
    },

    port: 9999,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: false,

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      }
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: '../app/',
      moduleName: 'plmTemplates'
    },

    // optional, configure html report
    htmlReporter:{
      outputFile:'../test/report/report.html',
      suite:'Unit Tests'
    },

    junitReporter: {
      outputFile:'../test/report/test-results.xml'
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : '../test/coverage/'
    }
  });
};
