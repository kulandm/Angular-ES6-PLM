/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewChangeLogViewPageSpec
 *
 * @description This is the view tests for the Workspace Item Change Log.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewChangeLogPage = require('../pages/ViewChangeLogPage');

// TODO: ViewChangeLogSpec and Page object needs to be upgraded. Page object still using old table references.
function ViewChangeLogViewPageSpec() {

	var that = this;

	describe('ViewChangeLogView', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewChangeLogPage.go();
					viewChangeLogPage.waitForEvents().then(function (result) {
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

module.exports = new ViewChangeLogViewPageSpec();
