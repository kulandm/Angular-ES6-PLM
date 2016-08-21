/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewActionNotificationsViewSpec
 *
 * @description This is the view tests for the Workspace Item Action Notifications.
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
var viewActionNotificationsPage = require('../pages/ViewActionNotificationsPage');

function ViewActionNotificationsViewSpec() {

	ViewActionNotificationsViewSpec.super_.call(this);
	var that = this;

	describe.skip('ViewActionNotificationsView', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewActionNotificationsPage.go();
					viewActionNotificationsPage.waitForEvents().then(function (result) {
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

		it.skip('should open a add notification modal dialog when clicking add', function () {
			this._runnable.ssName = 'ViewActionNotificationsView-openAddNotificationDialog';

			viewActionNotificationsPage.isAddNotificationLink().then(function (linkDisplayed) {
				expect(linkDisplayed).to.be.true;
			});

			viewActionNotificationsPage.clickAddNotificationLink().then(function () {
				expect(viewActionNotificationsPage.isAddNotificationDialogDisplayed()).to.eventually.be.true;
			});
		});

		// TODO Revisit and implement this test after multi-select delete option implemented
		it.skip('should delete notification when clicking delete after selecting', function () {
			this._runnable.ssName = 'ViewActionNotificationsView-DeleteNotification';

			// Perform delete event when there is atleast one action notification
			viewActionNotificationsPage.getActionNotificationsCount().then(function (notificationsCount) {
				if (notificationsCount > 0) {
					// TODO Perform Delete
				}
			});
		});

		// Run shared tests
		that.testWorkspacesMenu(viewActionNotificationsPage, 'ViewActionNotificationsView');
	});
}

util.inherits(ViewActionNotificationsViewSpec, SharedSpec);

module.exports = new ViewActionNotificationsViewSpec();
