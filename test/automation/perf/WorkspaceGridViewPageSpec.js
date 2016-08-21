/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceGridViewSpec
 *
 * @description This is the view tests for the WorkspaceGridViewPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var WorkspaceGridObj = require('../pages/ViewGridPage');

var workspaceGridViewPage = new WorkspaceGridObj;

function WorkspaceGridViewPageSpec() {

	var that = this;

	describe.skip('WorkspaceGridView', function () {

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					workspaceGridViewPage.go();
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

module.exports = new WorkspaceGridViewPageSpec();
