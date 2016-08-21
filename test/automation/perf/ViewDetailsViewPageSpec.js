/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDetailsViewPageSpec
 *
 * @description This is the view tests for the ViewDetailsViewPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewDetailsViewPage = require('../pages/ViewDetailsViewPage');

function ViewDetailsViewPageSpec() {

	var that = this;

	describe('ViewDetailsView', function () {
		this.timeout(60000);

		before(function () {
			var deferred = protractor.promise.defer();

			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewDetailsViewPage.changeRoute(62,3664);
					viewDetailsViewPage.go();
					viewDetailsViewPage.waitForEvents().then(function (result) {
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

module.exports = new ViewDetailsViewPageSpec();
