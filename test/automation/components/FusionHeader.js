'use strict';

/**
 * @ngdoc object
 * @name ViewTestsComponents.FusionHeader
 *
 * @description This component corresponds to the Unified Fusion Header
 *
 * ##Dependencies
 *
 */
function FusionHeader() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#header
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for header wrapper.
	 */
	let header = element(by.css('#fusion-header-wrapper'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#hamburgerMenuButton
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for hamburger menu button.
	 */
	let hamburgerMenuButton = header.element(by.css('#fusion-header-hamburger span'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#firstSeparator
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the separator between the hamburger and the logo.
	 */
	let firstSeparator = header.element(by.css('#fusion-header-hamburger-separator'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#fusionLogo
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for fusion logo.
	 */
	let fusionLogo = header.element(by.css('#fusion-brand-logo img'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#secondSeparator
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the separator between the logo and the hub name.
	 */
	let secondSeparator = header.element(by.css('#fusion-header-logo-separator'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#hubName
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the hub name.
	 */
	let hubName = header.element(by.css('#fusion-header-hub-name'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#searchIcon
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the search icon.
	 */
	let searchIcon = header.element(by.css('#fusion-header-search svg'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#helpMenuIcon
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the help menu icon.
	 */
	let helpMenuIcon = header.element(by.css('#fusion-header-help svg'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#userMenuIcon
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the user menu icon.
	 */
	let userMenuIcon = header.element(by.css('#fusion-header-user user-dropdown'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#helpMenu
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the help menu.
	 */
	let helpMenu = element(by.css('#fusion-header-help-menu-content'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#helpMenuBackdrop
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the help menu backdrop.
	 */
	let helpMenuBackdrop = element(by.css('.flyout-backdrop'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.FusionHeader#userMenu
	 * @propertyOf ViewTestsComponents.FusionHeader
	 * @description `private` WebElement for the user menu.
	 */
	let userMenu = element(by.css('#fusion-header-user .dropdown-widget-wrapper'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHeader
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the header component's wrapper
	 * @returns {WebElement} the header
	 */
	this.getHeader = function () {
		return header;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHamburgerMenuButton
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the hamburger button
	 * @returns {WebElement} the button
	 */
	this.getHamburgerMenuButton = function () {
		return hamburgerMenuButton;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getFirstHeaderSeparator
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the first separator
	 * @returns {WebElement} the separator
	 */
	this.getFirstHeaderSeparator = function () {
		return firstSeparator;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getFusionLogo
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the fusion logo
	 * @returns {WebElement} the logo
	 */
	this.getFusionLogo = function () {
		return fusionLogo;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getSecondHeaderSeparator
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the second separator
	 * @returns {WebElement} the separator
	 */
	this.getSecondHeaderSeparator = function () {
		return secondSeparator;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHubName
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the hub name container
	 * @returns {WebElement} the hubName container
	 */
	this.getHubName = function () {
		return hubName;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getSearchIcon
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the icon for search
	 * @returns {WebElement} the svg search icon
	 */
	this.getSearchIcon = function () {
		return searchIcon;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHelpMenuIcon
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the icon for help
	 * @returns {WebElement} the svg help icon
	 */
	this.getHelpMenuIcon = function () {
		return helpMenuIcon;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getUserMenuIcon
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the icon for user menu
	 * @returns {WebElement} the user menu icon
	 */
	this.getUserMenuIcon = function () {
		return userMenuIcon;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHelpMenu
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the help menu
	 * @returns {WebElement} the help menu
	 */
	this.getHelpMenu = function () {
		return helpMenu;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHelpMenuBackdrop
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the help menu backdrop
	 * @returns {WebElement} the help menu backdrop
	 */
	this.getHelpMenuBackdrop = function () {
		return helpMenuBackdrop;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#openHelpFlyout
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Opens the help menu
	 */
	this.openHelpMenu = function () {
		this.getHelpMenuIcon().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#closeHelpMenu
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Closes the open help menu
	 *		Clicks the backdrop (since it covers everything else)
	 */
	this.closeHelpMenu = function () {
		this.getHelpMenuBackdrop().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getHelpMenuOptions
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the optiions of the help menu
	 *		Will fail if the menu isn't open
	 * @returns {WebElement} the help menu backdrop
	 */
	this.getHelpMenuOptions = function () {
		return helpMenu.all(by.css('#fusion-header-help-options-link-list a'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#openUserMenu
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Opens the user menu
	 */
	this.openUserMenu = function () {
		this.getUserMenuIcon().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#closeUserMenu
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Closes the user menu
	 */
	this.closeUserMenu = function () {
		this.getUserMenuIcon().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getUserMenu
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the user menu
	 * @returns {WebElement} the user menu
	 */
	this.getUserMenu = function () {
		return userMenu;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.FusionHeader#getUserMenuOptions
	 * @methodof ViewTestsComponents.FusionHeader
	 * @description Returns the user menu options
	 * @returns {WebElementArray} the user menu options
	 */
	this.getUserMenuOptions = function () {
		return userMenu.all(by.css('ul li button'));
	};
}

module.exports = new FusionHeader();
