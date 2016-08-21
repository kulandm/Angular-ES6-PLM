var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var workspaceItemsListPage = require('../pages/WorkspaceItemsListPage');

/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceItemsListViewPageSpec
 *
 * @description This is the view tests for the WorkspaceItemsListPage.
 *
 * ##Dependencies
 *
 */
function WorkspaceItemsListViewPageSpec() {
	var that = this;

	describe('WorkspaceItemsListView', function () {
		this.timeout(80000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					workspaceItemsListPage.go();
					return workspaceItemsListPage.waitForEvents().then(function (result) {
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

module.exports = new WorkspaceItemsListViewPageSpec();
