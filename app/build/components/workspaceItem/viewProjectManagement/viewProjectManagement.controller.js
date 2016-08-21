System.registerModule("com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.controller.js";
  var ViewProjectManagementController = function() {
    function ViewProjectManagementController($scope, $rootScope, $state, $stateParams, $location, $compile, $document, $filter, $timeout, $window, ModelsManager, EventService, PermissionService, uiGridConstants, PLMPermissions, FlyoutService, _) {
      var $__3 = this;
      this.$scope = $scope;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$location = $location;
      this._ = _;
      this.ModelsManager = ModelsManager;
      this.PermissionService = PermissionService;
      this.FlyoutService = FlyoutService;
      this.EventService = EventService;
      var itemListenerId;
      var currentUserListenerId;
      var linkedItemsListenerId;
      var projectItemsListenerId;
      this.resizerCounter = 0;
      this.ganttChartData = [];
      this.ganttChartScale = 'year';
      this.ganttChartAvailableScales = ['day', 'week', 'month', 'quarter', 'year'];
      this.projectData = null;
      this.jsPlumbConnectionConfig = {
        anchors: ['Left', 'Right'],
        connector: ['Flowchart', {
          stub: 30,
          gap: 0,
          alwaysRespectStubs: true,
          midpoint: 0.4
        }],
        endpoint: 'Blank',
        overlays: [['Arrow', {
          width: 8,
          length: 5,
          location: 1
        }]],
        paintStyle: {
          strokeStyle: 'black',
          lineWidth: 1.1,
          dashstyle: '3'
        }
      };
      this.viewPermission = PLMPermissions.VIEW_PROJECT_MANAGEMENT;
      this.addPermission = PLMPermissions.ADD_PROJECT_ITEM;
      this.editPermission = PLMPermissions.EDIT_PROJECT_ITEM;
      this.deletePermission = PLMPermissions.DELETE_PROJECT_ITEM;
      this.isDataAvailable = true;
      $scope.linkableItemsOptions = {
        itemsType: 'projectItems',
        associationEvent: 'associateProjectItem'
      };
      this.tableData = {
        columns: [{
          displayName: '#',
          field: 'rowId',
          width: '7%'
        }, {
          displayName: '',
          field: 'itemType',
          cellTemplate: 'itemTypeTemplate',
          width: '5%'
        }, {
          displayName: $rootScope.bundle.projectManagement.item,
          field: 'title',
          cellTemplate: 'itemLinkTemplate',
          footerCellClass: 'project-summary-title',
          aggregationType: function() {
            return $rootScope.bundle.projectManagement.summary;
          }
        }, {
          displayName: $rootScope.bundle.projectManagement.start,
          field: 'startDate',
          cellTemplate: 'dateTemplate',
          footerCellTemplate: 'footerDateTemplate',
          aggregationType: function() {
            return $__3.projectData ? $__3.projectData.startDate : '';
          },
          width: '10%'
        }, {
          displayName: $rootScope.bundle.projectManagement.end,
          field: 'endDate',
          cellTemplate: 'dateTemplate',
          footerCellTemplate: 'footerDateTemplate',
          aggregationType: function() {
            return $__3.projectData ? $__3.projectData.endDate : '';
          },
          width: '10%'
        }, {
          displayName: $rootScope.bundle.projectManagement.duration,
          field: 'duration',
          cellTemplate: 'durationTemplate',
          footerCellTemplate: 'footerDurationTemplate',
          aggregationType: function() {
            return $__3.projectData ? parseInt($__3.projectData.duration) : '';
          },
          width: '10%'
        }, {
          displayName: $rootScope.bundle.projectManagement.pre,
          field: 'pre',
          cellTemplate: 'predecessorTemplate',
          width: '5%'
        }, {
          displayName: $rootScope.bundle.projectManagement.status,
          field: 'status',
          cellTemplate: 'statusTemplate',
          width: '15%'
        }, {
          displayName: $rootScope.bundle.projectManagement.complete,
          field: 'progress',
          cellTemplate: 'percentCompleteTemplate',
          footerCellTemplate: 'footerPercentCompleteTemplate',
          aggregationType: function() {
            return $__3.projectData ? $__3.projectData.progress : '';
          },
          width: '10%'
        }],
        rows: []
      };
      this.dateFormat = 'yyyy';
      this.dateAndHourFormat = 'hh:mm a';
      this.flyoutInstance = null;
      currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
        EventService.unlisten(currentUserListenerId);
        $__3.dateFormat = UserObj.getDateFormat();
        $__3.dateAndHourFormat = (UserObj.getDateFormat() + " hh:mm a");
      });
      projectItemsListenerId = EventService.listen(("projectItems:" + $location.search().itemId + ":done"), function(event, projectItemsObj) {
        $__3.projectData = projectItemsObj.getFullList();
        $__3.tableData.rows = $__3.parseData(projectItemsObj.getFullList().projectItems);
        $__3.convertNodesToGanttRows($__3.tableData.rows);
        $__3.calculateGranularity();
        $__3.isDataAvailable = $__3.tableData.rows.length > 0;
      });
      itemListenerId = EventService.listen(("itemInstance:" + $location.search().itemId + ":done"), function(event, itemObj) {
        EventService.unlisten(itemListenerId);
        PermissionService.checkPermissionByItem(itemObj, $__3.viewPermission).then(function(hasViewPermission) {
          if (!hasViewPermission) {
            $state.go('details', {
              tab: 'details',
              view: $location.search().view,
              mode: 'view',
              itemId: $location.search().itemId
            });
          }
        });
      });
      linkedItemsListenerId = EventService.listen('itemInstance:*:associationComplete', function() {
        ModelsManager.getProjectItems($location.search().itemId);
      });
      ModelsManager.getCurrentUser();
      ModelsManager.getProjectItems($location.search().itemId);
      ModelsManager.getItem($location.search().itemId);
      this.registerApi = function(api) {
        $scope.viewProjectManagementCtrl = $__3;
        api.directives.on.new($scope, function(directiveName, directiveScope, directiveEl) {
          if (directiveName === 'ganttSideContent') {
            var ifElement = angular.element('<div/>');
            angular.element(ifElement).addClass('side-element');
            var treeTableContainer = angular.element('<table-data/>');
            angular.element(treeTableContainer).attr('columns', 'viewProjectManagementCtrl.tableData.columns');
            angular.element(treeTableContainer).attr('rows', 'viewProjectManagementCtrl.tableData.rows');
            angular.element(treeTableContainer).attr('column-footer', '');
            angular.element(treeTableContainer).attr('tree-view', '');
            angular.element(ifElement).append(treeTableContainer);
            directiveEl.append($compile(ifElement)($scope));
          }
          if (directiveName === 'ganttTask') {
            $timeout(function() {
              jsPlumb.repaintEverything();
              $__3.drawPredecessors();
            }, 0);
          }
          $__3.resizerCounter = 0;
        });
        api.core.on.rendered($scope, function() {
          var jsPlumbContainerElement = document.querySelector('.gantt-body');
          jsPlumb.bind('ready', function() {
            jsPlumb.setContainer(jsPlumbContainerElement);
          });
          api.columns.on.generate($scope, function(columns, headers) {
            jsPlumb.repaintEverything();
            $__3.drawPredecessors();
          });
          $__3.resizerCounter = 0;
        });
      };
      this.getColumnWidth = function(scale) {
        if (scale.match(/.*?week.*?/)) {
          return 60;
        }
        if (scale.match(/.*?month.*?/)) {
          return 100;
        }
        if (scale.match(/.*?quarter.*?/)) {
          return 100;
        }
        if (scale.match(/.*?year.*?/)) {
          return 120;
        }
        return 40;
      };
      $scope.$on('destroy', function() {
        if ($__3.flyoutInstance) {
          $__3.flyoutInstance.cancel();
        }
        jsPlumb.detachEveryConnection();
        EventService.unlisten(linkedItemsListenerId);
        EventService.unlisten(projectItemsListenerId);
        EventService.unlisten(itemListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewProjectManagementController, {
      convertNodesToGanttRows: function(projectItems) {
        var $__3 = this;
        this.ganttChartData = this._.map(projectItems, function(item, index) {
          var taskId = item.__self__ ? item.__self__.match(/\d+$/)[0] : '';
          return {
            title: item.title,
            tasks: [{
              name: item.type ? (item.progress + "%") : '',
              tooltips: item.startDate === item.endDate,
              classes: item.type ? [("project-item-status-tinted-" + item.statusFlag.toLowerCase() + " project-item-type-" + item.itemType.toLowerCase()), ("task-" + taskId)] : 'project-item-type-wfm-tinted project-item-type-wfm-default',
              from: new Date(item.startDate),
              to: new Date(item.endDate),
              progress: {
                color: true,
                percent: ("" + item.progress),
                classes: item.type ? [("project-item-type-" + item.itemType.toLowerCase() + " project-item-status-" + (item.statusFlag && item.statusFlag.toLowerCase()))] : ''
              }
            }]
          };
        });
        this.$timeout(function() {
          $__3.resizeGridHeight();
        }, 100);
      },
      resizeGridHeight: function() {
        var $__3 = this;
        var sideElement = document.querySelectorAll('#itemnav .ui-grid');
        var ganttBody = document.querySelectorAll('#itemnav .gantt-scrollable');
        var ganttHeader = document.querySelectorAll('#itemnav .gantt-header');
        var gridHeader = document.querySelectorAll('#itemnav .ui-grid-render-container-body .ui-grid-header-canvas');
        if (sideElement[0] && ganttBody[0] && ganttHeader[0] && gridHeader[0]) {
          angular.element(sideElement[0]).css({height: (ganttBody[0].clientHeight + ganttHeader[0].clientHeight) + 'px'});
          angular.element(gridHeader[0]).css({height: (ganttHeader[0].clientHeight - 1) + 'px'});
          this.resizerCounter++;
          if (this.resizerCounter < 10) {
            this.$timeout(function() {
              $__3.resizeGridHeight();
            }, 100);
          }
        } else {
          this.$timeout(function() {
            $__3.resizeGridHeight();
          }, 1000);
        }
      },
      calculateGranularity: function() {
        var duration = this.projectData.duration;
        if (duration <= 12) {
          this.ganttChartScale = 'day';
        } else if (duration <= 90) {
          this.ganttChartScale = 'week';
        } else if (duration <= 365) {
          this.ganttChartScale = 'month';
        } else if (duration <= 1095) {
          this.ganttChartScale = 'quarter';
        } else {
          this.ganttChartScale = 'year';
        }
      },
      parseData: function(projectItems) {
        var treeLevel = arguments[1] !== (void 0) ? arguments[1] : 0;
        var $__3 = this;
        if (treeLevel === 0) {
          this._.each(projectItems, function(item, index) {
            item.rowId = index + 1;
          });
        }
        return this._.map(projectItems, function(item, index) {
          var $__5,
              $__6;
          item.$$treeLevel = treeLevel;
          if (item.type) {
            item.itemType = item.type.title;
          }
          if (item.item) {
            var $__4 = item.item.link.match(/(\d+)\/items\/(\d+)$/),
                workspaceId = ($__5 = $__4[Symbol.iterator](), $__5.next(), ($__6 = $__5.next()).done ? void 0 : $__6.value),
                itemId = ($__6 = $__5.next()).done ? void 0 : $__6.value;
            item.href = $__3.$state.href('details', {
              workspaceId: workspaceId,
              tab: 'details',
              view: 'full',
              mode: 'view',
              itemId: (workspaceId + "@" + itemId)
            });
          }
          item.duration = parseInt(item.duration);
          if (treeLevel === 0) {
            item.pre = $__3._.map(item.predecessors, function(predecessor) {
              return projectItems.find(function(item) {
                return item.__self__ === predecessor.link;
              }).rowId;
            });
          }
          item.pre = $__3._.sortBy(item.pre).reverse();
          item.isExpandable = item.type && (item.type.title === 'WFP' || item.type.title === 'WFM');
          item.isCollapsed = true;
          return item;
        });
      },
      expandRow: function(row, grid) {
        grid.api.treeBase.expandRow(row);
        this.onRowExpanded(row);
        row.entity.isCollapsed = false;
      },
      collapseRow: function(row, grid) {
        grid.api.treeBase.collapseRow(row);
        row.entity.isCollapsed = true;
        var parentNodeIndex = row.grid.rows.indexOf(row);
        var childNodes = this._.find(this._.rest(row.grid.rows, parentNodeIndex + 1), function(nodeObj) {
          return nodeObj.treeLevel <= row.grid.rows[parentNodeIndex].treeLevel;
        });
        var lastChildNodeIndex = this._.lastIndexOf(row.grid.rows, childNodes);
        if (lastChildNodeIndex === -1) {
          this.tableData.rows.splice(parentNodeIndex + 1, this._.rest(row.grid.rows, parentNodeIndex).length);
        } else {
          this.tableData.rows.splice(parentNodeIndex + 1, lastChildNodeIndex - (parentNodeIndex + 1));
        }
        this.convertNodesToGanttRows(this.tableData.rows);
      },
      onRowExpanded: function(row) {
        var $__3 = this;
        if (row.entity.type.title === 'WFP' || row.entity.type.title === 'WFM') {
          var matches = row.entity.item.link.match(/(\d+)\/items\/(\d+)$/);
          var id = (matches[1] + "@" + matches[2]);
          var itemsListenerId = this.EventService.listen(("projectItems:" + id + ":done"), function(event, projectItemsObj) {
            var $__7;
            $__3.EventService.unlisten(itemsListenerId);
            var items = $__3.parseData(projectItemsObj.getFullList().projectItems, row.entity.$$treeLevel + 1);
            var parentRowIndex = row.grid.rows.indexOf(row);
            var tableRows = $__3.tableData.rows;
            ($__7 = tableRows).splice.apply($__7, $traceurRuntime.spread([parentRowIndex + 1, 0], items));
            $__3.convertNodesToGanttRows(tableRows);
            $__3.tableData.rows = tableRows;
            $__3.resizeGridHeight();
          });
          this.ModelsManager.getProjectItems(id, row.entity.type.title === 'WFM');
          row.entity.areChildrenFetched = true;
        }
      },
      hasActiveFlyout: function() {
        return this.flyoutInstance && this.flyoutInstance.isActive() === true;
      },
      triggerAdd: function(event) {
        var target = event.currentTarget;
        this.flyoutInstance = this.FlyoutService.open({
          templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
          anchorEl: angular.element(target),
          flyoutClass: 'add-item-flyout',
          placement: 'bottom-left',
          showArrow: true,
          backdropOption: 2,
          controller: 'AddLinkableItemsController',
          controllerAs: 'addLinkableItemsCtrl',
          scope: this.$scope
        });
      },
      drawPredecessors: function() {
        var $__3 = this;
        jsPlumb.detachEveryConnection();
        this._.each(this.tableData.rows, function(projectItem) {
          var taskId = projectItem.__self__ ? projectItem.__self__.match(/\d+$/)[0] : '';
          $__3._.each(projectItem.predecessors, function(predecessor) {
            jsPlumb.connect({
              source: document.querySelector((".task-" + taskId)),
              target: document.querySelector((".task-" + predecessor.title))
            }, $__3.jsPlumbConnectionConfig);
          });
        });
      },
      isViewState: function() {
        return (this.$location.search().mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewProjectManagementController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.controller.js
