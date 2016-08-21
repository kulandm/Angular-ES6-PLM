System.registerModule("com/autodesk/components/workspaceItem/viewAffectedItems/addRelatedBom.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAffectedItems/addRelatedBom.controller.js";
  var MODELS_MGR = new WeakMap();
  var EVENT_SVC = new WeakMap();
  var AddRelatedBomController = function() {
    function AddRelatedBomController($scope, $rootScope, $stateParams, $mdDialog, EventService, urn, ModelsManager) {
      this.urn = urn;
      this.$mdDialog = $mdDialog;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      MODELS_MGR.set(this, ModelsManager);
      EVENT_SVC.set(this, EventService);
      this.relatedBomItemsListenerId;
      this.displayResults = false;
      this.childrenOptions = [$rootScope.bundle.text.none, $rootScope.bundle.text.directChildren, $rootScope.bundle.text.allChildren];
      this.childrenSelectedOption = this.childrenOptions[0];
      this.parentsOptions = [$rootScope.bundle.text.none, $rootScope.bundle.text.directParents];
      this.parentsSelectedOption = this.parentsOptions[0];
      this.itemsFilterOptions = [$rootScope.bundle.text.itemFilter, $rootScope.bundle.text.all];
      this.itemsFilterSelectedOption = this.itemsFilterOptions[0];
      this.selectedRows = [];
      this.tableData = {
        columns: [{
          field: 'selection',
          enableColumnResizing: false,
          headerCellTemplate: 'bomCheckboxHeaderTemplate',
          cellTemplate: 'bomCheckboxTemplate',
          width: '50'
        }, {
          displayName: $rootScope.bundle.affectedItems.itemDescriptor,
          field: 'item',
          type: 'object'
        }, {
          displayName: $rootScope.bundle.affectedItems.currentState,
          field: 'currentState',
          type: 'object'
        }],
        rows: []
      };
    }
    return ($traceurRuntime.createClass)(AddRelatedBomController, {
      searchRelatedBom: function() {
        var $__3 = this;
        this.tableData.rows = [];
        this.relatedBomItemsListenerId = EVENT_SVC.get(this).listen('relatedBomItems:' + this.urn + ':done', function(event) {
          for (var relatedBomItemsObj = [],
              $__4 = 1; $__4 < arguments.length; $__4++)
            relatedBomItemsObj[$__4 - 1] = arguments[$__4];
          $__3.parseRelatedBomItems(relatedBomItemsObj);
        });
        if (this.childrenSelectedOption !== this.$rootScope.bundle.text.none || this.parentsSelectedOption !== this.$rootScope.bundle.text.none) {
          if (this.childrenSelectedOption === this.$rootScope.bundle.text.directChildren) {
            MODELS_MGR.get(this).getDirectChildrenBOMItems(this.urn);
          }
          if (this.childrenSelectedOption === this.$rootScope.bundle.text.allChildren) {
            MODELS_MGR.get(this).getAllChildrenBOMItems(this.urn);
          }
          if (this.parentsSelectedOption === this.$rootScope.bundle.text.directParents) {
            MODELS_MGR.get(this).getRelatedParentBOMItems(this.urn);
          }
        }
        this.displayResults = true;
      },
      parseRelatedBomItems: function(relatedBomItems) {
        var $__3 = this;
        _.each(relatedBomItems, function(relatedBomItem, elementIndex) {
          if (!relatedBomItem.getWorkflowReference() && ($__3.itemsFilterSelectedOption === $__3.$rootScope.bundle.text.all || ($__3.itemsFilterSelectedOption !== $__3.$rootScope.bundle.text.all && relatedBomItem.getWorkingHasChanged()))) {
            $__3.tableData.rows.push({
              item: relatedBomItem.getItemDescriptor(),
              currentState: relatedBomItem.getLifecycle(),
              itemId: relatedBomItem.getItemId(),
              ref: relatedBomItem,
              selection: {isSelected: true}
            });
          }
        });
        this.tableData.rows = _.uniq(this.tableData.rows, function(row, key) {
          return row.itemId;
        });
        this.selectedRows = this.tableData.rows;
      },
      clearResults: function() {
        this.displayResults = false;
        EVENT_SVC.get(this).unlisten(this.relatedBomItemsListenerId);
      },
      cancel: function() {
        this.$mdDialog.cancel();
        EVENT_SVC.get(this).unlisten(this.relatedBomItemsListenerId);
      },
      selectRow: function() {
        this.selectedRows = _.filter(this.tableData.rows, function(obj) {
          return obj.selection.isSelected === true;
        });
      },
      toggleAllSelection: function() {
        if (this.tableData.rows.length !== this.selectedRows.length) {
          _.each(this.tableData.rows, function(tableRow) {
            tableRow.selection.isSelected = true;
          });
          this.selectedRows = this.tableData.rows;
        } else {
          _.each(this.tableData.rows, function(tableRow) {
            tableRow.selection.isSelected = false;
          });
          this.selectedRows = [];
        }
      },
      add: function() {
        EVENT_SVC.get(this).send('relatedBomItems:added', this.selectedRows);
        this.selectedRows = [];
      }
    }, {});
  }();
  var $__default = AddRelatedBomController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAffectedItems/addRelatedBom.controller.js
