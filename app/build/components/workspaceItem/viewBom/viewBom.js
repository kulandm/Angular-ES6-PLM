System.registerModule("com/autodesk/components/workspaceItem/viewBom/viewBom.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/viewBom.js";
  var ViewBomController = System.get("com/autodesk/components/workspaceItem/viewBom/viewBom.controller.js").default;
  var BomConfigurationDropdownController = System.get("com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.controller.js").default;
  var BomConfigurationDropdownDirective = System.get("com/autodesk/components/workspaceItem/viewBom/bomConfigurationDropdown.directive.js").default;
  var BomMessageService = System.get("com/autodesk/components/workspaceItem/viewBom/BomMessageService.js").default;
  var BomItemNumberDirecTive = System.get("com/autodesk/components/workspaceItem/viewBom/bomItemNumber.directive.js").default;
  var BomDataControllerFactory = System.get("com/autodesk/components/workspaceItem/viewBom/bomDataController.js").default;
  angular.module(__moduleName, []).controller('ViewBomController', ViewBomController).controller('BomConfigurationDropdownController', BomConfigurationDropdownController).directive('bomConfigurationDropdown', BomConfigurationDropdownDirective).directive('bomItemNumber', BomItemNumberDirecTive).factory('BomDataController', BomDataControllerFactory).service('BomMessageService', BomMessageService);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/viewBom.js
