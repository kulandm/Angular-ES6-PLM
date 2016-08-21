/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDetailsWithImageViewSpec
 *
 * @description This is the view tests for the ViewDetailsWithImageViewPage.
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
var viewDetailsWithImageViewPage = require('../pages/ViewDetailsWithImageViewPage');

function ViewDetailsWithImageViewSpec() {

	ViewDetailsWithImageViewSpec.super_.call(this);
	var that = this;

	describe('ViewDetailsWithImageView', function () {
		this.timeout(30000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewDetailsWithImageViewPage.go();
					viewDetailsWithImageViewPage.waitForEvents().then(function (result) {
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

		it('navigates to the workspace item details view page', function () {
			this._runnable.ssName = 'landingOnViewDetailsWithImageView';

			// App header should be displayed
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});

			// URL should be correct
			expect(browser.driver.getCurrentUrl()).to.eventually.contain('tab=details');

			// Item Details tab must be the one selected
			ItemMenu.getItemMenuTabs().each(function (tab) {
				tab.getText().then(function (name) {
					if (name === 'ITEM DETAILS') {
						expect(tab.getAttribute('class')).to.eventually.contain('active');
					}
				});
			});
		});

		it('should display an image', function () {
			this._runnable.ssName = 'ViewDetailsWithImageView-imageView';

			expect(viewDetailsWithImageViewPage.isImageDisplayed()).to.eventually.be.true;
			expect(viewDetailsWithImageViewPage.getImageSource()).to.eventually.contain('/api/v2/workspaces/47/items/2694/field-values/IMAGE/image/45');
		});

		// Run shared tests
		// that.testWorkspacesMenu(viewDetailsWithImageViewPage, 'ViewDetailsWithImageView');
		// that.testItemHeader(viewDetailsWithImageViewPage, 'ViewDetailsWithImageView', 'TEAM000006 - GT255 Quadro');
	});
}

util.inherits(ViewDetailsWithImageViewSpec, SharedSpec);

module.exports = new ViewDetailsWithImageViewSpec();
