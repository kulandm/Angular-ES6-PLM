System.registerModule("com/autodesk/components/createItem/managedItem.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/managedItem.directive.js";
  function ManagedItemDirective() {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'ManagedItemController',
      controllerAs: 'managedItemCtrl',
      bindToController: true,
      templateUrl: 'build/components/createItem/managedItem.html',
      scope: {managedItemForm: '='}
    };
    return directive;
  }
  var $__default = ManagedItemDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/createItem/managedItem.directive.js
