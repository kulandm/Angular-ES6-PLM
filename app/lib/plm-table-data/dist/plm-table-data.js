System.registerModule("com/autodesk/UiGridAutoResizer.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/UiGridAutoResizer.js";
  var UNDERSCORE = new WeakMap();
  var EVENT_SERVICE = new WeakMap();
  var LOG = new WeakMap();
  var TIMEOUT = new WeakMap();
  var WINDOW = new WeakMap();
  var UiGridAutoResizer = function() {
    function UiGridAutoResizer($timeout, $log, $window, EventService, _) {
      this.restrict = 'A';
      this.scope = false;
      TIMEOUT.set(this, $timeout);
      LOG.set(this, $log);
      WINDOW.set(this, $window);
      EVENT_SERVICE.set(this, EventService);
      UNDERSCORE.set(this, _);
    }
    return ($traceurRuntime.createClass)(UiGridAutoResizer, {link: function(scope, element, attrs) {
        var $__2 = this;
        if (attrs.uiGridAutoResizer === '') {
          LOG.get(UiGridAutoResizer.instance).warn('You need to pass a reference to the gridApi object for this grid to be resized!');
        }
        var resizeGrid = function() {
          var timeout = arguments[0] !== (void 0) ? arguments[0] : 250;
          TIMEOUT.get(UiGridAutoResizer.instance)(function() {
            if (angular.isDefined(angular.element(element)[0])) {
              var parentContainer = angular.element(element)[0].parentElement.parentElement;
              if (angular.isDefined(parentContainer) && angular.isDefined(angular.element(parentContainer)[0])) {
                var parentContainerWidth = angular.element(parentContainer)[0].offsetWidth;
                var parentContainerHeight = angular.element(parentContainer)[0].offsetHeight;
                angular.element(element).css('width', parentContainerWidth + 'px');
                angular.element(element).css('height', parentContainerHeight + 'px');
                scope.$eval(attrs.uiGridAutoResizer).core.handleWindowResize();
              }
            }
          }, timeout);
        };
        resizeGrid();
        angular.element(WINDOW.get(UiGridAutoResizer.instance)).bind('resize', function() {
          return resizeGrid($__2, 100);
        });
        scope.$on('$destroy', function() {
          angular.element(WINDOW.get(UiGridAutoResizer.instance)).unbind('resize');
        });
      }}, {directiveFactory: function($timeout, $log, $window, EventService, _) {
        UiGridAutoResizer.instance = new UiGridAutoResizer($timeout, $log, $window, EventService, _);
        return UiGridAutoResizer.instance;
      }});
  }();
  UiGridAutoResizer.directiveFactory.$inject = ['$timeout', '$log', '$window', 'EventService', '_'];
  var $__default = UiGridAutoResizer;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/UiGridAutoResizer.js
;

System.registerModule("com/autodesk/cellStateIndicator.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/cellStateIndicator.directive.js";
  function CellStateIndicator() {
    return {
      scope: {
        isDirty: '@',
        errorMessage: '=',
        invalid: '@'
      },
      transclude: true,
      templateUrl: 'cellStateIndicator.html'
    };
  }
  var $__default = CellStateIndicator;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/cellStateIndicator.directive.js
;

System.registerModule("com/autodesk/clientSort.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/clientSort.service.js";
  var ClientSortService = function() {
    function ClientSortService(_) {
      this._ = _;
    }
    return ($traceurRuntime.createClass)(ClientSortService, {sort: function(table, config) {
        var column = config.columnToSort;
        var defaultSortingFunction = function(data, column) {
          var val = data[column] ? data[column].value || data[column].val || data[column] : '';
          return angular.lowercase(val);
        };
        var userDefinedSortingFunction = this._.find(table.tableHeaders, function(col) {
          return col.field === column;
        }).sortingFunction;
        var sortedData = this._.sortBy(table.tableData, function(data) {
          return (userDefinedSortingFunction ? userDefinedSortingFunction : defaultSortingFunction)(data, column);
        });
        if (config.sortOrder === 'desc') {
          sortedData.reverse();
        }
        return sortedData;
      }}, {});
  }();
  var $__default = ClientSortService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/clientSort.service.js
;

System.registerModule("com/autodesk/rowSelector.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/rowSelector.directive.js";
  function RowSelector() {
    var directive = {
      restrict: 'E',
      scope: {
        onToggle: '&?',
        checked: '=',
        enabled: '='
      },
      templateUrl: 'rowSelector.html'
    };
    return directive;
  }
  var $__default = RowSelector;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/rowSelector.directive.js
;

System.registerModule("com/autodesk/rowStateIndicator.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/rowStateIndicator.directive.js";
  function RowStateIndicator() {
    return {
      scope: {
        isDirty: '&',
        isInvalid: '&'
      },
      templateUrl: 'rowStateIndicator.html'
    };
  }
  var $__default = RowStateIndicator;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/rowStateIndicator.directive.js
;

System.registerModule("com/autodesk/tableData.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/tableData.directive.js";
  var TIMEOUT = new WeakMap();
  var MODELS_MANAGER = new WeakMap();
  var UI_GRID_CONSTANTS = new WeakMap();
  var UI_GRID_TREE_VIEW_CONSTANTS = new WeakMap();
  var LOG = new WeakMap();
  var UNDERSCORE = new WeakMap();
  var PARSE = new WeakMap();
  var GRID_ROW_CELL_PADDING = 16;
  var GRID_HEADER_HEIGHT = 50;
  var GRID_ROW_HEIGHT = 50;
  var GRID_FOOTER_HEIGHT = 45;
  var TableData = function() {
    function TableData($timeout, ModelsManager, uiGridConstants, uiGridTreeViewConstants, $log, _, $parse) {
      this.restrict = 'E';
      this.replace = true;
      this.templateUrl = 'tableData.html';
      this.scope = {
        columns: '=',
        rows: '=',
        resizableColumns: '@',
        reorderableColumns: '@',
        clientSorting: '@',
        resizeRows: '@',
        selectableRows: '=?',
        selectRowsFunction: '&',
        noUnselect: '@',
        getFunction: '&',
        limitSize: '@',
        gridApi: '=?',
        isMultiSelect: '@',
        useDefaultSelectionColumn: '@',
        rowTemplate: '=?'
      };
      TIMEOUT.set(this, $timeout);
      MODELS_MANAGER.set(this, ModelsManager);
      UI_GRID_CONSTANTS.set(this, uiGridConstants);
      UI_GRID_TREE_VIEW_CONSTANTS.set(this, uiGridTreeViewConstants);
      LOG.set(this, $log);
      UNDERSCORE.set(this, _);
      PARSE.set(this, $parse);
    }
    return ($traceurRuntime.createClass)(TableData, {link: function(scope, element, attrs, tableDataCtrl) {
        var resizableColumns = angular.isDefined(attrs.resizableColumns);
        var reorderableColumns = angular.isDefined(attrs.reorderableColumns);
        var resizeRows = angular.isDefined(attrs.resizeRows);
        var clientSorting = angular.isDefined(attrs.clientSorting);
        var showColumnFooter = angular.isDefined(attrs.columnFooter);
        var showTreeView = angular.isDefined(attrs.treeView);
        var selectableRows = scope.selectableRows || false;
        var isMultiSelect = PARSE.get(TableData.instance)(attrs.isMultiSelect)(scope) || false;
        var useDefaultSelectionColumn = PARSE.get(TableData.instance)(attrs.useDefaultSelectionColumn)(scope) || false;
        var noUnselect = angular.isDefined(attrs.noUnselect);
        var resizerTimeout;
        var renderedTopRowId = '';
        var getMoreData = true;
        var resizeRowHeights = function() {
          var gridHtml = document.getElementsByClassName('grid' + scope.gridApi.grid.id)[0];
          var gridRenderContainer = gridHtml.getElementsByClassName('ui-grid-render-container-body');
          var gridRowsHtml = gridRenderContainer[0].getElementsByClassName('ui-grid-row');
          var gridPinnedColsHtml = gridHtml.getElementsByClassName('ui-grid-render-container-left');
          var gridPinnedColsRowHtml = (gridPinnedColsHtml.length > 0) ? gridPinnedColsHtml[0].getElementsByClassName('ui-grid-row') : '';
          var gridRowCellPadding = GRID_ROW_CELL_PADDING;
          var defaultGridRowCellHeight = scope.gridDefinition.rowHeight - gridRowCellPadding;
          var adjustedCanvasSizeDiff = 0;
          var resizeElementVertically = function(element, h) {
            angular.element(element).css({height: h + 'px'});
          };
          try {
            TIMEOUT.get(TableData.instance).cancel(resizerTimeout);
          } catch (error) {
            return;
          }
          resizerTimeout = TIMEOUT.get(TableData.instance)(function() {
            for (var l = (gridRowsHtml.length - 1); l >= 0; l--) {
              var row = gridRowsHtml[l];
              var pinnedColsRow = void 0;
              var gridRowCellsHtml = row.getElementsByClassName('ui-grid-cell');
              var gridMultilineRowCellsHtml = row.getElementsByClassName('multiline');
              var gridPinnedColsRowCellsHtml = [];
              if (gridPinnedColsHtml.length > 0) {
                pinnedColsRow = gridPinnedColsRowHtml[l];
              }
              var newGridRowHeight = defaultGridRowCellHeight;
              resizeElementVertically(row, scope.gridDefinition.rowHeight);
              resizeElementVertically(angular.element(row).children()[0], scope.gridDefinition.rowHeight);
              for (var i = (gridRowCellsHtml.length - 1); i >= 0; i--) {
                resizeElementVertically(gridRowCellsHtml[i], scope.gridDefinition.rowHeight);
              }
              if (angular.isDefined(pinnedColsRow)) {
                resizeElementVertically(pinnedColsRow, scope.gridDefinition.rowHeight);
                resizeElementVertically(angular.element(pinnedColsRow).children()[0], scope.gridDefinition.rowHeight);
                resizeElementVertically(pinnedColsRow.getElementsByClassName('ui-grid-cell')[0], scope.gridDefinition.rowHeight);
              }
              for (var i$__3 = (gridMultilineRowCellsHtml.length - 1); i$__3 >= 0; i$__3--) {
                var multilineCell = gridMultilineRowCellsHtml[i$__3];
                if (multilineCell.clientHeight > newGridRowHeight) {
                  newGridRowHeight = multilineCell.clientHeight;
                }
              }
              if (newGridRowHeight > defaultGridRowCellHeight) {
                var newGridRowHeightWithPadding = newGridRowHeight + gridRowCellPadding;
                adjustedCanvasSizeDiff += newGridRowHeightWithPadding - scope.gridDefinition.rowHeight;
                resizeElementVertically(row, newGridRowHeightWithPadding);
                resizeElementVertically(angular.element(row).children()[0], newGridRowHeightWithPadding);
                for (var i$__4 = (gridRowCellsHtml.length - 1); i$__4 >= 0; i$__4--) {
                  resizeElementVertically(gridRowCellsHtml[i$__4], newGridRowHeightWithPadding);
                }
                if (angular.isDefined(pinnedColsRow)) {
                  resizeElementVertically(pinnedColsRow, newGridRowHeightWithPadding);
                  resizeElementVertically(angular.element(pinnedColsRow).children()[0], newGridRowHeightWithPadding);
                  resizeElementVertically(pinnedColsRow.getElementsByClassName('ui-grid-cell')[0], newGridRowHeightWithPadding);
                }
              }
            }
          }, 100);
          resizerTimeout.then(function(response) {}, function(reject) {});
        };
        scope.gridApi = {};
        scope.gridDefinition = {
          rowTemplate: scope.rowTemplate,
          columnDefs: scope.columns,
          appScopeProvider: scope.$parent,
          data: scope.rows,
          useExternalSorting: !clientSorting,
          enableColumnMenus: false,
          headerRowHeight: GRID_HEADER_HEIGHT,
          enableColumnResizing: resizableColumns,
          enableColumnMoving: reorderableColumns,
          enableRowSelection: selectableRows,
          noUnselect: noUnselect,
          multiSelect: isMultiSelect,
          enableRowHeaderSelection: useDefaultSelectionColumn,
          enableSelectionBatchEvent: true,
          rowHeight: GRID_ROW_HEIGHT,
          showColumnFooter: showColumnFooter,
          columnFooterHeight: GRID_FOOTER_HEIGHT,
          enableTreeView: showTreeView,
          showTreeRowHeader: false,
          onRegisterApi: function(gridApi) {
            scope.gridApi = gridApi;
            scope.gridApi.core.on.rowsRendered(scope, function(gridObj) {
              if (resizeRows) {
                TIMEOUT.get(TableData.instance)(function() {
                  if (gridObj.grid.renderContainers.body.renderedRows.length > 0) {
                    renderedTopRowId = gridObj.grid.renderContainers.body.renderedRows[0].uid;
                    resizeRowHeights('rowsRendered');
                  }
                }, 0);
              }
            });
            scope.gridApi.core.on.scrollBegin(scope, function(scroll) {
              if ((scope.gridApi.grid.renderContainers.body.renderedRows.length > 0) && (renderedTopRowId !== scope.gridApi.grid.renderContainers.body.renderedRows[0].uid)) {
                renderedTopRowId = scope.gridApi.grid.renderContainers.body.renderedRows[0].uid;
                if (resizeRows) {
                  resizeRowHeights('scrollBegin');
                }
              }
              if ((scroll.y !== null) && (scroll.y.percentage !== null) && (scroll.y.percentage >= 0.8) && getMoreData && angular.isDefined(attrs.getFunction) && (attrs.getFunction !== '')) {
                getMoreData = false;
                var currentOrder = scope.gridApi.grid.getColumnSorting()[0].sort.direction;
                var currentColumnId = scope.gridApi.grid.getColumnSorting()[0].name;
                scope.getFunction({
                  order: currentOrder,
                  columnId: currentColumnId
                }).then(function() {
                  for (var response = [],
                      $__2 = 0; $__2 < arguments.length; $__2++)
                    response[$__2] = arguments[$__2];
                  getMoreData = true;
                }).catch(function(error) {
                  getMoreData = false;
                });
              }
            });
            scope.gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
              if (!clientSorting) {
                if (sortColumns.length > 1) {
                  angular.forEach(sortColumns, function(col) {
                    if (col.sort.priority === 1) {
                      col.sort.priority = 0;
                      col.sort.direction = null;
                    } else {
                      col.sort.priority = 1;
                    }
                  });
                } else {
                  sortColumns[0].sort.priority = 1;
                }
                var orderToFetchBy = '';
                if ((sortColumns.length === 0) || (sortColumns[0].name !== scope.gridDefinition.columnDefs[0].name)) {
                  orderToFetchBy = sortColumns[0].sort.direction;
                } else {
                  switch (sortColumns[0].sort.direction) {
                    case UI_GRID_CONSTANTS.get(TableData.instance).ASC:
                      orderToFetchBy = UI_GRID_CONSTANTS.get(TableData.instance).ASC;
                      break;
                    case UI_GRID_CONSTANTS.get(TableData.instance).DESC:
                    case undefined:
                    default:
                      orderToFetchBy = UI_GRID_CONSTANTS.get(TableData.instance).DESC;
                      break;
                  }
                }
                scope.getFunction({
                  order: orderToFetchBy,
                  columnId: sortColumns[0].name
                }).then(function() {
                  for (var response = [],
                      $__2 = 0; $__2 < arguments.length; $__2++)
                    response[$__2] = arguments[$__2];
                  getMoreData = true;
                }).catch(function(error) {
                  getMoreData = false;
                });
              }
            });
            scope.gridApi.selection.on.rowSelectionChanged(scope, function(row) {
              if (selectableRows && angular.isDefined(scope.selectRowsFunction)) {
                scope.selectRowsFunction({row: row});
              }
            });
            scope.gridApi.selection.on.rowSelectionChangedBatch(scope, function(rows) {
              if (selectableRows && angular.isDefined(scope.selectRowsFunction)) {
                _.each(rows, function(row) {
                  scope.selectRowsFunction({row: row});
                });
              }
            });
          }
        };
        scope.$watchCollection('columns', function(newVal, oldVal) {
          scope.gridDefinition.columnDefs = newVal;
        });
        scope.$watchCollection('rows', function(newVal, oldVal) {
          if (angular.isObject(newVal) && !angular.isArray(newVal)) {
            newVal = [];
          }
          scope.gridDefinition.data = newVal;
          if (angular.isDefined(scope.limitSize) && (newVal.length < parseInt(scope.limitSize))) {
            getMoreData = false;
          } else {
            getMoreData = true;
          }
          if (selectableRows && noUnselect) {
            TIMEOUT.get(TableData.instance)(function() {
              if (scope.gridDefinition.data.length > 0) {
                scope.gridApi.selection.selectRow(scope.gridDefinition.data[0]);
              }
            }, 0);
          }
        });
        scope.$watch('selectableRows', function(newVal, oldVal) {
          scope.gridApi.selection.clearSelectedRows();
          scope.gridDefinition.enableRowSelection = newVal;
          scope.gridApi.core.notifyDataChange(UI_GRID_CONSTANTS.get(TableData.instance).dataChange.OPTIONS);
          selectableRows = newVal || false;
        });
      }}, {directiveFactory: function($timeout, ModelsManager, uiGridConstants, uiGridTreeViewConstants, $log, _, $parse) {
        TableData.instance = new TableData($timeout, ModelsManager, uiGridConstants, uiGridTreeViewConstants, $log, _, $parse);
        return TableData.instance;
      }});
  }();
  TableData.directiveFactory.$inject = ['$timeout', 'ModelsManager', 'uiGridConstants', 'uiGridTreeViewConstants', '$log', '_', '$parse'];
  var $__default = TableData;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/tableData.directive.js
;

System.registerModule("com/autodesk/tableData.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/tableData.js";
  var ModelsManager = System.get("com/autodesk/apiModelsManager.js").default;
  var UnderscoreService = System.get("com/autodesk/UnderscoreService.js").default;
  var EventSerice = System.get("com/autodesk/EventService.js").default;
  var TableDataDirective = System.get("com/autodesk/tableData.directive.js").default;
  var CellStateIndicatorDirective = System.get("com/autodesk/cellStateIndicator.directive.js").default;
  var RowStateIndicatorDirective = System.get("com/autodesk/rowStateIndicator.directive.js").default;
  var RowSelectorDirective = System.get("com/autodesk/rowSelector.directive.js").default;
  var UiGridAutoResizer = System.get("com/autodesk/UiGridAutoResizer.js").default;
  var ClientSortService = System.get("com/autodesk/clientSort.service.js").default;
  angular.module(__moduleName, ['com/autodesk/apiModelsManager.js', 'com/autodesk/EventService.js', 'com/autodesk/UnderscoreService.js', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.treeView', 'ui.grid.selection']).provider('ClientSortService', function() {
    this.$get = ['_', function(_) {
      return new ClientSortService(_);
    }];
  }).directive('tableData', TableDataDirective.directiveFactory).directive('uiGridAutoResizer', UiGridAutoResizer.directiveFactory).directive('rowStateIndicator', RowStateIndicatorDirective).directive('cellStateIndicator', CellStateIndicatorDirective).directive('rowSelector', RowSelectorDirective);
  ;
  return {};
});
//# sourceURL=com/autodesk/tableData.js
;

System.get("com/autodesk/tableData.js");angular.module("com/autodesk/tableData.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('cellStateIndicator.html',
    "<div class=\"cell-state-container\" ng-class=\"{'invalid': errorMessage || invalid === 'true'}\" title=\"{{errorMessage}}\"><div class=\"cell-indicator-container\"><div class=\"cell-indicator\" ng-class=\"{'error': errorMessage || invalid === 'true', 'dirty': isDirty === 'true'}\"></div></div><ng-transclude></ng-transclude></div>"
  );


  $templateCache.put('rowSelector.html',
    "<div class=\"row-selector\"><input type=\"checkbox\" ng-disabled=\"!enabled\" ng-model=\"checked\" ng-change=\"onToggle({checked: checked})\"></div>"
  );


  $templateCache.put('rowStateIndicator.html',
    "<div class=\"indicator\" ng-class=\"{'dirty': isDirty(), 'invalid': isInvalid()}\" title=\"{{isInvalid() === true ? $root.bundle.table.row.error : ''}}\"></div>"
  );


  $templateCache.put('tableData.html',
    "<span><div ui-grid=\"gridDefinition\" ui-grid-resize-columns ui-grid-move-columns ui-grid-selection ui-grid-tree-view ui-grid-auto-resize ui-grid-auto-resizer=\"gridApi\"></div></span>"
  );
}]);