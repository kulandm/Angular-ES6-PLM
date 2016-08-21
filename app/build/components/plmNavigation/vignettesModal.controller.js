System.registerModule("com/autodesk/components/plmNavigation/vignettesModal.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/plmNavigation/vignettesModal.controller.js";
  var VignettesModalController = function() {
    function VignettesModalController($rootScope, $scope, $sce, $mdDialog) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$sce = $sce;
      this.$mdDialog = $mdDialog;
    }
    return ($traceurRuntime.createClass)(VignettesModalController, {
      closeVignetteseModal: function() {
        this.$mdDialog.hide();
      },
      getContentLink: function() {
        var vignettesLink = this.$rootScope.bundle.mainMenu.helpMenu.vignettes.link;
        var trustedValueObject = this.$sce.trustAsResourceUrl(vignettesLink);
        return trustedValueObject;
      }
    }, {});
  }();
  var $__default = VignettesModalController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/plmNavigation/vignettesModal.controller.js
