System.registerModule("com/autodesk/components/fusionHeader/helpMenu.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/fusionHeader/helpMenu.controller.js";
  var HelpMenuController = function() {
    function HelpMenuController($rootScope, $scope, $document, $timeout, $flyoutInstance, $mdDialog, EventService, ModelsManager) {
      var $__2 = this;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$scope.bundle = $rootScope.bundle;
      this.$document = $document;
      this.$timeout = $timeout;
      this.$flyoutInstance = $flyoutInstance;
      this.$mdDialog = $mdDialog;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.helpLinks = {};
      this.retrieveHelpLinks();
      this.$flyoutInstance.opened.then(function() {
        $__2.addFlyoutCloserEvent();
      });
    }
    return ($traceurRuntime.createClass)(HelpMenuController, {
      retrieveHelpLinks: function() {
        var $__2 = this;
        this.EventService.listen('configurations:tenant:done', function(event, configurations) {
          $__2.helpLinks.helpLink = configurations.getConfig('helpLocation').title;
          $__2.helpLinks.adminEmail = configurations.getConfig('supportEmail').title;
        });
        this.ModelsManager.getConfigurations();
      },
      getHelpLink: function() {
        return this.helpLinks.helpLink;
      },
      getAdminEmail: function() {
        return this.helpLinks.adminEmail;
      },
      openVignettesModal: function() {
        this.$mdDialog.show({
          templateUrl: 'build/components/plmNavigation/vignettesModal.html',
          controller: 'VignettesModalController',
          controllerAs: 'vignetteseCtrl'
        });
      },
      addFlyoutCloserEvent: function() {
        var $__2 = this;
        this.$timeout(function() {
          var closeFlyout = function() {
            $__2.$timeout(function() {
              $__2.$flyoutInstance.close();
              $__2.$document[0].removeEventListener('click', closeFlyout, true);
            }, 0);
          };
          $__2.$document[0].addEventListener('click', closeFlyout, true);
        }, 0);
      }
    }, {});
  }();
  HelpMenuController.$inject = ['$rootScope', '$scope', '$document', '$timeout', '$flyoutInstance', '$mdDialog', 'EventService', 'ModelsManager'];
  var $__default = HelpMenuController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/fusionHeader/helpMenu.controller.js
