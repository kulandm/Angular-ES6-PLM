/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceGridEditViewPageSpec
 *
 * @description This is the view tests for the WorkspaceGridEditPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var workspaceGridEditPage = require('../pages/EditGridPage');

function WorkspaceGridEditViewPageSpec() {

	var that = this;

	describe.skip('WorkspaceGridEditView', function () {

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					workspaceGridEditPage.go();
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

module.exports = new WorkspaceGridEditViewPageSpec();
