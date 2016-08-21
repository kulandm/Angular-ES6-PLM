'use strict';

/**
 * @ngdoc object
 * @name Controllers.UsersRadioSelectorController
 *
 * @description This controller corresponds to usersRadioSelector.html
 * ##Dependencies
 *
 */
class UsersRadioSelectorController {
	/*
	 * @ngdoc method
	 * @name Controllers.UsersRadioSelectorController#constructor
	 * @methodOf Controllers.UsersRadioSelectorController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $q) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		/**
		 * @ngdoc property
		 * @name Controllers.UsersRadioSelectorController#searchInput
		 * @propertyOf Controllers.UsersRadioSelectorController
		 * @description stores the value from search input box
		 */
		this.searchInput = '';

		this.selectedItem = this.selectedItem || '';

		/**
		 * @ngdoc property
		 * @name Controllers.UsersRadioSelectorController#isSelectedFirst
		 * @propertyOf Controllers.UsersRadioSelectorController
		 * @description is true by default, indicator to move selected item to top of list
		 */
		this.isSelectedFirst = this.selectedFirst !== 'false';

		// moving the selectedItem to top of array if selectedFirst is true
		if (this.itemsList.length > 1 && this.isSelectedFirst) {
			this.itemsList.unshift(
				this.itemsList.splice(
					this.itemsList.findIndex(item => item.__self__ === this.selectedItem.__self__), 1
				)[0]
			);
		}

		/**
		 * @ngdoc method
		 * @name Controllers.UsersRadioSelectorController#searchFn
		 * @propertyOf Controllers.UsersRadioSelectorController
		 * @description is true if displayname or organization matches the searchInput
		 * The reason not to have searchFn outside is explained in the link below
		 * https://github.com/angular/angular.js/commit/8863b9d04c722b278fa93c5d66ad1e578ad6eb1f
		 */
		this.searchFn = item =>
			item.displayName.toLowerCase().indexOf(this.searchInput.toLowerCase()) !== -1 ||
			item.organization && item.organization.toLowerCase().indexOf(this.searchInput.toLowerCase()) !== -1;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UsersRadioSelectorController#cancelSearch
	 * @methodOf Controllers.UsersRadioSelectorController
	 * @description clears the search text
	 */
	cancelSearch() {
		this.searchInput = '';
	}
}

export default UsersRadioSelectorController;
