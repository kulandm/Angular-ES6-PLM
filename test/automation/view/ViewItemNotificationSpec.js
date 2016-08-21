/**
 * @ngdoc object
 * @name ViewTestsSpecs.ItemNotificationSpec
 *
 * @description This is the view tests for the ItemNotificationPage.
 * It tests for archive, unarchive, bookmark and remove bookmark notifications
 * on an item view.
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
var Notification = require('../components/Notification');
var itemNotificationPage = require('../pages/ItemNotificationPage');
var ItemHeader = require('../components/ItemHeader');

function ViewItemNotificationSpec() {

	ViewItemNotificationSpec.super_.call(this);
	var that = this;

	describe('ItemNotification', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					itemNotificationPage.go();
					itemNotificationPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});
			});
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('navigates to the workspace item details view page', function () {
			this._runnable.ssName = 'landingOnViewDetailsView';

			// App header should be displayed
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});

			// URL should be correct
			expect(browser.driver.getCurrentUrl()).to.eventually
				.contain('tab=details');

			// Item Details tab must be the one selected
			ItemMenu.getItemMenuTabs().each(function (tab) {
				tab.getText().then(function (name) {
					if (name === 'ITEM DETAILS') {
						expect(tab.getAttribute('class')).to.eventually.contain('active');
					}
				});
			});
		});

		it('displays a success notification for archiving an item', function () {
			var EC = protractor.ExpectedConditions;
			browser.wait(EC.elementToBeClickable(ItemHeader.getActionsDropDownButton()), 5000);
			ItemHeader.getActionsDropDownButton().click();

			var item = itemNotificationPage.getMenuButton('Archive');
			browser.wait(EC.elementToBeClickable(item), 5000);
			item.click();
			Notification.isNotificationPresent().then((isPresent) => {
				if (isPresent) {
					expect(Notification.getNotificationText()).to.eventually.equal(
						'AT000000 - S135-155FT - Facility A - Engineering - Archived Successfully.');
					Notification.getCloseIcon().click();
				}
			});
		});

		it('displays a success notification for unarchiving an item', function () {
			var EC = protractor.ExpectedConditions;
			browser.wait(EC.elementToBeClickable(ItemHeader.getActionsDropDownButton()), 5000);
			ItemHeader.getActionsDropDownButton().click();

			var item = itemNotificationPage.getMenuButton('Unarchive');
			browser.wait(EC.elementToBeClickable(item), 5000);
			item.click();
			Notification.isNotificationPresent().then((isPresent) => {
				if (isPresent) {
					expect(Notification.getNotificationText()).to.eventually.equal(
						'AT000000 - S135-155FT - Facility A - Engineering - Unarchived Successfully.');
					Notification.getCloseIcon().click();
				}
			});
		});

		it('displays a success notification for bookmarking an item', function () {
			itemNotificationPage.getMenuButton('Bookmark').click();

			expect(Notification.isNotificationPresent()).to.eventually.be.true;
			expect(Notification.getNotificationText()).to.eventually.equal(
				'AT000000 - S135-155FT - Facility A - Engineering - Bookmarked Successfully.');
			Notification.getCloseIcon().click();
		});

		it('displays a success notification for removing the bookmark of an item', function () {
			itemNotificationPage.getMenuButton('Remove Bookmark').click();

			expect(Notification.isNotificationPresent()).to.eventually.be.true;
			expect(Notification.getNotificationText()).to.eventually.equal(
				'AT000000 - S135-155FT - Facility A - Engineering - Bookmark Removed Successfully.');
			Notification.getCloseIcon().click();
		});
	});
}

util.inherits(ViewItemNotificationSpec, SharedSpec);

module.exports = new ViewItemNotificationSpec();
