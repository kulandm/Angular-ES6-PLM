/**
 * @ngdoc object
 * @name ViewTestsComponents.AppHeader
 *
 * @description This component corresponds to the app header template.
 *
 * ##Dependencies
 *
 */
function AppHeader() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#plmHeader
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for PLM Header.
	 */
	var plmHeader = element(by.css('#plm-header'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#plmFooter
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for PLM footer.
	 */
	var plmFooter = element(by.css('#plm-footer'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#loadingBar
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Loading Bar.
	 */
	var loadingBar = element(by.css('#loading-bar'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#navigationBar
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Navigation Bar.
	 */
	var navigationBar = element(by.css('#sidenav'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#sidenavMenu
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Sidenav Menu container.
	 */
	var sidenavMenu = element(by.css('#sidenav-menu'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#profileMenuButton
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Profile Menu Button.
	 */
	var profileMenuButton = element(by.css('#fusion-header-user-profile-dropdown-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#profileMenu
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Profile Menu.
	 */
	var profileMenu = element(by.css('#fusion-header-user-dropdown .dropdown-widget-wrapper'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#workspacesBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Workspaces Menu button.
	 */
	var workspacesBtn = element(by.css('.workspace-menu-btn'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#helpBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Help Menu button.
	 */
	var helpBtn = element(by.css('.help-menu-btn'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#adminBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Administration Menu button.
	 */
	var adminBtn = element(by.css('.admin-menu-btn'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#backBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Workspaces Back button.
	 */
	var backBtn = element(by.css('#sidenav-menu-back'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#workspacesFlyout
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Workspaces flyout.
	 */
	var workspacesFlyout = element(by.css('#workspaces-sidenav-submenu'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#helpFlyout
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Help flyout.
	 */
	var helpFlyout = element(by.css('#help-sidenav-submenu'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#adminFlyout
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Administration flyout.
	 */
	var adminFlyout = element(by.css('#admin-sidenav-submenu'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#itemViewerMenuDropdownBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Menu Dropdown.
	 */
	var itemViewerMenuDropdownBtn = element(by.css('#itemviewer-menu-dropdown-button'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.AppHeader#dropdownWidget
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description `private` WebElement for Menu Dropdown Widget.
	 */
	var dropdownWidget = element(by.css('#itemviewer-menu-dropdown-button + .dropdown-widget'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#isAppHeaderComponentsDisplayed
	 * @methodOf ViewTestsComponents.AppHeader
	 * @description Gets whether the plm header components are displayed
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its display value is retrieved.
	 */
	this.isAppHeaderComponentsDisplayed = function () {
		return protractor.promise.all([
			plmHeader.isDisplayed(),
			loadingBar.isDisplayed(),
			navigationBar.isDisplayed(),
			profileMenu.isDisplayed(),
			workspacesBtn.isDisplayed()
		]);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#isWorkspacesBtnDisplayed
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets whether the workspaces menu is displayed.
	 *
	 * @returns {Object} A Promise that resolves when the element is found and its display value is retrieved.
	 */
	this.isWorkspacesBtnDisplayed = function () {
		return workspacesBtn.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#isWorkspacesCategoryCollapsed
	 * @methodOf ViewTestsComponents.AppHeader
	 * @description Returns true if given category is in collapsed state.
	 *
	 * @param {Object} workspaceCategoryEl The workspace category element finder.
	 *
	 * @returns {Boolean} True, if category is in collapsed state.
	 */
	this.isWorkspacesCategoryCollapsed = function (workspaceCategoryEl) {
		var deferObj = protractor.promise.defer();
		workspaceCategoryEl.element(by.css('.sidenav-submenu-panel')).getAttribute('class').then(function (val) {
			if (val.search('ng-hide') !== -1) {
				deferObj.fulfill(true);
			} else {
				deferObj.fulfill(false);
			}
		});
		return deferObj.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getSidenavMenuButtons
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the Sidenav menu buttons.
	 *
	 * @returns {Object} A Promise that resolves when the elements are found.
	 */
	this.getSidenavMenuButtons = function () {
		return sidenavMenu.all(by.css('.sidenav-menu-item'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getDropdownMenuBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the item viewer menu dropdown button.
	 *
	 * @returns {Element} An element for Menu Dropdown.
	 */
	this.getDropdownMenuBtn = function () {
		return itemViewerMenuDropdownBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getDropdownWidget
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the dropdown widget.
	 *
	 * @returns {Element} An element for the Dropdown Widget.
	 */
	this.getDropdownWidget = function () {
		return dropdownWidget;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getWorkspacesBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the workspaces menu button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getWorkspacesBtn = function () {
		return element(by.css('.workspace-menu-btn'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getHelpBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the Help menu button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getHelpBtn = function () {
		return helpBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getAdminBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the Administration menu button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getAdminBtn = function () {
		return adminBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getBackBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the back menu button.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getBackBtn = function () {
		return backBtn;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getWorkspacesFlyout
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the workspaces flyout.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getWorkspacesFlyout = function () {
		return workspacesFlyout;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getAllWorkspacesLink
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the All Workspaces link in the workspaces flyout.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getAllWorkspacesLink = function () {
		return element(by.binding('{{category.displayName}}'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getHelpFlyout
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the help flyout.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getHelpFlyout = function () {
		return helpFlyout;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getAdminFlyout
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the administration flyout.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getAdminFlyout = function () {
		return adminFlyout;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getNavMainButton
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the main nav button which open up the main flyout menu.
	 *
	 * @returns {Element} An element that is the main button.
	 */
	this.getNavMainButton = function () {
		return element(by.css('#fusion-lifecycle-logo'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getProfileMenuButton
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the main nav button which open profile dropdown menu.
	 *
	 * @returns {Element} An element that is the main button.
	 */
	this.getProfileMenuButton = function () {
		return profileMenuButton;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getProfileMenu
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the profile dropdown menu.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getProfileMenu = function () {
		return profileMenu;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#collapseMenu
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Makes sure the left nav menu is collapsed
	 *
	 */
	this.collapseMenu = function () {
		return this.getBackBtn().isDisplayed().then(function (backBtnDisplayed) {
			if (backBtnDisplayed) {
				 this.getBackBtn().click();
			}
			return this.getNavMainButton().click();
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getBackDrop
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the shadow element used for clicking to close the opened flyout.
	 *
	 * @returns {Element} An element that is the shadow element when the flyout opens.
	 */
	this.getBackDrop = function () {
		return element(by.css('#sidenav .md-sidenav-backdrop'));
	};

	this.getPageHeading = function () {
		var deferred = protractor.promise.defer();
		var pageHeading;
		element(by.css('h1')).getText().then(function (heading) {
			pageHeading = heading;
			deferred.fulfill(pageHeading);
		});
		return deferred.promise;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getWorkspacesCategories
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Gets the categories in the workspaces flyout.
	 *
	 * @returns {Object} A Promise that resolves when the element is found.
	 */
	this.getWorkspacesCategories = function () {
		return workspacesFlyout.all(by.repeater('category in plmNavigationCtrl.categoryList'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getPLMHeader
	 * @methodOf ViewTestsComponents.AppHeader
	 * @description Returns the header wrapper element.
	 *
	 * @returns {Object} A Promise that resolves when element is found.
	 */
	this.getPLMHeader = function () {
		return plmHeader;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getPLMFooter
	 * @methodOf ViewTestsComponents.AppHeader
	 * @description Returns the header wrapper element.
	 *
	 * @returns {Object} A Promise that resolves when element is found.
	 */
	this.getPLMFooter = function () {
		return plmFooter;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getWorkspaceName
	 * @methodOf ViewTestsComponents.AppHeader
	 * @description Returns the text for the workspace name.
	 *
	 * @returns {Object} A Promise that resolves when element is found.
	 */
	this.getWorkspaceName = function () {
		return element(by.css('#plm-header h1')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getCategoryBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description 'private' WebElement for the side navigation bar.
	 *
	 * @param {String} category : The category name.
	 *
	 * @returns {Object} the element for the category link
	 */
	this.getCategoryBtn = function (category) {
		return element(by.xpath('//*[@id="workspaces-sidenav-submenu"]/li/a[span[text() = "' + category + '"]]'));
	};
	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#getWorkspaceBtn
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description 'private' WebElement for the side navigation bar.
	 *
	 * @param {String} workspaceName : The workspace name.
	 *
	 * @returns {Object} the element for the workspace link
	 */
	this.getWorkspaceBtn = function (workspaceName) {
		return element(by.xpath('//*[@id="workspaces-sidenav-submenu"]//a[text()="' + workspaceName +'"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#openWorkspace
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description open the workspace be click links on the side nav bar.
	 *
	 * @param {String} category : the name of the category where the workspace belong to.
	 * @param {String} workspaceName : the name of the workspace.
	 */
	this.openWorkspace = function (category, workspaceName) {
		var catBtn = this.getCategoryBtn(category);
		var wsBtn = this.getWorkspaceBtn(workspaceName);
		var EC = protractor.ExpectedConditions;
		var allWSBtn = this.getWorkspacesBtn();
		var isClickable = EC.elementToBeClickable(allWSBtn);
		browser.wait(isClickable, 5000);
		allWSBtn.click();

		isClickable = EC.elementToBeClickable(catBtn);
		browser.wait(isClickable, 5000);
		catBtn.click();

		isClickable = EC.elementToBeClickable(wsBtn);
		browser.wait(isClickable, 5000);
		wsBtn.click();

		var wsHeader = element(by.xpath('//*[@id="plm-header"]//h1/span[text()="'+ workspaceName + '"]'));
		var isPresent = EC.presenceOf(wsHeader);
		browser.wait(isPresent, 3000);
		return wsHeader.isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#showExpandedMenu
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Return to the menu expanded main options.
	 *
	 * @returns {Promise} Will resolve when all actions bring us to the expanded menu options
	 */
	this.showExpandedMenu = function () {
		var that = this;
		return browser.isElementPresent(that.getBackDrop()).then(function (present) {
			if (present) {
				return browser.isElementPresent(that.getBackBtn()).then(function (present) {
					if (present) {
						return that.getBackBtn().isDisplayed().then(function (visible) {
							if (visible) {
								return that.getBackBtn().click();
							}
						});
					}
				});
			} else {
				return that.getNavMainButton().click();
			}
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.AppHeader#showProfileMenu
	 * @propertyOf ViewTestsComponents.AppHeader
	 * @description Open profile dropdown menu.
	 *
	 * @returns {Promise} Will resolve when all actions bring us to the profile dropdown menu
	 */
	this.showProfileMenu = function () {
		var that = this;
		browser.isElementPresent(that.getProfileMenuButton()).then(function (present) {
			if (present) {
				that.getProfileMenuButton().click();
			}
		});

		return protractor.promise.all([
			profileMenu.isDisplayed()
		]);
	};
}

module.exports = new AppHeader();
