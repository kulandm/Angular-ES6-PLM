'use strict';

/**
 * @ngdoc object
 * @name Controllers.PLMWrapperController
 *
 * @description This controller is attached to PLMWrapperController
 *
 * ##Dependencies
 *
 */

class PLMWrapperController {
	/*
	 * @ngdoc method
	 * @name Controllers.PLMWrapperController#constructor
	 * @methodOf Controllers.PLMWrapperController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, EventService, _) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.EventService = EventService;
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMWrapperController#that
		 * @propertyOf Controllers.PLMWrapperController
		 * @description `private` Reference to this controller
		 *
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.PLMWrapperController#contentLoad
		 * @propertyOf Controllers.PLMWrapperController
		 * @description `private` Called whenever a new content has been loaded (main content), and broadcasts an event
		 *
		 */
		this.contentLoad = () => {
			that.EventService.send('contentLoad:done');
		};

		/**
		 * @ngdoc property
		 * @name Controllers.PLMWrapperController#isFullPage
		 * @propertyOf Controllers.PLMWrapperController
		 * @description `private` Sets whether current view should be a full page, i.e. hide all header containers
		 */
		this.isFullPage = false;
	}
}

export default PLMWrapperController;
