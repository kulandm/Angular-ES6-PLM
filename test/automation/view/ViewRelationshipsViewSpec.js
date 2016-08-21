/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewRelationshipsViewSpec
 *
 * @description This is the view tests for the Workspace Item Relationships.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AddItemSpec = require('./sharedspecs/AddItemSpec');
var addItem = new AddItemSpec();
var CommandBarSpec = require('./sharedspecs/CommandBarSpec');
var commandBar = new CommandBarSpec();

var viewRelationshipsPage = require('../pages/ViewRelationshipsPage');

function ViewRelationshipsViewSpec() {

	ViewRelationshipsViewSpec.super_.call(this);
	var that = this;

	describe('ViewRelationshipsView', function () {

		this.timeout(60000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewRelationshipsPage.go();
					viewRelationshipsPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		commandBar.displaysEditAddRemove('ViewAffectedItemsView');

		it('displays the tableData component with the required columns', function () {
			this._runnable.ssName = 'ViewRelationshipsView-tableDataPresent';

			expect(viewRelationshipsPage.isTableDataDisplayed()).to.eventually.be.true;
			expect(viewRelationshipsPage.tableHeaderFields.get(1).getText()).to.eventually.contain('ITEM');
			expect(viewRelationshipsPage.tableHeaderFields.get(2).getText()).to.eventually.contain('WORKSPACE');
			expect(viewRelationshipsPage.tableHeaderFields.get(3).getText()).to.eventually.contain('CURRENT STATE');
			expect(viewRelationshipsPage.tableHeaderFields.get(4).getText()).to.eventually.contain('DIRECTION TYPE');
			expect(viewRelationshipsPage.tableHeaderFields.get(5).getText()).to.eventually.contain('DESCRIPTION');
		});

		it('should sort items when clicked on the header column', function () {
			this._runnable.ssName = 'ViewRelationshipsView-sorting';

			// Perform sort only when there is more than one workspace item
			viewRelationshipsPage.getRelatedItemsCount().then(function (ItemsCount) {
				if (ItemsCount > 1) {
					// Get the first item name
					viewRelationshipsPage.getFirstRelatedItemText().then(function (firstItem) {
						var beforeSort = firstItem;
						// Perform the sort
						viewRelationshipsPage.sortRelationshipsItems().then(function (value) {
							viewRelationshipsPage.getFirstRelatedItemText().then(function (text) {
									expect(text).to.not.equal(beforeSort);
								});
						});
					});
				}
			});
		});

		addItem.triggerAdd('ViewRelationshipsView');

		// Run shared tests
		that.testWorkspacesMenu(viewRelationshipsPage, 'ViewRelationshipsView');
	});
}

util.inherits(ViewRelationshipsViewSpec, SharedSpec);

module.exports = new ViewRelationshipsViewSpec();
