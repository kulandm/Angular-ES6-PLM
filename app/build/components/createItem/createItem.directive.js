System.registerModule("com/autodesk/components/createItem/createItem.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/createItem.directive.js";
  function CreateItemDirective() {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'CreateItemController',
      controllerAs: 'createItemCtrl',
      templateUrl: 'build/components/createItem/createItem.html',
      scope: {
        formFields: '=',
        filter: '=',
        unsupportedFields: '=',
        selectedWorkspace: '=',
        workspacesList: '=',
        createType: '=',
        waiting: '=',
        workspaceUrn: '=',
        classificationId: '='
      }
    };
    return directive;
  }
  var $__default = CreateItemDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/createItem/createItem.directive.js
