/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDetailsCreateItemDisabledSpec
 *
 * @description This is the view tests for the ViewDetailsCreateItemDisabledPage.
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
var viewDetailsCreateItemDisabledPage = require('../pages/ViewDetailsCreateItemDisabledPage');

function ViewDetailsCreateItemDisabledSpec() {

	ViewDetailsCreateItemDisabledSpec.super_.call(this);
	var that = this;

	describe('ViewDetailsCreateItemDisabled', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewDetailsCreateItemDisabledPage.go();
					viewDetailsCreateItemDisabledPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
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

		that.contextualCreateDisabled('ViewDetailsCreateItemDisabled');
	});
}

util.inherits(ViewDetailsCreateItemDisabledSpec, CreateItemSpec);

module.exports = new ViewDetailsCreateItemDisabledSpec();
