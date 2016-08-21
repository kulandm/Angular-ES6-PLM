var auth = require('../../util/Auth');
var AppHeader = require('../../components/AppHeader');
var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
var WorkspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');

/**
 * @ngdoc object
 * @name E2ETestsSpecs.WorkspaceAdminTabNamesSpec
 * @propertyOf E2ETestsSpecs
 * @description This is the e2e spec for validating the tabs
 */
function WorkspaceAdminTabNamesSpec() {
	describe.skip('WorkspaceAdmin TabNames test cases', function () {
		this.timeout(120000);

		before(function () {
			auth.doLoginWithParam('qa.UserX_NAME_836A4A1@autodesk.com','UserX_PWD_836A4A1');
			// Since it will log a new user we pass the second parameter to
			// checkAgreementModal forcing the verification.
			auth.checkAgreementModal(30000, true);
			AppHeader.openWorkspace('Service & Support', 'Field Failure Requests');
			WorkspaceItemsListPage.openItem('FFR000000 - EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable');
			browser.sleep(10000);
		});

		it('PLM2.0-1:Workspace Admin: Tab Names: View Permission for certain tabs', function () {
			expect(itemDetailsPage.isTabDisplayed('Item Details')).to.eventually.be.true;
			expect(itemDetailsPage.isTabDisplayed('Failed Components')).to.eventually.be.false;
			expect(itemDetailsPage.isTabDisplayed('Service')).to.eventually.be.true;
			expect(itemDetailsPage.isTabDisplayed('Related Changes')).to.eventually.be.false;
			expect(itemDetailsPage.isTabDisplayed('Workflow Actions')).to.eventually.be.false;
			expect(itemDetailsPage.isTabDisplayed('Attachments')).to.eventually.be.true;
			expect(itemDetailsPage.isTabDisplayed('Change Log')).to.eventually.be.false;
		});
	});
}

module.exports = new WorkspaceAdminTabNamesSpec();
