/**
 * @ngdoc object
 * @name ViewTestsSpecs.ItemHeaderActionsSpec
 *
 * @description This is the view tests for action on the item header.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var Notification = require('../components/Notification');
var ItemHeader = require('../components/ItemHeader');
var ItemHeaderActionsPage = require('../pages/ItemHeaderActionsPage');

function ItemHeaderActionsSpec() {
	ItemHeaderActionsSpec.super_.call(this);
	var that = this;
	var EC = protractor.ExpectedConditions;

	describe('Disabled Archive/Unarchive', function () {
		this.timeout(60000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					ItemHeaderActionsPage.setRouteToLockedItem(true);
					ItemHeaderActionsPage.go();
					return ItemHeaderActionsPage.waitForEvents().then(function (result) {
						 expect(result).to.be.true;
					});
				});
			});
		});

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('disables the archive option', function () {
			browser.wait(EC.elementToBeClickable(ItemHeader.getActionsDropDownButton()), 5000);
			ItemHeader.clickActionsDropDownButton();
			var archiveOption = ItemHeader.getDropdownOption('Archive');
			expect(archiveOption.isEnabled(), 'Archive option is enabled').to.eventually.be.false;
		});
	});

	describe('Enabled Archive/Unarchive', function () {
		this.timeout(60000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					ItemHeaderActionsPage.setRouteToLockedItem(false);
					ItemHeaderActionsPage.go();
					return ItemHeaderActionsPage.waitForEvents().then(function (result) {
						 expect(result).to.be.true;
					});
				});
			});
		});

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('enables the archive option', function () {
			this._runnable.ssName = 'ItemHeaderActions-archiveEnabled';

			browser.wait(EC.elementToBeClickable(ItemHeader.getActionsDropDownButton()), 5000);
			ItemHeader.clickActionsDropDownButton();
			var archiveOption = ItemHeader.getDropdownOption('Archive');
			expect(archiveOption.isEnabled(), 'Archive option is not enabled').to.eventually.be.true;
		});

		it('archives the item', function () {
			this._runnable.ssName = 'ItemHeaderActions-archive';

			ItemHeader.getDropdownOption('Archive').click();
			browser.waitForAngular();

			expect(ItemHeader.getArchivedStatus().isDisplayed()).to.eventually.be.true;
		});

		it('displays the option as \'Unarchive\' if item is archived', function () {
			this._runnable.ssName = 'ItemHeaderActions-unarchiveEnabled';

			Notification.isNotificationPresent().then(function (notification) {
				if (notification) {
					// Dropdown button is currently blocked by notification
					Notification.getCloseIcon().click();
					ItemHeader.clickActionsDropDownButton();

					var archiveOption = ItemHeader.getDropdownOption('Unarchive');
					expect(archiveOption.getText()).to.eventually.equal('Unarchive');
				} else {
					ItemHeader.clickActionsDropDownButton();

					var archiveOption = ItemHeader.getDropdownOption('Unarchive');
					expect(archiveOption.getText()).to.eventually.equal('Unarchive');
				}
			});
		});

		it('unarchives the item', function () {
			this._runnable.ssName = 'ItemHeaderActions-unarchive';

			ItemHeader.getDropdownOption('Unarchive').click();
			browser.waitForAngular();

			expect(ItemHeader.getArchivedStatus().isPresent()).to.eventually.be.false;
		});
	});
}

util.inherits(ItemHeaderActionsSpec, SharedSpec);

module.exports = new ItemHeaderActionsSpec();
