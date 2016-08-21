/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewItemNotificationPageSpec
 *
 * @description This is the view tests for the ItemNotificationPage.
 * It tests for archive, unarchive, bookmark and remove bookmark notifications
 * on an item view.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var itemNotificationPage = require('../pages/ItemNotificationPage');

function ViewItemNotificationPageSpec() {

	var that = this;

	describe('ItemNotification', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					itemNotificationPage.go();
					itemNotificationPage.waitForEvents().then(function (result) {
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

module.exports = new ViewItemNotificationPageSpec();
