/**
 * @ngdoc object
 * @name ViewTestsPage.EditDetailsViewPage
 *
 * @description This page corresponds to the workspace item details edit page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');

function EditDetailsViewPage() {

	EditDetailsViewPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditDetailsViewPage#route
	 * @propertyOf ViewTestsPage.EditDetailsViewPage
	 * @description The URL for a basic item page (from Items and BOMs workspace)
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/9/items/itemDetails?tab=details&view=split&mode=edit&itemId=9@2902';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditDetailsViewPage#changeRoute
	 * @propertyOf ViewTestsPage.EditDetailsViewPage
	 * @description Change the route of current page.
	 * After change we can call go() to navigate to the new item.
	 *
	 * @param {number} Workspace ID and dmsID
	 */
	this.changeRoute = function (workspaceId, dmsID) {
		this.route = '/' + browser.params.baseName + '/workspaces/' + workspaceId + '/items/itemDetails?tab=details&view=split&mode=edit&itemId=urn%60adsk,plm%60tenant,workspace,item%60' + browser.params.tenant + ',' + workspaceId + ',' + dmsID;
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditDetailsViewPage#urlRegex
	 * @propertyOf ViewTestsPage.EditDetailsViewPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/\@\/?\\d+\/details');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.EditDetailsViewPage#urlContains
	 * @propertyOf ViewTestsPage.EditDetailsViewPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'details';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditDetailsViewPage#getSaveBtn
	 * @propertyOf ViewTestsPage.getSaveBtn
	 * @description Gets the save button for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getSaveBtn = function () {
		return element(by.css('button[aria-label="Save"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditDetailsViewPage#getApprovalRequiredSection
	 * @propertyOf ViewTestsPage.getApprovalRequiredSection
	 * @description Gets the approval required dropdown field for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getApprovalRequiredSection = function () {
		return element(by.css('div[header-title="Approvals (3 of 4)"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditDetailsViewPage#getApprovalRequiredDropDownField
	 * @propertyOf ViewTestsPage.getApprovalRequiredDropDownField
	 * @description Gets the approval required dropdown field for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getApprovalRequiredDropDownField = function () {
		return this.getApprovalRequiredSection()
			.all(by.repeater('(itemIndex, item) in section.definition.fields track by $index'))
			.get(1).element(by.css('.search.selection.dropdown'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditDetailsViewPage#getApprovalRequiredDropDownMenu
	 * @propertyOf ViewTestsPage.getApprovalRequiredDropDownMenu
	 * @description Gets the drop down menu of Approval required.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getApprovalRequiredDropDownMenu = function () {
		return this.getApprovalRequiredDropDownField().element(by.css('.menu'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.EditDetailsViewPage#getApprovalRequiredDropDownMenuItem
	 * @propertyOf ViewTestsPage.getApprovalRequiredDropDownMenuItem
	 * @description Gets the item inside the drop down menu of Approval required.
	 *
	 * @params {Number} index The index of the item inside the menu.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getApprovalRequiredDropDownMenuItem = function (index) {
		return this.getApprovalRequiredDropDownMenu()
			.all(by.repeater('field in fieldData.options.items track by $index'))
			.get(index);
	};
}

util.inherits(EditDetailsViewPage, AbstractItemViewPage);
module.exports = new EditDetailsViewPage();
