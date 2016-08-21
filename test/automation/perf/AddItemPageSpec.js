/**
 * @ngdoc object
 * @name ViewTestsSpecs.AddItemPageSpec
 *
 * @description This is the view tests for the ViewDetailsViewPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var addItemPage = require('../pages/AddItemPage');

function AddItemPageSpec() {

	var that = this;

	describe('AddItemPage', function () {
		this.timeout(60000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					addItemPage.go();
					return addItemPage.waitForEvents().then(function (result) {
						 expect(result).to.be.true;
					});
				});
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

module.exports = new AddItemPageSpec();
