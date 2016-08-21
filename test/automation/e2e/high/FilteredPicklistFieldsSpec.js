'use strict';

/**
 * @ngdoc object
 * @name E2ETestsSpecs.FilteredPicklistSpec
 *
 * @description This is the e2e test for Affected Items Tab (Basic View)
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var ss = require('../../util/screenshoter');
var util = require('util');

var AppHeader = require('../../components/AppHeader');
var Notification = require('../../components/Notification');
var dashboardPage = require('../../pages/MainDashboardPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
var workspaceItemDetailsEditPage = require('../../pages/WorkspaceItemDetailsEditPage');
var FplField = require('../../components/FilteredPicklistField');

/**
 * @ngdoc method
 * @name E2ETestsSpecs.FilteredPicklistSpec#FilteredPicklistSpec
 * @propertyOf E2ETestsSpecs.FilteredPicklistSpec
 * @description The E2E spec for Filtered Picklist fields
 */
function FilteredPicklistFieldsSpec() {

	describe('[FilteredPicklistFieldsSpec]', function () {
		this.timeout(120000);

		var fpl1, fpl2, fpl3, fpl4, fpl5, fpl6, fpl7, fpl8;

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal();

			AppHeader.openWorkspace('Engineering', 'Items and BOMs');
			workspaceItemsListPage.openItem('683-0002-000 - Pneumatic Assembly, Project 621');

			fpl1 = FplField.getFplByIndex(0);
			fpl2 = FplField.getFplByIndex(1);
			fpl3 = FplField.getFplByIndex(2);
			fpl4 = FplField.getFplByIndex(3);
			fpl5 = FplField.getFplByIndex(4);
			fpl6 = FplField.getFplByIndex(5);
			fpl7 = FplField.getFplByIndex(6);
			fpl8 = FplField.getFplByIndex(7);
		});

		it('should verify the saved values', function () {
			expect(FplField.getViewText(fpl1)).to.eventually.equal('BOM');
			expect(FplField.getViewText(fpl2)).to.eventually.equal('SUB BOM PIPING');
			expect(FplField.getViewText(fpl3)).to.eventually.equal('');
			expect(FplField.getViewText(fpl4)).to.eventually.equal('683');
			expect(FplField.getViewHrefText(fpl5)).to.eventually.equal('683 - BOM - SUB BOM PIPING -');
			expect(FplField.getViewText(fpl6)).to.eventually.equal('Project Number');
			expect(FplField.getViewText(fpl7)).to.eventually.equal('');
			expect(FplField.getViewText(fpl8)).to.eventually.equal('');
		});

		describe(['Edit mode'], function () {

			function clearAllFpls() {
				FplField.getClearBtn(fpl1).click();
				FplField.getClearBtn(fpl2).click();
				FplField.getClearBtn(fpl3).click();
				FplField.getClearBtn(fpl4).click();
				FplField.getClearBtn(fpl5).click();
				FplField.getClearBtn(fpl6).click();
				FplField.getClearBtn(fpl7).click();
				FplField.getClearBtn(fpl8).click();
			}

			beforeEach(function () {
				workspaceItemDetailsEditPage.getEditBtn().click();
			});

			afterEach(function () {
				workspaceItemDetailsEditPage.getCancelBtn().click();
				browser.sleep(1000);
			});

			it('should have 23 FPL fields present, all related', function () {
				expect(FplField.getFplCount()).to.eventually.equal(23);
			});

			it('should have all correct values present for all of the FPLs', function () {
				expect(FplField.getEditText(fpl1)).to.eventually.equal('BOM');
				expect(FplField.getEditText(fpl2)).to.eventually.equal('SUB BOM PIPING');
				expect(FplField.getEditText(fpl3)).to.eventually.equal('');
				expect(FplField.getEditText(fpl4)).to.eventually.equal('683');
				expect(FplField.getEditText(fpl5)).to.eventually.equal('683 - BOM - SUB BOM PIPING -');
				expect(FplField.getEditText(fpl6)).to.eventually.equal('Project Number');
				expect(FplField.getEditText(fpl7)).to.eventually.equal('');
				expect(FplField.getEditText(fpl8)).to.eventually.equal('');
			});

			it('should clean all values', function () {

				clearAllFpls();

				expect(FplField.getEditText(fpl1)).to.eventually.equal('');
				expect(FplField.getEditText(fpl2)).to.eventually.equal('');
				expect(FplField.getEditText(fpl3)).to.eventually.equal('');
				expect(FplField.getEditText(fpl4)).to.eventually.equal('');
				expect(FplField.getEditText(fpl5)).to.eventually.equal('');
				expect(FplField.getEditText(fpl6)).to.eventually.equal('');
				expect(FplField.getEditText(fpl7)).to.eventually.equal('');
				expect(FplField.getEditText(fpl8)).to.eventually.equal('');
			});

			// NEED TO RE-ENABLE THIS TEST, AUTO-SELECTION OF FPLS IS BROKEN AS OF APRIL/2016
			it.skip('should select a value for the second FPL and set automatically the values of the related FPLs', function () {

				clearAllFpls();

				FplField.getDropdown(fpl2).click();
				// TODO: This is a workaround for a bug that must be fixed. It is here for not disabling the test.
				FplField.getDropdown(fpl2).click();

				browser.sleep(500);

				FplField.getDropdownOptionByIndex(fpl2, 9).click();

				browser.sleep(500);

				expect(FplField.getEditText(fpl1)).to.eventually.equal('FASTENERS (Inch)');
				expect(FplField.getEditText(fpl2)).to.eventually.equal('ANCHOR');
				expect(FplField.getEditText(fpl3)).to.eventually.equal('');
				expect(FplField.getEditText(fpl4)).to.eventually.equal('101');
				expect(FplField.getEditText(fpl5)).to.eventually.equal('101 - FASTENERS (Inch) - ANCHOR -');
				expect(FplField.getEditText(fpl6)).to.eventually.equal('Description');
				expect(FplField.getEditText(fpl7)).to.eventually.equal('');
				expect(FplField.getEditText(fpl8)).to.eventually.equal('');
			});

			it('should cancel the edition and show correct untouched values in the view mode', function () {

				browser.executeScript("$('item-viewer-wrapper').scrollTop(0);");

				workspaceItemDetailsEditPage.getCancelBtn().click();

				browser.sleep(500);

				expect(FplField.getViewText(fpl1)).to.eventually.equal('BOM');
				expect(FplField.getViewText(fpl2)).to.eventually.equal('SUB BOM PIPING');
				expect(FplField.getViewText(fpl3)).to.eventually.equal('');
				expect(FplField.getViewText(fpl4)).to.eventually.equal('683');
				expect(FplField.getViewHrefText(fpl5)).to.eventually.equal('683 - BOM - SUB BOM PIPING -');
				expect(FplField.getViewText(fpl6)).to.eventually.equal('Project Number');
				expect(FplField.getViewText(fpl7)).to.eventually.equal('');
				expect(FplField.getViewText(fpl8)).to.eventually.equal('');

				// To leave the same state - starting from with edit enabled
				workspaceItemDetailsEditPage.getEditBtn().click();
				browser.sleep(1000);
			});

			it.skip('should select an option in the second FPLs and change the options quantity for FPL1', function () {

				clearAllFpls();

				FplField.getDropdown(fpl1).click();
				// TODO: This is a workaround for a bug that must be fixed. It is here for not disabling the test.
				FplField.getDropdown(fpl1).click();

				browser.sleep(2000);

				expect(FplField.getDropdownOptions(fpl1).count()).to.eventually.equal(28);

				// Select the first and clear again
				FplField.getDropdownOptionByIndex(fpl1, 0).click();
				FplField.getClearBtn(fpl1).click();

				FplField.getDropdown(fpl2).click();
				FplField.getDropdownOptionByIndex(fpl2, 0).click();

				browser.sleep(2000);

				FplField.getDropdown(fpl1).click();

				expect(FplField.getDropdownOptions(fpl1).count()).to.eventually.equal(2);
			});

			/*
			 TODO: We would need additional tests for the multiple scenarios in which this feature work.
			*/

		});
	});
}

module.exports = new FilteredPicklistFieldsSpec();
