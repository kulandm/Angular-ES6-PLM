/**
 * @ngdoc object
 * @name ViewTestsSpecs.viewWipAttachmentsEditSpec
 *
 * @description This is the view tests for the viewWipAttachmentsEditPage.
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var FileBrowser = require('../components/FileBrowser');
var viewWipAttachmentsEditPage = require('../pages/ViewWipAttachmentsEditPage');
var CommandBar = require('../components/CommandBar');

describe('ViewWipAttachmentsEdit', function () {
	this.timeout(60000);

	var EC = protractor.ExpectedConditions;
	var fileBrowserTableEl = FileBrowser.getTable();

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal();
		viewWipAttachmentsEditPage.go();
		return viewWipAttachmentsEditPage.waitForEvents().then(function (result) {
			expect(result).to.be.true;
		});
	});

	after(function () {
		// auth.doLogout();
	});

	afterEach('take a screenshot if a test fails', function () {
		if (this.currentTest.state === 'failed') {
			ss.writeSS(this.currentTest.ssName);
		}
	});

	describe('[Edit]', function () {
		it('disabled the Add and Remove buttons', function () {
			this._runnable.ssName = 'ViewWipAttachmentsEdit-disabledButtons';

			expect(CommandBar.getRemoveButton().getAttribute('disabled')).to.eventually.equal('true');

			expect(CommandBar.getAddButton().getAttribute('disabled')).to.eventually.equal('true');
		});
	});
});
