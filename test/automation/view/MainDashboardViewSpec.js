/**
 * @ngdoc object
 * @name ViewTestsSpecs.MainDashboardViewSpec
 *
 * @description This is the view tests for the MainDashboardPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
// var searchPlm = require('../components/SearchPlm');
var mainDashboardPage = require('../pages/MainDashboardPage');

function MainDashboardViewSpec() {

	MainDashboardViewSpec.super_.call(this);
	var that = this;

	describe('MainDashboardView', function () {
		// Because being the first one, this spec use to wait too much.
		this.timeout(120000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					mainDashboardPage.go();
					mainDashboardPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});
		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		it('navigates to the NextPLM dashboard upon signing in', function () {
			this._runnable.ssName = 'landingOnDashboard';

			expect(mainDashboardPage.sections).to.eventually.have.length(4);
			expect(browser.driver.getCurrentUrl()).to.eventually.contain('/mainDashboard');
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});
		});

		it('has all sections opened initially, but the sections should be toggled upon clicking on the section headings', function () {
			this._runnable.ssName = 'MainDashboard-toggleSection';

			// Make sure section is displayed
			expect(mainDashboardPage.isSectionBodyDisplayed(1)).to.eventually.be.true;
			// Make sure section is not displayed after heading is clicked
			mainDashboardPage.clickSectionHeading(1);

			// Note: Use of browser sleep is intentional, as clicking the
			// section will show / hide the section with animation.
			// So, we need to take the time of the animation when checking
			// the visibility of the section.
			// {@link waitForAngular} is not capable of doing that.
			browser.sleep(1000).then(function () {
				expect(mainDashboardPage.isSectionBodyDisplayed(1)).to.eventually.be.false;
			});

			mainDashboardPage.clickSectionHeading(1);

			browser.sleep(1000).then(function () {
				expect(mainDashboardPage.isSectionBodyDisplayed(1)).to.eventually.be.true;
			});
		});

		it('should refresh My Outstanding Work upon clicking on the refresh button on the section header', function () {
			this._runnable.ssName = 'MainDashboard-outstandingWorkRefresh';

			// When refresh button is clicked there are no visual changes,
			// so no point of having a view test for it.
			expect(mainDashboardPage.sections.get(1).element(by.css('.md-sync'))
				.isPresent()).to.eventually.be.true;
		});

		// NOTE: There are no outstanding work on pristine database.
		// TODO Have some outstanding work on pristine database.
		/* it('opens the user profile flyout when clicking on username link of my outstanding row', function () {
			this._runnable.ssName = 'MainDashboard-userProfile';

			// TODO There are some assumptions here.
			// 1) Last column of the table is a user profile column
			// 2) Column has no empty value for user
			var tableRows = mainDashboardPage.sections.get(1)
				.all(by.css('tbody tr'));

			if (tableRows.count > 1) {
				// This test scenario is only valid when we have at least one outstanding work item.
				var userProfileLink = tableRows.get(1).all(by.css('td'))
					.last().element(by.css('a'));

				// Scroll to the My Outstanding Work section
				var scrollIntoView = function () {
					arguments[0].scrollIntoView();
				};

				browser.executeScript(scrollIntoView, mainDashboardPage.sections.get(1));

				// Make sure the link is displayed so that it can be clicked
				userProfileLink.isDisplayed().then(function() {
					userProfileLink.click().then(function () {
						expect(element(by.css('.user-profile-flyout')).isPresent()).to.eventually.be.true;
					});
				});
			}
		}); */

		// NOTE There are no recently viewed items on pristine database.
		// TODO Have some recently viewed items on pristine database.
		/* it('sorts the recently viewed items upon clicking on item column.', function () {
			this._runnable.ssName = 'MainDashboard-sortRecentlyViewed';

			var recentlyViewedRows = mainDashboardPage.sections.get(3)
				.all(by.css('tr'));

			if (recentlyViewedRows.count > 2) {
				var firstColumnHeaderEl = recentlyViewedRows.get(0)
					.all(by.css('th')).first().element(by.css('a'));

				// Ensure that recently viewed table is visible on the page
				// (or else it will cause error in chrome)
				firstColumnHeaderEl.getLocation().then(function (location) {
					browser.driver.executeScript('window.scrollTo(0, ' + location.y + ')');

					firstColumnHeaderEl.click().then(function () {
						recentlyViewedRows.get(1).all(by.css('td')).first().getText().then(function (firstRowFirstColumnValue) {
							recentlyViewedRows.last().all(by.css('td')).first().getText().then(function (lastRowFirstColumnValue) {
								firstColumnHeaderEl.click().then(function () {
									recentlyViewedRows.get(1).all(by.css('td')).first().getText().then(function (updatedFirstRowFirstColumnValue) {
										recentlyViewedRows.last().all(by.css('td')).first().getText().then(function (updatedLastRowFirstColumnValue) {
											expect(firstRowFirstColumnValue).to.equal(updatedLastRowFirstColumnValue);
											expect(lastRowFirstColumnValue).to.equal(updatedFirstRowFirstColumnValue);
										});
									});
								});
							});
						});
					});
				});
			}
		}); */

		/* it('displays configured charts or show \'no charts to display\' message', function () {
			this._runnable.ssName = 'MainDashboard-charts';

			if (!mainDashboardPage.isReportsDisplayed()) {
				mainDashboardPage.sections.get(0)
					.element(by.binding('$root.bundle.chart.noDataToShow'))
					.getText().then(function (text) {
					// TODO How to use localization bundle instead of string?
					expect(text).to.equal('No data to show');
				});
			}
		}); */

		// TODO This test will change after galileo updates to reports.
		/* it('displays charts in modal window upon clicking on the report expand button', function () {
			this._runnable.ssName = 'MainDashboard-chartsModal';

			if (mainDashboardPage.isReportsDisplayed()) {
				// TODO Access expand button. Its hidden in highcharts.
				mainDashboardPage.getFirstReport();
			}
		}); */

		// NOTE There are no recently viewed items on pristine database.
		// TODO have some recently viewed items on pristine database.
		/* it('should open the recently viewed items (item details page), on clicking the links under Item Name in Recently Viewed Items', function () {
			this._runnable.ssName = 'MainDashboard-recentlyViewedLinks';

			element.all(by.repeater('obj in [row[value.field]]')).get(4).click();
			expect(browser.getCurrentUrl()).to.eventually.contain('itemDetails');
		}); */

		// Run shared tests
		// that.testSearchPlm();
		that.testWorkspacesMenu(mainDashboardPage, 'MainDashboard');

		// This test is working, but disabled for 10.0 release
		// that.testCreateItem(mainDashboardPage, 'MainDashboard', '');

		it('should test for jitterbit link presence on the navigation bar', function () {
			expect(mainDashboardPage.getJitterBitLink().isDisplayed()).to.eventually.be.true;
		});
	});
}

util.inherits(MainDashboardViewSpec, SharedSpec);

module.exports = new MainDashboardViewSpec();
