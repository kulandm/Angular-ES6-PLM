System.registerModule("com/autodesk/dashboard.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dashboard.controller.js";
  var MainDashboardController = function() {
    function MainDashboardController($scope, $rootScope, $compile, $timeout, $interval, $state, ModelsManager, FlyoutService, EventService, ClientSortService, NotificationService, NotificationTypes, $filter, _) {
      $scope.init = function() {
        var reportsListenerId;
        var enabledFeaturesListenerId = EventService.listen('enabledFeatures:*:done', function(event, EnabledFeatures) {
          EventService.unlisten(enabledFeaturesListenerId);
          if (_.find(EnabledFeatures.getDisplayableData().data, function(item) {
            return item.title === 'dashboard.reports';
          })) {
            reportsListenerId = $scope.getReports();
          }
        });
        $scope.getOutstandingWork(false);
        $scope.getBookmarkedItems();
        $scope.recentlyViewedColumns = [{
          displayName: $rootScope.bundle.text.itemName,
          field: 'itemdescription.val',
          itemType: 'object',
          cellTemplate: 'itemRenderer',
          suppressRemoveSort: false,
          width: '60%'
        }, {
          displayName: $rootScope.bundle.text.workspace,
          field: 'workspace.val',
          cellTemplate: 'workspaceRenderer',
          suppressRemoveSort: false,
          width: '40%'
        }];
        $scope.recentlyViewedData = {data: []};
        var recentlyViewedListenerId = EventService.listen('recentlyViewed:load:done', function(event, RecentlyViewedItemsObj) {
          $scope.recentlyViewedData = RecentlyViewedItemsObj.getDisplayableData();
          var container = $('#dashboardRecentlyViewed div');
          var element = angular.element('<table-data/>');
          element.attr('columns', 'recentlyViewedColumns');
          element.attr('rows', 'recentlyViewedData.data');
          element.attr('client-sorting', '');
          container.remove('table-data').append(element);
          $compile(element)($scope);
        }, true);
        ModelsManager.getRecentlyViewedItems('recentlyViewed:load:get');
        var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
          $scope.dateFormat = UserObj.getDateFormat();
        }, true);
        ModelsManager.getCurrentUser('currentUser:currentUser:get');
        $scope.$on('$destroy', function() {
          EventService.unlisten(recentlyViewedListenerId);
          EventService.unlisten(currentUserListenerId);
          EventService.unlisten(reportsListenerId);
          EventService.unlisten(enabledFeaturesListenerId);
        });
        $interval(function() {
          if ($('.dashboard-reports-all .collapsed').length === 0) {
            var resizeEvent = document.createEvent('Event');
            resizeEvent.initEvent('resize', true, true);
          }
        }, 500);
      };
      var parseDueDate = function(milestoneArray) {
        var currentDate = new Date().getTime();
        var fullDay = 24 * 60 * 60 * 1000;
        var parsedObj = {
          stateIndex: 0,
          stateDate: null
        };
        var result = _.find(milestoneArray, function(value, index) {
          if (!value.actualCompleteDate) {
            var milestoneDate = new Date(value.date).getTime();
            if ((milestoneDate - (currentDate - fullDay)) < 0) {
              parsedObj.stateIndex = 3;
              parsedObj.stateColor = 'red';
            } else if (((milestoneDate - (currentDate - fullDay)) - value.warnThreshold * fullDay) < 0) {
              parsedObj.stateIndex = 2;
              parsedObj.stateColor = 'orange';
            } else {
              parsedObj.stateIndex = 1;
              parsedObj.stateColor = 'green';
            }
            parsedObj.stateDate = $filter('date')(value.date, $scope.dateFormat);
            value.parsedObj = parsedObj;
            return true;
          }
          return false;
        });
        return result ? result.parsedObj : {stateDate: null};
      };
      $scope.retrieveDueDate = function(milestoneArray) {
        $scope.stateIndex = parseDueDate(milestoneArray).stateIndex;
        $scope.stateDate = parseDueDate(milestoneArray).stateDate;
      };
      $scope.getReports = function() {
        $scope.listOfReports = [];
        var reportsListener = EventService.listen('reports:load:done', function(event, obj) {
          $scope.listOfReports = obj.getDashboardReports();
          _.each($scope.listOfReports, function(report) {
            var thisReportListener = EventService.listen('report:' + report.id + ':done', function(event, reportObj) {
              report.reportObj = reportObj;
              EventService.unlisten(thisReportListener);
              EventService.unlisten(thisReportRejectionListener);
            }, true);
            var thisReportRejectionListener = EventService.listen('report:' + report.id + ':rejected', function() {
              report.reportObj = null;
              EventService.unlisten(thisReportListener);
              EventService.unlisten(thisReportRejectionListener);
            }, true);
            ModelsManager.getReport(report.id);
          });
        }, true);
        ModelsManager.getReports('reports:load:get');
        return reportsListener;
      };
      $scope.getOutstandingWork = function(recalculate) {
        if (angular.isUndefined($scope.outstandingWorkColumns)) {
          $scope.outstandingWorkColumns = [{
            displayName: '',
            headerCellTemplate: 'outstandingWorkHeaderMilestonesTemplate',
            field: 'iconflag',
            cellTemplate: 'iconRenderer',
            width: '4%'
          }, {
            displayName: 'icon-plm-users',
            headerCellTemplate: 'outstandingWorkHeaderEscalationsTemplate',
            field: 'delegations',
            cellTemplate: 'iconRenderer',
            width: '4%'
          }, {
            displayName: 'icon-plm-task_finished',
            headerCellTemplate: 'outstandingWorkHeaderDelegationsTemplate',
            field: 'escalations',
            cellTemplate: 'iconRenderer',
            width: '4%'
          }, {
            displayName: $rootScope.bundle.text.dueDate,
            field: 'duedate.val',
            cellTemplate: 'dateRendererDueDate',
            width: '15%'
          }, {
            displayName: $rootScope.bundle.text.itemName,
            field: 'itemdescription.val',
            cellTemplate: 'itemLinkRenderer',
            width: '28%'
          }, {
            displayName: $rootScope.bundle.text.workspace,
            field: 'workspace.val',
            cellTemplate: 'workspaceLinkRenderer',
            width: '15%'
          }, {
            displayName: $rootScope.bundle.text.state,
            field: 'workflowStateName',
            width: '10%'
          }, {
            displayName: $rootScope.bundle.text.stateSetOn,
            field: 'statesetdate.val',
            cellTemplate: 'dateRendererStateSetOn',
            width: '10%'
          }, {
            displayName: $rootScope.bundle.text.stateSetBy,
            field: 'user',
            cellTemplate: 'userNameLinkRenderer',
            width: '10%'
          }];
        }
        $scope.tableData = {data: []};
        var outstandingWorkListenerId = EventService.listen('outstandingWork:load:done', function(event, MyOutstandingWorkObj) {
          EventService.unlisten(outstandingWorkListenerId);
          var thisCurrentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
            EventService.unlisten(thisCurrentUserListenerId);
            $scope.dateFormat = UserObj.getDateFormat();
            var rowsObj = MyOutstandingWorkObj.getDisplayableData($filter, parseDueDate, $scope.dateFormat, FlyoutService);
            $scope.tableData = {data: []};
            angular.forEach(rowsObj.data, function(row) {
              $scope.tableData.data.push(row);
            });
            var container = $('#dashboardMyOutstandingWork div.outstanding-work-container');
            var element = angular.element('<table-data/>');
            element.attr('columns', 'outstandingWorkColumns');
            element.attr('rows', 'tableData.data');
            element.attr('client-sorting', '');
            container.empty().append(element);
            $compile(element)($scope);
          }, true);
          ModelsManager.getCurrentUser('currentUser:currentUser:get');
        }, true);
        ModelsManager.resetModels();
        ModelsManager.getOutstandingWork('outstandingWork:load:get', recalculate);
      };
      $scope.openFlyoutWindow = function(event, userId) {
        FlyoutService.open({
          flyoutClass: 'user-profile-flyout',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          template: '<user-profile-summary user-id=' + userId + '></user-profile-summary>'
        });
      };
      $scope.getBookmarkedItems = function() {
        $scope.bookmarkColumns = [{
          displayName: '',
          headerCellTemplate: '<div class="ui-grid-cell-contents header-cell icon"><span class="md-star"></span></div>',
          cellTemplate: 'actionButtonRenderer',
          field: 'actiontext',
          enableSorting: false,
          width: '7%'
        }, {
          displayName: $rootScope.bundle.text.itemName,
          field: 'itemdescription.val',
          suppressRemoveSort: false,
          cellTemplate: 'itemRenderer',
          width: '31%'
        }, {
          displayName: $rootScope.bundle.text.workspace,
          field: 'workspace.val',
          suppressRemoveSort: false,
          cellTemplate: 'workspaceRenderer',
          width: '31%'
        }, {
          displayName: $rootScope.bundle.text.note,
          field: 'message',
          enableSorting: false,
          width: '31%'
        }];
        $scope.bookmarkData = {data: []};
        var bookmarkedItemListenerId = EventService.listen('bookmarkedItems:load:done', function(event, BookmarksObj) {
          EventService.unlisten(bookmarkedItemListenerId);
          $scope.bookmarkData = BookmarksObj.getDisplayableData();
          var container = $('#dashboardBookmark div.bookmark-items-container');
          var element = angular.element('<table-data/>');
          element.attr('columns', 'bookmarkColumns');
          element.attr('rows', 'bookmarkData.data');
          element.attr('client-sorting', '');
          container.empty().append(element);
          $compile(element)($scope);
        }, true);
        ModelsManager.resetModels();
        ModelsManager.getBookmarkedItems('bookmarkedItems:load:get');
      };
      $scope.applySortBookmarks = function(column, order) {
        var sortedBookmarks = ClientSortService.sort({
          tableHeaders: $scope.bookmarkColumns,
          tableData: $scope.bookmarkData.data
        }, {
          columnToSort: column,
          sortOrder: order
        });
        $scope.bookmarkData = {data: sortedBookmarks};
      };
      $scope.removeBookmarkedItem = function(workspaceId, itemId) {
        var removeBookmarkListener = EventService.listen('itemInstance:' + itemId + ':done', function(event, itemObj) {
          EventService.unlisten(removeBookmarkListener);
          itemObj.setBookmark(false).then(function() {
            NotificationService.addNotification(NotificationTypes.SUCCESS, ("" + itemObj.getItemTitle() + $rootScope.bundle.notification.removeBookmark.success));
            $scope.getBookmarkedItems();
            NotificationService.showNotifications();
          });
        });
        ModelsManager.getItem(itemId);
      };
      $scope.outstandingWorkActionIcons = {refresh: 'md-sync'};
      $scope.outstandingWorkActionHandler = function(actionName) {
        switch (actionName) {
          case 'refresh':
            $scope.getOutstandingWork(true);
            break;
          default:
            break;
        }
      };
    }
    return ($traceurRuntime.createClass)(MainDashboardController, {}, {});
  }();
  var $__default = MainDashboardController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/dashboard.controller.js
;

System.registerModule("com/autodesk/dashboard.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dashboard.js";
  System.get("com/autodesk/RESTWrapperService.js");
  System.get("com/autodesk/EventService.js");
  System.get("com/autodesk/UnderscoreService.js");
  System.get("com/autodesk/apiModelsManager.js");
  System.get("com/autodesk/notification.js");
  System.get("com/autodesk/tableData.js");
  System.get("com/autodesk/flyout.js");
  System.get("com/autodesk/filters.js");
  var MainDashbaordController = System.get("com/autodesk/dashboard.controller.js").default;
  angular.module(__moduleName, ['com/autodesk/RESTWrapperService.js', 'com/autodesk/filters.js', 'com/autodesk/UnderscoreService.js', 'com/autodesk/EventService.js', 'com/autodesk/apiModelsManager.js', 'com/autodesk/notification.js', 'com/autodesk/tableData.js', 'com/autodesk/flyout.js', 'com/autodesk/filters.js']).controller('MainDashboardController', MainDashbaordController);
  return {};
});
//# sourceURL=com/autodesk/dashboard.js
;

System.get("com/autodesk/dashboard.js");angular.module("com/autodesk/dashboard.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('mainDashboard.html',
    "<!-- Main content--> <span class=\"dashboard-container\" layout=\"column\" layout-fill><md-content layout-fill id=\"main-dashboard\" ng-init=\"init()\"><!-- Reports/Charts --><div layout=\"row\" layout-margin feature-toggle=\"dashboard.reports\"><section-wrapper collapsible collapsed=\"true\" header-title=\"{{bundle.text.reports}}\"><div ng-if=\"listOfReports.length === 0\" class=\"no-results-msg\"><p>{{$root.bundle.reports.noReportsToShow}} <span>{{$root.bundle.reports.learnMore}}</span></p></div><div layout=\"row\" class=\"dashboard-reports-all\"><div ng-repeat=\"report in listOfReports\" flex=\"33\"><report-chart report-obj=\"report.reportObj\" is-modal=\"false\" class=\"dashboard-report\"></report-chart></div></div></section-wrapper></div><!-- My outstanding work --><div layout=\"row\" layout-margin><section-wrapper id=\"dashboardMyOutstandingWork\" collapsible collapsed=\"false\" header-title=\"{{bundle.dashboard.myOutstandingWork}}\" action-icons=\"outstandingWorkActionIcons\" action-handler=\"outstandingWorkActionHandler\"><div class=\"outstanding-work-container\"></div></section-wrapper></div><div layout=\"row\"><!-- Bookmark items --><div flex=\"66\" class=\"bookmark-items-wrapper\"><section-wrapper id=\"dashboardBookmark\" collapsible collapsed=\"false\" header-title=\"{{bundle.dashboard.bookmarks}}\"><div class=\"bookmark-items-container\"></div></section-wrapper></div><!-- Recently viewed items list --><div flex class=\"recently-viewed-items-wrapper\"><section-wrapper id=\"dashboardRecentlyViewed\" collapsible collapsed=\"false\" header-title=\"{{bundle.dashboard.myRecentlyViewedItems}}\"><div class=\"recently-viewed-items-container\"></div></section-wrapper></div></div><div layout=\"row\" layout-margin></div></md-content></span><script type=\"text/ng-template\" id=\"itemRenderer\"><div class=\"ui-grid-cell-contents\"><a href=\"{{row.entity.itemdescription.href}}\" title=\"{{row.entity.itemdescription.val}}\">{{row.entity.itemdescription.val}}</a></div></script><script type=\"text/ng-template\" id=\"workspaceRenderer\"><div class=\"ui-grid-cell-contents\"><a href=\"{{row.entity.workspace.href}}\" title=\"{{row.entity.workspace.val}}\">{{row.entity.workspace.val}}</a></div></script><script type=\"text/ng-template\" id=\"userNameLinkRenderer\"><div class=\"ui-grid-cell-contents\"><a href=\"javascript:;\" ng-click=\"grid.appScope.openFlyoutWindow($event, row.entity.user.userId)\" title=\"{{row.entity.user.title}}\">{{row.entity.user.title}}</a></div></script><script type=\"text/ng-template\" id=\"itemLinkRenderer\"><div class=\"ui-grid-cell-contents\"><a href=\"{{row.entity.itemdescription.href}}\" title=\"{{row.entity.itemdescription.val}}\">{{row.entity.itemdescription.val}}</a></div></script><script type=\"text/ng-template\" id=\"workspaceLinkRenderer\"><div class=\"ui-grid-cell-contents\"><a href=\"{{row.entity.workspace.href}}\" title=\"{{row.entity.workspace.val}}\">{{row.entity.workspace.val}}</a></div></script><script type=\"text/ng-template\" id=\"dateRendererDueDate\"><div class=\"ui-grid-cell-contents\">\r" +
    "\n" +
    "\t\t{{row.entity.duedate.val | date: row.entity.duedate.dateFormat}}\r" +
    "\n" +
    "\t</div></script><script type=\"text/ng-template\" id=\"dateRendererStateSetOn\"><div class=\"ui-grid-cell-contents\">{{row.entity.statesetdate.val | date: row.entity.statesetdate.dateFormat}}</div></script><script type=\"text/ng-template\" id=\"iconRenderer\"><div class=\"ui-grid-cell-contents icon\" ng-bind-html=\"COL_FIELD\"></div></script><script type=\"text/ng-template\" id=\"actionButtonRenderer\"><div class=\"ui-grid-cell-contents button\">\r" +
    "\n" +
    "\t\t<md-button\r" +
    "\n" +
    "\t\t\tclass=\"md-primary\"\r" +
    "\n" +
    "\t\t\taria-label=\"{{$root.bundle.button.bookmark}}\"\r" +
    "\n" +
    "\t\t\tng-click=\"grid.appScope.removeBookmarkedItem(COL_FIELD.workspaceId, COL_FIELD.itemId)\">\r" +
    "\n" +
    "\t\t\t<span class=\"md-star\"></span>\r" +
    "\n" +
    "\t\t</md-button>\r" +
    "\n" +
    "\t</div></script><script type=\"text/ng-template\" id=\"outstandingWorkHeaderMilestonesTemplate\"><div ng-class=\"{ 'sortable': sortable }\">\r" +
    "\n" +
    "\t\t<div class=\"ui-grid-cell-contents header-cell icon\" col-index=\"renderIndex\">\r" +
    "\n" +
    "\t\t\t<span class=\"md md-flag\" title=\"{{$root.bundle.text.milestones}}\"></span>\r" +
    "\n" +
    "\t\t\t<span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div></script><script type=\"text/ng-template\" id=\"outstandingWorkHeaderEscalationsTemplate\"><div ng-class=\"{ 'sortable': sortable }\">\r" +
    "\n" +
    "\t\t<div class=\"ui-grid-cell-contents header-cell icon\" col-index=\"renderIndex\">\r" +
    "\n" +
    "\t\t\t<span class=\"md icon-plm-users\" title=\"{{$root.bundle.text.delegations}}\"></span>\r" +
    "\n" +
    "\t\t\t<span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div></script><script type=\"text/ng-template\" id=\"outstandingWorkHeaderDelegationsTemplate\"><div ng-class=\"{ 'sortable': sortable }\">\r" +
    "\n" +
    "\t\t<div class=\"ui-grid-cell-contents header-cell icon\" col-index=\"renderIndex\">\r" +
    "\n" +
    "\t\t\t<span class=\"md icon-plm-task_finished\" title=\"{{$root.bundle.text.escalations}}\"></span>\r" +
    "\n" +
    "\t\t\t<span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div></script>"
  );
}]);