System.registerModule("com/autodesk/components/workspaceItem/viewNamedRelationships/viewNamedRelationships.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewNamedRelationships/viewNamedRelationships.controller.js";
  var ViewNamedRelationshipsController = function() {
    function ViewNamedRelationshipsController($location, $mdDialog, $q, $rootScope, $scope, $state, $stateParams, $timeout, _, EventService, FlyoutService, ModelsManager, NotificationService, NotificationTypes) {
      var $__2 = this;
      this.$location = $location;
      this.$mdDialog = $mdDialog;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this._ = _;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.ModelsManager = ModelsManager;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.$timeout = $timeout;
      this.workspaceId = $stateParams.workspaceId;
      this.itemId = $location.search().itemId;
      this.item;
      this.addFlyout;
      this.namedRelationshipId = $location.search().relationshipKey;
      this.viewState = 'named-relationships';
      $scope.linkableItemsOptions = {itemsType: ("namedRelationshipItems~" + this.$location.search().relationshipKey)};
      this.tableColumns = [{
        field: 'selection',
        headerCellTemplate: 'checkboxHeaderTemplate',
        cellTemplate: 'checkboxTemplate',
        enableColumnResizing: false,
        width: '50'
      }, {
        displayName: $rootScope.bundle.namedRelationships.item,
        field: 'linkedItemDescriptor',
        cellTemplate: 'namedRelationshipsLinkTemplate'
      }];
      this.tableData = [];
      this.gridApiInterface;
      this.selectedItems = [];
      this.addLinkableItemsListenerId;
      this.linkableItemSaveListenerId;
      this.itemListenerId = EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, item) {
        EventService.unlisten($__2.itemListenerId);
        $__2.item = item;
      });
      this.namedRelationshipsObjListenerId = EventService.listen(("namedRelations:" + this.itemId + "~" + this.$location.search().relationshipKey + ":done"), function(event, namedRelationshipsItems) {
        $__2.parseNamedRelationshipsItems(namedRelationshipsItems);
      });
      this.registerAddLinkableItemsListeners();
      this.ModelsManager.getItem(this.itemId, !this.isViewState());
      this.ModelsManager.getNamedRelationships(this.itemId, this.$location.search().relationshipKey);
      this.$scope.$on('$destroy', function() {
        if ($__2.hasActiveFlyout()) {
          $__2.addFlyout.cancel();
        }
        $__2.EventService.unlisten($__2.itemListenerId);
        $__2.EventService.unlisten($__2.namedRelationshipsObjListenerId);
        $__2.EventService.unlisten($__2.addLinkableItemsListenerId);
        $__2.EventService.unlisten($__2.linkableItemSaveListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewNamedRelationshipsController, {
      registerAddLinkableItemsListeners: function() {
        var $__2 = this;
        this.addLinkableItemsListenerId = this.EventService.listen('linkableItems:added', function(event) {
          for (var addedItems = [],
              $__3 = 1; $__3 < arguments.length; $__3++)
            addedItems[$__3 - 1] = arguments[$__3];
          $__2.associateAddedItems(addedItems).then(function(results) {
            if ($__2._.every(results)) {
              $__2.EventService.send(("itemInstance:" + $__2.itemId + ":associationComplete"));
              $__2.addFlyout.close();
            } else {
              $__2.addFlyout.cancel();
            }
            $__2.NotificationService.showNotifications();
          });
        });
        this.linkableItemSaveListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":associationComplete"), function() {
          $__2.ModelsManager.getNamedRelationships($__2.itemId, $__2.$location.search().relationshipKey);
        }, true);
      },
      associateAddedItems: function(items) {
        var $__2 = this;
        return this.$q.all(this._.map(items, function(item) {
          var selectedItem = item.ref;
          $__2.EventService.send(("itemInstance:" + selectedItem.getItemId() + ":associateNamedRelationshipItem"), [$__2.item, selectedItem.getItemLink(), selectedItem.getItemTitle(), $__2.namedRelationshipId]);
          return $__2.$q(function(resolve) {
            var associateItemsListener = $__2.EventService.listen(("itemInstance:" + selectedItem.getItemId() + ":associationDone"), function(event, isSaved) {
              $__2.EventService.unlisten(associateItemsListener);
              if (isSaved) {
                $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + selectedItem.getItemTitle() + $__2.$rootScope.bundle.notification.singleAdd.success));
              } else {
                $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + selectedItem.getItemTitle() + $__2.$rootScope.bundle.notification.failed));
              }
              resolve(isSaved);
            });
          });
        }));
      },
      getPermittedRelatedWorkspaces: function() {
        var $__2 = this;
        return this.$q(function(resolve) {
          var relatedWorkspacesListenerId = $__2.EventService.listen(("relatedWorkspaces:" + $__2.workspaceId + ":done"), function(event, RelatedWorkspacesObj) {
            $__2.EventService.unlisten(relatedWorkspacesListenerId);
            var relatedWorkspaces = RelatedWorkspacesObj.getFullList();
            $__2.permittedWSPromises = $__2._.map(relatedWorkspaces.workspaces, function(workspace) {
              var deferred = $__2.$q.defer();
              var relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
              var workspaceListenerId = $__2.EventService.listen(("workspaceInstance:" + relatedWSId + ":done"), function(event, workspaceObj) {
                $__2.EventService.unlisten(workspaceListenerId);
                $__2.EventService.unlisten(workspacePermissionErrorListenerId);
                deferred.resolve({workspaceObj: workspaceObj});
              });
              var workspacePermissionErrorListenerId = $__2.EventService.listen(("workspaceInstance:" + relatedWSId + ":permissionError"), function(event) {
                $__2.EventService.unlisten(workspaceListenerId);
                $__2.EventService.unlisten(workspacePermissionErrorListenerId);
                deferred.reject();
              });
              $__2.ModelsManager.getWorkspace(relatedWSId);
              return deferred.promise;
            });
            resolve($__2.permittedWSPromises);
          });
          $__2.ModelsManager.getNamedRelationshipRelatedWorkspaces($__2.workspaceId, $__2.namedRelationshipId);
        });
      },
      triggerAdd: function(event) {
        var $__2 = this;
        this.getPermittedRelatedWorkspaces().then(function(workspaces) {
          $__2.addFlyout = $__2.FlyoutService.open({
            templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
            scope: $__2.$scope,
            anchorEl: angular.element(event.target),
            flyoutClass: 'add-item-flyout',
            placement: 'bottom-left',
            showArrow: true,
            backdropOption: 2,
            controller: 'AddLinkableItemsController',
            controllerAs: 'addLinkableItemsCtrl',
            disableDefaultZIndexAllocation: true,
            resolve: {relatedWorkspaces: function() {
                return $__2.$q.all(workspaces).then(function(workspaces) {
                  return workspaces.map(function(workspace) {
                    return workspace.workspaceObj;
                  });
                });
              }}
          });
        });
      },
      hasActiveFlyout: function() {
        return this.addFlyout && this.addFlyout.isActive();
      },
      parseNamedRelationshipsItems: function(namedRelationshipsItems) {
        var $__2 = this;
        this.tableData = this._.map(namedRelationshipsItems.getFullList(), function(item, index) {
          return {
            namedRelationshipsObj: item,
            selection: {
              inlineMenu: false,
              urn: item.getItemUrn(),
              title: item.getItemTitle()
            },
            chkBox: {
              isSelected: false,
              chkBoxId: item.getResourceId()
            },
            linkedItemDescriptor: {
              value: item.getItemDescriptorValue(),
              href: $__2.$state.href('details', {
                tab: 'details',
                view: 'full',
                mode: 'view',
                itemId: item.getResourceId()
              })
            }
          };
        });
        this.$timeout(function() {
          window.dispatchEvent(new Event('resize'));
        }, 2000);
      },
      isViewState: function() {
        return this.$location.search().mode === 'view';
      },
      toggleAllSelection: function() {
        this.gridApiInterface.selection.selectAll = !this.gridApiInterface.selection.selectAll;
        if (this.gridApiInterface.selection.selectAll) {
          this.gridApiInterface.selection.selectAllRows();
        } else {
          this.gridApiInterface.selection.clearSelectedRows();
        }
      },
      selectRow: function(row) {
        var selfLink = row.entity.namedRelationshipsObj.json.__self__;
        if (row.isSelected) {
          this.selectedItems.push({
            link: selfLink,
            inlineMenu: row.entity.selection.inlineMenu,
            urn: row.entity.selection.urn,
            title: row.entity.selection.title,
            namedRelationshipsObj: row.entity.namedRelationshipsObj
          });
        } else {
          this.selectedItems = this._.filter(this.selectedItems, function(obj) {
            return obj.link !== selfLink;
          });
        }
        return this.selectedItems.length;
      },
      removeSelectedItems: function() {
        var $__2 = this;
        var promises = this._.map(this.selectedItems, function(item) {
          return $__2.$q(function(resolve, reject) {
            var eventServiceIdentifier = ("namedRelationshipsItem:" + item.link.substring(item.link.lastIndexOf('/') + 1) + "~" + $__2.$location.search().relationshipKey);
            var namedRelationshipsRemoveListenerId = $__2.EventService.listen((eventServiceIdentifier + ":deleteDone"), function(event, flag) {
              $__2.EventService.unlisten(namedRelationshipsRemoveListenerId);
              if (flag) {
                $__2.tableData = $__2._.filter($__2.tableData, function(row) {
                  return row.__self__ === item.link;
                });
                $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + item.title + $__2.$rootScope.bundle.notification.singleRemove.success));
              } else {
                $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + item.title + $__2.$rootScope.bundle.notification.failed));
              }
              resolve();
            });
            $__2.EventService.send((eventServiceIdentifier + ":deleteItem"), item.link);
          });
        });
        this.$q.all(promises).then(function() {
          $__2.tableData = [];
          $__2.ModelsManager.getNamedRelationships($__2.itemId, $__2.$location.search().relationshipKey);
          $__2.selectedItems = [];
          $__2.NotificationService.showNotifications();
        });
      },
      triggerDelete: function() {
        var $__2 = this;
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.html',
          controller: 'RemoveItemConfirmationController',
          controllerAs: 'removeItemCtrl',
          locals: {itemCount: this.selectedItems.length}
        }).then(function() {
          $__2.removeSelectedItems();
        });
      }
    }, {});
  }();
  var $__default = ViewNamedRelationshipsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewNamedRelationships/viewNamedRelationships.controller.js
