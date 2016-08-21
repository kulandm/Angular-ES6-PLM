/**
 * @ngdoc object
 * @name ViewTestsSpecs.EditAffectedItemsCustomColumnsPageSpec
 *
 * @description This is the view tests for the EditAffectedItemsCustomColumnsPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var customColumnsPage = require('../pages/EditAffectedItemsCustomColumnsPage');

function EditAffectedItemsCustomColumnsPageSpec() {

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

		it('lands on the page', function () {
			expect(true).to.be.true;
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});
	});
}

module.exports = new EditAffectedItemsCustomColumnsPageSpec();
