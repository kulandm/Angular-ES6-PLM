System.registerModule("com/autodesk/jitterbit.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/jitterbit.controller.js";
  var plmJitterbitIntegrationController = function() {
    function plmJitterbitIntegrationController($scope, App, RESTWrapperService) {
      var root = new App();
      $scope.url = null;
      RESTWrapperService.get('api/v3/tenant').then(function(response) {
        var tenantName = response.id;
        RESTWrapperService.get('api/v3/configurations/jitterbitconfig').then(function(response) {
          $scope.url = (response.value + "?customer=" + tenantName);
        });
      });
    }
    return ($traceurRuntime.createClass)(plmJitterbitIntegrationController, {}, {});
  }();
  var $__default = plmJitterbitIntegrationController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/jitterbit.controller.js
;

System.registerModule("com/autodesk/jitterbit.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/jitterbit.js";
  System.get("com/autodesk/RESTWrapperService.js");
  System.get("com/autodesk/apiModelsManager.js");
  var plmJitterbitIntegrationController = System.get("com/autodesk/jitterbit.controller.js").default;
  angular.module(__moduleName, ['com/autodesk/RESTWrapperService.js', 'com/autodesk/apiModelsManager.js']).controller('plmJitterbitIntegrationController', plmJitterbitIntegrationController).config(function($sceDelegateProvider) {
    var trustedConfigurableUrl;
    var $http = angular.injector(['ng']).get('$http');
    $http.get('/api/v3/configurations/jitterbitconfig').then(function(response) {
      trustedConfigurableUrl = (response.data.value + "/**");
      $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://devdemo.jitterbit.com/**', trustedConfigurableUrl]);
    });
  });
  return {};
});
//# sourceURL=com/autodesk/jitterbit.js
;

System.get("com/autodesk/jitterbit.js");angular.module("com/autodesk/jitterbit.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('jitterbit.html',
    "<iframe class=\"jitter-bit-container\" id=\"plmJitterbit\" ng-src=\"{{url}}\"></iframe>"
  );
}]);