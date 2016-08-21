/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewChangeLogViewSpec
 *
 * @description This is the view tests for the Workspace Item Change Log.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var ItemMenu = require('../components/ItemMenu');
var viewChangeLogPage = require('../pages/ViewChangeLogPage');

// TODO: ViewChangeLogSpec and Page object needs to be upgraded. Page object still using old table references.
function ViewChangeLogViewSpec() {

	ViewChangeLogViewSpec.super_.call(this);
	var that = this;

	describe('ViewChangeLogView', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewChangeLogPage.go();
					viewChangeLogPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});
			});
		});

		after(function () {
//			auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('should sort items when clicked on the header column', function () {
			this._runnable.ssName = 'ViewChangeLogView-sorting';

			// Perform sort only when there is more than one changelog item
			viewChangeLogPage.getChangeLogItemsCount().then(function (clItemsCount) {
				if (clItemsCount > 1) {
					// Get the first item name
					viewChangeLogPage.getFirstChangeLogItemText().then(function (firstItem) {
						var beforeSort = firstItem;
						// Perform the sort
						viewChangeLogPage.sortChangeLogItems().then(function (value) {
							viewChangeLogPage.getFirstChangeLogItemText().then(function (text) {
								expect(text).to.not.equal(beforeSort);
							});
						});
					});
				}
			});
		});

		// Infinite scrolling is not covered as there is no way to check the
		// total numbber of records from the server in change log page
		it('should do a scroll down and the below data should be available', function () {
			this._runnable.ssName = 'ViewChangeLogView-Scrolling';
			viewChangeLogPage.go();

			var linkElement = element(by.css('#header-buttons'));
			var scrollBarBeforeScroll;
			var scrollBarAfterScroll;

			browser.driver.executeScript('return window.pageYOffset').then(function (value) {
				scrollBarBeforeScroll = value;

				// browser.window.sleep was removed and alternatively a
				// setTimeout was added in the execute script.
				// It will enable to the browser to scroll down and
				// track the changed position of the scroll.
				browser.driver.executeScript('window.setTimeout(function(){window.scrollTo(0, 800); return window.pageYOffset;} , 100)').then(function (value) {
					scrollBarAfterScroll = value;
					expect(scrollBarBeforeScroll).to.not.equal(scrollBarAfterScroll);
				});
			});
		});

		it('should open a small overlay on clicking on changed by items', function () {
			this._runnable.ssName = 'ViewChangeLogView-openChangeLogFlyout';
			viewChangeLogPage.go();

			// Perform click event when there is atleast one changelog item
			viewChangeLogPage.getChangeLogItemsCount().then(function (clItemsCount) {
				if (clItemsCount > 0) {
					// Create item button should be displayed
					viewChangeLogPage.isChangedByLink().then(function (linkDisplayed) {
						expect(linkDisplayed).to.eventually.be.true;
					}).then(function () {
						// Click on the create item button to trigger flyout
						viewChangeLogPage.clickChangedByLink().then(function () {
							expect(viewChangeLogPage.isChangedByFlyoutDisplayed()).to.eventually.be.true;
						});
					});
				}
			});
		});

		// Run shared tests
		that.testWorkspacesMenu(viewChangeLogPage, 'ViewChangeLogView');
	});
}

util.inherits(ViewChangeLogViewSpec, SharedSpec);

module.exports = new ViewChangeLogViewSpec();
