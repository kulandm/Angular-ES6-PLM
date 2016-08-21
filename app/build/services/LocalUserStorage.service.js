System.registerModule("com/autodesk/services/LocalUserStorage.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/LocalUserStorage.service.js";
  var LocalUserStorageService = function() {
    function LocalUserStorageService($window, $q, EventService, ModelsManager) {
      this.$window = $window;
      this.$q = $q;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.userKey = null;
      this.loadUser();
    }
    return ($traceurRuntime.createClass)(LocalUserStorageService, {
      loadUser: function() {
        var $__2 = this;
        var userListenerId = this.EventService.listen('currentUser:currentUser:done', function(event, userObj) {
          $__2.EventService.unlisten(userListenerId);
          $__2.userKey = ("$$USER_" + userObj.getId());
        });
        this.ModelsManager.getCurrentUser();
      },
      canUseLocalStorage: function() {
        try {
          var storage = this.$window.localStorage;
          var x = '__storage_test__';
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return false;
        }
      },
      getUserDataStorage: function() {
        var storage = this.$window.localStorage;
        var data = storage.getItem(this.userKey);
        if (!data) {
          var dataMap = {};
          storage.setItem(this.userKey, JSON.stringify(dataMap));
          return dataMap;
        } else {
          return JSON.parse(data);
        }
      },
      get: function(key) {
        return this.getUserDataStorage()[key];
      },
      set: function(key, value) {
        var currentData = this.getUserDataStorage();
        currentData[key] = value;
        this.$window.localStorage.setItem(this.userKey, JSON.stringify(currentData));
      }
    }, {});
  }();
  LocalUserStorageService.$inject = ['$window', '$q', 'EventService', 'ModelsManager'];
  angular.module(__moduleName, []).service('LocalUserStorageService', LocalUserStorageService);
  return {};
});
//# sourceURL=com/autodesk/services/LocalUserStorage.service.js
