/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewDetailsViewSpec
 *
 * @description This is the view tests for the ViewDetailsViewPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var ItemMenu = require('../components/ItemMenu');
var CommandBarSpec = require('./sharedspecs/CommandBarSpec');
var commandBar = new CommandBarSpec();
var CommandBar = require('../components/CommandBar');
var viewDetailsViewPage = require('../pages/ViewDetailsViewPage');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var WorkspacesManagerPage = require('../admin/WorkspacesManagerPage');

function ViewDetailsViewSpec() {

	ViewDetailsViewSpec.super_.call(this);
	var that = this;

	describe.skip('ViewDetailsView', function () {
		this.timeout(60000);

		before(function () {
			var deferred = protractor.promise.defer();

			auth.doLogin().then(function () {
				// return WorkspacesManagerPage.go()
				// .then(function () {
				// 	return WorkspacesManagerPage.toggleWorkspace('AAAAAAAAAAA');
				// })
				// .then(function () {
				// 	return WorkspacesManagerPage.clickSetupLink('AAAAAAAAAAA', 'Item Details Tab');
				// 	//return WorkspacesManagerPage.clickNewWorkspaceButton();
				// })
				// .then(function () {
				// 	return WorkspacesManagerPage.moveField('P63', 'test');
				// })
				// .then(function () {
				// 	return WorkspacesManagerPage.cancelLayout();
				// })
				// .then(function () {
				// 	return WorkspacesManagerPage.enterWorkspaceName('Test One');
				// })
				// .then(function () {
				// 	return WorkspacesManagerPage.selectBasicWorkspaceType();
				// })
				// .then(function () {
				// 	return WorkspacesManagerPage.selectSupplierManagementType();
				// })
				auth.checkAgreementModal().then(function () {
					viewDetailsViewPage.changeRoute(62,3664);
					viewDetailsViewPage.go();
					viewDetailsViewPage.waitForEvents().then(function (result) {
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

		commandBar.displaysEdit('ViewDetailsView');

		it('displays sticky action bar on scroll', function () {
			this._runnable.ssName = 'viewDetailsPage-stickyActionBar';
			return viewDetailsViewPage.waitForEvents().then(function (result) {
				// scroll to the bottom-most element
				element.all(by.css('a.ownership')).get(0).click();
				viewDetailsViewPage.getEditButton().getLocation().then(function (location) {
					// The following assertion implies:
					// the bar is sticky (didn't scroll out of view)
					expect(location.y).to.be.above(0);
				});
			});
		});

		it('navigates to the workspace item details view page', function () {
			this._runnable.ssName = 'landingOnViewDetailsView';
			viewDetailsViewPage.changeRoute(9,2902);
			viewDetailsViewPage.go();

			// App header should be displayed
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				expect(componentDisplayStatusList[0]).to.be.true;
			});

			// URL should be correct
			expect(browser.driver.getCurrentUrl()).to.eventually.contain('tab=details');

			// Item Details tab must be the one selected
			ItemMenu.getItemMenuTabs().each(function (tab) {
				tab.getText().then(function (name) {
					if (name === 'ITEM DETAILS') {
						expect(tab.getAttribute('class')).to.eventually.contain('active');
					}
				});
			});
		});

		it('displays the edit button in the view state if the user has permission to view it and at least one section is unlocked', function () {
			this._runnable.ssName = 'ViewDetailsView-editButton';

			expect(viewDetailsViewPage.isEditButtonDisplayed()).to.eventually.be.true;
		});

		it('should check that the data navigator button is present', function () {
			browser.sleep(3000);
			AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
				var button = AppHeader.getDropdownMenuBtn();
				button.click();

				var dropdown = AppHeader.getDropdownWidget();
				dropdown.isPresent().then(function (present) {
					expect(present).to.be.true;
					var dropdownItem = dropdown.element(by.css('.data-navigator-button'));
					expect(dropdownItem.element(by.css('span')).getText()).to.eventually.equal('Data Navigator');
				});
			});
		});

		// All these tests below should go into a separate page
		// (ViewDetailsEditPage) and corresponding spec - they're left here for
		// now temporarily. We should tweak them once EDIT mode-related tasks
		// have been assigned to UI devs in a sprint.
		it.skip('switches to edit mode', function () {
			this._runnable.ssName = 'ViewDetailsView-editMode';

			viewDetailsViewPage.getEditButton().click();

			// URL should be correct
			expect(browser.driver.getCurrentUrl()).to.eventually.contain('/itemDetails/edit');

			// Save/Cancel buttons should be displayed
			expect(viewDetailsViewPage.isSaveButtonDisplayed()).to.eventually.be.true;
			expect(viewDetailsViewPage.isCancelButtonDisplayed()).to.eventually.be.true;
		});

		it.skip('attempts to inject HTML into single line text and paragraph field types', function () {
			this._runnable.ssName = 'ViewDetailsView-injectHTML';

			viewDetailsViewPage.getSingleLineTextInput().clear().sendKeys('<script>javascript:alert(\'testing\');</script>');
			viewDetailsViewPage.getParagraphInput().clear().sendKeys('javascript:void(document.cookie=\'Authorized=yes\');<b>something<br>injected</b>');

			viewDetailsViewPage.getSaveButton().click();

			// URL should be correct (sent back to EDIT mode)
			expect(browser.driver.getCurrentUrl()).to.eventually.contain('/itemDetails');

			// Save/Cancel buttons should have disappeared, and EDIT button must be visible once again
			expect(viewDetailsViewPage.isSaveButtonDisplayed()).to.eventually.not.be.true;
			expect(viewDetailsViewPage.isCancelButtonDisplayed()).to.eventually.not.be.true;
			expect(viewDetailsViewPage.isEditButtonDisplayed()).to.eventually.be.true;

			// Checks if plain strings are present in the page, instead of rendered HTML
			viewDetailsViewPage.getSingleLineTextValue().then(function (str) {
				expect(str).to.have.string('<script>javascript:alert(\'testing\');</script>');
			});

			// Commenting out this test: There's a bug with Chrome 41 or lower
			// when doing .sendKeys() on <textarea>
			// https://code.google.com/p/chromedriver/issues/detail?id=707
			// TODO Re-enable this test once Chrome 39 on Jenkins is upgraded
			// viewDetailsViewPage.getParagraphTextValue().then(function (str) {
			// 	expect(str).to.have.string('javascript:void(document.cookie=\'Authorized=yes\');<b>something<br>injected</b>');
			// });
		});

		// Run shared tests
		that.testWorkspacesMenu(viewDetailsViewPage, 'ViewDetailsView');
		that.testWorkflowTransitionFlyout(viewDetailsViewPage, 'ViewDetailsView');
		that.testWorkflowTransitionLink(viewDetailsViewPage, 'ViewDetailsView');
		that.testItemHeader(viewDetailsViewPage, 'ViewDetailsView', 'CO000009 - Test Release 1 - 1 - Low');
	});

	// Skipping this spec as it is causing view test to fail and will be fixed once incorrect data-state issue is fixed
	// describe('ViewDetailsView-atLeastOneSectionNotLocked', function () {
	// 	this.timeout(30000);

	// 	before(function () {
	// 		viewDetailsViewPage.changeRoute(24, 3322); // item with one section locked, another unlocked
	// 		viewDetailsViewPage.go();
	// 		return viewDetailsViewPage.waitForEvents().then(function (result) {
	// 			expect(result).to.be.true;
	// 		});
	// 	});

	// 	after(function () {
	// 		// auth.doLogout();
	// 	});

	// 	afterEach('take a screenshot if a test fails', function () {
	// 		if (this.currentTest.state === 'failed') {
	// 			ss.writeSS(this.currentTest.ssName);
	// 		}
	// 	});

	// 	commandBar.displaysEdit('ViewDetailsView-atLeastOneSectionNotLocked');
	// });

	// // Skipping this spec as it is causing view test to fail and will be fixed once incorrect data-state issue is fixed
	// describe('ViewDetailsView-allSectionsLocked', function () {
	// 	this.timeout(30000);

	// 	before(function () {
	// 		viewDetailsViewPage.changeRoute(40, 3321); // item with all sections locked
	// 		viewDetailsViewPage.go();
	// 		return viewDetailsViewPage.waitForEvents().then(function (result) {
	// 			expect(result).to.be.true;
	// 		});
	// 	});

	// 	after(function () {
	// 		// auth.doLogout();
	// 	});

	// 	afterEach('take a screenshot if a test fails', function () {
	// 		if (this.currentTest.state === 'failed') {
	// 			ss.writeSS(this.currentTest.ssName);
	// 		}
	// 	});

	// 	commandBar.emptyCommandBar('ViewDetailsView-allSectionsLocked');

	// });
}

util.inherits(ViewDetailsViewSpec, SharedSpec);

module.exports = new ViewDetailsViewSpec();
