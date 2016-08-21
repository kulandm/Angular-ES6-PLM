System.registerModule("com/autodesk/components/fusionHeader/fusionHeader.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/fusionHeader/fusionHeader.js";
  var FusionHeaderController = System.get("com/autodesk/components/fusionHeader/fusionHeader.controller.js").default;
  var HelpMenuController = System.get("com/autodesk/components/fusionHeader/helpMenu.controller.js").default;
  var UserDropdownController = System.get("com/autodesk/components/fusionHeader/userDropdown.controller.js").default;
  angular.module(__moduleName, []).component('fusionHeader', {
    templateUrl: 'build/components/fusionHeader/fusionHeader.html',
    controller: FusionHeaderController,
    controllerAs: 'fusionHeaderCtrl'
  }).component('userDropdown', {
    templateUrl: 'build/components/fusionHeader/userDropdown.html',
    controller: UserDropdownController,
    controllerAs: 'userDropdownCtrl'
  }).controller('HelpMenuController', HelpMenuController);
  return {};
});
//# sourceURL=com/autodesk/components/fusionHeader/fusionHeader.js
