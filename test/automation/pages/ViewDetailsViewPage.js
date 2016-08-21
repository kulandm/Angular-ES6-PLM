/**
 * @ngdoc object
 * @name ViewTestsPage.ViewDetailsViewPage
 *
 * @description This page corresponds to the workspace item details view page.
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');

function ViewDetailsViewPage() {

	ViewDetailsViewPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewDetailsViewPage#route
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description The URL for a basic item page (from Items and BOMs workspace)
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/9/items/itemDetails?tab=details&view=split&mode=view&itemId=9@2902';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#changeRoute
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Change the route of current page.
	 * After change we can call go() to navigate to the new item.
	 *
	 * @param {number} Workspace ID and dmsID
	 */
	this.changeRoute = function (workspaceId, dmsID) {
		this.route = '/' + browser.params.baseName + '/workspaces/' + workspaceId + '/items/itemDetails?tab=details&view=split&mode=view&itemId=urn%60adsk,plm%60tenant,workspace,item%60' + browser.params.tenant + ',' + workspaceId + ',' + dmsID;
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewDetailsViewPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/\@\/?\\d+\/details');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewDetailsViewPage#urlContains
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'details';

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getEditButton
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Gets the EDIT button for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getEditButton = function () {
		return CommandBar.getTranscludedButton(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#isEditButtonDisplayed
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Checks if the EDIT button is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isEditButtonDisplayed = function () {
		return CommandBar.getTranscludedButton(0).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getSaveButton
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Gets the SAVE button for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getSaveButton = function () {
		return CommandBar.getControlButton(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getCancelButton
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Gets the SAVE button for this view.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	this.getCancelButton = function () {
		return CommandBar.getControlButton(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#isSaveButtonDisplayed
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Checks if the SAVE button is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isSaveButtonDisplayed = function () {
		return CommandBar.getControlButton(0).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#isCancelButtonDisplayed
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Checks if the CANCEL button is being displayed on the page
	 *
	 * @returns {Boolean} True/false if the button is being displayed on the page
	 */
	this.isCancelButtonDisplayed = function () {
		return CommandBar.getControlButton(1).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getSingleLineTextInput
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Returns the element that corresponds to the rendered single line input in item details
	 *
	 * @returns {Object} The input DOM element
	 */
	this.getSingleLineTextInput = function () {
		return element(by.xpath('//*[@id="view-details"]/div[1]/div/div[2]/div/div/table/tbody/tr[3]/td[2]/span[2]/span/span/ng-form/input'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getSingleLineTextValueElement
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Returns the value of the element that corresponds to the rendered single line text value in item details
	 *
	 * @returns {Object} The input DOM element
	 */
	this.getSingleLineTextValue = function () {
		return element(by.xpath('//*[@id="view-details"]/div[1]/div/div[2]/div/div/table/tbody/tr[3]/td[2]/span/span/span/span')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getParagraph
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Returns the element that corresponds to the rendered paragraph input in item details
	 *
	 * @returns {Object} The input DOM element
	 */
	this.getParagraphInput = function () {
		return element(by.xpath('//*[@id="view-details"]/div[2]/div/div[2]/div/div/table/tbody/tr[2]/td[2]/span[2]/span/span/ng-form/textarea'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getParagraphTextValueElement
	 * @propertyOf ViewTestsPage.ViewDetailsViewPage
	 * @description Returns the value of the element that corresponds to the rendered paragraph text value in item details
	 *
	 * @returns {Object} The input DOM element
	 */
	this.getParagraphTextValue = function () {
		return element(by.xpath('//*[@id="view-details"]/div[2]/div/div[2]/div/div/table/tbody/tr[2]/td[2]/span/span/span/span/pre')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#getApprovalsRequired
	 * @propertyOf ViewTestsPage.getApprovalsRequired
	 * @description Returns the Approval Required in the item details
	 *
	 * @returns {Object} The promise when text of Approval Required is resolved
	 */
	this.getApprovalsRequired = function () {
		return element(by.css('div[header-title="Approvals (3 of 4)"]'))
			.all(by.repeater('(itemIndex, item) in section.definition.fields track by $index'))
			.get(1).element(by.css('.field-selector')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewDetailsViewPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewDetailsViewPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false'
	 * depending on the state of the event listeners.
	 */
	this.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var currentUserDeferred = $q.defer();
			var currentUserListener = eventService.listen('currentUser:currentUser:done', function () {
				eventService.unlisten(currentUserListener);
				currentUserDeferred.resolve();
			});
			promises.push(currentUserDeferred.promise);

			var itemDetailsDeferred = $q.defer();
			promises.push(itemDetailsDeferred.promise);
			var itemDetailsListener = eventService.listen('itemInstance:*:done', function () {
				eventService.unlisten(itemDetailsListener);
				itemDetailsDeferred.resolve();
			});

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ViewDetailsViewPage, AbstractItemViewPage);
module.exports = new ViewDetailsViewPage();
