/**
 * @ngdoc object
 * @name ViewTestsPage.MainDashboardPage
 *
 * @description This page corresponds to the landing page of the app - the dashboard.
 *
 * ##Dependencies
 *
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');
var AppHeader = require('../components/AppHeader');

function MainDashboardPage() {

	MainDashboardPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.MainDashboardPage#route
	 * @propertyOf ViewTestsPage.MainDashboardPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/mainDashboard';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.MainDashboardPage#urlRegex
	 * @propertyOf ViewTestsPage.MainDashboardPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/mainDashboard');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.MainDashboardPage#urlContains
	 * @propertyOf ViewTestsPage.MainDashboardPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'mainDashboard';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.MainDashboardPage#sections
	 * @propertyOf ViewTestsPage.MainDashboardPage
	 * @description This is the list of sections divs.
	 */
	this.sections = element.all(by.css('.section-wrapper'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#getOutstandingWork
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Gets the outstanding work container
	 *
	 * @returns {Object} A Promise that resolves when element is found.
	 */
	this.getOutstandingWork = function () {
		return element(by.css('.outstanding-work-container'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#getOutstandingWorkItemsName
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Gets the outstanding text for Items column
	 *
	 * @returns {Object} A Promise that resolves when element is found.
	 */
	this.getOutstandingWorkItemsName = function () {
		return element.all(by.css('.ui-grid-cell.ui-grid-coluiGrid-002K')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#isSectionBodyDisplayed
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Gets whether the section body of the given section is displayed.
	 *
	 * @returns {Object} A Promise that resolves when element is found and its display value is retrieved.
	 */
	this.isSectionBodyDisplayed = function (index) {
		return this.sections.get(index || 0).element(by.css('.transcluded-content-wrapper')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#clickSectionHeading
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Clicks the heading of the given section to toggle the collapsible body.
	 *
	 * @returns {Object} A Promise that resolves when the click is completed.
	 */
	this.clickSectionHeading = function (index) {
		return this.sections.get(index || 0).element(by.css('.header > span')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#isReportsDisplayed
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Returns true if there are any reports on the dashboard.
	 *
	 * @returns {Boolean} True, if there are any reports on the dashboard.
	 */
	this.isReportsDisplayed = function () {
		return this.sections.get(0).all(by.repeater('section in reports.sections')).count() > 0;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#getFirstReport
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Returns the first report element finder.
	 *
	 * @returns {Object} First report element finder.
	 */
	this.getFirstReport = function () {
		return this.sections.get(0).all(by.repeater('section in reports.sections')).first().all(by.repeater('report in section')).first();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#getJitterBitLink
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Returns the getJitterBitLink.
	 *
	 * @returns {Object} getJitterBitLink
	 */
	this.getJitterBitLink = function () {
		return element(by.css('.plm-jitterbit-link'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.MainDashboardPage#waitForEvents
	 * @methodOf ViewTestsPage.MainDashboardPage
	 * @description Returns a promise that will be resolved to 'true' if all events (necessary for main dashboard page) are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false' depending on the state of the event listeners.
	 */
	this.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.element(document.body).injector();
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			/* var recentlyViewedLoadDeferObj = $q.defer();
			promises.push(recentlyViewedLoadDeferObj.promise);
			var recentlyViewedLoadListenerId = eventService.listen('recentlyViewed:load:done', function () {
				eventService.unlisten(recentlyViewedLoadListenerId);
				recentlyViewedLoadDeferObj.resolve();
			}); */

			var outstandingWorkLoadDeferObj = $q.defer();
			promises.push(outstandingWorkLoadDeferObj.promise);
			var outstandingWorkLoadListenerId = eventService.listen('outstandingWork:load:done', function () {
				eventService.unlisten(outstandingWorkLoadListenerId);
				outstandingWorkLoadDeferObj.resolve();
			});

			var bookmarkedItemsLoadDeferObj = $q.defer();
			promises.push(bookmarkedItemsLoadDeferObj.promise);
			var bookmarkedItemsLoadListenerId = eventService.listen('bookmarkedItems:load:done', function () {
				eventService.unlisten(bookmarkedItemsLoadListenerId);
				bookmarkedItemsLoadDeferObj.resolve();
			});

			var reportsLoadDeferObj = $q.defer();
			promises.push(reportsLoadDeferObj.promise);
			var reportsLoadListenerId = eventService.listen('reports:load:done', function () {
				eventService.unlisten(reportsLoadListenerId);
				reportsLoadDeferObj.resolve();
			});

			// TODO: should have a listener for load:error to cover the scenario when there is some issue loading the data.

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(MainDashboardPage, GenericPage);

module.exports = new MainDashboardPage();
