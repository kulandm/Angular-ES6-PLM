System.registerModule("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyoutBox.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyoutBox.controller.js";
  var WorkspaceTableauFlyoutBoxController = function() {
    function WorkspaceTableauFlyoutBoxController($scope, $rootScope, ParentController, $flyoutInstance, _) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.ParentController = ParentController;
      this.$flyoutInstance = $flyoutInstance;
      this._ = _;
      this.$scope.$on('$destroy', function() {});
      this.groups = angular.copy(ParentController.columns);
      this.fields = [];
      this.isPerformingAction = false;
      this.saveFlyout = function() {
        $__2.isPerformingAction = true;
        ParentController.saveWorkspaceTableau($__2.getSelectedColumns());
        $__2.$flyoutInstance.cancel();
      };
      this.cancelFlyout = function() {
        $__2.$flyoutInstance.cancel();
      };
      this.getSelectedColumns = function() {
        var visibleFields = [];
        var newDisplayOrder = 0;
        $__2.fields.sort(function(a, b) {
          return a.displayOrder - b.displayOrder;
        });
        _.each($__2.fields, function(field) {
          if (field.visible) {
            field.displayOrder = newDisplayOrder;
            newDisplayOrder++;
            visibleFields.push(angular.copy(field));
          } else if (angular.isDefined(field.filter)) {
            delete field.displayOrder;
            visibleFields.push(angular.copy(field));
          }
        });
        _.each($__2.groups, function(group) {
          _.each(group.fields, function(field) {
            if (field.visible) {
              field.displayOrder = newDisplayOrder;
              newDisplayOrder++;
              visibleFields.push(angular.copy(field));
            } else if (angular.isDefined(field.filter)) {
              visibleFields.push(angular.copy(field));
            }
          });
        });
        return {array: visibleFields};
      };
      this.initialization = function() {
        _.each($__2.groups, function(group, index) {
          var newGroup = angular.copy(group);
          newGroup.fields = [];
          _.each(group.fields, function(field) {
            if (angular.isDefined(field.displayOrder)) {
              $__2.fields.push(field);
            } else {
              if (angular.isDefined(field.filter)) {
                field.visible = false;
              }
              newGroup.fields.push(field);
            }
          });
          $__2.groups[index] = newGroup;
        });
      };
      this.initialization();
    }
    return ($traceurRuntime.createClass)(WorkspaceTableauFlyoutBoxController, {}, {});
  }();
  var $__default = WorkspaceTableauFlyoutBoxController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyoutBox.controller.js
