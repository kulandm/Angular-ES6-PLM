'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.AddLinkableItemsController
 *
 * @description This controller is responsible for providing list of existing linked items that can be added to current workspace item.
 * It also provides logic to select a subset of items and add it to the current linkedItems workspace item.
 *
 * This controller uses a map called `linkableItemsOptions` containing the
 * `itemsType` property that needs to be present in the $scope that is passed in.
 *
 * ##Dependencies
 * - Requires {@link Services/Services.EventService}
 * - Requires {@link Misc/Models.ModelsManager}
 * - Requires {@link Models/Models.Item}
 */
const SCOPE = new WeakMap();
const FLYOUT_INSTANCE = new WeakMap();
const MODELS_MGR = new WeakMap();
const EVENT_SVC = new WeakMap();
const FLYOUT_SVC = new WeakMap();

class AddLinkableItemsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#constructor
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description The class constructor.
	 */
	constructor($rootScope, $scope, $location, $flyoutInstance, ModelsManager, EventService, FlyoutService, _, relatedWorkspaces, UrnParser) {
		SCOPE.set(this, $scope);
		FLYOUT_INSTANCE.set(this, $flyoutInstance);
		MODELS_MGR.set(this, ModelsManager);
		EVENT_SVC.set(this, EventService);
		FLYOUT_SVC.set(this, FlyoutService);
		this.UrnParser = UrnParser;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description The workspace id of the current selected item.
		 */
		this.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#itemId
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description The item id of the current selected item.
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#percentage
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description This property is used with
		 * {@link Directives/AdjustMaxHeightDirective}.
		 */
		$scope.percentage = 0.75;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#pageOffset
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description The page to fetch data from.
		 */
		this.pageOffset = 0;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#listData
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description Stores data for existing linked items
		 * Note: A special property 'selected' will be added to each item
		 * of the list to track select state. We are also assuming that
		 * each item can be uniquely identified by a property called 'id'.
		 * This can change in future.
		 */
		this.listData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#itemQuantity
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description Amount of items to fetch.
		 */
		this.itemQuantity = 100;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#totalItemCount
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description Total item count.
		 */
		this.totalItemCount = 0;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#searchVal
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description Value on which the list is filtered.
		 */
		this.searchVal = '';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#flyoutState
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description This property is used with
		 * {@link Directives/AdjustMaxHeightDirective} to allow
		 * on-demand max height calculation.
		 */
		this.flyoutState = '';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#selectedItemIdList
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description The list of selected item ids. This list will be used
		 * to manage the selection state of the list.
		 */
		this.selectedItemIdList = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#linkedWorkspaceList
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description `private` The list of linked workspaces.
		 */
		let linkedWorkspaceList = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#filterDropdownData
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description Object containing the selected id and list of workspaces
		 * to be displayed in dropdown.
		 */
		this.filterDropdownData = {};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#noWorkspaceRsFlag
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description True, if there are no workspace relationships configured.
		 */
		this.noWorkspaceRsFlag = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#noDataFlag
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description True, if there are no data found.
		 */
		this.noDataFlag;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#linkableItemsObj
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description The reference to the {@link Models.LinkableItems} object
		 * associated with this controller.
		 */
		this.linkableItemsObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddLinkableItemsController#isLoading
		 * @propertyOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description A flag which will be true when data is being loaded.
		 */
		this.isLoading = false;
		
		let linkableItemsListenerId = EventService.listen(`linkableItems:${this.itemId}:done`, (event, LinkableItemsObj) => {
			this.linkableItemsObj = LinkableItemsObj;
			this.parseItems(LinkableItemsObj, this.itemQuantity);
			this.isLoading = false;
		});

		let itemListenerId = EventService.listen(`itemInstance:${this.itemId}:done`, (event, ItemObj) => {
			EventService.unlisten(itemListenerId);

			this.ItemObj = ItemObj;
			this.workspaceId = this.ItemObj.workspaceObj.getId();

			if (angular.isDefined(relatedWorkspaces) && relatedWorkspaces.length > 0) {
				linkedWorkspaceList = relatedWorkspaces;

				// Add a flag to each workspace
				linkedWorkspaceList = _.map(relatedWorkspaces, (workspace) => {
					return {
						isSelected: false,
						title: workspace.json.name,
						type: workspace.json.type,
						link: workspace.json.__self__
					};
				});

				// Add the option of 'All Workspaces' to the list
				// TODO: Revisit once user preference is implemented
				// (All Workspaces may not be first option). Note: No need to add this option when item is only related to
				// one workspace.
				if (linkedWorkspaceList[0].link !== '' && linkedWorkspaceList.length > 1) {
					linkedWorkspaceList.unshift({
						link: '',
						title: $rootScope.bundle.text.allWorkspaces,
						type: '',
						isSelected: true
					});
				}

				this.filterDropdownData = {
					selectedItemId: '',
					itemList: linkedWorkspaceList
				};

				this.isLoading = true;
				ModelsManager.getExistingLinkedItems(this.itemId, $scope.linkableItemsOptions.itemsType, {
					offset: this.pageOffset,
					itemQuantity: this.itemQuantity
				});

			} else {
				// Set a flag to display the 'No workspace R/s' msg
				this.noWorkspaceRsFlag = true;
			}
		});

		ModelsManager.getItem(this.itemId);

		// Update flyout state when flyout is opened to
		// trigger on-demand max height calculation.
		$flyoutInstance.opened.then(() => {
			this.flyoutState = 'open';
		});

		/**
		 * @ngdoc method
		 * @name Controllers.workspaceItem.AddLinkableItemsController#doScroll
		 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
		 * @description Scroll event handler for infinite scrolling.
		 */
		this.doScroll = () => {
			if (this.isLoading === true || !this.linkableItemsObj.isNext()) {
				return;
			}

			this.isLoading = true;
			EventService.send(`linkableItems:${this.itemId}:get`,
				this.linkableItemsObj.getNextLink().substring(1));
		};

		$scope.$on('$destroy', () => {
			EventService.unlisten(linkableItemsListenerId);
			EventService.unlisten(itemListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#optionChanged
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Process the selected workspace for filtering.
	 *
	 * @param {Number} selectedId The selected id of a workspace in the filter dropdown.
	 */
	optionChanged(selectedId) {
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
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#parseItems
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Parse fetched data into table rows.
	 *
	 * @param {Object} linkableItems The instance of LinkableItems model.
	 * @param {Number} itemQuantity Number of items to be displayed on a single page.
	 */
	parseItems(linkableItems, itemQuantity) {
		if (angular.isDefined(linkableItems.getFullList())) {
			this.noDataFlag = false;
			this.totalItemCount = linkableItems.getTotalCount() || 0;

			this.listData = this.listData.concat(linkableItems.getFullList());

			// Pre-select all the items based on {@link #selectedItemIdList}.
			// This is useful when user apply search filter and the result
			// contains items that were already selected before the search.
			_.each(this.selectedItemIdList, (selectedItem) => {
				let listItem = _.find(this.listData, (listItem) => {
					return listItem.getItemLink() === selectedItem.id;
				});

				if (listItem) {
					listItem.setSelection(true);
				}
			});
		} else {
			// Set a flag to display the 'No matches' msg
			this.noDataFlag = true;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#doSearch
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Filter the list based on the given search value.
	 *
	 * @param {String} searchValue The value used to filter the list.
	 */
	doSearch(searchValue) {
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
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#toggleSelection
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description This method will be called whenever the selection state of
	 * list item is changed. This method updates {@link #selectedItemIdList} array.
	 *
	 * @param {Object} item The linkable item
	 */
	toggleSelection(item) {
		// Check to see if the changed item exist in the {@link #selectedItemIdList}.
		let preSelectedItem = _.find(this.selectedItemIdList, (selectedItem) => {
			return selectedItem.id === item.getItemLink();
		});

		// If item doesn't exist in the selected list, add it.
		if (item.isSelected() && angular.isUndefined(preSelectedItem)) {
			this.selectedItemIdList.push({id: item.getItemLink(), ref: item});
		}

		// If item exist in the selected list, remove it.
		if (!item.isSelected() && angular.isDefined(preSelectedItem)) {
			this.selectedItemIdList = _.without(this.selectedItemIdList, preSelectedItem);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#clearSelection
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description This method will be called whenever 'Clear All' is clicked.
	 */
	clearSelection() {
		// Pre-deselect all the items based on {@link #selectedItemIdList}.
		_.each(this.selectedItemIdList, (selectedItem) => {
			let listItem = _.find(this.listData, function (listItem) {
				return listItem.getItemLink() === selectedItem.id;
			});

			if (listItem) {
				listItem.setSelection(false);
			}
		});

		// Empty the array of selected items
		this.selectedItemIdList = [];
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#submitSelection
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Save selected linked items or pass them to the controller
	 * for editing.
	 */
	submitSelection() {
		if (this.selectedItemIdList.length) {
			EVENT_SVC.get(this).send('linkableItems:added', this.selectedItemIdList);
		}

		FLYOUT_INSTANCE.get(this).close();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#cancelSelection
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Close the flyout.
	 */
	cancelSelection() {
		FLYOUT_INSTANCE.get(this).cancel();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#createNewItem
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Opens quick create modal.
	 */
	createNewItem() {
		FLYOUT_INSTANCE.get(this).close({
			createItem: true
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddLinkableItemsController#tooltipFlyout
	 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
	 * @description Show tooltip if there is an item description
	 *
	 * @param {Object} event The event object
	 * @param {String} displayName The displayName of the item field
	 * @param {String} description The description of the item field
	 *
	 */
	tooltipFlyout(event, linkableItem) {
		let tooltip = FLYOUT_SVC.get(this).open({
			templateUrl: 'build/components/workspaceItem/addLinkableItems/linkedItemTooltip.html',
			scope: SCOPE.get(this),
			anchorEl: angular.element(event.target),
			placement: 'top-right',
			showArrow: true,
			controllerAs: 'tooltipCtrl',
			flyoutClass: 'managed-by-tooltip',
			controller: function ($scope, $flyoutInstance, $state, $stateParams, LinkableItemObj) {
				this.linkableItem = LinkableItemObj;

				/**
				 * @ngdoc method
				 * @name Controllers.workspaceItem.AddLinkableItemsController#closeFlyout
				 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
				 * @description Close the tooltip flyout
				 */
				this.closeFlyout = function () {
					$flyoutInstance.close();
				};

				/**
				 * @ngdoc method
				 * @name Controllers.workspaceItem.AddLinkableItemsController#cancelFlyout
				 * @methodOf Controllers.workspaceItem.AddLinkableItemsController
				 * @description Cancel the tooltip flyout
				 */
				this.cancelFlyout = function () {
					$flyoutInstance.cancel();
				};
			},
			resolve: {
				LinkableItemObj: () => {
					return linkableItem;
				}
			}
		});

		tooltip.closed.then(() => {
			FLYOUT_INSTANCE.get(this).cancel();
		});
	}
}

export default AddLinkableItemsController;
