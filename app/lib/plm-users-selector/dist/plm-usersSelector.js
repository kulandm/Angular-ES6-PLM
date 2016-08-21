System.registerModule("com/autodesk/usersCheckboxSelector.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/usersCheckboxSelector.controller.js";
  var UsersCheckboxSelectorController = function() {
    function UsersCheckboxSelectorController($scope, $rootScope) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.searchInput = '';
      this.selectedItems = this.selectedItems || [];
      this.searchFn = function(item) {
        return item.displayName.toLowerCase().indexOf($__2.searchInput.toLowerCase()) !== -1 || item.organization && item.organization.toLowerCase().indexOf($__2.searchInput.toLowerCase()) !== -1;
      };
    }
    return ($traceurRuntime.createClass)(UsersCheckboxSelectorController, {
      cancelSearch: function() {
        this.searchInput = '';
      },
      exists: function(item) {
        return this.selectedItems.indexOf(item) > -1;
      },
      toggle: function(item) {
        var index = this.selectedItems.indexOf(item);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        } else {
          this.selectedItems.push(item);
        }
      }
    }, {});
  }();
  var $__default = UsersCheckboxSelectorController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/usersCheckboxSelector.controller.js
;

System.registerModule("com/autodesk/usersCheckboxSelector.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/usersCheckboxSelector.directive.js";
  function usersCheckboxSelector() {
    return {
      restrict: 'E',
      replace: true,
      controller: 'UsersCheckboxSelectorController',
      controllerAs: 'usersCheckboxSelectorCtrl',
      templateUrl: 'usersCheckboxSelector.html',
      bindToController: true,
      scope: {
        itemsList: '=',
        selectedItems: '='
      }
    };
  }
  usersCheckboxSelector.$inject = [];
  var $__default = usersCheckboxSelector;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/usersCheckboxSelector.directive.js
;

System.registerModule("com/autodesk/usersRadioSelector.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/usersRadioSelector.controller.js";
  var UsersRadioSelectorController = function() {
    function UsersRadioSelectorController($scope, $rootScope, $q) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.searchInput = '';
      this.selectedItem = this.selectedItem || '';
      this.isSelectedFirst = this.selectedFirst !== 'false';
      if (this.itemsList.length > 1 && this.isSelectedFirst) {
        this.itemsList.unshift(this.itemsList.splice(this.itemsList.findIndex(function(item) {
          return item.__self__ === $__2.selectedItem.__self__;
        }), 1)[0]);
      }
      this.searchFn = function(item) {
        return item.displayName.toLowerCase().indexOf($__2.searchInput.toLowerCase()) !== -1 || item.organization && item.organization.toLowerCase().indexOf($__2.searchInput.toLowerCase()) !== -1;
      };
    }
    return ($traceurRuntime.createClass)(UsersRadioSelectorController, {cancelSearch: function() {
        this.searchInput = '';
      }}, {});
  }();
  var $__default = UsersRadioSelectorController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/usersRadioSelector.controller.js
;

System.registerModule("com/autodesk/usersRadioSelector.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/usersRadioSelector.directive.js";
  function usersRadioSelector() {
    return {
      restrict: 'E',
      replace: true,
      controller: 'UsersRadioSelectorController',
      controllerAs: 'usersRadioSelectorCtrl',
      templateUrl: 'usersRadioSelector.html',
      bindToController: true,
      scope: {
        itemsList: '=',
        selectedItem: '=',
        selectedFirst: '@'
      }
    };
  }
  usersRadioSelector.$inject = [];
  var $__default = usersRadioSelector;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/usersRadioSelector.directive.js
;

System.registerModule("com/autodesk/usersSelector.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/usersSelector.js";
  var UsersRadioSelectorController = System.get("com/autodesk/usersRadioSelector.controller.js").default;
  var UsersCheckboxSelectorController = System.get("com/autodesk/usersCheckboxSelector.controller.js").default;
  var usersRadioSelector = System.get("com/autodesk/usersRadioSelector.directive.js").default;
  var usersCheckboxSelector = System.get("com/autodesk/usersCheckboxSelector.directive.js").default;
  angular.module(__moduleName, []).controller('UsersRadioSelectorController', UsersRadioSelectorController).controller('UsersCheckboxSelectorController', UsersCheckboxSelectorController).directive('usersRadioSelector', usersRadioSelector).directive('usersCheckboxSelector', usersCheckboxSelector);
  return {};
});
//# sourceURL=com/autodesk/usersSelector.js
;

System.get("com/autodesk/usersSelector.js");angular.module("com/autodesk/usersSelector.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('usersCheckboxSelector.html',
    "<div class=\"users-selector-wrapper\"><div class=\"search-box-wrapper\"><input type=\"search\" placeholder=\"{{$root.bundle.text.search}}\" ng-model=\"usersCheckboxSelectorCtrl.searchInput\"> <a href=\"javascript:;\" class=\"close-button-wrapper\" ng-click=\"usersCheckboxSelectorCtrl.cancelSearch()\"><span class=\"zmdi zmdi-close-circle\"></span></a></div><div class=\"selection-area\"><div class=\"checkbox-wrapper\" ng-repeat=\"item in usersCheckboxSelectorCtrl.itemsList | filter: usersCheckboxSelectorCtrl.searchFn\"><md-checkbox md-no-ink ng-checked=\"usersCheckboxSelectorCtrl.exists(item)\" ng-click=\"usersCheckboxSelectorCtrl.toggle(item)\"><user-avatar class=\"user-selector-avatar\" user-name=\"{{item.displayName}}\" user-image=\"{{item.imageSizeMedium}}\"></user-avatar>{{item.displayName}} <span ng-if=\"item.organization\" class=\"secondary-text\">- {{item.organization}}</span></md-checkbox></div></div></div>"
  );


  $templateCache.put('usersRadioSelector.html',
    "<div class=\"users-selector-wrapper\"><div class=\"search-box-wrapper\"><input type=\"search\" placeholder=\"{{$root.bundle.text.search}}\" ng-model=\"usersRadioSelectorCtrl.searchInput\"> <a href=\"javascript:;\" class=\"close-button-wrapper\" ng-click=\"usersRadioSelectorCtrl.cancelSearch()\"><span class=\"zmdi zmdi-close-circle\"></span></a></div><div class=\"selection-area\"><md-radio-group md-no-ink ng-model=\"usersRadioSelectorCtrl.selectedItem\"><md-radio-button ng-repeat=\"item in usersRadioSelectorCtrl.itemsList | filter: usersRadioSelectorCtrl.searchFn\" ng-value=\"item\" aria-label=\"{{item.displayName}}\" class=\"select-user-radio\"><user-avatar class=\"user-selector-avatar\" user-name=\"{{item.displayName}}\" user-image=\"{{item.imageSizeMedium}}\"></user-avatar><!-- TODO: change item to user model and use helper methods -->{{item.displayName}} <span ng-if=\"item.organization\" class=\"secondary-text\">- {{item.organization}}</span></md-radio-button></md-radio-group></div></div>"
  );
}]);