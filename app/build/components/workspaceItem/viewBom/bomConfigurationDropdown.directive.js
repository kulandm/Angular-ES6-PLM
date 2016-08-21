System.registerModule("com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.directive.js";
  function BomConfigurationDropdownDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'build/components/workspaceItem/viewBom/bomConfigurationDropdown.html',
      controller: 'BomConfigurationDropdownController',
      controllerAs: 'bomConfigCtrl',
      bindToController: true,
      scope: {
        anchor: '@',
        initialDate: '=',
        initialBias: '=',
        onSave: '&'
      },
      link: function(scope, element, attrs, controller) {
        $(attrs.anchor).on('click', function() {
          controller.updateDialog();
        });
      }
    };
    return directive;
  }
  var $__default = BomConfigurationDropdownDirective;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.directive.js
