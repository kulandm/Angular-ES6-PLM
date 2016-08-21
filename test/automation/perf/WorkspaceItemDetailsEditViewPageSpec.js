'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceItemDetailsEditViewPageSpec
 *
 * @description This is the view tests for the WorkspaceItemDetailsEditPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var workspaceItemDetailsEditPage = require('../pages/WorkspaceItemDetailsEditPage');

function WorkspaceItemDetailsEditViewPageSpec() {

	describe('WorkspaceItemDetailsEditView', function () {
		this.timeout(60000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					workspaceItemDetailsEditPage.changeRoute(29, 2897);
					workspaceItemDetailsEditPage.go();
					return workspaceItemDetailsEditPage.waitForEvents().then(result => {
						expect(result).to.be.true;
					});
				});
			});
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('lands on the page', function () {
			expect(true).to.be.true;
		});
	});
}

module.exports = new WorkspaceItemDetailsEditViewPageSpec();
