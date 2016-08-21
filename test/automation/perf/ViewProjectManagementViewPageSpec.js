/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewProjectManagementViewPageSpec
 *
 * @description This is the view tests for the Project Management view.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var projectManagementPage = require('../pages/ViewProjectManagementPage');

function ViewProjectManagementViewPageSpec() {

	var that = this;

	describe('ViewProjectManagementView', function () {
		this.timeout(300000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					projectManagementPage.go();
					projectManagementPage.waitForEvents().then(function (result) {
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

module.exports = new ViewProjectManagementViewPageSpec();
