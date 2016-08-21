/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDetailsCreateItemSpec
 *
 * @description This is the view tests for the ViewDetailsCreateItemPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var CreateItemSpec = require('./sharedspecs/CreateItemSpec');
var AppHeader = require('../components/AppHeader');
var ItemMenu = require('../components/ItemMenu');
var viewDetailsCreateItemPage = require('../pages/ViewDetailsCreateItemPage');

function ViewDetailsCreateItemSpec() {

	ViewDetailsCreateItemSpec.super_.call(this);
	var that = this;

	describe('ViewDetailsCreateItem', function () {
		this.timeout(60000);

		before(function () {
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewDetailsCreateItemPage.go();
					viewDetailsCreateItemPage.waitForEvents().then(function (result) {
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

		it('navigates to the workspace item details view page', function () {
			this._runnable.ssName = 'landingOnViewDetailsView';

			// App header should be displayed
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});

			// URL should be correct
			expect(browser.driver.getCurrentUrl()).to.eventually
				.contain('tab=details');

			// Item Details tab must be the one selected
			ItemMenu.getItemMenuTabs().each(function (tab) {
				tab.getText().then(function (name) {
					if (name === 'ITEM DETAILS') {
						expect(tab.getAttribute('class')).to.eventually.contain('active');
					}
				});
			});
		});

		that.triggerContextualCreate('ViewDetailsCreateItem', 'Change Orders');
	});
}

util.inherits(ViewDetailsCreateItemSpec, CreateItemSpec);

module.exports = new ViewDetailsCreateItemSpec();
