'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.SharedSpec
 *
 * @description This is the parent class of all specs.
 *
 * ##Dependencies
 */
var ss = require('../util/screenshoter');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');
var CreateItem = require('../components/CreateItem');
var ItemHeader = require('../components/ItemHeader');
var WorkflowTransitionFlyout = require('../components/WorkflowTransitionFlyout');
var MenuButtonSpec = require('./sharedspecs/MenuButtonSpec');
var Helper = require('../util/Helper.js');
// var SearchPlmSpec = require('./sharedspecs/SearchPlmSpec');

function SharedSpec() {

	let getBrowserBaseUrlLowerCase = () => {
		let baseUrl = browser.baseUrl;
		return baseUrl.toLowerCase();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testWorkspacesMenu
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests for the workspaces menu flyout.
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} name The page name.
	 */
	this.testWorkspacesMenu = function (page, name) {
		it('each page should have a header component with appropriate heading', function () {
			this._runnable.ssName = name + '-plmHeader';

			AppHeader.getPLMHeader().getText().then(function (text) {
				expect(text.length > 0).to.be.true;
			});
		});

		describe('[Footer]', function () {
			let footer, privacyLink, termsLink;
			beforeEach(() => {
				footer = AppHeader.getPLMFooter();
				privacyLink = footer.element(by.css('#footer-privacy-policy a'));
				termsLink = footer.element(by.css('#footer-terms-and-conditions a'));
			});

			it('Should display the footer', function () {
				this._runnable.ssName = name + '-plmFooterPresent';

				expect(footer.isPresent()).to.eventually.be.true;
			});

			it('Should display the privacy link', function () {
				this._runnable.ssName = name + '-plmFooterPrivacy';

				expect(privacyLink.isPresent()).to.eventually.be.true;
				expect(privacyLink.getAttribute('href')).to.eventually.equal('http://usa.autodesk.com/privacy/');
				expect(privacyLink.getAttribute('target')).to.eventually.equal('_blank');
			});

			it('Should display the terms and conditions link', function () {
				this._runnable.ssName = name + '-plmFooterTermsAndConditions';

				expect(termsLink.isPresent()).to.eventually.be.true;
				expect(termsLink.getAttribute('href')).to.eventually.equal('http://www.autodesk.com/termsofservice');
				expect(termsLink.getAttribute('target')).to.eventually.equal('_blank');
			});
		});

		describe('[Main Menu]', function () {
			it('should expand the main nav menu on clicking of nav control button', function () {
				this._runnable.ssName = name + 'mainNavExpanded';
				var mainNavButton = AppHeader.getNavMainButton();

				var sideMenuInitialWidth;
				var sideMenuFinalWidth;
				var menuExpanded;

				element(by.css('.md-sidenav-left')).getSize().then(function (size) {
					sideMenuInitialWidth = size.width;
					mainNavButton.click();
					element(by.css('.md-sidenav-left')).getSize().then(function (size) {
						sideMenuFinalWidth = size.width;
						menuExpanded = sideMenuFinalWidth > sideMenuInitialWidth;
						expect(menuExpanded).to.be.true;
					});
				});

				// close the menu
				mainNavButton.click();
			});

			describe('[Main menu buttons]', function () {
				var buttons, dashboardBtn, wsBtn, adminBtn, currentTenant, reportsBtn, importBtn, helpBtn;
				let buttonDef = {};
				let buttonsHolder = {};

				let setButtonDef = function (args) {
					buttonDef.button = args.button;
					buttonDef.expectedTitle = args.expectedTitle;
					buttonDef.expectedMethod = args.expectedMethod;
					buttonDef.expectedIcon = args.expectedIcon;
					buttonDef.expectedHref = args.expectedHref;
					buttonDef.expectedTarget = args.expectedTarget;
				};

				before(function () {
					buttons = AppHeader.getSidenavMenuButtons();
					dashboardBtn = buttons.first();
					wsBtn = buttons.get(1);
					reportsBtn = buttons.get(4);
					importBtn = buttons.get(5);
					adminBtn = buttons.get(6);
					helpBtn = buttons.get(7);
					currentTenant = getBrowserBaseUrlLowerCase() + '/' + browser.params.baseName;

					buttonsHolder.buttons = buttons;
				});

				it('should be 8 buttons in the main menu', function () {
					this._runnable.ssName = name + '-mainMenuButtons';

					expect(buttons.count()).to.eventually.equal(8);
				});

				MenuButtonSpec.testLabelsHidden(buttonsHolder);

				describe('[Dashboard button]', function () {
					before(function () {
						setButtonDef({
							button: dashboardBtn,
							expectedTitle: 'Dashboard',
							expectedMethod: 'plmNavigationCtrl.closeMenu()',
							expectedIcon: 'md-home',
							expectedHref: currentTenant + '/mainDashboard',
							expectedTarget: null
						});
					});

					MenuButtonSpec.run(buttonDef);
				});

				describe('[Workspaces button]', function () {
					before(function () {
						setButtonDef({
							button: wsBtn,
							expectedTitle: 'Workspaces',
							expectedMethod: 'plmNavigationCtrl.goToInnerPanel(NavigationPanels.WORKSPACES)',
							expectedIcon: 'md-description',
							expectedHref: 'javascript:;',
							expectedTarget: null
						});
					});

					MenuButtonSpec.run(buttonDef);
				});

				describe('[Reports button]', function () {
					before(function () {
						setButtonDef({
							button: reportsBtn,
							expectedTitle: 'Reports',
							expectedIcon: 'icon-Reports',
							expectedMethod: null,
							expectedHref: getBrowserBaseUrlLowerCase() + '/reportListAction.do',
							expectedTarget: '_blank'
						});
					});

					MenuButtonSpec.run(buttonDef);
				});

				describe('[Import button]', function () {
					before(function () {
						setButtonDef({
							button: importBtn,
							expectedTitle: 'Import',
							expectedIcon: 'md-playlist-add',
							expectedMethod: null,
							expectedHref: getBrowserBaseUrlLowerCase() + '/importListAction.do',
							expectedTarget: '_blank'
						});
					});

					MenuButtonSpec.run(buttonDef);
				});

				describe('[Administration button]', function () {
					before(function () {
						setButtonDef({
							button: adminBtn,
							expectedTitle: 'Administration',
							expectedIcon: 'icon-Settings1',
							expectedMethod: 'plmNavigationCtrl.goToInnerPanel(NavigationPanels.ADMINISTRATION)',
							expectedHref: 'javascript:;',
							expectedTarget: null
						});
					});

					MenuButtonSpec.run(buttonDef);
				});

				describe('[Help button]', function () {
					before(function () {
						setButtonDef({
							button: helpBtn,
							expectedTitle: 'Help',
							expectedIcon: 'md-help',
							expectedMethod: 'plmNavigationCtrl.goToInnerPanel(NavigationPanels.HELP)',
							expectedHref: 'javascript:;',
							expectedTarget: null
						});
					});

					MenuButtonSpec.run(buttonDef);
				});
			});

			describe('[WorkspacesMenu]', function () {
				before(function () {
					AppHeader.isWorkspacesBtnDisplayed().then(function (isDisplayed) {
						expect(isDisplayed).to.be.true;
					});
					AppHeader.getWorkspacesBtn().click();
				});

				after(function () {
					AppHeader.getBackBtn().click();
					AppHeader.getNavMainButton().click();
				});

				it('displays the workspaces menu flyout after clicking on workspaces button', function () {
					this._runnable.ssName = name + '-workspacesMenu';

					expect(AppHeader.getWorkspacesFlyout().isDisplayed()).to.eventually.be.true;
				});

				it('should be able to display workspace categories', function () {
					this._runnable.ssName = name + '-allWorkspacesCategories';

					var workspaceCategoryList = AppHeader.getWorkspacesCategories();
					expect(workspaceCategoryList.count()).to.eventually.above(8);
				});

				it('should initially display categories as collapsed', function () {
					this._runnable.ssName = name + '-workspacesCategories';
					var workspaceCategoryList = AppHeader.getWorkspacesCategories();

					workspaceCategoryList.count().then(function (count) {
						if (count > 0) {
							expect(AppHeader.isWorkspacesCategoryCollapsed(workspaceCategoryList.first())).to.eventually.be.true;
						}
					});
				});

				it('should show the sub-categories of the workspaces categories when the main category is clicked', function () {
					this._runnable.ssName = name + '-subcategories';

					var categoryEl = element.all(by.repeater('category in plmNavigationCtrl.categoryList')).get(1);
					categoryEl.click();

					var ele = categoryEl.element(by.css('.caret'));
					ele.getAttribute('class').then(function (obj) {
						expect(obj).to.contain('rotate');
					});
				});

				it('should not constrain workspace menu by max-height', function () {
					this._runnable.ssName = name + '-subcategories-max-height-notSet';

					var categoryEl = element.all(by.repeater('category in plmNavigationCtrl.categoryList')).get(1);
					var ele = categoryEl.element(by.css('.sidenav-submenu-panel'));
					// ensure the effective-css for max-height is not set
					ele.getCssValue('max-height').then(function (obj) {
						// default value (non-initialized) is 'none'. Ref: https://developer.mozilla.org/en/docs/Web/CSS/max-height
						expect(obj).to.equal('none');
					});
				});

				it('should close the already open category if another category is opened', function () {
					this._runnable.ssName = name + '-closeAlreadyOpen';

					var categoryEl = element.all(by.repeater('category in plmNavigationCtrl.categoryList')).get(2);
					var newElement = categoryEl.element(by.css('.caret'));

					newElement.click().then(function () {
						newElement.getAttribute('class').then(function (obj) {
							expect(obj).to.contain(' rotate');
						});

						var oldCategoryCaretEl = element.all(by.repeater('category in plmNavigationCtrl.categoryList')).get(1).element(by.css('.caret'));

						oldCategoryCaretEl.getAttribute('class').then(function (obj) {
							expect(obj).to.not.contain(' rotate');
						});
					});
				});
			});

			describe('[Help Menu]', function () {
				before(function () {
					expect(AppHeader.getHelpBtn().isDisplayed()).to.eventually.be.true;
					AppHeader.getHelpBtn().click();
				});

				after(function () {
					AppHeader.getBackBtn().click();
					AppHeader.getNavMainButton().click();
				});

				it('displays the help menu flyout after clicking on workspaces button', function () {
					this._runnable.ssName = name + '-helpMenu';

					expect(AppHeader.getHelpFlyout().isDisplayed()).to.eventually.be.true;
				});

				describe('Options', function () {
					let options;
					before(function () {
						options = AppHeader.getHelpFlyout().all(by.css('.sidenav-submenu-panel .sidenav-menu-item a'));
					});

					it('Should display the help link', function () {
						let link = options.get(0);
						expect(link.isDisplayed()).to.eventually.be.true;
						expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');

						expect(link.getAttribute('href'), 'href').to.eventually.equal('http://help.autodesk.com/view/PLM/ENU/');
						expect(link.element(by.css('.icon')).getAttribute('class'), 'correct icon').to.eventually.contain('zmdi-help-outline');
					});

					it('Should display the community link', function () {
						let link = options.get(1);
						expect(link.isDisplayed()).to.eventually.be.true;
						expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');
						expect(link.getAttribute('href'), 'href').to.eventually.equal('http://www.autodeskplm360.com/community/');
						expect(link.element(by.css('.icon')).getAttribute('class'), 'correct icon').to.eventually.contain('zmdi-accounts-alt');
					});

					it('Should display the admin email button', function () {
						let link = options.get(2);
						expect(link.isDisplayed()).to.eventually.be.true;

						expect(link.getAttribute('href'), 'mailto').to.eventually.equal('mailto:support@yourcompany.com');
						expect(link.element(by.css('.icon')).getAttribute('class'), 'correct icon').to.eventually.contain('zmdi-email');
					});
				});
			});

			describe('[Administration Menu]', function () {
				before(function () {
					expect(AppHeader.getAdminBtn().isDisplayed()).to.eventually.be.true;
					AppHeader.getAdminBtn().click();
				});

				after(function () {
					AppHeader.getBackBtn().click();
					AppHeader.getNavMainButton().click();
				});

				it('displays the Administration menu flyout after clicking on workspaces button', function () {
					this._runnable.ssName = name + '-adminMenu';

					expect(AppHeader.getAdminFlyout().isDisplayed()).to.eventually.be.true;
				});

				describe('Options', function () {
					let options;
					before(function () {
						options = AppHeader.getAdminFlyout().all(by.css('.sidenav-submenu-panel .sidenav-menu-item a'));
					});

					it('Should punchout to Security page in classic', function () {
						let link = options.get(0);
						expect(link.isDisplayed()).to.eventually.be.true;
						expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');
						expect(link.getAttribute('href'), 'href').to.eventually.equal(browser.baseUrl + '/admin#section=adminusers&tab=users');
					});

					it('Should punchout to Workspace Manager page in classic', function () {
						let link = options.get(1);
						expect(link.isDisplayed()).to.eventually.be.true;
						expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');
						expect(link.getAttribute('href'), 'href').to.eventually.equal(browser.baseUrl + '/admin#section=setuphome&tab=workspaces');
					});

					it('Should punchout to System Configuration page in classic', function () {
						let link = options.get(2);
						expect(link.isDisplayed()).to.eventually.be.true;
						expect(link.getAttribute('target'), 'blank target').to.eventually.equal('_blank');
						expect(link.getAttribute('href'), 'href').to.eventually.equal(browser.baseUrl + '/admin#section=setuphome&tab=general');
					});
				});
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testApplicationTabs
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests for the tabs below the main application header.
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} name The page name.
	 */
	this.testApplicationTabs = function (page, name) {
		describe('[ApplicationTabs]', function () {
			before(function () {
				page.go();
			});

			it('has the tab-bar present on the page', function () {
				this._runnable.ssName = name + '-tabBar';

				var tabPresent = false;
				browser.driver.sleep(1000);
				var tabsCount = element.all(by.repeater('(key, value) in tabList')).count();

				tabsCount.then(function (cnt) {
					if (cnt > 0) {
						// tab/tabs are present
						tabPresent = true;
						expect(tabPresent).to.equal(true);
					}
				});
			});

			it('should click few tabs to check if the tabs are changing and getting selected', function () {
				this._runnable.ssName = name + '-changeTabs';

				element.all(by.repeater('(key, value) in tabList')).get(4).click();
				element.all(by.repeater('(key, value) in tabList')).get(4).getAttribute('class')
					.then(function (classes) {
						expect(classes).to.contain('active');
					});

				element(by.css('.md-paginator')).click();
				browser.sleep('1000');

				element.all(by.repeater('(key, value) in tabList')).get(8).click();
				element.all(by.repeater('(key, value) in tabList')).get(8).getAttribute('class')
					.then(function (classes) {
						expect(classes).to.contain('active');
					});
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testItemHeader
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests whether the workspace item header components are displayed.
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} name The page name.
	 * @param {String} itemName The item name.
	 */
	this.testItemHeader = function (page, name, itemName) {
		describe('[ItemHeader]', function () {
			before(function () {
				page.changeRoute('9', '2949'); // change orders; Test release 1 - 1 - Low
				page.go();
				page.waitForEvents();
			});

			//
			// New item header with info regarding item status
			//
			describe('[New Icon Row Status]', function () {
				// check there is a new row on item details view
				it('should show a new row in the item header', function () {
					this._runnable.ssName = name + '-itemPageHeadingNewRow';
					var itemHeaderRow = ItemHeader.getItemHeaderInfoRow();
					itemHeaderRow.isPresent().then(function (present) {
						expect(present).to.be.true;
					});
				});

				// Check item des
				it('should show item descriptor in the item header', function () {
					this._runnable.ssName = name + '-itemPageHeadingDescriptor';
					expect(ItemHeader.getItemDescriptor()).to.eventually.equal(itemName);
				});

				describe('[Workspace Icons]', function () {
					// Check workflow status icon and text
					it('should show workflow status icon in the item header', function () {
						this._runnable.ssName = name + '-itemPageHeadingWorfflowSatusIcon';
						expect(ItemHeader.getWorkflowStatus().getAttribute('class')).to.eventually.contain('icon-plm-stamp');
						expect(ItemHeader.getWorkflowStatus().getText()).to.eventually.equal('Implementation');
					});

					describe('[locked item]', function () {
						// I need a locked item
						before(function () {
							page.changeRoute('9', '2861'); // change orders; Update Project 622 Base to Protect Piping - 1 - Low
							page.go();
							page.waitForEvents();
						});

						// leave it as it was
						after(function () {
							page.changeRoute('9', '2949'); // change orders; Test release 1 - 1 - Low
							page.go();
							page.waitForEvents();
						});

						// Check workflow lock state and icon
						it('should show workflow lock state and icon in the item header', function () {
							this._runnable.ssName = name + '-itemPageHeadingWorkflowLockIcon';
							expect(ItemHeader.getWorkflowLock().element(by.css('span')).getAttribute('class')).to.eventually.contain('item-locked');
							expect(ItemHeader.getWorkflowLock().getText()).to.eventually.contain('Locked');
						});
					});

                    describe('[Effectivity date]', function () {

                        var changeWorkspaceItem = function (workspaceId, itemId) {
                            page.changeRoute(workspaceId, itemId); // change orders; Update Project 622 Base to Protect Piping - 1 - Low
							page.go();
							page.waitForEvents();
                        };

                        it('should show date', function () {
                            changeWorkspaceItem(8, 2773);
                            expect(ItemHeader.getEffectivityDate().getText()).to.eventually.contain('04/24/2013');
                        });

                        it('should show pending status', function () {
                            changeWorkspaceItem(8, 2877);
                            expect(ItemHeader.getEffectivityDate().getText()).to.eventually.contain('Pending');
                        });

                        // leave it as it was
						after(function () {
							page.changeRoute('9', '2949'); // change orders; Test release 1 - 1 - Low
							page.go();
							page.waitForEvents();
						});
                    });
				});
			});
        describe('[Resize buttons]', function () {

            before(function () {
                page.changeRoute('9', '2861'); // change orders; Update Project 622 Base to Protect Piping - 1 - Low
                page.go();
                page.waitForEvents();
            });

            it('Should be present', function () {
                ItemHeader.isItemFullView().then(function (isFullView) {
                    expect(ItemHeader.isChangeToSplitViewButtonPresent()).to.eventually.equal(isFullView);
                    expect(ItemHeader.isChangeToFullViewButtonPresent()).to.eventually.equal(!isFullView);
                });
            });

            it('Should resolve the click event', function () {
                ItemHeader.isItemFullView().then(function (isFullView) {
                    var clickToChangeViewButton = isFullView ? ItemHeader.clickChangeToSplitViewButton : ItemHeader.clickChangeToFullViewButton;
                    var targetRegExp = isFullView ? /^.*view=split.*$/ : /^.*view=full.*$/;

                    clickToChangeViewButton().then(function () {
                        Helper.waitForUrlToChangeTo(targetRegExp).then(function () {
                            expect(ItemHeader.isChangeToSplitViewButtonPresent()).to.eventually.equal(!isFullView);
                            expect(ItemHeader.isChangeToFullViewButtonPresent()).to.eventually.equal(isFullView);
                        });
                    });

                });
            });

        });
        describe('[Close Button]', function () {
                var workspaceId = '9';
                var itemId = '2949';
                var workspaceUrl = 'workspaces/' + workspaceId + '/items';

                beforeEach(function () {
                    page.changeRoute(workspaceId, itemId); // change orders; Test release 1 - 1 - Low
                    page.go();
                    page.waitForEvents();
                });

                it('Should be present', function (done) {
                    ItemHeader.isCloseButtonPresent().then(function (result) {
                        expect(result).to.be.true;
                        done();
                    });
                });

                it('Should close item details view', function () {
                    ItemHeader.isItemFullView().then(function (isFullView) {
                        ItemHeader.clickCloseButton().then(function () {
                            if (isFullView) {
                                it('[Full]', function () {
                                    Helper.getCurrentUrl().then(function (url) {
                                        expect(url.indexOf(workspaceUrl) > 0).to.be.true;
                                    });
                                });
                            } else {
                                it('[Split]', function () {
                                    browser.driver.wait(ItemHeader.isItemViewerClose, 5000);
                                    ItemHeader.isCloseButtonPresent().then(function (isPresent) {
                                        expect(isPresent).to.be.false;
                                    });
                                });
                            }
                        });
                    });
                });
            });
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testCommandBar
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests the commands bar on the item details page
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} name The page name.
	 * @param {String} itemName The item name.
	 */
	this.testCommandBar = function (page, name, itemName) {
		describe('[ItemHeader]', function () {
			before(function () {
				page.go();
			});

			it('should display the functional edit button on the command bar', function () {
				this._runnable.ssName = name + '-functionalEdit';

				browser.driver.sleep(1000);
				element(by.css('#transcluded-buttons a')).click();

				element.all(by.css('#control-data button')).get(0).getText().then(function (btnText) {
					expect(btnText).to.equal('Save');
				});

				element.all(by.css('#control-data button')).get(1).getText().then(function (btnText) {
					expect(btnText).to.equal('Cancel');
				});
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testWorkflowTransitionLink
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests the workflow transition link
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} name The page name.
	 */
	this.testWorkflowTransitionLink = function (page, name) {
		var EC = protractor.ExpectedConditions;
		describe('[testWorkflowTransitionLink]', function () {
			before(function () {
				page.changeRoute('8', '2725');
				page.go();
				page.waitForEvents();
			});

			it('checks that the workflow transition link is not present for relevant workspaces like Item and BOMS', function () {
				WorkflowTransitionFlyout.actionsDropdown.click();
				browser.wait(EC.presenceOf(WorkflowTransitionFlyout.actionsDropdown), 5000);
				expect(WorkflowTransitionFlyout.workFlowTransitionLink.isDisplayed())
					.to.eventually.be.false;
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testWorkflowTransitionFlyout
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests the workflow transition flyout on plm header
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} name The page name.
	 */
	this.testWorkflowTransitionFlyout = function (page, name) {
		describe('[WorkflowTransitionFlyout]', function () {
			before(function () {
				page.changeRoute('60', '3294');
				page.go();
				page.waitForEvents();
			});

			it('checks the delegation workflow transition link', function () {
				this._runnable.ssName = name + '-delegationLink';

				WorkflowTransitionFlyout.actionsDropdown.click();
				expect(WorkflowTransitionFlyout.workFlowTransitionLink.isDisplayed())
					.to.eventually.be.true;
			});

			it('checks if the transition option list is available', function () {
				this._runnable.ssName = name + '-transitionOptions';

				WorkflowTransitionFlyout.workFlowTransitionLink.click();
				WorkflowTransitionFlyout.workflowTransitionSelect.click();
				expect(WorkflowTransitionFlyout.transitionOptionList.count())
					.to.eventually.equal(1);
			});

			it('checks if the act as label and dropdown is displayed properly', function () {
				this._runnable.ssName = name + '-actAsLabel';

				WorkflowTransitionFlyout.transitionOptionList.get(0).click();
				expect(WorkflowTransitionFlyout.actAsLabel.isDisplayed())
					.to.eventually.be.true;
				expect(WorkflowTransitionFlyout.actAsDropdown.isDisplayed())
					.to.eventually.be.true;
				expect(WorkflowTransitionFlyout.actAsDropdown.all(by.css('option')).count())
					.to.eventually.be.above(0);
			});

			it('checks if the save button is disabled if act as value is not selected or is \'Please select\'', function () {
				this._runnable.ssName = name + '-disabledSave';

				WorkflowTransitionFlyout.actAsDropdown.click();
				WorkflowTransitionFlyout.actAsDropdownOption.get(0).click();
				expect(WorkflowTransitionFlyout.saveButton.getAttribute('disabled'))
					.to.eventually.equal('true');
			});

			it('checks if the save button is enabled after selecting transition and act as value', function () {
				this._runnable.ssName = name + '-enabledSave';

				WorkflowTransitionFlyout.actAsDropdown.click();
				WorkflowTransitionFlyout.actAsDropdownOption.get(1).click();
				expect(WorkflowTransitionFlyout.saveButton.getAttribute('disabled'))
					.to.eventually.equal(null);
			});

			it('checks if the save functionality is working properly', function () {
				this._runnable.ssName = name + '-save';

				WorkflowTransitionFlyout.comments.sendKeys('Test comments');
				WorkflowTransitionFlyout.saveButton.click();
				browser.sleep(2000);

				expect(WorkflowTransitionFlyout.flyout.isPresent()).to.eventually.be.false;
			});
		});
	};

	// this.testSearchPlm = function () {
	// 	SearchPlmSpec.run();
	// };
}

module.exports = SharedSpec;
