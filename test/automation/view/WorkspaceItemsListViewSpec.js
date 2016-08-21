var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');
var workspaceItemsListPage = require('../pages/WorkspaceItemsListPage');
var helper = require('../util/Helper');

/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceItemsListViewSpec
 *
 * @description This is the view tests for the WorkspaceItemsListPage.
 *
 * ##Dependencies
 *
 */
function WorkspaceItemsListViewSpec() {

	WorkspaceItemsListViewSpec.super_.call(this);
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

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		describe('[MISC]', function () {
			it('navigates to the workspace items list page', function () {
				this._runnable.ssName = 'landingOnWorkspaceItemsList';

				// App header should be displayed
				AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
					expect(componentDisplayStatusList[0]).to.be.true;
				});

				// URL should be correct
				expect(browser.driver.getCurrentUrl()).to.eventually.contain('/items');
			});

			it('shows the workspace name', function () {
				this._runnable.ssName = 'WorkspaceItemsList-workspaceName';

				expect(workspaceItemsListPage.isWorkspaceNameDisplayed()).to.eventually.be.true;
				AppHeader.getWorkspaceName().then(function (wsName) {
					expect(workspaceItemsListPage.getWorkspaceName()).to.eventually.equal(wsName);
				});
			});
		});

		describe('[Table]', function () {

			it('displays the list of workspace items', function () {
				this._runnable.ssName = 'WorkspaceItemsList-displayWSItems';

				// Table of workspace items should be displayed
				workspaceItemsListPage.isWorkspaceItemsDisplayed().then(function (wsItemsDisplayed) {
					expect(wsItemsDisplayed).to.be.true;
					expect(workspaceItemsListPage.getWorkspaceItemsCount()).to.eventually.be.at.least(1);
				});
			});

			describe('[Pull next page]', function () {
				var originalRoute;
				before(function () {
					originalRoute = workspaceItemsListPage.route;
					// 'Classification Structure' worskpace
					workspaceItemsListPage.route = workspaceItemsListPage.route.replace('/8/', '/51/');
					workspaceItemsListPage.go();
					return workspaceItemsListPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});

				after(function () {
					// 'Item & Boms' worskpace
					workspaceItemsListPage.route = originalRoute;
					workspaceItemsListPage.go();
					return workspaceItemsListPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});

				it('loads more items to the list if scrolled to the end of the list, i.e. infinite scrolling is implemented', function () {
					this._runnable.ssName = 'WorkspaceItemsList-infiniteScrolling';
					var lastElementFirstBatch = '170 - PNEUMATICS - VALVE - FLOW CONTROL';
					var firstElementSecondBatch = '170 - HYDRAULICS - VALVE - GATE';
					workspaceItemsListPage.isViewsDisplayed().then(function () {
						// Scroll to the end of the page and open last item
						workspaceItemsListPage.scrollDownAndOpenItem(lastElementFirstBatch, 2).then(function () {
							// if succeed, then open the first item of next batch
							expect(workspaceItemsListPage.openItem(firstElementSecondBatch)).to.eventually.be.true;
						});
					});
				});

			});
			
			it.skip('displays no results if there are no items', function () {
				this._runnable.ssName = 'WorkspaceItemsList-noResults';

				workspaceItemsListPage.getWorkspaceItemsCount().then(function (wsItemsCount) {
					// Check for no results if there is only one tr child
					// TODO: consider this test for TDW component instead
					if (wsItemsCount === 1) {
						workspaceItemsListPage.getWorkspaceItemsClass().then(function (classes) {
							// If the class 'empty-state' is present, it means 'No results'
							if (classes.search('empty-state') !== -1) {
								expect(workspaceItemsListPage.getWorkspaceItemsFirstItem()).to.equal('No results');
							}
						});
					}
				});
			});

			it('performs remote sorting when clicking on the column header', function () {
				this._runnable.ssName = 'WorkspaceItemsList-remoteSorting';

				// Perform sort only when there is more than one workspace item
				workspaceItemsListPage.getWorkspaceItemsCount().then(function (wsItemsCount) {
					if (wsItemsCount > 1) {
						// Perform the sort
						workspaceItemsListPage.sortWorkspaceItems().then(function () {
							// Get the first three items
							var firstItem, secondItem, thirdItem;

							workspaceItemsListPage.getTableDataCellContent(0, 0).then(function (item) {
								firstItem = item;
							});
							workspaceItemsListPage.getTableDataCellContent(1, 0).then(function (item) {
								secondItem = item;
							});
							workspaceItemsListPage.getTableDataCellContent(2, 0).then(function (item) {
								thirdItem = item;
							});
							// Get the sort order, whether ascending or descending
							workspaceItemsListPage.isSortAscending().then(function (value) {
								if (value) {
									// Check the ascending order of the first three items
									expect(firstItem).to.be.at.most(secondItem);
									expect(secondItem).to.be.at.most(thirdItem);
								} else {
									// Check the descending order of the first three items
									expect(firstItem).to.be.at.least(secondItem);
									expect(secondItem).to.be.at.least(thirdItem);
								}
							});
						});
					}
				});
			});

			it('table should have at least 1 column ', function () {
				this._runnable.ssName = 'WorkspaceItemsList-atLeastOneColumn';
				expect(workspaceItemsListPage.getColumnsCount()).to.eventually.be.above(0);
			});

			it('sort the list of workspace items according the column 1 ', function () {
				this._runnable.ssName = 'WorkspaceItemsList-remoteSorting2';
				var cellTextBeforeSort;

				// when sorting 2 times at the same column the first element should be de same
				workspaceItemsListPage.getTableDataCellContent(0,0).then(function (text) {
					cellTextBeforeSort = text;

					workspaceItemsListPage.clickHeaderOfColumn(0);

					workspaceItemsListPage.getTableDataCellContent(0,0).then(function (text) {
						expect(text).to.not.be.equal(cellTextBeforeSort);
						workspaceItemsListPage.clickHeaderOfColumn(0);
						workspaceItemsListPage.getTableDataCellContent(0,0).then(function (text) {
							expect(text).to.be.equal(cellTextBeforeSort);
						});
					});
				});
			});
		});

		describe('[Create button]', () => {
			'use strict';

			it('should check that the Create button is present', () => {
				expect(workspaceItemsListPage.createButton.isPresent()).to.be.truthy;
				expect(workspaceItemsListPage.createButton.isDisplayed()).to.eventually.be.truthy;
			});

			it('should click the Create button navigating to the add-item view', function () {
				return browser.getCurrentUrl().then(prevRoute => {
					return workspaceItemsListPage.createButton.click().then(() => {
						return helper.waitForUrlToChangeTo(/addItem/).then(result => {
							expect(result).to.be.truthy;
							return browser.get(prevRoute);
						});
					});
				});
			});
		});

		describe('[Views switch]', function () {
			it('shows the dropdown for views upon clicking', function () {
				this._runnable.ssName = 'WorkspaceItemsList-viewsDropdown';

				workspaceItemsListPage.toggleViewsDropdown();
				expect(workspaceItemsListPage.isViewsDisplayed()).to.eventually.be.true;
			});

			it('has at least one (default) view in the dropdown for views whereby user can switch between views', function () {
				this._runnable.ssName = 'WorkspaceItemsList-changeViews';

				expect(workspaceItemsListPage.getViewsCount()).to.eventually.be.at.least(1);
			});
		});

		/**
		 * TODO
		 * We must add a proper test related to the Access control in a workspace
		 * [PLM-6600] Workspace Items List Access Control (My Views)
		 * [PLM-6668] Implementation / Tests
		 * Permissions: View Working Version, View Historical Items, View only my items
		 * The lists are provided correctly filtered by the API so we should see how to test this,
		 * and if it is useful to do it.
		 */
	});
}

util.inherits(WorkspaceItemsListViewSpec, SharedSpec);

module.exports = new WorkspaceItemsListViewSpec();
