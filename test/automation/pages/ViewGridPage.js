/**
 * @ngdoc object
 * @name ViewTestsPage.ViewGridPage
 *
 * @description This page corresponds to the workspace grid view page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var ItemHeader = require('../components/ItemHeader');

function ViewGridPage() {

	ViewGridPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewGridPage#route
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description The URL for a basic workspace page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/60/items/grid?tab=grid&view=split&mode=view&itemId=60@6356';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewGridPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/items\/?\\d+\/grid');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewGridPage#urlContains
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'grid';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewGridPage#getEditBtn
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description Gets the edit button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getEditBtn = function () {
		return ItemHeader.getHeaderBtn(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewGridPage#getCommentsBtn
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description Gets the comments button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getCommentsBtn = function () {
		return ItemHeader.getHeaderBtn(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewGridPage#getActionsBtn
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description Gets the actions button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getActionsBtn = function () {
		return ItemHeader.getHeaderBtn(2);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewGridPage#toggleCommentsBtn
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description Toggles the comments using comments button.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.toggleCommentsBtn = function () {
		return ItemHeader.getHeaderBtn(1).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewGridPage#toggleActionsBtn
	 * @propertyOf ViewTestsPage.ViewGridPage
	 * @description Toggles the dropdown for actions.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.toggleActionsBtn = function () {
		return ItemHeader.getHeaderBtn(2).click();
	};
}

util.inherits(ViewGridPage, AbstractItemViewPage);

module.exports = ViewGridPage;
