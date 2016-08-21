/**
 * @ngdoc object
 * @name ViewTestsSpecs.PlmHeaderViewSpec
 *
 * @description This is the view tests for the PlmHeader.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var mainDashboardPage = require('../pages/MainDashboardPage');

function PlmHeaderViewSpec() {

	PlmHeaderViewSpec.super_.call(this);
	var that = this;

	describe('PlmHeaderView', function () {
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

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('open user profile dropdown list', function () {
			this._runnable.ssName = 'PlmHeaderView-open profile dropdown';

			// App header should be displayed
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});

			// App profile menu displayed
			AppHeader.showProfileMenu().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});

			// check items in dropdown menu
			AppHeader.getProfileMenu().all(by.css('span')).then(function (items) {
				expect(items).length.to.be(6);
				items[2].getText().then(function (text) {
					expect(text).to.equal('My Profile');
				});
				items[3].getText().then(function (text) {
					expect(text).to.equal('My Delegations');
				});
				items[4].getText().then(function (text) {
					expect(text).to.equal('Go back to Classic');
				});
				items[5].getText().then(function (text) {
					expect(text).to.equal('Sign Out');
				});
			});

		});

	});
}

util.inherits(PlmHeaderViewSpec, SharedSpec);

module.exports = new PlmHeaderViewSpec();
