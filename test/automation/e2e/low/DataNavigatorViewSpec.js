'use strict';

/**
 * @ngdoc object
 * @name E2ETestsSpecs.DataNavigatorViewSpec
 *
 * @description The E2E spec for Data Navigator View
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var ss = require('../../util/screenshoter');
var util = require('util');

var AppHeader = require('../../components/AppHeader');
var Notification = require('../../components/Notification');
var apiRequest = require('../../util/ApiRequest');
var dashboardPage = require('../../pages/MainDashboardPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');

/**
 * @ngdoc method
 * @name E2ETestsSpecs.DataNavigatorViewSpec#DataNavigatorViewSpec
 * @propertyOf E2ETestsSpecs.DataNavigatorViewSpec
 * @description The E2E spec for Data Navigator View
 */
function DataNavigatorViewSpec() {

	describe('[DataNavigatorViewSpec]', function () {
		this.timeout(120000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					dashboardPage.go();
					dashboardPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});
			}).then(function () {
				AppHeader.openWorkspace('Engineering', 'Products');
				workspaceItemsListPage.openItem('EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable');
			});
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		describe(['Data Navigator feature'], function () {
			let isEnabled = false;
			before(() => {
				let requestUrl = '/api/v3/tenant/enabled-features';
				return apiRequest.get(requestUrl).then(function (response) {
					let body = JSON.parse(response.body);
					body.forEach(feature => {
						if (feature.title === 'data.navigator') {
							isEnabled = true;
						}
					});
				});
			});

			it('should check that the data navigator button is present if data.navigator feature is enabled', function () {
				AppHeader.isAppHeaderComponentsDisplayed().then(function () {
					let button = AppHeader.getDropdownMenuBtn();
					button.click();

					let dropdown = AppHeader.getDropdownWidget();
					dropdown.isPresent().then(function (present) {
						expect(present).to.be.true;
						let dropdownButton = dropdown.element(by.css('.data-navigator-button'));
						dropdownButton.isDisplayed().then(displayed => {
							if (isEnabled) {
								expect(displayed).to.be.true;
								expect(dropdownButton.element(by.css('span')).getText()).to.eventually.equal('Data Navigator');
							} else {
								expect(displayed).to.be.false;
							}
						});
					});
				});
			});
		});
	});
}

module.exports = new DataNavigatorViewSpec();
