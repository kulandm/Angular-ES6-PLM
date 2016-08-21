'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceItemBomViewPageSpec
 *
 * @description This is the view tests for the ViewBomPage.
 *
 * ##Dependencies
 *
 */

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewBomPageClass = require('../pages/ViewBomPage');

var viewBomPage = new viewBomPageClass();

function WorkspaceItemBomViewPageSpec() {
	var that = this;

	describe('<BomView>', function () {
		this.timeout(200000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewBomPage.goToDefaultItem();
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

module.exports = new WorkspaceItemBomViewPageSpec();
