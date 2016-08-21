'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewBomAttachedItemsFlyoutViewSpec
 *
 * @description This is the view tests for the ViewBomPage.
 *
 * ##Dependencies
 *
 */

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var ItemMenu = require('../components/ItemMenu');
var viewBomPageClass = require('../pages/ViewBomPage');
var util = require('util');
var BomAttachedItemFlyout = require('../components/BomAttachedItemFlyout');
var viewBomPage = new viewBomPageClass();

function ViewBomAttachedItemsFlyoutViewSpec() {
	ViewBomAttachedItemsFlyoutViewSpec.super_.call(this);
	var that = this;

	describe.skip('<BomAttachedItems>', function () {
		this.timeout(200000);

		var EC = protractor.ExpectedConditions;

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewBomPage.goToAttachmentItem();
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

		describe('[Bom Page]', function () {
			it('navigates to the workspace item bom view page', function () {
				this._runnable.ssName = 'BomAttachedItems-arriveOnBomPage';

				// App header should be displayed
				AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
					expect(componentDisplayStatusList[0]).to.be.true;
				});

				// URL should be correct
				expect(browser.driver.getCurrentUrl()).to.eventually.contain('tab=bom');

				// Item Details tab must be the one selected
				ItemMenu.getItemMenuTabs().each(function (tab) {
					tab.getText().then(function (name) {
						if (name === 'BILL OF MATERIALS') {
							expect(tab.getAttribute('class')).to.eventually.contain('active');
						}
					});
				});
			});
		});

		it('triggers the attached items flyout', function () {
			this._runnable.ssName = 'BomAttachedItems-openFlyout';

			var row = viewBomPage.bom.table.rows.getRow(0);
			var iconButton = row.getAttachedItemIcon();

			browser.wait(EC.elementToBeClickable(iconButton), 5000); // wait for an element to become clickable
			iconButton.click();

			browser.wait(EC.visibilityOf(BomAttachedItemFlyout.getAttachedItemsFlyout()), 5000);
		});

		it('checks that item header contains 2 items', function () {
			this._runnable.ssName = 'BomAttachedItems-checksHeader';

			expect(BomAttachedItemFlyout.getAttachedItemsHeader()).to.eventually.equal('2 \nDIRECT ATTACHMENTS');
		});

		it('triggers the actions dropdown', function () {
			this._runnable.ssName = 'BomAttachedItems-triggersActionsDropdown';

			BomAttachedItemFlyout.getActionMenu().click();
			expect(BomAttachedItemFlyout.getDropDownWidget().isDisplayed()).to.eventually.be.true;
		});

		it('checks that there are 2 items in the attached item list', function () {
			this._runnable.ssName = 'BomAttachedItems-containsItems';

			expect(BomAttachedItemFlyout.getAttachedItemsList().count()).to.eventually.equal(2);
		});

		it('contains title, version and type for the first item', function () {
			this._runnable.ssName = 'BomAttachedItems-containsDetails';

			BomAttachedItemFlyout.getFirstItem().click();
			expect(BomAttachedItemFlyout.getDescriptorOfFirstItem()).to.eventually.equal('WipFileBrowser.tiff');
			expect(BomAttachedItemFlyout.getVersionOfFirstItem()).to.eventually.equal('Version: 1');
			expect(BomAttachedItemFlyout.getTypeOfFirstItem()).to.eventually.equal('Type: tiff');
		});

		it('displays open containing folder and download icon on hover', function () {
			this._runnable.ssName = 'BomAttachedItems-containsIconsOnHover';

			browser.actions().mouseMove(BomAttachedItemFlyout.getFirstItem()).perform();

			// opening containing folder of first item
			browser.wait(EC.visibilityOf(BomAttachedItemFlyout.getActionsButtons().first()), 5000);

			// download file icon of first item
			browser.wait(EC.visibilityOf(BomAttachedItemFlyout.getActionsButtons().get(1)), 5000);

			// opening containing folder icon of second item
			browser.wait(EC.not(EC.visibilityOf(BomAttachedItemFlyout.getActionsButtons().get(2))), 5000);

			// download file icon of second item
			browser.wait(EC.not(EC.visibilityOf(BomAttachedItemFlyout.getActionsButtons().get(3))), 5000);
		});

		it('closes attached items flyout on clicking Close button', function () {
			this._runnable.ssName = 'BomAttachedItems-closeFlyout';

			BomAttachedItemFlyout.getCloseFlyoutButton().click();
			browser.wait(EC.not(EC.visibilityOf(BomAttachedItemFlyout.getAttachedItemsFlyout())), 5000);
		});

		it('closes attached items flyout on clicking outside the flyout', function () {
			this._runnable.ssName = 'BomAttachedItems-closeFlyoutOnClickOutside';

			var row = viewBomPage.bom.table.rows.getRow(0);
			var iconButton = row.getAttachedItemIcon();

			browser.wait(EC.elementToBeClickable(iconButton), 5000); // wait for an element to become clickable

			// Open flyout
			iconButton.click();
			browser.waitForAngular();

			// Close flyout by clicking outside it
			var backdrop = BomAttachedItemFlyout.getFlyoutBackdrop();
			browser.executeScript('arguments[0].click();', backdrop.getWebElement()); // Force a click on the disabled backdrop via javascript

			browser.wait(EC.not(EC.visibilityOf(BomAttachedItemFlyout.getAttachedItemsFlyout())), 5000);
		});
	});
}

util.inherits(ViewBomAttachedItemsFlyoutViewSpec, SharedSpec);

module.exports = new ViewBomAttachedItemsFlyoutViewSpec();
