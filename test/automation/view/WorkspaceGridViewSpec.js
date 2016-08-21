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
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var ItemMenu = require('../components/ItemMenu');
var ItemHeader = require('../components/ItemHeader');
var WorkspaceGridObj = require('../pages/ViewGridPage');

var workspaceGridViewPage = new WorkspaceGridObj;

function WorkspaceGridViewSpec() {

	WorkspaceGridViewSpec.super_.call(this);
	var that = this;

	describe.skip('WorkspaceGridView', function () {

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					workspaceGridViewPage.go();
				});
			});
		});

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('navigates to the workspace grid view page', function () {
			this._runnable.ssName = 'landingOnWorkspaceGridView';

			// There should be 4 levels in the breadcrumbs: dashboard > workspaces > workspace > item
			expect(AppHeader.getBreadcrumbElementsCount()).to.eventually.equal(4);
			// App header should be displayed
			expect(AppHeader.isAppHeaderComponentsDisplayed()).to.eventually.be.true;
		});

		it('displays the item menu with the grid tab', function () {
			this._runnable.ssName = 'WorkspaceGridView-itemMenu';

			// Item menu should be displayed
			expect(ItemMenu.isItemMenuDisplayed()).to.eventually.be.true;

			// Get the tab names on the item menu
			ItemMenu.getItemMenuTabs().map(function (menu) {
				return menu.getText();
			}).then(function (tabNames) {
				expect(tabNames).to.contain('Grid');
			});

			// Grid should use icon-Tabular icon
			ItemMenu.getItemMenuTabs().each(function (tab) {
				tab.getText().then(function (name) {
					if (name === 'Grid') {
						tab.element(by.tagName('span')).getAttribute('class').then(function (classes) {
							expect(classes).to.contain('icon-Tabular');
						});
					}
				});
			});
		});

		it('displays the edit, comments and actions buttons in the view state', function () {
			this._runnable.ssName = 'WorkspaceGridView-editBtns';

			expect(ItemHeader.isHeaderBtnsDisplayed(3)).to.eventually.be.true;
			// The edit button should use icon-Edit icon
			workspaceGridViewPage.getSaveBtn().then(function (saveBtn) {
				saveBtn.element(by.tagName('span')).getAttribute('class').then(function (classes) {
					expect(classes).to.contain('icon-Edit');
				});
			});
		});

		// Run shared tests
		// that.testItemHeader(workspaceGridViewPage, 'WorkspaceGridView', '');
		// that.testComments(workspaceGridViewPage, 'WorkspaceGridView', 3);
	});
}

util.inherits(WorkspaceGridViewSpec, SharedSpec);

module.exports = new WorkspaceGridViewSpec();
