var q = require('q');
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var CommandBar = require('../components/CommandBar');

/**
 * @ngdoc object
 * @name ViewTestsPage.WorkspaceItemsListPage
 *
 * @description This page corresponds to the workspace items list page.
 *
 * ##Dependencies
 *
 */
function WorkspaceItemsListPage() {

	WorkspaceItemsListPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#route
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/' + '8' + '/items';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#urlRegex
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/workspaces\/?\\d+\/items');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#urlContains
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'items';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#viewsContainer
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the menu containing the list of views.
	 */
	this.viewsContainer = element(by.id('views-dropdown-list'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#createButton
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the button to trigger the add item feature.
	 */
	this.createButton = element(by.css('.add-item-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#viewsDropdownButton
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the button (dropdown) for select views.
	 */
	this.viewsDropdownButton = element(by.id('views-dropdown-button-tableau'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#views
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the menu containing the list of views.
	 */
	this.views = this.viewsContainer.all(by.tagName('li'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#workspaceItems
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the list of workspace items.
	 */
	this.workspaceItems = element(by.css('.ui-grid-render-container'));

	/*
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#workspaceItemsHeaders
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is ALL the th of the header row.
	 */
	this.workspaceItemsHeaders = element.all(by.css('.ui-grid-render-container-body .ui-grid-header-cell-row'));

	/*
	 * @ngdoc property
	 * @name ViewTestsPage.WorkspaceItemsListPage#workspaceItemsFirstHeader
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description This is the first th of the header row.
	 */
	this.workspaceItemsFirstHeader = element.all(by.css('.ui-grid-render-container-body .ui-grid-header-cell-row')).first();

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#isViewsDisplayed
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets whether the list of views is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isViewsDisplayed = function () {
		return this.viewsContainer.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#isWorkspaceItemsDisplayed
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets whether the list of workspace items is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isWorkspaceItemsDisplayed = function () {
		return this.workspaceItems.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#isWorkspaceNameDisplayed
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets whether the workspace name is displayed
	 *
	 * @returns {Object} Promise that resolves when element is found and its display value is retrieved
	 */
	this.isWorkspaceNameDisplayed = function () {
		return element(by.css('#plm-header h1')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#toggleViewsDropdown
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Clicks the button to trigger the dropdown for views.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.toggleViewsDropdown = function () {
		return this.viewsDropdownButton.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#changeView
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Clicks a view in the views dropdown that is not the current view.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.changeView = function () {
		var firstItem, currentItem;
		this.views.first().getText().then(function (val) {
			firstItem = val;
		});
		this.getCurrentViewName().then(function (val) {
			currentItem = val;
		});
		if (firstItem !== currentItem) {
			return this.views.first().click();
		} else {
			return this.views.last().click();
		}
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getViewsCount
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the total number of views.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its count is retrieved.
	 */
	this.getViewsCount = function () {
		return this.views.count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getCurrentViewName
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the current view name.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its text is retrieved.
	 */
	this.getCurrentViewName = function () {
		return this.viewsDropdownButton
			.element(by.tagName('md-select-value'))
			.all(by.tagName('span'))
			.first().getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getWorkspaceName
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the workspace name.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its text is retrieved.
	 */
	this.getWorkspaceName = function () {
		return element(by.css('#plm-header h1')).getText();
	};

	/*
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getWorkspaceItemsCount
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the number of displayed workspace items.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its count is retrieved.
	 */

	this.getWorkspaceItemsCount = function () {
		return element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index')).count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getWorkspaceItemsFirstHeaderClass
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the class of the first th of the first row.
	 *
	 * @returns {Object} A Promise that resolves when element is found.
	 */
	this.getWorkspaceItemsFirstHeaderClass = function () {
		return this.workspaceItemsFirstHeader.all(by.css('.ui-grid-header-cell')).get(0).element(by.css('.ui-grid-cell-contents')).all(by.tagName('span')).get(1).getAttribute('class');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getTableDataCellHTMLContent
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the HTML content of a cell in the table by its row/column.
	 *
	 * @param {Integer} row The index of the row for item descriptor.
	 * @param {Integer} column The index of the column for item descriptor.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its HTML is retrieved.
	 */
	this.getTableDataCellHTMLContent = function (row, column) {
		return element.all(by.css('.ui-grid-render-container-body .ui-grid-viewport .ui-grid-canvas .ui-grid-row')).get(row).all(by.css('.ui-grid-cell-contents')).get(column).getInnerHtml();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getTableDataCellContent
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Gets the content of a cell in the table by its row/column.
	 *
	 * @param {Integer} row The index of the row for item descriptor.
	 * @param {Integer} column The index of the column for item descriptor.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its text is retrieved.
	 */
	this.getTableDataCellContent = function (row, column) {
		return element.all(by.css('.ui-grid-render-container-body .ui-grid-viewport .ui-grid-canvas .ui-grid-row')).get(row).all(by.css('.ui-grid-cell-contents')).get(column).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#sortWorkspaceItems
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description Clicks the header of the first column in the table to sort.
	 *
	 * @returns {Object} A Promise that resolves when the sorting is completed.
	 */
	this.sortWorkspaceItems = function () {
		// sort by first column
		element.all(by.css('#workspace-items .ui-grid-header-cell-label')).get(0).click();
		// make sure the loading bar started before we check
		browser.sleep(1000);
		var loadingBar = element(by.css('#loading-bar'));
		return browser.wait(function () {
			return loadingBar.getAttribute('style').then(function (value) {
				return value === 'width: 0%;';
			});
		}, 6000, 'wait for loading timed out');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#isSortAscending
	 * @methodOf ViewTestsPage.WorkspaceItemsListPage
	 * @description get current sort status: ascending or descending.
	 *
	 * @returns {Object} A Promise that resolves to true if the up arrow icon present.
	 */
	this.isSortAscending = function () {
		return element(by.css('.ui-grid-icon-up-dir')).isPresent();
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

			// New tableau calls
			var viewsDeferred = $q.defer();
			promises.push(viewsDeferred.promise);
			var viewsListenerId = eventService.listen('workspaceTableau:*:getTableauDone', function () {
				eventService.unlisten(viewsListenerId);
				viewsDeferred.resolve();
			});

			console.log('I made you some promises', promises);
			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#openItem
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description click an item to open the itemDetails page.
	 *
	 * @param {String} itemName The name of the item you're looking for
	 *
	 * @return {Object} A promise that will be resolved when item is opened properly. The promise will resolved with a boolean value.
	 */
	this.openItem = function (itemName) {
		var elink = element(by.linkText(itemName));

		browser.wait(function () {
			return elink.isPresent();
		}, 5000, 'wait for item link failed');
		return elink.click().then(function () {
			expect(browser.getCurrentUrl()).to.eventually.contain('details');
			return true;
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#scrollDownAndOpenItem
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * 
	 * @param {String} itemName The name of the item you're looking for
	 * @param {Integer} stop The var to stop recursion if element not found
	 * 
	 * @description Scroll down to the bottom and click an item to open the itemDetails page.
	 */
	this.scrollDownAndOpenItem = function (itemName, stop) {
		stop = isNaN(stop) ? 1 : stop;
		var deferObj = protractor.promise.defer();
		var that = this;
		var elink = null;
		browser.driver.executeScript('document.querySelector(".ui-grid-viewport").scrollTop =  document.querySelector(".ui-grid-viewport").scrollTop + 5000').then(function () {
			browser.sleep(1000);
			elink = element(by.linkText(itemName));
			elink.isPresent().then(function (isPresent) {
				if (isPresent) {
					elink.click().then(function () {
						expect(browser.getCurrentUrl()).to.eventually.contain('details');
						deferObj.fulfill(true);
					});
				} else {
					stop--;
					if (stop < 1) {
						deferObj.fulfill(false);
					} else {
						that.scrollDownAndOpenItem(itemName, stop).then(function (result) {
							deferObj.fulfill(result);
						});
					}
				}
			});
		});
		return deferObj.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#clickHeaderOfColumn
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @param {Integer} number The index of the column on the table(0 is the first element)
	 * @description Click a column from the table
	 */
	this.clickHeaderOfColumn = function (number) {
		this.workspaceItemsHeaders.first().all(by.css('div[role="columnheader"]')).get(number).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.WorkspaceItemsListPage#getColumnsCount
	 * @propertyOf ViewTestsPage.WorkspaceItemsListPage
	 * @description a promise with the number of columns on the table
	 */
	this.getColumnsCount = function () {
		return this.workspaceItemsHeaders.first().all(by.css('div[role="columnheader"]')).count();
	};
}

util.inherits(WorkspaceItemsListPage, GenericPage);

module.exports = new WorkspaceItemsListPage();
