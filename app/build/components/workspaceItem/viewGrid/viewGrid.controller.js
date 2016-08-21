System.registerModule("com/autodesk/components/workspaceItem/viewGrid/viewGrid.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewGrid/viewGrid.controller.js";
  var LOCATION = new WeakMap();
  var ViewGridController = function() {
    function ViewGridController($scope, $rootScope, $location, $state, $stateParams, $timeout, $window, ModelsManager, EventService, ClientSortService, PLMPermissions, _) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$window = $window;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.ClientSortService = ClientSortService;
      this.PLMPermissions = PLMPermissions;
      this._ = _;
      LOCATION.set(this, $location);
      var that = this;
      this.bundle = $rootScope.bundle;
      this.workspaceId = $stateParams.workspaceId;
      this.itemId = $location.search().itemId;
      this.edit = angular.isDefined($stateParams.edit);
      this.edit = (LOCATION.get(this).search().mode === 'edit');
      this.editPermission = PLMPermissions.EDIT_GRID;
      this.addPermission = PLMPermissions.ADD_GRID;
      this.showContextMenu = false;
      this.canHideContextMenu = true;
      this.selectedRowId = undefined;
      this.errors = {};
      this.scrollContext = angular.element($window);
      this.endOfList = true;
      this.customVars = {selectAll: false};
      this.tableColumns = [];
      this.tableData = [];
      this.sortConfig = {
        disableInitialSort: false,
        applySort: that.applySort
      };
      this.GridObj = null;
      this.gridData = {rows: []};
      this.gridMeta = {};
      ModelsManager.getGrid(this.workspaceId, this.itemId);
      this.gridListenerId = EventService.listen(("grid:" + this.itemId + ":done"), function(event, gridObj) {
        $__2.GridObj = gridObj;
        $__2.gridData = $__2.GridObj.getFullList();
        ModelsManager.getGridMeta($__2.workspaceId, $__2.itemId);
      });
      this.gridMetaListenerId = EventService.listen(("gridMeta:" + this.itemId + ":done"), function(event, GridMetaObj) {
        $__2.gridMeta = GridMetaObj.getFullList();
        $__2.tableColumns = [{
          displayName: '',
          field: 'chkBox',
          renderer: 'chkBoxAll',
          cellRenderer: 'chkBoxRenderer',
          width: 3
        }, {
          displayName: that.bundle.grid.id,
          field: 'rowId',
          enableColumnSorting: true,
          cellRenderer: 'gridMetaRenderer',
          width: 5
        }];
        $__2._.each($__2.gridMeta, function(row, rowIndex) {
          $__2.tableColumns.push({
            displayName: row.title,
            field: row.link,
            enableColumnSorting: true,
            cellRenderer: 'gridMetaRenderer'
          });
          $__2._.each($__2.gridData.rows, function(dataRow, rowIndex) {
            if (!angular.isDefined($__2.errors[rowIndex])) {
              $__2.errors[rowIndex] = {};
            }
            $__2.errors[rowIndex][row.link] = false;
          });
        });
        if ($state.params.addRow) {
          $__2.addRow();
          $__2.parseGridData();
        } else {
          $__2.parseGridData();
        }
      });
      this.gridValidationListenerId = null;
      this.gridValidationListenerId = EventService.listen('grid:validationsErrors:present', function(event, errs) {
        $__2._.each($__2.errors, function(error, ind) {
          $__2._.each(error, function(col, colInd) {
            $__2.errors[ind][colInd] = false;
          });
        });
        $__2._.each(errs, function(errorArr, rowIndex) {
          if (!angular.isDefined($__2.errors[rowIndex])) {
            $__2.errors[rowIndex] = {};
          }
          $__2._.each(errorArr, function(error) {
            $__2.errors[rowIndex][error.fieldId] = true;
          });
        });
        $__2._.each($__2.tableData, function(row, rowIndex) {
          $__2._.each(row, function(col, fieldId) {
            if ($__2._.isObject(col)) {
              col.error = ($__2.errors[row.rowId] ? $__2.errors[row.rowId][fieldId] : false);
            }
          });
        });
      }, true);
      EventService.listen('state:change:done', function() {
        $__2.checkCurrentState();
      });
      $scope.$on('$destroy', function() {
        EventService.unlisten($__2.gridValidationListenerId);
        EventService.unlisten($__2.gridListenerId);
        EventService.unlisten($__2.gridMetaListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewGridController, {
      checkCurrentState: function() {
        if (!this.isViewState()) {
          this.edit = true;
        } else {
          this.edit = false;
        }
        this.ModelsManager.getGrid(this.workspaceId, this.itemId);
      },
      applySort: function(column, order, scope) {
        var that = scope.viewGridCtrl;
        that.tableData = that.ClientSortService.sort({
          tableHeaders: that.tableColumns,
          tableData: that.tableData
        }, {
          columnToSort: column,
          sortOrder: order
        });
      },
      parseGridData: function() {
        var $__2 = this;
        this.tableData = [];
        this._.each(this.gridData.rows, function(row, rowIndex) {
          $__2.tableData.push($__2.parseRow(row, rowIndex));
        });
      },
      parseRow: function(row, rowIndex) {
        var $__2 = this;
        var parsedData = {};
        parsedData.chkBox = {};
        parsedData.rowId = row.rowData[0];
        var rowIdVal = parsedData.rowId.value;
        parsedData.rowId.originalValue = rowIdVal;
        var columns = row.rowData;
        this._.each(this.gridMeta, function(column, columnIndex) {
          var colId = column.link.substring(column.link.lastIndexOf('/') + 1);
          var foundCol = $__2._.find(columns, function(col) {
            return colId === (col.__self__ ? col.__self__.substring(col.__self__.lastIndexOf('/') + 1) : '');
          });
          var val = (angular.isDefined(foundCol) ? foundCol.value : undefined);
          parsedData[column.link] = {
            value: val,
            originalValue: val,
            metadata: {dataTypeId: column.definition.type.dataTypeId},
            __self__: column.link,
            title: column.title,
            error: ($__2.errors[rowIndex] ? $__2.errors[rowIndex][column.link] : false),
            isEdit: $__2.edit,
            waiting: false,
            unitOfMeasure: null,
            triggerEdit: function() {
              return $__2.triggerEdit();
            },
            interactions: {
              showClear: false,
              overBtn: false,
              setShowClear: function($event) {
                this.$timeout.cancel(this.testInv);
                this.showClear = true;
                this.overBtn = true;
              },
              testShowClear: function($event) {
                var $__3 = this;
                var that = this;
                if (this.mousePos !== ($event.clientX + "." + $event.clientY)) {
                  this.showClear = true;
                }
                this.mousePos = ($event.clientX + "." + $event.clientY);
                this.testInv = this.$timeout(function() {
                  if ($__3.mousePos === ($event.clientX + "." + $event.clientY) && !$__3.overBtn) {
                    $__3.showClear = false;
                  }
                }, 500);
              }
            },
            validations: [{
              type: 'MAX_LENGTH',
              settings: {maxlength: 512}
            }]
          };
        });
        parsedData.linkUrl = '#';
        parsedData.triggerContextMenu = this.triggerContextMenu;
        parsedData.isEdit = this.edit;
        var that = this;
        parsedData.hasChanged = function() {
          var changed = false;
          if (this.rowId === '') {
            return true;
          }
          that._.each(this, function(col) {
            if (col.value !== col.originalValue) {
              changed = true;
            }
          });
          return changed;
        };
        return parsedData;
      },
      addRow: function(rowIndex) {
        var ind = angular.isDefined(rowIndex) ? rowIndex : this._.size(this.tableData);
        var newRow = {rowData: [{value: ''}]};
        this._.each(this.gridMeta, function(column, columnIndex) {
          newRow.rowData.push({
            __self__: column.link,
            value: undefined
          });
        });
        this.errors[this._.size(this.errors)] = this.errors[this._.size(this.errors) - 1];
        if (angular.isDefined(rowIndex)) {
          this.gridData.rows.splice(rowIndex, 0, newRow);
        } else {
          this.gridData.rows.push(newRow);
        }
        this.tableData.push(this.parseRow(newRow, ind));
      },
      doScroll: function() {
        if (this.endOfList) {
          return;
        }
      },
      performAction: function(event, row, key) {},
      triggerSave: function() {
        var $__2 = this;
        this._.each(this.tableData, function(row, key) {
          row.waiting = true;
        });
        this.EventService.send(("grid:" + this.itemId + ":saveGrid"), [this.GridObj, this._, this.tableData, this.workspaceId, this.itemId, this.gridMeta]);
        var gridSaveListenerId = this.EventService.listen(("grid:" + this.itemId + ":saveDone"), function(event, flag, obj) {
          $__2.EventService.unlisten(gridSaveListenerId);
          if (flag) {
            LOCATION.get($__2).search({
              tab: LOCATION.get($__2).search().tab,
              view: LOCATION.get($__2).search().view,
              mode: 'view',
              itemId: LOCATION.get($__2).search().itemId
            });
          }
          $__2._.each($__2.tableData, function(row, key) {
            row.waiting = false;
          });
        });
      },
      triggerCancel: function() {
        this.gridData = this.GridObj.getFullList();
        LOCATION.get(this).search({
          tab: LOCATION.get(this).search().tab,
          view: LOCATION.get(this).search().view,
          mode: 'view',
          itemId: LOCATION.get(this).search().itemId
        });
      },
      triggerAdd: function() {
        this.triggerEdit(true);
      },
      triggerEdit: function(addRow) {
        if (!this.edit) {
          LOCATION.get(this).search({
            tab: LOCATION.get(this).search().tab,
            view: LOCATION.get(this).search().view,
            mode: 'edit',
            itemId: LOCATION.get(this).search().itemId
          });
        } else {
          if (addRow) {
            this.addRow();
          }
        }
      },
      triggerContextMenu: function(event, param) {
        var $__2 = this;
        return;
        if (!this.edit) {
          return;
        }
        this.canHideContextMenu = false;
        this.showContextMenu = true;
        this.$timeout(function() {
          $__2.canHideContextMenu = true;
        }, 500);
        $('.context-menu').css({
          'z-index': 10000,
          left: (event.clientX + "px"),
          top: (event.clientY + "px")
        });
        this.selectedRowId = parseInt(param.rowId) - 1;
      },
      hideContextMenu: function() {
        if (this.canHideContextMenu) {
          this.showContextMenu = false;
        }
      },
      isViewState: function() {
        return (LOCATION.get(this).search().mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewGridController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewGrid/viewGrid.controller.js
