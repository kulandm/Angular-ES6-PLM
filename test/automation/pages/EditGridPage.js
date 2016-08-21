/**
 * @ngdoc object
 * @name ViewTestsPage.EditGridPage
 *
 * @description This page corresponds to the workspace grid edit page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var ItemHeader = require('../components/ItemHeader');
var WorkspaceGridViewPage = require('./ViewGridPage');

function EditGridPage() {

	EditGridPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditGridPage#route
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description The URL for a basic workspace page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/60/items/grid?tab=grid&view=split&mode=edit&itemId=60@6356';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditGridPage#urlRegex
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/items\/?\\d+\/grid\/edit');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditGridPage#urlContains
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'grid/edit';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#getInputCount
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Gets the count of ng-form/input type.
	 *
	 * @returns {Object} A promise that resolves when the element is found and its count value is retrieved.
	 */
	this.getInputCount = function () {
		return element.all(by.css('.collapse-body ng-form input')).count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#getSaveBtn
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Gets the save item button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getSaveBtn = function () {
		return ItemHeader.getHeaderBtn(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#getCancelBtn
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Gets the cancel item button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getCancelBtn = function () {
		return ItemHeader.getHeaderBtn(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#getCommentsBtn
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Gets the comments button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getCommentsBtn = function () {
		return ItemHeader.getHeaderBtn(2);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#getActionsBtn
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Gets the actions button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getActionsBtn = function () {
		return ItemHeader.getHeaderBtn(3);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#toggleCommentsBtn
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Toggles the comments using comments button.
	 *
	 * @returns {Object} A promise that resolves when the click is completed.
	 */
	this.toggleCommentsBtn = function () {
		return ItemHeader.getHeaderBtn(2).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditGridPage#toggleActionsBtn
	 * @propertyOf ViewTestsPage.EditGridPage
	 * @description Toggles the dropdown for actions.
	 *
	 * @returns {Object} A promise that resolves when the click is completed.
	 */
	this.toggleActionsBtn = function () {
		return ItemHeader.getHeaderBtn(3).click();
	};
}

util.inherits(EditGridPage, WorkspaceGridViewPage);

module.exports = new EditGridPage();
