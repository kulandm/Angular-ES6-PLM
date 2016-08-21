/**
 * @ngdoc object
 * @name ViewTestsSpecs.LoginLandingViewSpec
 *
 * @description This is the view tests for the LoginLandingPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var AppHeader = require('../components/AppHeader');
var loginLandingPage = require('../pages/LoginLandingPage');

/*
TODO: revisit this spec.
describe('LoginLandingView', function () {

	before(function () {
		// Go to the page to be tested
		loginLandingPage.go();
	});

	after(function () {
		auth.incrementTestsCount();
	});

	afterEach('take a screenshot if a test fails', function () { 
		if (this.currentTest.state === 'failed') { 
			ss.writeSS(this.currentTest.ssName); 
		} 
	});

	it('navigates to the login page, hiding all header components', function () {
		this._runnable.ssName = 'landingOnLogin';

		AppHeader.isAppHeaderComponentsDisplayed().then(function (displayStatusList) {
			expect(displayStatusList[0]).to.be.true;
		});
	});
});*/
