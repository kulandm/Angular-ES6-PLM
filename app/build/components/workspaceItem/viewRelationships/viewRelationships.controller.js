System.registerModule("com/autodesk/components/workspaceItem/viewRelationships/viewRelationships.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewRelationships/viewRelationships.controller.js";
  var ViewRelationshipsController = function() {
    function ViewRelationshipsController(_, $location, $mdDialog, $rootScope, $scope, $state, $timeout, $q, EventService, FlyoutService, ModelsManager, PermissionService, UrnParser, PLMPermissions, NotificationService, NotificationTypes, uiGridConstants, FieldTypes) {
      var $__4 = this;
      this._ = _;
      this.$location = $location;
      this.$mdDialog = $mdDialog;
      this.$scope = $scope;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$q = $q;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.ModelsManager = ModelsManager;
      this.UrnParser = UrnParser;
      this.PLMPermissions = PLMPermissions;
      this.FieldTypes = FieldTypes;
      var itemListenerId;
      var relatedItemsListenerId;
      var linkedItemsListenerId;
      var addLinkableItemsListenerId;
      this.directions = {
        BI_DIRECTIONAL: 'Bi-Directional',
        UNI_DIRECTIONAL: 'Uni-Directional'
      };
      this.workspaceId;
      this.itemId;
      this.viewState = 'relationships';
      this.edit = (this.$location.search().mode === 'edit');
      this.addPermission = PLMPermissions.ADD_RELATIONSHIPS;
      this.editPermission = PLMPermissions.EDIT_RELATIONSHIPS;
      this.viewPermission = PLMPermissions.VIEW_RELATIONSHIPS;
      this.deletePermission = PLMPermissions.DELETE_RELATIONSHIPS;
      this.hasEditPermission;
      this.hasActionPermission = false;
      this.disableSelection = false;
      this.RelatedItemsObj = null;
      this.selectedRelationships = [];
      this.bundle = $rootScope.bundle;
      this.tableData = {
        columns: [{
          field: 'indicator',
          displayName: '',
          cellTemplate: 'indicatorTemplate',
          enableColumnResizing: false,
          width: '5',
          enableSorting: false
        }, {
          field: 'selection',
          headerCellTemplate: 'checkboxHeaderTemplate',
          cellTemplate: 'checkboxTemplate',
          enableColumnResizing: false,
          width: '50'
        }, {
          displayName: $rootScope.bundle.relationships.item,
          field: 'item.title',
          cellTemplate: 'linkRenderer'
        }, {
          displayName: $rootScope.bundle.relationships.workspace,
          field: 'workspace.title'
        }, {
          displayName: $rootScope.bundle.relationships.currentState,
          field: 'state.title'
        }, {
          displayName: $rootScope.bundle.relationships.directionType,
          field: 'directionField',
          cellTemplate: 'editableCellTemplate_direction',
          dataType: FieldTypes.PICKLIST,
          fieldMeta: {}
        }, {
          displayName: $rootScope.bundle.relationships.description,
          field: 'descriptionField',
          cellTemplate: 'editableCellTemplate',
          dataType: FieldTypes.SINGLE_LINE_TEXT,
          fieldMeta: {fieldLength: 150}
        }],
        rows: []
      };
      this.gridApiInterface;
      this.flyoutInstance = null;
      $scope.linkableItemsOptions = {itemsType: 'relationshipItems'};
      this.addedItems = [];
      itemListenerId = EventService.listen(("itemInstance:" + $location.search().itemId + ":done"), function(event, itemObj) {
        EventService.unlisten(itemListenerId);
        $__4.itemId = itemObj.getId();
        $__4.workspaceId = itemObj.workspaceObj.getId();
        $__4.getRelatedWorkspaces($__4.workspaceId);
        PermissionService.checkPermissionByItem(itemObj, $__4.editPermission, true, true).then(function(hasEditPermission) {
          $__4.hasEditPermission = hasEditPermission;
          ModelsManager.getRelatedItems($location.search().itemId);
        });
        $__4.$q.all([PermissionService.checkPermissionByItem(itemObj, $__4.deletePermission, true, true), PermissionService.checkPermissionByItem(itemObj, $__4.addPermission, true, true), PermissionService.checkPermissionByItem(itemObj, $__4.editPermission, true, true)]).then(function(permissions) {
          $__4.hasActionPermission = permissions[0] || permissions[1] || permissions[2];
          $__4.disableSelection = !(permissions[0] || permissions[2]);
        });
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
      relatedItemsListenerId = EventService.listen(("relatedItems:" + $location.search().itemId + ":done"), function(event, relatedItemsObj) {
        $__4.RelatedItemsObj = relatedItemsObj;
        if ($__4.isEditState() && $__4.$state.params.addedItems && $__4.$state.params.addedItems.length) {
          var addedItemRefs = $__4._.pluck($__4.$state.params.addedItems, 'ref');
          var parsedAddedItems = $__4.parseRelatedItems(addedItemRefs, true);
          var parsedExistingItems = $__4.parseRelatedItems(relatedItemsObj.getFullList());
          $__4.tableData.rows = parsedAddedItems.concat(parsedExistingItems);
        } else {
          $__4.tableData.rows = $__4.parseRelatedItems(relatedItemsObj.getFullList());
        }
        $__4.$timeout(function() {
          window.dispatchEvent(new Event('resize'));
        }, 2000);
      });
      addLinkableItemsListenerId = EventService.listen('linkableItems:added', function(event) {
        for (var addedItems = [],
            $__5 = 1; $__5 < arguments.length; $__5++)
          addedItems[$__5 - 1] = arguments[$__5];
        $__4.$state.go($__4.viewState, {
          addedItems: addedItems,
          tab: $__4.$location.search().tab,
          view: $__4.$location.search().view,
          mode: 'edit',
          itemId: $__4.$location.search().itemId
        });
      });
      linkedItemsListenerId = EventService.listen('itemInstance:*:associationComplete', function() {
        ModelsManager.getRelatedItems($location.search().itemId);
      });
      ModelsManager.getItem($location.search().itemId);
      $scope.$on('$destroy', function() {
        if ($__4.flyoutInstance) {
          $__4.flyoutInstance.cancel();
        }
        EventService.unlisten(relatedItemsListenerId);
        EventService.unlisten(addLinkableItemsListenerId);
        EventService.unlisten(linkedItemsListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewRelationshipsController, {
      parseRelatedItems: function(relatedItems, isNewlyAdded) {
        var $__4 = this;
        return this._.map(relatedItems, function(relatedItem) {
          var result = relatedItem.json;
          var itemLink = $__4.UrnParser.encode(result.item.urn);
          var itemWs = result.item.urn.split('.').reverse()[1];
          if (isNewlyAdded) {
            result.associateItem = {
              itemId: $__4.itemId,
              workspaceId: $__4.workspaceId
            };
          }
          result.item.href = $__4.$state.href('details', {
            workspaceId: itemWs,
            tab: 'details',
            view: 'full',
            mode: 'view',
            itemId: itemLink
          });
          result.isNewlyAdded = isNewlyAdded;
          result.descriptionField = {
            value: result.description || '',
            originalValue: result.description || ''
          };
          var directionOption = [{
            title: $__4.bundle.relationships.biDirectional,
            link: $__4.directions.BI_DIRECTIONAL
          }, {
            title: $__4.bundle.relationships.uniDirectional,
            link: $__4.directions.UNI_DIRECTIONAL
          }];
          var selectedDirection = result.direction && result.direction.type === $__4.directions.UNI_DIRECTIONAL ? directionOption[1] : directionOption[0];
          result.directionField = {
            value: $__4._.clone(selectedDirection),
            originalValue: $__4._.clone(selectedDirection),
            options: {items: directionOption}
          };
          return result;
        }, this);
      },
      getRelatedWorkspaces: function(workspaceId) {
        var $__4 = this;
        var relatedWorkspacesListenerId = this.EventService.listen(("relatedWorkspaces:" + workspaceId + ":done"), function(event, relatedWorkspacesObj) {
          $__4.EventService.unlisten(relatedWorkspacesListenerId);
          var relatedWorkspaces = relatedWorkspacesObj.getFullList();
          $__4.permittedWSPromises = $__4._.map(relatedWorkspaces.workspaces, function(workspace) {
            return new Promise(function(resolve) {
              var relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
              var workspaceListenerId = $__4.EventService.listen(("workspaceInstance:" + relatedWSId + ":done"), function(event, workspaceObj) {
                $__4.EventService.unlisten(workspaceListenerId);
                $__4.EventService.unlisten(workspacePermissionErrorListenerId);
                var userPermissionsListenerId = $__4.EventService.listen(("userPermissions:" + relatedWSId + "~*:done"), function(event, userPermissionsObj, workspaceId) {
                  $__4.EventService.unlisten(userPermissionsListenerId);
                  if (userPermissionsObj.hasPermission($__4.PLMPermissions.ADD_ITEMS) || userPermissionsObj.hasPermission($__4.PLMPermissions.VIEW_ITEMS)) {
                    resolve({
                      workspaceObj: workspaceObj,
                      canAdd: userPermissionsObj.hasPermission($__4.PLMPermissions.ADD_ITEMS),
                      canView: userPermissionsObj.hasPermission($__4.PLMPermissions.VIEW_ITEMS)
                    });
                  } else {
                    resolve(false);
                  }
                });
              });
              var workspacePermissionErrorListenerId = $__4.EventService.listen('workspaceInstance:' + relatedWSId + ':permissionError', function(event) {
                $__4.EventService.unlisten(workspaceListenerId);
                $__4.EventService.unlisten(workspacePermissionErrorListenerId);
                resolve(false);
              });
              $__4.ModelsManager.getWorkspace(relatedWSId);
            });
          });
        });
        this.ModelsManager.getRelationshipRelatedWorkspaces(workspaceId);
      },
      triggerEdit: function() {
        this.$state.go(this.viewState, {
          tab: this.$location.search().tab,
          view: this.$location.search().view,
          mode: 'edit',
          itemId: this.$location.search().itemId
        });
      },
      selectRow: function(row) {
        if (row.isSelected && !this._.contains(this.selectedRelationships, row.entity.__self__)) {
          this.selectedRelationships.push({
            __self__: row.entity.__self__,
            title: row.entity.item.title,
            urn: row.entity.item.urn
          });
        } else {
          this.selectedRelationships = this._.reject(this.selectedRelationships, function(item) {
            return item.__self__ === row.entity.__self__;
          });
        }
        return this.selectedRelationships.length;
      },
      triggerDelete: function() {
        var $__4 = this;
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.html',
          controller: 'RemoveItemConfirmationController',
          controllerAs: 'removeItemCtrl',
          locals: {itemCount: this.selectedRelationships.length}
        }).then(function() {
          $__4.removeSelectedItems();
        });
      },
      triggerSave: function() {
        var $__4 = this;
        this._.each(this.tableData.rows, function(row) {
          row.waiting = true;
        });
        this.EventService.send(("relatedItems:" + this.$location.search().itemId + ":save"), [this.RelatedItemsObj, this.tableData.rows]);
        var relatedItemsSaveListenerId = this.EventService.listen(("relatedItems:" + this.$location.search().itemId + ":saveDone"), function(event) {
          for (var results = [],
              $__5 = 1; $__5 < arguments.length; $__5++)
            results[$__5 - 1] = arguments[$__5];
          $__4.EventService.unlisten(relatedItemsSaveListenerId);
          $__4._.each($__4.tableData.rows, function(row) {
            row.waiting = false;
          });
          $__4._.each(results, function(result) {
            if (result.isSaved && result.isAdded) {
              $__4.NotificationService.addNotification($__4.NotificationTypes.SUCCESS, ("" + result.title + $__4.bundle.notification.singleAdd.success));
            } else if (result.isSaved) {
              $__4.NotificationService.addNotification($__4.NotificationTypes.SUCCESS, ("" + result.title + $__4.bundle.notification.singleEdit.success));
            } else {
              $__4.NotificationService.addNotification($__4.NotificationTypes.ERROR, ("" + result.title + $__4.bundle.notification.singleEdit.failed));
            }
          });
          if ($__4._.every($__4._.pluck(results, 'isSaved'))) {
            $__4.NotificationService.showNotifications(null, $__4.bundle.notification.bulk.updateAllPassed);
            $__4.$state.go($__4.viewState, {
              tab: $__4.$location.search().tab,
              view: $__4.$location.search().view,
              mode: 'view',
              itemId: $__4.$location.search().itemId
            });
          } else if ($__4._.some($__4._.pluck(results, 'isSaved'))) {
            $__4.NotificationService.showNotifications(null, $__4.bundle.notification.bulk.updateAllPassed);
          } else {
            $__4.NotificationService.showNotifications(null, $__4.bundle.notification.bulk.updateAllFailed);
          }
        });
      },
      triggerCancel: function() {
        this.$state.go(this.viewState, {
          tab: this.$location.search().tab,
          view: this.$location.search().view,
          mode: 'view',
          itemId: this.$location.search().itemId
        });
      },
      removeSelectedItems: function() {
        var $__4 = this;
        var promises = this._.map(this.selectedRelationships, function(relationship, index) {
          var selfLink = relationship.__self__.substring(relationship.__self__.lastIndexOf('/') + 1);
          return $__4.$q(function(resolve, reject) {
            var relatedItemSaveListenerId = $__4.EventService.listen(("relatedItem:" + selfLink + ":deleteDone"), function(event, flag) {
              $__4.EventService.unlisten(relatedItemSaveListenerId);
              if (flag) {
                $__4.NotificationService.addNotification($__4.NotificationTypes.SUCCESS, ("" + relationship.title + $__4.bundle.notification.singleRemove.success));
              } else {
                $__4.NotificationService.addNotification($__4.NotificationTypes.ERROR, ("" + relationship.title + $__4.bundle.notification.failed));
              }
              resolve();
            });
            $__4.EventService.send(("relatedItem:" + selfLink + ":deleteItem"), relationship.__self__);
          });
        });
        this.$q.all(promises).then(function() {
          $__4.ModelsManager.getRelatedItems($__4.$location.search().itemId);
          $__4.selectedRelationships = [];
          $__4.NotificationService.showNotifications();
        });
      },
      hasActiveFlyout: function() {
        return this.flyoutInstance && this.flyoutInstance.isActive() === true;
      },
      triggerAdd: function(event) {
        var $__4 = this;
        var target = event.currentTarget;
        return Promise.all(this.permittedWSPromises).then(this._.filter).then(function(results) {
          var allowViewWorkspaces = $__4._.filter($__4._.map(results, function(result) {
            return result.canView ? result.workspaceObj : null;
          }));
          $__4.flyoutInstance = $__4.FlyoutService.open({
            templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
            anchorEl: angular.element(target),
            flyoutClass: 'add-item-flyout',
            placement: 'bottom-left',
            showArrow: true,
            backdropOption: 2,
            controller: 'AddLinkableItemsController',
            controllerAs: 'addLinkableItemsCtrl',
            disableDefaultZIndexAllocation: true,
            scope: $__4.$scope,
            resolve: {relatedWorkspaces: function() {
                return allowViewWorkspaces;
              }}
          });
        });
      },
      isViewState: function() {
        return this.$location.search().mode === 'view';
      },
      isEditState: function() {
        return this.$location.search().mode === 'edit';
      },
      isTableRowDirty: function(tableRow) {
        var $__4 = this;
        var propertyList = [];
        propertyList.push(tableRow.descriptionField);
        propertyList.push({
          value: tableRow.directionField.value.link,
          originalValue: tableRow.directionField.originalValue.link
        });
        return tableRow.isNewlyAdded || this._.some(propertyList, function(property) {
          return !$__4._.isEqual(property.originalValue, property.value);
        });
      },
      isTableRowInvalid: function(tableRow) {
        return !!tableRow.descriptionField.serverError;
      },
      toggleAllSelection: function() {
        this.gridApiInterface.selection.selectAll = !this.gridApiInterface.selection.selectAll;
        if (this.gridApiInterface.selection.selectAll) {
          this.gridApiInterface.selection.selectAllRows();
        } else {
          this.gridApiInterface.selection.clearSelectedRows();
        }
      }
    }, {});
  }();
  var $__default = ViewRelationshipsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewRelationships/viewRelationships.controller.js
