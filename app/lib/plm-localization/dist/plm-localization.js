System.registerModule("com/autodesk/localization.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/localization.js";
  var LocalizationService = System.get("com/autodesk/localization.service.js").default;
  angular.module(__moduleName, ['angular-locale-bundles', 'tmh.dynamicLocale']).provider('LocalizationService', function() {
    var pathToLocaleBundles = '';
    this.setPathToLocaleBundles = function(value) {
      pathToLocaleBundles = value || '';
    };
    this.$get = ['$rootScope', '$q', 'localeBundleFactory', function($rootScope, $q, localeBundleFactory) {
      return new LocalizationService($rootScope, $q, localeBundleFactory, pathToLocaleBundles);
    }];
  }).config(['localeBundleFactoryProvider', function(localeBundleFactoryProvider) {
    localeBundleFactoryProvider.bundleUrl('{{bundle}}.json');
    localeBundleFactoryProvider.bundleLocaleUrl('{{bundle}}_{{locale}}.json');
    localeBundleFactoryProvider.useAcceptLanguageHeader(true);
    localeBundleFactoryProvider.enableHttpCache(true);
    localeBundleFactoryProvider.responseTransformer(function(response) {
      return response.data.body;
    });
  }]);
  return {};
});
//# sourceURL=com/autodesk/localization.js
;

System.registerModule("com/autodesk/localization.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/localization.service.js";
  var LocalizationService = function() {
    function LocalizationService($rootScope, $q, localeBundleFactory, pathToLocaleBundles) {
      var that = this;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.localeBundleFactory = localeBundleFactory;
      this.deferred = this.$q.defer();
      this.localeBundleFactory(pathToLocaleBundles + '/translations/localizationBundleGeneral', '').translations.then(function(data) {
        angular.copy(data, that.$rootScope.localizationBundleGeneral);
        that.deferred.resolve();
      });
    }
    return ($traceurRuntime.createClass)(LocalizationService, {
      init: function() {
        return this.deferred.promise;
      },
      translate: function(key) {
        if (!angular.isString(key)) {
          return undefined;
        }
        var keys = key.split('.');
        var val = this.$rootScope.bundle;
        for (var i = 0; i < keys.length; i++) {
          val = val[keys[i]];
        }
        return val;
      }
    }, {});
  }();
  var $__default = LocalizationService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/localization.service.js
