'use strict';
/**
 * @ngdoc object
 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage
 *
 * @description This page corresponds to the workspace items list page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');

function ViewWorkspaceTableauFlyoutPage() {

	ViewWorkspaceTableauFlyoutPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#wtFlyout
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is the outer element for the component
	 */
	this.wtFlyout = element(by.css('.workspace-tableau-tooltip'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#wtFlyoutTableauBox
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is the outer element for the flayout
	 */
	this.wtFlyoutTableauBox = element(by.css('.workspace-tableau-box'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#wtFlyoutSelectedColumnBox
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is the div element that contain the panel of shown columns
	 */
	this.wtFlyoutSelectedColumnBox = element(by.css('.workspace-tableau-box')).$('.wtd-selected');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#wtFlyoutAvailableColumnBox
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is the div element that contain the panel of shown columns
	 */
	this.wtFlyoutAvailableColumnBox = element(by.css('.workspace-tableau-box')).$('.wtd-unselected');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#openWtFlyout
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is the 3 dots 'button' to open flyout
	 */
	this.openWtFlyout = element(by.css('.workspace-tableau .icon-SuspensionPoints'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#saveFlyout
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is Save 'button' to update the new tableau configuration
	 */
	this.saveFlyout = $('.buttons-footer').$$('button').get(0);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#ocancelFlyout
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description This is Cancel 'button' to close flyout and cancel the operation
	 */
	this.cancelFlyout = $('.buttons-footer').$$('button').get(1);

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#iswtFlyoutDisplayed
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Gets whether the flyout is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isWtFlyoutDisplayed = function () {
		return this.wtFlyout.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#isWtFlyoutTableauBox
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Gets whether the flyout box is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isWtFlyoutTableauBox = function () {
		return this.wtFlyoutTableauBox.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#iswtFlyoutOpenerButtonDisplayed
	 * @propertyOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Gets whether the flyout is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isWtFlyoutOpenerButtonDisplayed = function () {
		return this.openWtFlyout.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#openFlyout
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Clicks the button to open flyout
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.openFlyout = function () {
		return this.openWtFlyout.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#getSelectedColumn
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Clicks the button to open flyout
	 *
	 * @param {Number} index The position of the column you want to ckeck/uncheck
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.getSelectedColumn = function (index) {
		return this.wtFlyoutSelectedColumnBox.$$('md-checkbox').get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#getShownColumns
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Get an array of the text of the checkboxes of the SHOWN COLUMNS
	 *
	 * @returns {Array} Array of the label and position
	 */
	this.getShownColumns = function () {
		var defer = protractor.promise.defer();
		var textShownColumns = [];
		var promiseQueue = [];

		this.wtFlyoutSelectedColumnBox.$$('md-checkbox').then(function (items) {
			items.forEach(function (element) {
				promiseQueue.push(element.getText());
			});

			protractor.promise.all(promiseQueue).then(function (texts) {
				texts.forEach(function (text, index) {
					textShownColumns.push(
						{
							label: text.toUpperCase(),
							index:index
						});
				});
				defer.fulfill(textShownColumns);
			});
		});
		return defer.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#getShownColumnsSelected
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description Get an array of the text of the checkboxes that are selected of the SHOWN COLUMNS
	 *
	 * @returns {Array} Array of the label and position
	 */
	this.getShownColumnsSelected = function () {
		var defer = protractor.promise.defer();
		var textShownColumns = [];
		var promiseQueue = [];

		this.wtFlyoutSelectedColumnBox.$$('md-checkbox.md-checked').then(function (items) {
			items.forEach(function (element) {
				promiseQueue.push(element.getText());
			});

			protractor.promise.all(promiseQueue).then(function (texts) {
				texts.forEach(function (text, index) {
					textShownColumns.push({
							label: text.toUpperCase(),
							index:index
						});
				});
				defer.fulfill(textShownColumns);
			});
		});
		return defer.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#getAvailableColumn
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @param {Number} index The position of the column you want to open/close
	 * @description Get an array of the text of the checkboxes that are selected of the SHOWN COLUMNS
	 *
	 * @returns {Array} Array of the label and position of every Avaible Column
	 */
	this.getAvailableColumn = function (index) {
		return this.wtFlyoutAvailableColumnBox.all(by.repeater('group in flyoutCtrl.groups')).get(index).$('.button');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#getAvailableColumn
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @param {Number} indexGroup The position of the column you want to ckeck/uncheck
	 * @param {Number} indexCheckBox The position of the column you want to ckeck/uncheck
	 * @description Get an array of the text of the checkboxes that are selected of the SHOWN COLUMNS
	 *
	 * @returns {Object} WebElement of a checkbox
	 */
	this.getCheckBoxOfAvailableColumn = function (indexGroup, indexCheckBox) {
		var group = this.wtFlyoutAvailableColumnBox.all(by.repeater('group in flyoutCtrl.groups')).get(indexGroup);
		var checkbox = group.all(by.repeater('field in group.fields')).get(indexCheckBox);
		return checkbox;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#clickSave
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description click save button
	 *
	 * @returns {Object} Promise
	 */
	this.clickSave = function () {
		return this.saveFlyout.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewWorkspaceTableauFlyoutPage#clickCancel
	 * @methodOf ViewTestsPage.ViewWorkspaceTableauFlyoutPage
	 * @description click cancel button
	 *
	 * @returns {Object} Promise
	 */
	this.clickCancel = function () {
		return this.cancelFlyout.click();
	};
}

util.inherits(ViewWorkspaceTableauFlyoutPage, GenericPage);

module.exports = new ViewWorkspaceTableauFlyoutPage();
