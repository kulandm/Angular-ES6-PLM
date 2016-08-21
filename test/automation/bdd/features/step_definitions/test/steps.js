// http://chaijs.com/
var chai = require('chai');

// https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

module.exports = function () {
	//
	var auth = require('../../../../util/Auth');
	var ss = require('../../../../util/screenshoter');
	var util = require('util');
	var AppHeader = require('../../../../components/AppHeader');
	var mainDashboardPage = require('../../../../pages/MainDashboardPage');
	console.log('test');
	this.Given('me', function () {
		console.log('given');
		auth.doLogin().then(function () {
			auth.checkAgreementModal().then(function () {
				browser.sleep(3500).then(function () {
					mainDashboardPage.go();
					mainDashboardPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
					});
				});
			});
		});
	});
	this.When('metoo', function () {
		console.log('when');
	});
	this.Then('asyou', function () {
		console.log('then');
		expect(false).to.equal(true);
	});
};
