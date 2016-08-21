/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewAffectedItemsViewPageSpec
 *
 * @description This is the view tests for the AffectedItemsViewPage.
 *
 * ##Dependencies
 *
 */

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var AffectedItemsViewPageObj = require('../pages/ViewAffectedItemsPage');
var affectedItemsViewPage = new AffectedItemsViewPageObj();

function ViewAffectedItemsViewPageSpec() {

	var that = this;

	describe('ViewAffectedItemsView', function () {
		this.timeout(150000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					affectedItemsViewPage.go();
					affectedItemsViewPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
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

module.exports = new ViewAffectedItemsViewPageSpec();
