/**
 * @ngdoc object
 * @name ViewTestsSpecs.viewWipAttachmentsEditSpec
 *
 * @description This is the view tests for the viewWipAttachmentsEditPage.
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var viewWipAttachmentsEditPage = require('../pages/ViewWipAttachmentsEditPage');

describe('ViewWipAttachmentsEdit', function () {
	this.timeout(60000);

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal();
		viewWipAttachmentsEditPage.go();
		return viewWipAttachmentsEditPage.waitForEvents().then(function (result) {
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
