module.exports = (function () {
   // This approach of creating suite is taken from {@link https://atticuswhite.com/blog/angular-unit-test-memory-problems/}
   // TODO: we can run these suites in parallel {@link http://grunt-tasks.com/grunt-concurrent/}
   // Unit test runner configurations
   var testFiles = [
      // 'node_modules/angular/angular.js',
      // 'node_modules/angular-mocks/angular-mocks.js',
      // 'node_modules/traceur/bin/traceur.js',
      // 'node_modules/traceur/bin/traceur-runtime.js',
      // 'build/plm-localization.js'
   ];

   return {
      // Standard configuation
      main: {
         configFile: 'karma.conf.js',
         options: {
            //files: testFiles.concat(['test/*Spec.js'])
         },
         autoWatch: false,
         singleRun: true
      }
   };
})();
