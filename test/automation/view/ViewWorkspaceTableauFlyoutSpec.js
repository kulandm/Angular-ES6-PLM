'use strict';

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var SharedSpec = require('./SharedSpec');
var util = require('util');
var mainDashboardPage = require('../pages/MainDashboardPage');
var workspaceItemsListPage = require('../pages/WorkspaceItemsListPage');
var ViewWorkspaceTableauFlyoutPage = require('../pages/ViewWorkspaceTableauFlyoutPage');

/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewWorkspaceTableauFlyout
 *
 * @description This is the view tests for the component to configure views
 *
 * ##Dependencies
 *
 */
function ViewWorkspaceTableauFlyout() {
	var that = this;
	ViewWorkspaceTableauFlyout.super_.call(this);
	var headerOfUiGrid;

	describe('[ViewWorkspaceTableauFlyout]', function () {
		this.timeout(60000);

		before(function () {
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					mainDashboardPage.go();
					mainDashboardPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});

		before(function () {
			// navigate to workspace items list
			workspaceItemsListPage.go();
			workspaceItemsListPage.waitForEvents().then(function (result) {
				expect(result).to.be.true;
				headerOfUiGrid = workspaceItemsListPage.workspaceItemsHeaders;
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

		describe('[Display Icon]', function () {
			it('should navigate to workspace items view and see the button is present', function () {
				expect(ViewWorkspaceTableauFlyoutPage.isWtFlyoutOpenerButtonDisplayed()).to.eventually.be.truthy;
			});

			it('should click button and show flyout', function () {
				ViewWorkspaceTableauFlyoutPage.openFlyout().then(function () {
					expect(ViewWorkspaceTableauFlyoutPage.isWtFlyoutDisplayed()).to.eventually.be.truthy;
				});
			});

			describe('[SHOWN COLUMNS panel]', function () {
				var checkboxTags = ViewWorkspaceTableauFlyoutPage.wtFlyoutSelectedColumnBox.$$('md-checkbox');
				var checkboxTagsChecked = ViewWorkspaceTableauFlyoutPage.wtFlyoutSelectedColumnBox.$$('md-checkbox.md-checked');
				var checkboxTagLength;
				var checkboxTagsCheckedLength;

				// getting the main div
				var flayoutElement = ViewWorkspaceTableauFlyoutPage.wtFlyoutTableauBox;
				it('the main div shoud be visible',function () {
					 expect(ViewWorkspaceTableauFlyoutPage.isWtFlyoutTableauBox()).to.eventually.be.truthy;
				});

				it('show the header',function () {
					// getting the 'Shown columns'
					var shownColumnsSpan = ViewWorkspaceTableauFlyoutPage.wtFlyoutSelectedColumnBox.$('.wtd-selected .wtd-columns-header');
					expect(shownColumnsSpan.getText()).to.eventually.be.equal('SHOWN COLUMNS');
					expect(shownColumnsSpan.isDisplayed()).to.eventually.be.truthy;
				});

				it('showing checkbox(s) for the selected columns, must being selected',function () {

					checkboxTags.then(function (items) {
						checkboxTagLength = items.length;
						expect(items.length).to.be.above(0);
					});
					checkboxTagsChecked.then(function (items) {
						checkboxTagsCheckedLength = items.length;
						expect(items.length).to.be.above(0);
					});
					expect(checkboxTagLength).to.equal(checkboxTagsCheckedLength);
				});

				it('columns must be ordered acording to the [displayOrder]',function () {
					var columns = headerOfUiGrid.$$('span.ui-grid-header-cell-label');
					var checkBoxNames = [];
					var headerWorkSpaceNames = [];

					checkboxTagsChecked.then(function (items) {
						for (var i = 0; i < items.length; i++) {
							items[i].getText().then(function (text) {
								checkBoxNames.push(text.toUpperCase());
							});
						}
					});

					columns.then(function (items) {
						for (var i = 0; i < items.length; i++) {
							items[i].getText().then(function (text) {
								headerWorkSpaceNames.push(text.toUpperCase());
							});
						}
					});

					for (var i = 0; i < checkBoxNames.length; i++) {
						expect(checkBoxNames[i]).to.equal(headerWorkSpaceNames[i]);
					}
				});
			});

			describe('[AVAILABLE COLUMNS panel]', function () {
				// getting the main div
				var flayoutElement = ViewWorkspaceTableauFlyoutPage.wtFlyoutTableauBox;

				it('show the header',function () {
					// setting the 'Shown columns'
					var availableColumnsSpan = flayoutElement.$('.wtd-unselected .wtd-columns-header');
					expect(availableColumnsSpan.getText()).to.eventually.be.equal('AVAILABLE COLUMNS');
					expect(availableColumnsSpan.isDisplayed()).to.eventually.be.truthy;
				});

				it('show the list of avaible columns',function () {
					// getting the ul
					var ulTag = flayoutElement.$$('.wtd-columns .wtd-unselected ul');
					expect(ulTag.isDisplayed()).to.eventually.be.truthy;
				});

				it('show filters columns in avaible columns unckecked',function () {
					// opening group
					ViewWorkspaceTableauFlyoutPage.getAvailableColumn(2).click();

					var checkBoxFilterClass = ViewWorkspaceTableauFlyoutPage.getCheckBoxOfAvailableColumn(2,0);
					expect(checkBoxFilterClass.getAttribute('aria-checked')).to.eventually.equal('false');
					// closing group
					ViewWorkspaceTableauFlyoutPage.getAvailableColumn(2).click();

				});
			});

			describe('[SAVE button]',function ()	{
				var checkboxTagsShownColumns = ViewWorkspaceTableauFlyoutPage.wtFlyoutSelectedColumnBox.$$('md-checkbox');
				var selectedColumnsName;

				it('click the first element of the SHOWN COLUMNS',function () {
					ViewWorkspaceTableauFlyoutPage.getShownColumns().then(function (shownColumnsAll) {
						expect(shownColumnsAll).to.be.instanceof(Array);
						expect(shownColumnsAll).to.have.length.above(0);
						ViewWorkspaceTableauFlyoutPage.getSelectedColumn(shownColumnsAll[2].index).click().then(function () {
							ViewWorkspaceTableauFlyoutPage.getShownColumnsSelected().then(function (shownColumnsSelected) {
								expect(shownColumnsSelected).to.be.instanceof(Array);
								expect(shownColumnsSelected.length + 1).to.be.equal(shownColumnsAll.length);
							});
						});
					});
				});

				it('click the first element of the 4 AVAILABLE COLUMNS',function () {
					// seleccionar una de las available
					ViewWorkspaceTableauFlyoutPage.getAvailableColumn(3).click().then(function () {
						ViewWorkspaceTableauFlyoutPage.getCheckBoxOfAvailableColumn(3,0).click().then(function () {
						});
					});
				});

				it('click the save button',function () {
					ViewWorkspaceTableauFlyoutPage.clickSave().then(function () {
						// updating the new columns on the table
						headerOfUiGrid = workspaceItemsListPage.workspaceItemsHeaders;

						ViewWorkspaceTableauFlyoutPage.openFlyout().then(function () {
							expect(ViewWorkspaceTableauFlyoutPage.isWtFlyoutDisplayed()).to.eventually.be.true;
						});
					});
				});

				it('columns must be ordered acording to the [displayOrder]',function () {
					var checkboxTags = ViewWorkspaceTableauFlyoutPage.wtFlyoutSelectedColumnBox.$$('md-checkbox');
					var checkboxTagsChecked = ViewWorkspaceTableauFlyoutPage.wtFlyoutSelectedColumnBox.$$('md-checkbox.md-checked');
					var checkboxTagLength;
					var checkboxTagsCheckedLength;
					var columns = headerOfUiGrid.$$('span.ui-grid-header-cell-label');
					var checkBoxNames = [];
					var headerWorkSpaceNames = [];

					checkboxTagsChecked.then(function (items) {
						for (var i = 0; i < items.length; i++) {
							items[i].getText().then(function (text) {
								checkBoxNames.push(text.toUpperCase());
							});
						}
					});

					columns.then(function (items) {
						for (var i = 0; i < items.length; i++) {
							items[i].getText().then(function (text) {
								headerWorkSpaceNames.push(text.toUpperCase());
							});
						}
					});

					for (var i = 0; i < checkBoxNames.length; i++) {
						expect(checkBoxNames[i]).to.equal(headerWorkSpaceNames[i]);
					}

				});

				// setting the data back to how it was before the test
				it('click the 3 element of the SHOWN COLUMNS',function () {
					ViewWorkspaceTableauFlyoutPage.getShownColumns().then(function (shownColumnsAll) {
						expect(shownColumnsAll).to.be.instanceof(Array);
						expect(shownColumnsAll).to.have.length.above(0);
						ViewWorkspaceTableauFlyoutPage.getSelectedColumn(shownColumnsAll[2].index).click().then(function () {
							ViewWorkspaceTableauFlyoutPage.getShownColumnsSelected().then(function (shownColumnsSelected) {
								expect(shownColumnsSelected).to.be.instanceof(Array);
								expect(shownColumnsSelected.length + 1).to.be.equal(shownColumnsAll.length);
							});
						});
					});
				});

				// setting the data back to how it was before the test
				it('click the 3 element of the 3 AVAILABLE COLUMNS',function () {
					// seleccionar una de las available
					ViewWorkspaceTableauFlyoutPage.getAvailableColumn(2).click().then(function () {
						ViewWorkspaceTableauFlyoutPage.getCheckBoxOfAvailableColumn(2,2).click().then(function () {
						});

					});
				});

				// setting the data back to how it was before the test
				it('click the save button',function () {
					ViewWorkspaceTableauFlyoutPage.clickSave().then(function () {
					});
				});
			});

		});
	});
}

util.inherits(ViewWorkspaceTableauFlyout, SharedSpec);

module.exports = new ViewWorkspaceTableauFlyout();
