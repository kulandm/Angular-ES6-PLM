/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewWipAttachmentsViewSpec
 *
 * @description This is the view tests for the ViewWipAttachmentsViewPage.
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewWipAttachmentsViewPage = require('../pages/ViewWipAttachmentsViewPage');

describe('ViewWipAttachmentsView', function () {
	this.timeout(60000);

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal();
		viewWipAttachmentsViewPage.go();
		return viewWipAttachmentsViewPage.waitForEvents().then(function (result) {
			expect(result).to.be.true;
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
