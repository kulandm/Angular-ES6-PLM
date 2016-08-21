'use strict';

var util = require('util');
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');

var GenericPage = require('../pages/GenericPage');
var AppHeader = require('../components/AppHeader');
var searchPageObject = require('../pages/SearchPage');
var mainDashboardPage = require('../pages/MainDashboardPage');

/**
 * @ngdoc object
 * @name ViewTestsSpecs.SearchPlmSpec
 *
 * @description This is the view tests for the Search page.
 *
 * ##Dependencies
 *
 */
function SearchPlmSpec() {

	describe('SearchPlmSpec', function () {

		this.timeout(120000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
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

		it('Should load search page', function () {
			searchPageObject.get('true');
			
			browser.getCurrentUrl().then(function (url) {
				expect(url).to.contain('search');
			});
			
		});

	});
}

module.exports = new SearchPlmSpec();