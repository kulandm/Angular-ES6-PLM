/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewRelationshipsViewPageSpec
 *
 * @description This is the view tests for the Workspace Item Relationships.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewRelationshipsPage = require('../pages/ViewRelationshipsPage');

function ViewRelationshipsViewPageSpec() {

	var that = this;

	describe('ViewRelationshipsView', function () {

		this.timeout(60000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewRelationshipsPage.go();
					viewRelationshipsPage.waitForEvents().then(function (result) {
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

module.exports = new ViewRelationshipsViewPageSpec();
