'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewAttachedItemsController
 *
 * @description Display list of attached items for a single item.
 */

class ViewAttachedItemsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachedItemsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewAttachedItemsController
	 * @description The class constructor.
	 */
	constructor($rootScope, $scope, $flyoutInstance, $state, RESTWrapperService, WipApiService, FileOverviewService, App, attachmentsObj, UrnParser) {

		this.$scope = $scope;
		this.$flyoutInstance = $flyoutInstance;
		this.FileOverviewService = FileOverviewService;
		this.App = new App();
		this.$state = $state;
		this.UrnParser = UrnParser;
		this.attachmentsObj = attachmentsObj;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachedItemsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewAttachedItemsController
		 * @description The workspace id of the current selected item.
		 */
		this.workspaceId = attachmentsObj.value.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachedItemsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewAttachedItemsController
		 * @description The item id of the current selected item.
		 */
		this.itemId = attachmentsObj.value.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachedItemsController#attachmentsCount
		 * @propertyOf Controllers.workspaceItem.ViewAttachedItemsController
		 * @description The total count value of attachments.
		 */
		this.attachmentsCount = attachmentsObj.value.count;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachedItemsController#goAttachmentsLink
		 * @propertyOf Controllers.workspaceItem.ViewAttachedItemsController
		 * @description build the link to attachment tab of the item, require for opening in new tab
		 */
		this.goAttachmentsLink = this.$state.href('attachments', {
			tab: 'attachments',
			view: 'full',
			mode: 'view',
			itemId: this.UrnParser.encode(attachmentsObj.value.itemUrn)
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewAttachedItemsController#flyoutState
		 * @propertyOf Controllers.workspaceItem.ViewAttachedItemsController
		 * @description This property is used with
		 * {@link Directives/AdjustMaxHeightDirective} to allow
		 * on-demand max height calculation.
		 */
		this.flyoutState = '';

		// Update flyout state when flyout is opened to
		// trigger on-demand max height calculation.
		$flyoutInstance.opened.then(() => {
			this.flyoutState = 'open';
		});

		$scope.$on('$destroy', () => {
		});

		// Set up the FileOverviewService
		RESTWrapperService.get(this.App.hubs.link).then(response => {
			this.FileOverviewService.setHost(response.items[0].links.link.href);
		});

		// Set up the WipApiService
		RESTWrapperService.get(this.App.wipBase.link).then(response => {
			WipApiService.setHost(response.value);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachedItemsController#cancelSelection
	 * @methodOf Controllers.workspaceItem.ViewAttachedItemsController
	 * @description Close the flyout.
	 */
	cancelSelection() {
		this.$flyoutInstance.cancel();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewAttachedItemsController#goToAttachment
	 * @methodOf Controllers.workspaceItem.ViewAttachedItemsController
	 * @description go to attachment tab of the item
	 */
	goToAttachment() {
		this.$state.go('attachments', {
			tab: 'attachments',
			view: 'full',
			mode: 'view',
			itemId: this.UrnParser.encode(this.attachmentsObj.value.itemUrn)
		});
	}
}

export default ViewAttachedItemsController;
