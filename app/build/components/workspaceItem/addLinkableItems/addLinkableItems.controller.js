System.registerModule("com/autodesk/components/workspaceItem/addLinkableItems/addLinkableItems.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/addLinkableItems/addLinkableItems.controller.js";
  var SCOPE = new WeakMap();
  var FLYOUT_INSTANCE = new WeakMap();
  var MODELS_MGR = new WeakMap();
  var EVENT_SVC = new WeakMap();
  var FLYOUT_SVC = new WeakMap();
  var AddLinkableItemsController = function() {
    function AddLinkableItemsController($rootScope, $scope, $location, $flyoutInstance, ModelsManager, EventService, FlyoutService, _, relatedWorkspaces, UrnParser) {
      var $__2 = this;
      SCOPE.set(this, $scope);
      FLYOUT_INSTANCE.set(this, $flyoutInstance);
      MODELS_MGR.set(this, ModelsManager);
      EVENT_SVC.set(this, EventService);
      FLYOUT_SVC.set(this, FlyoutService);
      this.UrnParser = UrnParser;
      this.workspaceId;
      this.itemId = $location.search().itemId;
      $scope.percentage = 0.75;
      this.pageOffset = 0;
      this.listData = [];
      this.itemQuantity = 100;
      this.totalItemCount = 0;
      this.searchVal = '';
      this.flyoutState = '';
      this.selectedItemIdList = [];
      var linkedWorkspaceList = [];
      this.filterDropdownData = {};
      this.noWorkspaceRsFlag = false;
      this.noDataFlag;
      this.linkableItemsObj = null;
      this.isLoading = false;
      var linkableItemsListenerId = EventService.listen(("linkableItems:" + this.itemId + ":done"), function(event, LinkableItemsObj) {
        $__2.linkableItemsObj = LinkableItemsObj;
        $__2.parseItems(LinkableItemsObj, $__2.itemQuantity);
        $__2.isLoading = false;
      });
      var itemListenerId = EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, ItemObj) {
        EventService.unlisten(itemListenerId);
        $__2.ItemObj = ItemObj;
        $__2.workspaceId = $__2.ItemObj.workspaceObj.getId();
        if (angular.isDefined(relatedWorkspaces) && relatedWorkspaces.length > 0) {
          linkedWorkspaceList = relatedWorkspaces;
          linkedWorkspaceList = _.map(relatedWorkspaces, function(workspace) {
            return {
              isSelected: false,
              title: workspace.json.name,
              type: workspace.json.type,
              link: workspace.json.__self__
            };
          });
          if (linkedWorkspaceList[0].link !== '' && linkedWorkspaceList.length > 1) {
            linkedWorkspaceList.unshift({
              link: '',
              title: $rootScope.bundle.text.allWorkspaces,
              type: '',
              isSelected: true
            });
          }
          $__2.filterDropdownData = {
            selectedItemId: '',
            itemList: linkedWorkspaceList
          };
          $__2.isLoading = true;
          ModelsManager.getExistingLinkedItems($__2.itemId, $scope.linkableItemsOptions.itemsType, {
            offset: $__2.pageOffset,
            itemQuantity: $__2.itemQuantity
          });
        } else {
          $__2.noWorkspaceRsFlag = true;
        }
      });
      ModelsManager.getItem(this.itemId);
      $flyoutInstance.opened.then(function() {
        $__2.flyoutState = 'open';
      });
      this.doScroll = function() {
        if ($__2.isLoading === true || !$__2.linkableItemsObj.isNext()) {
          return;
        }
        $__2.isLoading = true;
        EventService.send(("linkableItems:" + $__2.itemId + ":get"), $__2.linkableItemsObj.getNextLink().substring(1));
      };
      $scope.$on('$destroy', function() {
        EventService.unlisten(linkableItemsListenerId);
        EventService.unlisten(itemListenerId);
      });
    }
    return ($traceurRuntime.createClass)(AddLinkableItemsController, {
      optionChanged: function(selectedId) {
        this.selectedWorkspaceId = selectedId && selectedId.match(/\d+$/)[0];
        this.pageOffset = 0;
        this.listData = [];
        this.isLoading = true;
        MODELS_MGR.get(this).getExistingLinkedItems(this.itemId, SCOPE.get(this).linkableItemsOptions.itemsType, {
          search: this.searchVal,
          offset: this.pageOffset,
          limit: this.itemQuantity,
          relatedWorkspaceId: this.selectedWorkspaceId
        });
      },
      parseItems: function(linkableItems, itemQuantity) {
        var $__2 = this;
        if (angular.isDefined(linkableItems.getFullList())) {
          this.noDataFlag = false;
          this.totalItemCount = linkableItems.getTotalCount() || 0;
          this.listData = this.listData.concat(linkableItems.getFullList());
          _.each(this.selectedItemIdList, function(selectedItem) {
            var listItem = _.find($__2.listData, function(listItem) {
              return listItem.getItemLink() === selectedItem.id;
            });
            if (listItem) {
              listItem.setSelection(true);
            }
          });
        } else {
          this.noDataFlag = true;
        }
      },
      doSearch: function(searchValue) {
        this.searchVal = searchValue;
        this.listData = [];
        this.pageOffset = 0;
        this.isLoading = true;
        MODELS_MGR.get(this).getExistingLinkedItems(this.itemId, SCOPE.get(this).linkableItemsOptions.itemsType, {
          search: this.searchVal,
          offset: this.pageOffset,
          limit: this.itemQuantity,
          relatedWorkspaceId: this.selectedWorkspaceId
        });
      },
      toggleSelection: function(item) {
        var preSelectedItem = _.find(this.selectedItemIdList, function(selectedItem) {
          return selectedItem.id === item.getItemLink();
        });
        if (item.isSelected() && angular.isUndefined(preSelectedItem)) {
          this.selectedItemIdList.push({
            id: item.getItemLink(),
            ref: item
          });
        }
        if (!item.isSelected() && angular.isDefined(preSelectedItem)) {
          this.selectedItemIdList = _.without(this.selectedItemIdList, preSelectedItem);
        }
      },
      clearSelection: function() {
        var $__2 = this;
        _.each(this.selectedItemIdList, function(selectedItem) {
          var listItem = _.find($__2.listData, function(listItem) {
            return listItem.getItemLink() === selectedItem.id;
          });
          if (listItem) {
            listItem.setSelection(false);
          }
        });
        this.selectedItemIdList = [];
      },
      submitSelection: function() {
        if (this.selectedItemIdList.length) {
          EVENT_SVC.get(this).send('linkableItems:added', this.selectedItemIdList);
        }
        FLYOUT_INSTANCE.get(this).close();
      },
      cancelSelection: function() {
        FLYOUT_INSTANCE.get(this).cancel();
      },
      createNewItem: function() {
        FLYOUT_INSTANCE.get(this).close({createItem: true});
      },
      tooltipFlyout: function(event, linkableItem) {
        var $__2 = this;
        var tooltip = FLYOUT_SVC.get(this).open({
          templateUrl: 'build/components/workspaceItem/addLinkableItems/linkedItemTooltip.html',
          scope: SCOPE.get(this),
          anchorEl: angular.element(event.target),
          placement: 'top-right',
          showArrow: true,
          controllerAs: 'tooltipCtrl',
          flyoutClass: 'managed-by-tooltip',
          controller: function($scope, $flyoutInstance, $state, $stateParams, LinkableItemObj) {
            this.linkableItem = LinkableItemObj;
            this.closeFlyout = function() {
              $flyoutInstance.close();
            };
            this.cancelFlyout = function() {
              $flyoutInstance.cancel();
            };
          },
          resolve: {LinkableItemObj: function() {
              return linkableItem;
            }}
        });
        tooltip.closed.then(function() {
          FLYOUT_INSTANCE.get($__2).cancel();
        });
      }
    }, {});
  }();
  var $__default = AddLinkableItemsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/addLinkableItems/addLinkableItems.controller.js
