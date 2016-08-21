/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewWorkflowViewSpec
 *
 * @description This is the view tests for the WorkspaceWorflowPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var workspaceWorkflowPage = require('../pages/ViewWorkflowPage');

function ViewWorkflowViewPageSpec() {

	var that = this;

	describe('WorkspaceWorkflowView', function () {
		this.timeout(300000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					workspaceWorkflowPage.go();
					workspaceWorkflowPage.waitForEvents().then(function (result) {
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

module.exports = new ViewWorkflowViewPageSpec();
