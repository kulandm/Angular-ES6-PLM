System.registerModule("com/autodesk/components/fusionHeader/userDropdown.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/fusionHeader/userDropdown.controller.js";
  var UserDropdownController = function() {
    function UserDropdownController($document, $window, $state, AuthenticationService, EventService, ModelsManager) {
      this.$document = $document;
      this.$window = $window;
      this.$state = $state;
      this.AuthenticationService = AuthenticationService;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.userInfo = {
        userAvatar: {
          small: 'images/avatar_generic_x20.png',
          medium: 'images/avatar_generic_x50.png'
        },
        userDisplayName: '',
        userEmail: ''
      };
      this.loadUserDropdownInformation();
    }
    return ($traceurRuntime.createClass)(UserDropdownController, {
      loadUserDropdownInformation: function() {
        var $__3 = this;
        var currentUserListenerId = this.EventService.listen('currentUser:currentUser:done', function(event, userObj) {
          $__3.EventService.unlisten(currentUserListenerId);
          $__3.userInfo.userAvatar = userObj.getProfileImage();
          $__3.userInfo.userDisplayName = userObj.getDisplayName();
          $__3.userInfo.userEmail = userObj.getEmail();
          $__3.userInfo.logOutAction = '/api/v3/users/' + userObj.getId() + '/authorizations';
        });
        this.ModelsManager.getCurrentUser();
      },
      logOut: function() {
        this.AuthenticationService.requestLogout();
        this.$document[0].querySelector('#fusion-header-logOutForm').submit();
      },
      switchToClassic: function() {
        var $__3 = this;
        var userDefInterfaceSuccessListener = this.EventService.listen('currentUser:definterface:done', function() {
          $__3.EventService.unlisten(userDefInterfaceSuccessListener);
          $__3.EventService.unlisten(userDefInterfaceErrorListener);
          $__3.$state.go('classic');
        });
        var userDefInterfaceErrorListener = this.EventService.listen('currentUser:definterface:error', function() {
          $__3.EventService.unlisten(userDefInterfaceSuccessListener);
          $__3.EventService.unlisten(userDefInterfaceErrorListener);
        });
        this.ModelsManager.setCurrentUserDefInterface('ClassicPLM360');
      },
      goToClassicProfile: function() {
        this.$window.location.href = '/profile.do';
      },
      goToClassicDelegations: function() {
        this.$window.location.href = '/delegations.do';
      }
    }, {});
  }();
  UserDropdownController.$inject = ['$document', '$window', '$state', 'AuthenticationService', 'EventService', 'ModelsManager'];
  var $__default = UserDropdownController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/fusionHeader/userDropdown.controller.js
