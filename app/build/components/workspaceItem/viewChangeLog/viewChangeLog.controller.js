System.registerModule("com/autodesk/components/workspaceItem/viewChangeLog/viewChangeLog.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewChangeLog/viewChangeLog.controller.js";
  var ViewChangeLogController = function() {
    function ViewChangeLogController($scope, $rootScope, $state, $stateParams, $location, $filter, $window, $timeout, ModelsManager, EventService, FlyoutService, PermissionService, PLMPermissions, uiGridConstants, _) {
      var $__4 = this;
      this.$scope = $scope;
      this.$filter = $filter;
      this.$timeout = $timeout;
      this.$location = $location;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      var that = this;
      this.bundle = $rootScope.bundle;
      this.workspaceId = $stateParams.workspaceId;
      this.itemId = $location.search().itemId;
      this.tableData = {
        columns: [{
          displayName: that.bundle.text.dateTime,
          field: 'timestamp',
          enableSorting: true,
          suppressRemoveSort: true,
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          cellTemplate: 'changeLogDateRenderer',
          width: '20%'
        }, {
          displayName: that.bundle.text.changedBy,
          field: 'userDisplayName',
          enableSorting: true,
          suppressRemoveSort: true,
          cellTemplate: 'changeLogUserLinkRenderer',
          width: '20%'
        }, {
          displayName: that.bundle.text.action,
          field: 'action',
          enableSorting: false,
          width: '20%'
        }, {
          displayName: that.bundle.text.description,
          field: 'description',
          enableSorting: false,
          cellTemplate: 'descriptionRenderer',
          width: '40%'
        }],
        rows: []
      };
      this.viewPermission = PLMPermissions.VIEW_CHANGE_LOG;
      this.pageNumber = 0;
      this.itemQuantity = 100;
      this.dateFormat = 'yyyy';
      this.dateAndHourFormat = 'hh:mm a';
      this.currentOrder = 'desc';
      this.currentColumnId = 'timestamp';
      this.itemListenerId = EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, itemObj) {
        EventService.unlisten($__4.itemListenerId);
        PermissionService.checkPermissionByItem(itemObj, $__4.viewPermission).then(function(hasViewPermission) {
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
      this.currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
        EventService.unlisten($__4.currentUserListenerId);
        $__4.dateFormat = UserObj.getDateFormat();
        $__4.dateAndHourFormat = (UserObj.getDateFormat() + " hh:mm:ss a");
      }, true);
      ModelsManager.getCurrentUser();
      ModelsManager.getItem(this.itemId);
      this.getChangeLogData(this.currentOrder, this.currentColumnId).then(function() {}).catch(function() {});
      $scope.$on('$destroy', function() {
        EventService.unlisten($__4.itemListenerId);
        EventService.unlisten($__4.currentUserListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewChangeLogController, {
      getChangeLogData: function(order, columnId) {
        var $__4 = this;
        if ((order !== this.currentOrder) || (columnId !== this.currentColumnId)) {
          this.currentOrder = order;
          this.currentColumnId = columnId;
          this.pageNumber = 1;
          this.tableData.rows = [];
        } else {
          ++this.pageNumber;
        }
        return new Promise(function(resolve, reject) {
          $__4.ModelsManager.getChangeLog($__4.workspaceId, $__4.itemId, order, columnId, $__4.pageNumber, $__4.itemQuantity);
          var changeLogListenerId = $__4.EventService.listen(("changeLog:" + $__4.itemId + ":done"), function(event, ChangeLogObj) {
            $__4.EventService.unlisten(changeLogListenerId);
            _.each(ChangeLogObj.getFullList().elements, function(element, elementIndex) {
              var description = '';
              var htmlStr = angular.element('<span />');
              if (angular.isDefined(element.description) && element.description !== null) {
                description = element.description;
              }
              if (_.isArray(element.records) && element.records.length > 0) {
                if (angular.isDefined(element.records[0]) && element.records[0].rowId !== 0) {
                  htmlStr.append(("Row " + element.records[0].rowId + ":"));
                  htmlStr.append('<br>');
                }
                var uList = angular.element('<ul />');
                _.each(element.records, function(record, i) {
                  var oldValue = (record.oldValue !== '') ? record.oldValue : $__4.bundle.changeLog.noValue;
                  var newValue = (record.newValue !== null) ? record.newValue : '';
                  var listItem = angular.element('<li />');
                  var labelItem = angular.element('<span />');
                  labelItem.addClass('changelog-item-label');
                  if (angular.isDefined(record.fieldName) && record.fieldName !== null) {
                    labelItem.append((record.fieldName + ":&nbsp;"));
                  }
                  listItem.append(labelItem);
                  if ((record.oldValue !== null) && (record.oldValue !== ' - ') && (oldValue !== newValue)) {
                    var oldValueHTML = angular.element('<span />');
                    oldValueHTML.addClass('changelog-old-value');
                    oldValueHTML.text(oldValue);
                    listItem.append(oldValueHTML);
                    listItem.append('&nbsp; \u21d2 &nbsp;');
                  }
                  var newValueHTML = angular.element('<span />');
                  newValueHTML.addClass('changelog-new-value');
                  newValueHTML.text(newValue);
                  listItem.append(newValueHTML);
                  uList.append(listItem);
                });
                htmlStr.append(uList);
                description += htmlStr[0].outerHTML;
              }
              var actionName = $__4.bundle.item.action.short.name[element.action.toLowerCase()];
              element.action = (actionName) ? actionName : element.action;
              $__4.tableData.rows.push({
                timestamp: {
                  val: $__4.$filter('UTC')(element.timestamp),
                  dateFormat: $__4.dateAndHourFormat
                },
                userDisplayName: {
                  userId: element.userId,
                  val: element.userDisplayName
                },
                action: element.action,
                description: description
              });
            });
            if (_.size(ChangeLogObj.getFullList().elements) < $__4.itemQuantity) {
              reject();
            } else {
              resolve();
            }
            $__4.$timeout(function() {
              window.dispatchEvent(new Event('resize'));
            }, 2000);
          });
        });
      },
      openFlyoutWindow: function(event, userId) {
        this.FlyoutService.open({
          flyoutClass: 'user-profile-flyout',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          template: ("<user-profile-summary user-id=\"" + userId + "\"></user-profile-summary>")
        });
      },
      isViewState: function() {
        return (this.$location.search().mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewChangeLogController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewChangeLog/viewChangeLog.controller.js
