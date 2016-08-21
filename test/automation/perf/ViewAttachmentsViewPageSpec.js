/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewAttachmentsViewSpec
 *
 * @description This is the view tests for the ViewAttachmentsViewPage.
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewAttachmentsViewPage = require('../pages/ViewAttachmentsViewPage');

describe('ViewAttachmentsPageView', function () {
	this.timeout(60000);

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal();
		viewAttachmentsViewPage.go();
		return viewAttachmentsViewPage.waitForEvents().then(function (result) {
			expect(result).to.be.true;
		});
	});

	it('lands on the page',function () {
		expect(true).to.be.true;
	});

	afterEach('take a screenshot if a test fails', function () {
		if (this.currentTest.state === 'failed') {
			ss.writeSS(this.currentTest.ssName);
		}
	});
});
