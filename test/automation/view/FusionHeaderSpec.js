'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.FusionHeaderSpec
 *
 * @description These are the view tests for the unified fusion header
 *					They will need to be updated after a shared component is in place
 *
 * ##Dependencies
 *
 */

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var MainDashboardPage = require('../pages/MainDashboardPage');
var FusionHeader = require('../components/FusionHeader');

function FusionHeaderSpec() {
	FusionHeaderSpec.super_.call(this);

	describe('[FusionHeaderSpec]', function () {
		this.timeout(120000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			let deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					MainDashboardPage.go();
					MainDashboardPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('Displays the Fusion Header', function () {
			this._runnable.ssName = 'fusionHeader-displayed';
			expect(FusionHeader.getHeader().isDisplayed()).to.eventually.be.true;
		});

		it('Displays the Hamburger menu button', function () {
			this._runnable.ssName = 'fusionHeader-HamburgerDisplayed';
			expect(FusionHeader.getHamburgerMenuButton().isDisplayed()).to.eventually.be.true;
		});

		it('Displays a separator between the hamburger and the logo', function () {
			this._runnable.ssName = 'fusionHeader-HamburgerLogoSeparatorDisplayed';
			expect(FusionHeader.getFirstHeaderSeparator().isDisplayed()).to.eventually.be.true;
		});

		it('Displays the Fusion logo', function () {
			this._runnable.ssName = 'fusionHeader-LogoDisplayed';
			expect(FusionHeader.getFusionLogo().isDisplayed()).to.eventually.be.true;
		});

		it('Displays a separator between the logo and the hub name', function () {
			this._runnable.ssName = 'fusionHeader-LogoHubNameSeparatorDisplayed';
			expect(FusionHeader.getSecondHeaderSeparator().isDisplayed()).to.eventually.be.true;
		});

		it('Displays the hub name', function () {
			this._runnable.ssName = 'fusionHeader-HubNameDisplayed';
			expect(FusionHeader.getHubName().isDisplayed()).to.eventually.be.true;
			expect(FusionHeader.getHubName().getText()).to.eventually.equal('Rongzhu Tang - Lifecycle');
		});

		it('displays the search icon', function () {
			this._runnable.ssName = 'fusionHeader-SearchIconDisplayed';
			expect(FusionHeader.getSearchIcon().isDisplayed()).to.eventually.be.true;
		});

		it('displays the help menu icon', function () {
			this._runnable.ssName = 'fusionHeader-HelpMenuIconDisplayed';
			expect(FusionHeader.getHelpMenuIcon().isDisplayed()).to.eventually.be.true;
		});

		it('displays the user menu icon', function () {
			this._runnable.ssName = 'fusionHeader-UserMenuIconDisplayed';
			expect(FusionHeader.getUserMenuIcon().isDisplayed()).to.eventually.be.true;
		});

		describe('[Help Menu]', function () {
			it('Can open, close, then reopen and reclose the help menu', function () {
				this._runnable.ssName = 'fusionHeader-HelpMenuToggles';
				expect(FusionHeader.getHelpMenu().isPresent(), 'start closed').to.eventually.be.false;
				FusionHeader.openHelpMenu();
				expect(FusionHeader.getHelpMenu().isPresent(), 'open').to.eventually.be.true;
				FusionHeader.closeHelpMenu();
				expect(FusionHeader.getHelpMenu().isPresent(), 'close').to.eventually.be.false;
				FusionHeader.openHelpMenu();
				expect(FusionHeader.getHelpMenu().isPresent(), 'reopen').to.eventually.be.true;
				FusionHeader.closeHelpMenu();
				expect(FusionHeader.getHelpMenu().isPresent(), 'reclose').to.eventually.be.false;
			});

			describe('[Options]', function () {
				let options;

				before(function () {
					FusionHeader.openHelpMenu();
					options = FusionHeader.getHelpMenuOptions();
				});

				after(function () {
					FusionHeader.closeHelpMenu();
				});

				it('Should display the help link', function () {
					this._runnable.ssName = 'fusionHeader-HelpMenuHelpLink';
					let link = options.get(0);
					expect(link.isDisplayed()).to.eventually.be.true;
					expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');
					expect(link.getAttribute('href'), 'href').to.eventually.equal('http://help.autodesk.com/view/PLM/ENU/');

					let icon = link.element(by.css('svg'));
					expect(icon.isDisplayed(), 'icon').to.eventually.be.true;
				});

				it('Should display the community link', function () {
					this._runnable.ssName = 'fusionHeader-HelpMenuCommunityLink';
					let link = options.get(1);
					expect(link.isDisplayed()).to.eventually.be.true;
					expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');
					expect(link.getAttribute('href'), 'href').to.eventually.equal('http://www.autodeskplm360.com/community/');

					let icon = link.element(by.css('svg'));
					expect(icon.isDisplayed(), 'icon').to.eventually.be.true;
				});

				it('Should display the admin email button', function () {
					this._runnable.ssName = 'fusionHeader-HelpMenuEmailButton';
					let link = options.get(2);
					expect(link.isDisplayed()).to.eventually.be.true;
					expect(link.getAttribute('href'), 'mailto').to.eventually.equal('mailto:support@yourcompany.com');

					let icon = link.element(by.css('svg'));
					expect(icon.isDisplayed(), 'icon').to.eventually.be.true;
				});

				it('Should display the vignette button', function () {
					this._runnable.ssName = 'fusionHeader-HelpMenuVignetteButton';
					let link = options.get(3);
					expect(link.isDisplayed()).to.eventually.be.true;
					expect(link.getAttribute('href'), 'empty js').to.eventually.equal(null);

					let icon = link.element(by.css('svg'));
					expect(icon.isDisplayed(), 'icon').to.eventually.be.true;
				});
			});
		});

		describe('[User Menu]', function () {
			it('Can open, close, then reopen and reclose the user menu', function () {
				this._runnable.ssName = 'fusionHeader-UserMenuToggles';
				expect(FusionHeader.getUserMenu().isDisplayed(), 'start closed').to.eventually.be.false;
				FusionHeader.openUserMenu();
				expect(FusionHeader.getUserMenu().isDisplayed(), 'open').to.eventually.be.true;
				FusionHeader.closeUserMenu();
				expect(FusionHeader.getUserMenu().isDisplayed(), 'close').to.eventually.be.false;
				FusionHeader.openUserMenu();
				expect(FusionHeader.getUserMenu().isDisplayed(), 'reopen').to.eventually.be.true;
				FusionHeader.closeUserMenu();
				expect(FusionHeader.getUserMenu().isDisplayed(), 'reclose').to.eventually.be.false;
			});

			describe('[Content]', function () {
				let options, userInfo;

				before(function () {
					FusionHeader.openUserMenu();
					userInfo = FusionHeader.getUserMenu().element(by.css('.fusion-header-user-info'));
					options = FusionHeader.getUserMenuOptions();
				});

				after(function () {
					FusionHeader.closeUserMenu();
				});

				it('Should display the user name', () => {
					expect(userInfo.all(by.css('span')).get(0).getText()).to.eventually.equal('PLMAutoTest Selenium1');
				});

				it('Should display the user email', () => {
					expect(userInfo.all(by.css('span')).get(1).getText()).to.eventually.equal('plmautotest@autodesk.com');
				});

				it('Should display the profile button', () => {
					expect(options.get(0).element(by.css('span')).getText()).to.eventually.equal('My Profile');
				});

				it('Should display the delegations button', () => {
					expect(options.get(1).element(by.css('span')).getText()).to.eventually.equal('My Delegations');
				});

				it('Should display the return to classic button', () => {
					expect(options.get(2).element(by.css('span')).getText()).to.eventually.equal('Go back to Classic');
				});

				it('Should display the sign out link', () => {
					expect(options.get(3).element(by.css('span')).getText()).to.eventually.equal('Sign Out');
				});
			});
		});
	});
}

util.inherits(FusionHeaderSpec, SharedSpec);

module.exports = new FusionHeaderSpec();
