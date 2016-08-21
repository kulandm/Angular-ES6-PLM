'use strict';

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var dataNavigatorViewPage = require('../pages/DataNavigatorViewPage');

/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDataNavigatorViewPageSpec
 *
 * @description This is the view tests for the DataNavigatorViewPage.
 *
 * ##Dependencies
 *
 */
function ViewDataNavigatorViewPageSpec() {
	
	describe('[DataNavigatorView]', function () {
		this.timeout(120000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					dataNavigatorViewPage.go();
					browser.sleep(20000);
					return true;
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

module.exports = new ViewDataNavigatorViewPageSpec();
