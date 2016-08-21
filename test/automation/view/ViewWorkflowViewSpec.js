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
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var ItemMenu = require('../components/ItemMenu');
var workspaceWorkflowPage = require('../pages/ViewWorkflowPage');

function ViewWorkflowViewSpec() {

	ViewWorkflowViewSpec.super_.call(this);
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

		after(function () {
//			auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('navigates to the workspace workflow page', function () {
			this._runnable.ssName = 'landingOnWorkspaceWorkflow';

			// App header should be displayed
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});
		});

		it('displays the sorting indicator on the workflow column by default', function () {
			this._runnable.ssName = 'WorkspaceWorkflowView-sortingIndicator';

			// Since the sorting indicator is created in a ::before pseudo-element,
			// isDisplayed returns false because the <span> has a width and height of 0;
			// instead check that the class list *doesn't* include 'invisible'
			expect(workspaceWorkflowPage.getSortingIndicatorClass()).to.eventually.not.contain('ui-grid-invisible');
		});

		it('displays the list of workflow items', function () {
			this._runnable.ssName = 'WorkspaceWorkflowView-workflowList';

			expect(workspaceWorkflowPage.isWorkflowTableDisplayed()).to.eventually.be.true;
			expect(workspaceWorkflowPage.workflowRows.count()).to.eventually.be.at.least(1);
		});

		it('shows the item descriptor of the workflow as a link', function () {
			this._runnable.ssName = 'WorkspaceWorkflowView-workflowLink';

			expect(workspaceWorkflowPage.isWorkflowLinkToItem()).to.eventually.be.true;
		});

		it('changes column width when the resize handler is dragged', function () {
			this._runnable.ssName = 'WorkspaceWorkflowView-resizeColumn';

			var initialWidth, finalWidth;
			var dragOffset = {
				x: 400,
				y: 0
			};

			workspaceWorkflowPage.getWorkflowColumnWidth().then(function (width) {
				initialWidth = width;

				// Resize the column using the offset specified above
				browser.actions()
					.dragAndDrop(workspaceWorkflowPage.workflowColumnResizer, dragOffset)
					.perform();

				// Width after resizing
				return workspaceWorkflowPage.getWorkflowColumnWidth();
			}).then(function (width) {
				finalWidth = width;

				expect(initialWidth).to.not.equal(finalWidth);
			});
		});

		// Run shared tests
		that.testWorkspacesMenu(workspaceWorkflowPage, 'WorkspaceWorkflowView');
		// that.testItemHeader(workspaceWorkflowPage, 'WorkspaceWorkflowView');
	});
}

util.inherits(ViewWorkflowViewSpec, SharedSpec);

module.exports = new ViewWorkflowViewSpec();
