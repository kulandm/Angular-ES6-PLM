/**
 * @ngdoc object
 * @name ViewTestsSpecs.MainDashboardViewPageSpec
 *
 * @description This is the view tests for the MainDashboardPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var mainDashboardPage = require('../pages/MainDashboardPage');

function MainDashboardViewPageSpec() {

	var that = this;

	describe('MainDashboardView', function () {
		// Because being the first one, this spec use to wait too much.
		this.timeout(120000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					mainDashboardPage.go();
					mainDashboardPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});
		it('lands on the page',function () {
			expect(true).to.be.true;
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});
	});
}

module.exports = new MainDashboardViewPageSpec();
