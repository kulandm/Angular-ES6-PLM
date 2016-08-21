'use strict';

/**
 * @ngdoc object
 * @name Controllers.UsersCheckboxSelectorController
 *
 * @description This controller corresponds to usersCheckboxSelector.html
 * ##Dependencies
 *
 */
class UsersCheckboxSelectorController {
	/*
	 * @ngdoc method
	 * @name Controllers.UsersCheckboxSelectorController#constructor
	 * @methodOf Controllers.UsersCheckboxSelectorController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;

		/**
		 * @ngdoc property
		 * @name Controllers.UsersCheckboxSelectorController#searchInput
		 * @propertyOf Controllers.UsersCheckboxSelectorController
		 * @description stores the value from search input box
		 */
		this.searchInput = '';

		this.selectedItems = this.selectedItems || [];

		/**
		 * @ngdoc method
		 * @name Controllers.UsersCheckboxSelectorController#searchFn
		 * @propertyOf Controllers.UsersCheckboxSelectorController
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
	 * @name Controllers.UsersCheckboxSelectorController#cancelSearch
	 * @methodOf Controllers.UsersCheckboxSelectorController
	 * @description clears the search text
	 */
	cancelSearch() {
		this.searchInput = '';
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UsersCheckboxSelectorController#exists
	 * @methodOf Controllers.UsersCheckboxSelectorController
	 * @description returns true if item can be found in selectedItems
	 *
	 * @param {Object} item an item from itemList
	 *
	 * @returns {Boolean} true if item exist in selectedItems Array
	 */
	exists(item) {
		return this.selectedItems.indexOf(item) > -1;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.UsersCheckboxSelectorController#toggle
	 * @methodOf Controllers.UsersCheckboxSelectorController
	 * @description removes an item from selectedItems if is in selectedItems and vice versa
	 *
	 * @param {Object} item an item from itemList
	 */
	toggle(item) {
		let index = this.selectedItems.indexOf(item);
		if (index > -1) {
			this.selectedItems.splice(index, 1);
		} else {
			this.selectedItems.push(item);
		}
	}
}

export default UsersCheckboxSelectorController;