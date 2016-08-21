module.exports = (function () {
   // This approach of creating suite is taken from {@link https://atticuswhite.com/blog/angular-unit-test-memory-problems/}
   // TODO: we can run these suites in parallel {@link http://grunt-tasks.com/grunt-concurrent/}
   // Unit test runner configurations
   var testFiles = [
      // Explicitly exclude angular.min.js to avoid "Tried to load Angular more than once" warning when running karma.
      {pattern: '../app/lib/angular/angular.min.js', included: false, served: true, watched: false},
      '../app/lib/angular/angular.js',
      '../app/lib/angular-animate/angular-animate.min.js',
      '../app/lib/angular-aria/angular-aria.min.js',
      '../app/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
      '../app/lib/angular-cache/dist/angular-cache.min.js',
      '../app/lib/angular-cookies/angular-cookies.min.js',
      '../app/lib/angular-dynamic-locale/src/tmhDynamicLocale.js',
      '../app/lib/angular-locale-bundles/dist/angular-locale-bundles.min.js',
      '../app/lib/angular-material/angular-material.min.js',
      '../app/lib/angular-mocks/angular-mocks.js',
      '../app/lib/angular-resource/angular-resource.min.js',
      '../app/lib/angular-route/angular-route.min.js',
      '../app/lib/angular-sanitize/angular-sanitize.min.js',
      '../app/lib/angular-ui-grid/ui-grid.js',
      '../app/lib/angular-ui-mask/dist/mask.min.js',
      '../app/lib/angular-ui-router/release/angular-ui-router.min.js',
      '../app/lib/jquery/dist/jquery.min.js',
      '../app/lib/oclazyload/dist/ocLazyLoad.min.js',
      '../app/lib/restangular/dist/restangular.min.js',
      '../app/lib/semantic-ui/dist/semantic.min.js',
      '../app/lib/traceur/traceur.js',
      '../app/lib/traceur_runtime.js',
      '../app/lib/underscore/underscore-min.js',
      '../app/lib/d3/d3.js',
      '../app/lib/df-tab-menu/build/df-tab-menu.min.js',
      '../app/lib/highcharts-ng/dist/*min.js',
      '../app/lib/highcharts/adapters/standalone-framework.js',
      '../app/lib/highcharts/highcharts.js',
      '../app/lib/jsPlumb/dist/js/dom.jsPlumb-1.7.4-min.js',
      '../app/lib/moment/min/moment-with-locales.min.js',
      '../app/lib/angular-moment/angular-moment.js',
      '../app/lib/angular-gantt/dist/angular-gantt.min.js',
      '../app/lib/angular-gantt/dist/angular-gantt-plugins.min.js',
      '../app/lib/rangy/rangy-core.js',
      '../app/lib/rangy/rangy-selectionsaverestore.js',
      '../app/lib/textAngular/dist/textAngular-sanitize.min.js',
      '../app/lib/textAngular/dist/textAngular.min.js',
      '../app/lib/cpdm-ui/dist/*min.js',
      '../app/lib/plm-commons/**/*.js',
      '../app/lib/adsk-commons/**/*.js',
      '../app/lib/plm-file-overview-service/dist/*.js',
      '../app/lib/plm-navigation-guard/dist/*.js',
      '../app/lib/plm-localization/dist/*.js',
      '../app/lib/plm-underscore/build/*.js',
      '../app/lib/plm-event-service/build/*.js',
      '../app/lib/plm-dropdown/build/*.js',
      '../app/lib/plm-token-service/dist/*.js',
      '../app/lib/plm-authentication-service/build/*.js',
      '../app/lib/plm-classic-redirector/build/*.js',
      '../app/lib/plm-loading-data-service/build/*.js',
      '../app/lib/plm-config/build/*.js',
      '../app/lib/plm-rest-wrapper-service/dist/*.js',
      '../app/lib/plm-notification/dist/*.js',
      '../app/lib/plm-ng-filters/build/*.js',
      '../app/lib/plm-flyout/dist/*.js',
      '../app/lib/plm-api-models-manager/dist/*.js',
      '../app/lib/plm-table-data/dist/*.js',
      '../app/lib/plm-bom/dist/*.js',
      '../app/lib/plm-dashboard/dist/*.js',
      '../app/lib/plm-jitterbit/dist/*.js',
      '../app/lib/plm-search/dist/*.js',
      '../app/lib/plm-roamer/dist/*.js',
      '../app/lib/plm-section-wrapper/build/*.js',
      '../app/lib/plm-edit-tracker/dist/*.js',
      '../app/lib/plm-wip-file-type/dist/*.js',
      '../app/lib/plm-wip-file-browser/dist/*.js',
      '../app/lib/plm-wip-http/dist/*.js',
      '../app/lib/plm-urn-parser/dist/*.js',
      '../app/lib/plm-field-selector/dist/*.js',
      '../app/lib/plm-users-selector/dist/*.js',
      '../app/lib/plm-user-avatar/dist/*.js',
      '../app/lib/plm-cws/dist/*.js',
      '../app/build/**/*.js',
      '../app/build-legacy/scripts/**/*.js',
      '../app/partials/**/*',
      '../app/templates/**/*.html',
      '../app/build-legacy/components/**/module.js',
      '../app/build-legacy/components/**/*.js',
      '../app/components/**/*.html',
      '../app/build/**/*.html',
      '../app/build/components/**/*.js',
      '../app/lib/plm-unit-tests-mocks/build/mock*/module.js',
      '../app/lib/plm-unit-tests-mocks/build/mock*/Mock*',
      '../app/lib/angular-file-saver/dist/angular-file-saver.bundle.js',
      '../app/lib/excel-builder.js/dist/excel-builder.standalone.js'
   ];

   return {
      // Standard configuation
      controllers: {
         configFile: 'test/karma-unit.conf.js',
         options: {
            files: testFiles.concat(['../test/unit/controllerSpecs/!(View*Spec).js'])
         },
         autoWatch: false,
         singleRun: true
      },

      viewcontrollers: {
         configFile: 'test/karma-unit.conf.js',
         options: {
            files: testFiles.concat(['../test/unit/controllerSpecs/View*Spec.js'])
         },
         autoWatch: false,
         singleRun: true
      },

      directives: {
         configFile: 'test/karma-unit.conf.js',
         options: {
            files: testFiles.concat(['../test/unit/directiveSpecs/*Spec.js'])
         },
         autoWatch: false,
         singleRun: true
      },

      models: {
         configFile: 'test/karma-unit.conf.js',
         options: {
            files: testFiles.concat(['../test/unit/modelSpecs/*Spec.js'])
         },
         autoWatch: false,
         singleRun: true
      },

      services: {
         configFile: 'test/karma-unit.conf.js',
         options: {
            files: testFiles.concat(['../test/unit/serviceSpecs/*Spec.js'])
         },
         autoWatch: false,
         singleRun: true
      }
   };
})();
