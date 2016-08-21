/**
 * @ngdoc object
 * @name ViewTestsSpecs.EditAffectedItemsCustomColumnsSpec
 *
 * @description This is the view tests for the EditAffectedItemsCustomColumnsPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');

var customColumnsPage = require('../pages/EditAffectedItemsCustomColumnsPage');

function EditAffectedItemsCustomColumnsSpec() {

	EditAffectedItemsCustomColumnsSpec.super_.call(this);

	var that = this;
	var expectedConditions = protractor.ExpectedConditions;

	describe('EditAffectedItemsCustomColumns', function () {
		this.timeout(150000);

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal();
			customColumnsPage.go();
			customColumnsPage.waitForEvents().then(function (result) {
				expect(result).to.be.true;
			});
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('has one item in the list of affected items', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-oneItem';

			expect(customColumnsPage.isAffectedItemsTableDisplayed())
				.to.eventually.be.true;
			expect(customColumnsPage.itemRows.count())
				.to.eventually.equal(1);
		});

		it('has a radio field configured', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-radioField';

			expect(customColumnsPage.getHeaderCell(19).getText())
				.to.eventually.equal('R_PICKLIST');
		});

		it('has no value in the radio field', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-radioFieldNoValue';

			expect(customColumnsPage.getCell(0, 19).getText())
				.to.eventually.equal('');
		});

		it('triggers the radio field menu', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-radioFieldMenu';
			var radioField = customColumnsPage.getCell(0, 19);

			radioField.click();
			expect(customColumnsPage.isRadioFieldMenuDisplayed(radioField))
				.to.eventually.be.true;
		});

		it('has two options in the radio field menu', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-radioFieldOptions';
			var radioField = customColumnsPage.getCell(0, 19);

			expect(customColumnsPage.getRadioButtons(radioField).count())
				.to.eventually.equal(2);
		});

		it('selects the first radio option and sets the cell to dirty state', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-selectFirstRadioOption';
			var radioField = customColumnsPage.getCell(0, 19);

			customColumnsPage.getRadioButtons(radioField).get(0).click();
			expect(customColumnsPage.getCell(0, 19).getText())
				.to.eventually.equal('AT000000 - S135-155FT - Facility A - Engineering');
			expect(customColumnsPage.getRowStateIndicatorClasses(0))
				.to.eventually.contain('dirty');
			expect(customColumnsPage.getCellStateIndicatorClasses(0, 19))
				.to.eventually.contain('dirty');
		});

		it('selects the second radio option and displays the selected option as the first', function () {
			this._runnable.ssName = 'EditAffectedItemsCustomColumns-selectSecondRadioOption';
			var radioField = customColumnsPage.getCell(0, 19);

			// Select second option
			radioField.click();
			customColumnsPage.getRadioButtons(radioField).get(1).click();
			expect(customColumnsPage.getCell(0, 19).getText())
				.to.eventually.equal('AT000001 - NVX5060II - Facility A - Prod. Work Station #1');

			// Check that selected second option is now the first in the menu
			radioField.click();
			expect(customColumnsPage.getRadioButtons(radioField).get(0).getText())
				.to.eventually.contain('AT000001 - NVX5060II - Facility A - Prod. Work Station #1');

			// Needed to avoid the navigation guard
			customColumnsPage.save();
		});
	});
}

util.inherits(EditAffectedItemsCustomColumnsSpec, SharedSpec);

module.exports = new EditAffectedItemsCustomColumnsSpec();
