/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceGridEditViewSpec
 *
 * @description This is the view tests for the WorkspaceGridEditPage.
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
var workspaceGridEditPage = require('../pages/EditGridPage');

function WorkspaceGridEditViewSpec() {

	WorkspaceGridEditViewSpec.super_.call(this);
	var that = this;

	describe.skip('WorkspaceGridEditView', function () {

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					workspaceGridEditPage.go();
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

		it('navigates to the workspace item details edit page', function () {
			this._runnable.ssName = 'landingOnWorkspaceGridEdit';

			// There should be 4 levels in the breadcrumbs: dashboard > workspaces > workspace > item
			expect(AppHeader.getBreadcrumbElementsCount()).to.eventually.equal(4);
			// App header should be displayed
			expect(AppHeader.isAppHeaderComponentsDisplayed()).to.eventually.be.true;
		});

		it('displays the item menu with the grid tab', function () {
			this._runnable.ssName = 'WorkspaceGridEdit-itemMenu';

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

		it('displays the save and cancel buttons in the edit state', function () {
			this._runnable.ssName = 'WorkspaceGridEdit-editBtns';

			expect(ItemHeader.isHeaderBtnsDisplayed(4)).to.eventually.be.true;
			// The save button should use icon-Checkmark icon
			workspaceGridEditPage.getSaveBtn().then(function (saveBtn) {
				saveBtn.element(by.tagName('span')).getAttribute('class').then(function (classes) {
					expect(classes).to.contain('icon-Checkmark');
				});
			});
			// The cancel button should use icon-Delete icon
			workspaceGridEditPage.getCancelBtn().then(function (cancelBtn) {
				cancelBtn.element(by.tagName('span')).getAttribute('class').then(function (classes) {
					expect(classes).to.contain('icon-Delete');
				});
			});
		});

		it('has editable input fields', function () {
			this._runnable.ssName = 'WorkspaceGridEdit-inputFields';

			// TODO: Assumption that there is at least one editable field
			expect(workspaceGridEditPage.getInputCount()).to.eventually.be.at.least(1);
		});

		// Run shared tests
		// that.testItemHeader(workspaceGridEditPage, 'WorkspaceGridEdit', '');
		// that.testComments(workspaceGridEditPage, 'WorkspaceGridEdit', 4);
	});
}

util.inherits(WorkspaceGridEditViewSpec, SharedSpec);

module.exports = new WorkspaceGridEditViewSpec();
