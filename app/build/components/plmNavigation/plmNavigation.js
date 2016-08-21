System.registerModule("com/autodesk/components/plmNavigation/plmNavigation.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/plmNavigation/plmNavigation.js";
  var PLMNavigationController = System.get("com/autodesk/components/plmNavigation/plmNavigation.controller.js").default;
  var VignettesModalController = System.get("com/autodesk/components/plmNavigation/vignettesModal.controller.js").default;
  var PLMNavigationDirective = System.get("com/autodesk/components/plmNavigation/plmNavigation.directive.js").default;
  angular.module(__moduleName, []).controller('PLMNavigationController', PLMNavigationController).controller('VignettesModalController', VignettesModalController).directive('plmNavigation', PLMNavigationDirective);
  return {};
});
//# sourceURL=com/autodesk/components/plmNavigation/plmNavigation.js
