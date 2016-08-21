System.registerModule("com/autodesk/components/plmNavigation/plmNavigation.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/plmNavigation/plmNavigation.directive.js";
  function PLMNavigationDirective() {
    var directive = {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: 'PLMNavigationController',
      controllerAs: 'plmNavigationCtrl',
      templateUrl: 'build/components/plmNavigation/plmNavigation.html',
      scope: {},
      link: function(scope, element, attrs, plmNavigationCtrl) {}
    };
    return directive;
  }
  var $__default = PLMNavigationDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/plmNavigation/plmNavigation.directive.js
