/**
 * @ngdoc object
 * @name ViewTestsPage.ViewBomPage
 *
 * @description This is a parent class of all pages
 *
 * ##Dependencies
 *
 */
var q = require('q');
var util = require('util');
var AbstractItemViewPage = require('../pages/AbstractItemViewPage');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var ItemHeader = require('../components/ItemHeader');
var BomConfigurationDropdown = require('../components/BomConfigurationDropdown');
var CommandBar = require('../components/CommandBar');

function ViewBomPage() {

	ViewBomPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#items
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Maps identifiers to item information for use in testing
	 */
	this.items = {
		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.defaultItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description the default item to test with
		 * Dmsid 2773 = 683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621 [Rev: B]
		 * Items and Boms workspace
		 * An item with a single layer of children of 10, some with change orders and attachments
		 */
		defaultItem: {
			dmsid: 2773,
			workspace: 8,
			descriptor: '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621 [REV:B]',
			revision: 'B'
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.defaultItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description the pervious version of supercededItem
		 * Dmsid 2696 = 683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621 [REV:sA]
		 * Items and Boms workspace
		 * An item with a single layer of children of 10, some with change orders and attachments
		 */
		supercededItem: {
			dmsid: 2696,
			workspace: 8,
			descriptor: '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621 [REV:sA]',
			revision: 'A'
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.unlockedForChangesItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description The working revision for defaultItem
		 * which we have permission to change
		 */
		unlockedForChangesItem: {
			dmsid: 2909,
			workspace: 8,
			descriptor: '683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621 [REV:w]',
			revision: 'Working'
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.attachmentItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description The working revision item for testing attached items flyout
		 */
		attachmentItem: {
			dmsid: 2906,
			workspace: 8,
			descriptor: '600-0001-000 - SBOM Project 621 Head [REV:w]',
			revision: 'Working'
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.defaultItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description The working revision for the item in the Products workspace
		 * which we have permission to change
		 */
		productItem: {
			dmsid: 2694,
			workspace: 47
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.unlockedItemWithChildrens
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description The working revision for the item in the Products workspace
		 * which we have permission to change
		 */
		unlockedItemWithChildren: {
			dmsid: 2772,
			workspace: 8
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.inChangeOrderReleasedItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description An item in items and boms workspace that is currently in a change order
		 *		The released revision of that item
		 */
		inChangeOrderReleasedItem: {
			dmsid: 2702,
			workspace: 8,
			descriptor: '163-0000-000 - VALVE BALL 1/2" Female-Female Threaded , [REV:A]',
			revision: 'A'
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.inChangeOrderWorkingItem
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description An item in items and boms workspace that is currently in a change order
		 *		The working revision of that item
		 */
		inChangeOrderWorkingItem: {
			dmsid: 2779,
			workspace: 8,
			descriptor: '163-0000-000 - VALVE BALL 1/2" Female-Female Threaded , [REV:w]',
			revision: 'Working'
		},

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#items.addedItems
		 * @propertyOf ViewTestsPage.ViewBomPage.dmsids
		 * @description A list of items we add to boms
		 */
		addedItems: [
			{
				dmsid: 2786,
				workspace: 8,
				title: '155-0004-000 - 5/16 X 1 in Long, SHCS Drive, [REV:w]'
			}
		]
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#getItemEncodedUrn
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Returns the encoded urn for an item in this.items - Builds given a tenant, workspace and dmsid
	 */
	this.getItemEncodedUrn = function (itemKey) {
		'urn%60adsk,plm%60tenant,workspace,item%60' + browser.params.tenant + ',' + this.items[itemKey].workspace + ',' + this.items[itemKey].dmsid;
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#itemId
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Item id referring to the item in a given workspace
	 */
	this.getItemId = function (itemKey) {
		return this.items[itemKey].workspace + '@' + this.items[itemKey].dmsid;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#getRouteForItem
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Gets the route for the items and Boms workspace in the format used in GenericPage.go()
	 */
	this.getRouteForItem = function (itemKey) {
		return '/' + browser.params.baseName + '/workspaces/' + this.items[itemKey].workspace + '/items/bom?tab=bom&view=split&mode=view&itemId=' + this.getItemId(itemKey);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#setRouteForItem
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Sets the route for use in GenericPage.go()
	 */
	this.setRouteForItem = function (itemKey) {
		this.route = this.getRouteForItem(itemKey);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#waitForPageToBeLoaded
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description wait for for bom page to be loaded
	 */
	this.waitForPageToBeLoaded = function () {
		expect(this.waitForEvents()).to.eventually.be.true;
		expect(this.bom.table.isDisplayed()).to.eventually.be.true;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#goToItem
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Use GenericPage.go() to travese to page, so that we get any arguments it adds (noAnimation, etc)
	 * Currently can only traverse to bom tab
	 */
	this.goToItem = function (itemKey) {
		this.setRouteForItem(itemKey);
		this.go();
		// wait for page to be loaded.
		this.waitForPageToBeLoaded();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#goToDefaultItem
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Shortcut to return to default item
	 */
	this.goToDefaultItem = function () {
		this.goToItem('defaultItem');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#goToAttachmentItem
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Shortcut to item with attachments
	 */
	this.goToAttachmentItem = function () {
		this.goToItem('attachmentItem');
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#route
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Set the initial URL for this page to the default item.
	 */
	this.route = this.getRouteForItem('defaultItem');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('/bom');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#urlContains
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'bom';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#page
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description Alias for 'this'
	 */
	var page = this;

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#getElementCount
	 * @description Retrieves the locator property of the context and counts the number of items in it
	 *
	 * @returns {Object} A promise that will be resolved to the number of items in the locator
	 */
	function getElementCount() {
		// value of 'this' depends on calling context
		return this.locator.count();
	}

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#isElementDisplayed
	 * @description Retrieves the locator property of the context and checks if it is displayed
	 *
	 * @returns {Object} A promise that will resolve to true if the locator is visible
	 */
	function isElementDisplayed() {
		// value of 'this' depends on calling context
		return this.locator.isDisplayed();
	}

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#isElementDisabled
	 * @description Retrieves the locator property of the context and checks if it is disabled
	 *
	 * @returns {Object} A promise that will resolve to true if the locator is disabled
	 */
	function isElementDisabled() {
		// value of 'this' depends on calling context
		return this.locator.getAttribute('disabled').then(function (result) {
			return result ? true : false;
		});
	}

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#clickElement
	 * @description Retrieves the locator property of the context and clicks it
	 *
	 * @returns {Object} A promise that will be resolved when the click completes;
	 */
	function clickElement() {
		// value of 'this' depends on calling context
		return this.locator.click();
	}

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#clickDropdownValue
	 * @description Retrieves the locator property of the context (which is a dropdown)
	 *		and clicks the value at the specified index
	 *
	 * @returns {Object} A promise that will be resolved when the click completes;
	 */
	function clickDropdownValue(index) {
		// value of 'this' depends on calling context
		return this.locator.get(index).element(by.css('a')).click();
	}

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description The bar of buttons at the top of the section (not the tab bar)
	 */
	page.commandBar = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The locator for the command bar
	 */
	page.commandBar.locator = element(by.css('#transcluded-buttons'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.addButton
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The button to open the add flyout
	 */
	page.commandBar.addButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.addButton.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.addButton
	 * @description The locator for the add button
	 */
	page.commandBar.addButton.locator = element(by.css('#bom-add-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.addButton.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.addButton
	 * @description Checks if the add button is visible
	 */
	page.commandBar.addButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.addButton.isDisabled
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.addButton
	 * @description Checks if the add button is disabled
	 */
	page.commandBar.addButton.isDisabled = isElementDisabled;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.addButton.click
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.addButton
	 * @description Clicks the add button to open the add flyout
	 */
	page.commandBar.addButton.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.editButton
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The button to switch to edit mode
	 */
	page.commandBar.editButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.editButton.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.editButton
	 * @description The locator for the edit button
	 */
	page.commandBar.editButton.locator = element(by.css('#bom-edit-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.editButton.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.editButton
	 * @description Checks if the edit button is visible
	 */
	page.commandBar.editButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.editButton.isDisabled
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.editButton
	 * @description Checks if the edit button is disabled
	 */
	page.commandBar.editButton.isDisabled = isElementDisabled;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.editButton.click
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.editButton
	 * @description Clicks the edit button to switch to edit mode
	 */
	page.commandBar.editButton.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.removeButton
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The button to remove items from the bom
	 */
	page.commandBar.removeButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.removeButton.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.removeButton
	 * @description The locator for the remove button
	 */
	page.commandBar.removeButton.locator = element(by.css('#bom-remove-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.removeButton.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.removeButton
	 * @description Checks if the remove button is displayed
	 */
	page.commandBar.removeButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.removeButton.isDisabled
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.removeButton
	 * @description Checks if the remove button is disabled
	 */
	page.commandBar.removeButton.isDisabled = isElementDisabled;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.removeButton.click
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.removeButton
	 * @description Click the remove button to queue selected rows for removal
	 */
	page.commandBar.removeButton.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The actions dropdown wrapper
	 */
	page.commandBar.actionsDropdown = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown
	 * @description The locator for the actions dropdown wrapper
	 */
	page.commandBar.actionsDropdown.locator = element(by.css('#bom-actions-dropdown'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.button
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown
	 * @description The button to open the actions dropdown
	 */
	page.commandBar.actionsDropdown.button = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.button.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.button
	 * @description The locator for the actions button
	 */
	page.commandBar.actionsDropdown.button.locator = page.commandBar.actionsDropdown.locator.element(by.css('#bom-actions-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.button.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.button
	 * @description Checks if the actions button is displayed
	 */
	page.commandBar.actionsDropdown.button.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.button.isDisabled
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.button
	 * @description Checks if the actions button is disabled
	 */
	page.commandBar.actionsDropdown.button.isDisabled = isElementDisabled;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.button.click
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.button
	 * @description Click the actions button to open the actions dropdown
	 */
	page.commandBar.actionsDropdown.button.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown
	 * @description The actions dropdown
	 */
	page.commandBar.actionsDropdown.dropdown = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.dropdown
	 * @description Click the actions button to open the actions dropdown
	 */
	page.commandBar.actionsDropdown.dropdown.locator = page.commandBar.actionsDropdown.locator.element(by.css('.dropdown-widget-wrapper'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown.isDisplayed
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.dropdown
	 * @description Checks if the actions dropdown is displayed
	 */
	page.commandBar.actionsDropdown.dropdown.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown.values
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.dropdown
	 * @description The values in the actions dropdown
	 */
	page.commandBar.actionsDropdown.dropdown.values = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown.values.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.dropdown.values
	 * @description The locator for the values in the actions dropdown
	 */
	page.commandBar.actionsDropdown.dropdown.values.locator = page.commandBar.actionsDropdown.dropdown.locator.all(by.css('li'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown.values.getCount
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.dropdown.values
	 * @description The number of options in the views dropdown
	 */
	page.commandBar.actionsDropdown.dropdown.values.getCount = getElementCount;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.actionsDropdown.dropdown.values.clickValue
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.actionsDropdown.dropdown.values
	 * @description Clicks the action at the specified index
	 */
	page.commandBar.actionsDropdown.dropdown.values.clickAction = clickDropdownValue;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description buttons that become avaiable when the bom is in edit mode
	 */
	page.commandBar.controlButtons = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.saveButton
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.controlButtons
	 * @description The save button to save the changes to the BOM
	 */
	page.commandBar.controlButtons.saveButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.saveButton.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.controlButtons.saveButton
	 * @description the locator for the save button
	 */
	page.commandBar.controlButtons.saveButton.locator = CommandBar.getControlButton(0);

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.saveButton.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.controlButtons.saveButton
	 * @description Checks if the save button is displayed
	 */
	page.commandBar.controlButtons.saveButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.saveButton.click
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.controlButtons.saveButton
	 * @description Click the save button to save the changes and return to view mode
	 */
	page.commandBar.controlButtons.saveButton.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.cancelButton
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.controlButtons
	 * @description The cancel button to cancel the changes to the BOM
	 */
	page.commandBar.controlButtons.cancelButton = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.cancelButton.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.controlButtons.cancelButton
	 * @description the locator for the cancel button
	 */
	page.commandBar.controlButtons.cancelButton.locator = CommandBar.getControlButton(1);

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.cancelButton.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.controlButtons.cancelButton
	 * @description Checks if the cancel button is displayed
	 */
	page.commandBar.controlButtons.cancelButton.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.controlButtons.cancelButton.click
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.controlButtons.cancelButton
	 * @description Click the cancel button to discard the changes to the BOM and return to view mode
	 */
	page.commandBar.controlButtons.cancelButton.click = clickElement;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The container for the dropdown component that lets user switch views
	 */
	page.commandBar.viewsDropdown = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown
	 * @description The locator for the dropdown component's container
	 */
	page.commandBar.viewsDropdown.locator = element(by.css('#views-dropdown'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.changeToView
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown
	 * @description Utility function to open the views dropdown and pick a view
	 */
	page.commandBar.viewsDropdown.changeToView = function (index) {
		this.button.click();
		this.dropdown.values.clickValue(index);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.button
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown
	 * @description The button to open the views dropdown
	 */
	page.commandBar.viewsDropdown.button = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.button.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.button
	 * @description The locator for the button to open the views dropdown
	 */
	page.commandBar.viewsDropdown.button.locator = element(by.css('#views-dropdown-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.button.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.button
	 * @description Checks if the button to open the views dropdown is visible
	 */
	page.commandBar.viewsDropdown.button.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.button.click
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.button
	 * @description Clicks the button to open the views dropdown
	 */
	page.commandBar.viewsDropdown.button.click = clickElement;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.button.isDisabled
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.button
	 * @description checks if the view dropdown button is disabled
	 */
	page.commandBar.viewsDropdown.button.isDisabled = isElementDisabled;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown
	 * @description The dropdown that shows the list of view options
	 */
	page.commandBar.viewsDropdown.dropdown = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.dropdown
	 * @description The locator for the dropdown that shows the list of view options
	 */
	page.commandBar.viewsDropdown.dropdown.locator = page.commandBar.viewsDropdown.locator.element(by.css('.dropdown-widget-wrapper'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown
	 * @description Checks if the views dropdown is visible
	 */
	page.commandBar.viewsDropdown.dropdown.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown.values
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.dropdown
	 * @description The list of options in the views dropdown
	 */
	page.commandBar.viewsDropdown.dropdown.values = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown.values.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.dropdown.values
	 * @description The locator for all the values in the views dropdown
	 */
	page.commandBar.viewsDropdown.dropdown.values.locator = page.commandBar.viewsDropdown.dropdown.locator.all(by.css('li'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown.values.getCount
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.dropdown.values
	 * @description The number of options in the views dropdown
	 */
	page.commandBar.viewsDropdown.dropdown.values.getCount = getElementCount;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.viewsDropdown.dropdown.values.clickValue
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.viewsDropdown.dropdown.values
	 * @description Clicks the view option at the specified index to switch to that view
	 *
	 * @returns {Object} a promise that resolves when the click completes
	 */
	page.commandBar.viewsDropdown.dropdown.values.clickValue = clickDropdownValue;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar
	 * @description The container for the dropdown to change the bom configuration
	 */
	page.commandBar.configurationDropdown = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description The locator for the configuration dropdown container
	 */
	page.commandBar.configurationDropdown.locator = element(by.css('#configuration-dropdown'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.changeEffectiveDateToEarliest
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description Utility function to changes the bom effective date to the earliest date datepicker can easily pick
	 *
	 * @returns {Object} A promise that will be resolved when the date has changed
	 */
	page.commandBar.configurationDropdown.changeEffectiveDateToEarliest = function () {
		this.component.open();
		this.component.effectivityDatepicker.setToEarliestDate();
		this.component.save();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.changeEffectiveDateToLatest
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description Utility function to changes the bom effective date to the latest date datepicker can easily pick
	 *
	 * @returns {Object} A promise that will be resolved when the date has changed
	 */
	page.commandBar.configurationDropdown.changeEffectiveDateToLatest = function () {
		this.component.open();
		this.component.effectivityDatepicker.setToLatestDate();
		this.component.save();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.changeToBias
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description Utility function to changes the bom bias to the specified revision
	 *
	 * @returns {Object} A promise that will be resolved when the bias has changed
	 */
	page.commandBar.configurationDropdown.changeToBias = function (revision) {
		this.component.open();
		this.component.biasDropdown.setSelectedBias(revision);
		this.component.save();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.changeToEarliestDateAndRevision
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description Utility function to attempt to change both the date and the revision bias
	 *
	 * @returns {Object} A promise that will be resolved when the request has resolved
	 */
	page.commandBar.configurationDropdown.changeToEarliestDateAndBias = function (revision) {
		this.component.open();
		this.component.effectivityDatepicker.setToEarliestDate();
		this.component.biasDropdown.setSelectedBias(revision);
		this.component.save();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.button
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description The button to open the configuration dropdown
	 */
	page.commandBar.configurationDropdown.button = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.button.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown.button
	 * @description The locator for the button to open the configuration dropdown
	 */
	page.commandBar.configurationDropdown.button.locator = element(by.css('#configuration-dropdown-button'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.button.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown.button
	 * @description Checks if the button to open the configuration dropdown is visible
	 */
	page.commandBar.configurationDropdown.button.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.button.isDisabled
	 * @methodOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown.button
	 * @description Checks if the configuration dropdown button is disabled.
	 */
	page.commandBar.configurationDropdown.button.isDisabled = isElementDisabled;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#commandBar.configurationDropdown.component
	 * @propertyOf ViewTestsPage.ViewBomPage.commandBar.configurationDropdown
	 * @description The component for accessing the configuration dropdown
	 */
	page.commandBar.configurationDropdown.component = new BomConfigurationDropdown(page.commandBar.configurationDropdown.button.locator);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description The container for the main section of the bom view page
	 */
	page.bom = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.bom
	 * @description The locator for the container for the main section of the bom view page
	 */
	page.bom.locator = element(by.css('.bom'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.isInViewMode
	 * @propertyOf ViewTestsPage.ViewBomPage.bom
	 * @description Determines if the page is in view mode
	 *	by checking for the visibility of the edit button
	 */
	page.bom.isInViewMode = function () {
		return page.commandBar.editButton.isDisplayed();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.enterEditMode
	 * @propertyOf ViewTestsPage.ViewBomPage.bom
	 * @description Enters edit mode by clicking the edit button
	 */
	page.bom.enterEditMode = function () {
		page.commandBar.editButton.click();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.views
	 * @propertyOf ViewTestsPage.ViewBomPage.bom
	 * @description The current bom views
	 */
	page.bom.views = {
		defaultView: {
			columns: {
				editIndicator: 0,
				checkbox: 1,
				itemNumber: 2,
				descriptor: 3,
				revision: 4,
				pinning: 5,
				attachments: 6,
				changeOrder: 7,
				lifecycle: 8,
				quantity: 9
			},
			index: 0,
			numColumns: 17,
			isInViewTest: function () {
				expect(page.bom.table.headerCells.getCount(), 'In default view').to.eventually.equal(this.numColumns);
			}
		},
		secondaryView: {
			columns: {
				editIndicator: 0,
				checkbox: 1,
				itemNumber: 2,
				number: 3,
				revision: 4,
				pinning: 5,
				releaseDate: 6,
				effectivity: 7,
				attachments: 8,
				lifecycle: 9,
				quantity: 10
			},
			index: 1,
			numColumns: 18,
			isInViewTest: function () {
				// Protractor doesn't seem to count past 17 columns on certain machines (notably CI),
				//	so we can't check the count of columns
				// Instead, we check that a column unique to EXPORT view exists
				expect(page.bom.table.headerCells
						.getCell(this.columns.number)
						.element(by.css('.ui-grid-header-cell-label'))
						.getText(), 'In secondary view').to.eventually.equal('NUMBER');
			}
		}
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.header
	 * @propertyOf ViewTestsPage.ViewBomPage.bom
	 * @description The header of the bom
	 */
	page.bom.header = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.header.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.header
	 * @description The locator for the header of the bom
	 */
	page.bom.header.locator = element(by.css('.bom-wrapper .bom-config-header'));

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.header.click
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.header
	 * @description Click the header of the Bom
	 *	Userful because it should be a noop, and cancel any other click actions that are occuring
	 *	e.g. editing cells
	 */
	page.bom.header.click = clickElement;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.header.getViewTitle
	 * @methodOf ViewTestsPage.ViewBomPage.bom.header
	 * @description Gets the displayed title of the currently selected view
	 *
	 * @returns {Object} a promise that resolves to the displayed title of the current view
	 */
	page.bom.header.getViewTitle = function () {
		return this.locator.element(by.css('.bom-config-header-text > strong:nth-child(1)')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.header.getEffectivityDate
	 * @methodOf ViewTestsPage.ViewBomPage.bom.header
	 * @description Gets the displayed date for the current effectivity date
	 *
	 * @returns {Object} a promise that resolves to the displayed date for the current effectivity date
	 */
	page.bom.header.getEffectivityDate = function () {
		return this.locator.element(by.css('.bom-config-header-text > strong:nth-child(2)')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.header.getBias
	 * @methodOf ViewTestsPage.ViewBomPage.bom.header
	 * @description Gets the displayed name of the currently selected bias
	 *
	 * @returns {Object} a promise that resolves to the displayed name for the currently selected bias
	 */
	page.bom.header.getBias = function () {
		return this.locator.element(by.css('.bom-config-header-text > strong:nth-child(3)')).getText();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table
	 * @methodOf ViewTestsPage.ViewBomPage.bom
	 * @description The container for the bom table (Does not include the header, but does include the column titles)
	 */
	page.bom.table = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.locator
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table
	 * @description The locator for the container for the bom table
	 */
	page.bom.table.locator = element(by.css('.bom-wrapper .ui-grid-render-container-body'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.isDisplayed
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table
	 * @description Checks if the bom table is displayed
	 */
	page.bom.table.isDisplayed = isElementDisplayed;

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.headerCells
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.table
	 * @description The header cells of the bom table
	 */
	page.bom.table.headerCells = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.headerCells.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.table.headerCells
	 * @description The locator for the header cells of the bom table
	 */
	page.bom.table.headerCells.locator = page.bom.table.locator.element(by.css('.ui-grid-header-cell-row')).all(by.repeater('col in colContainer.renderedColumns track by col.uid'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.headerCells.getCount
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table.headerCells
	 * @description Counts the number of columns in the bom
	 */
	page.bom.table.headerCells.getCount = getElementCount;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.headerCells.getCell
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table.headerCells
	 * @description Returns the locator for the header cell
	 */
	page.bom.table.headerCells.getCell = function (index) {
		return this.locator.get(index);
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.columnResizersr
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.table
	 * @description The resizers for each column of the BOM
	 */
	page.bom.table.columnResizers = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.columnResizersr.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.table.columnResizersr
	 * @description The locator for the resizers for each column of the BOM
	 */
	page.bom.table.columnResizers.locator = page.bom.table.locator.all(by.css('.ui-grid-column-resizer'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.getColumnWidth
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table
	 * @description Returns the width of the selected column
	 */
	page.bom.table.getColumnWidth = function (col) {
		return this.headerCells.locator.get(col).getCssValue('width');
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#contains
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description checks if the item exists in the list
	 */
	page.contains = function (list, item, delimeter) {
		return list.split(delimeter).indexOf(item) !== -1;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewTestsPage#getLeaveButton
	 * @propertyOf ViewTestsPage.ViewBomPage
	 * @description gives us the leave button of the nav guard modal.
	 *
	 * @returns {Object} A promise that resolves when the elements are found.
	 */
	page.getLeaveButton = function () {
		return element(by.css('.nav-guard-dialog')).all(by.tagName('button')).get(0);
	};

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#Cell
	 * @description A Class encapsulating a cell of the Bom table
	 */
	function Cell(locator) {
		var cell = this;

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#Cell.locator
		 * @propertyOf ViewTestsPage.ViewBomPage.Cell
		 * @description The locator for the cell
		 */
		cell.locator = locator;

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.isALink
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description Checks if the cell contents are a link to somewhere
		 *
		 * @returns {Object} a promise that resolves to true if the cell is a link, and false otherwise
		 */
		cell.isALink = function () {
			return this.locator.element(by.css('a[href]')).isPresent();
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.clickLink
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description Clicks the cell to follow the link (Assumes that this.isALink is true)
		 *
		 * @returns {Object} a promise that resolves when the click has finished
		 */
		cell.clickLink = function () {
			browser.actions().mouseMove(this.locator);
			return this.locator.element(by.css('a[href]')).click();
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.hasClass
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description checks to see if the cell element has a particular css classs
		 *
		 * @returns {Object} true or false depending on whether or not the class is applied on the element
		 */
		cell.hasClass = function (className) {
			return this.locator.getAttribute('class').then(function (classes) {
				return page.contains(classes, className, ' ');
			});
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.attemptToEnterEditMode
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description Attempts to turn the cell into edit state (will succeed when page is in edit mode)
		 *
		 * @returns {Object} a promise that resolves when the attempt has finished
		 *		Note - this does not return the success of the attempt. Use Cell.isInEditMode instead
		 */
		cell.attemptToEnterEditMode = function () {
			return this.locator.element(by.css('field-selector')).click();
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.isInEditMode
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description Determines if the cell is in edit mode
		 *
		 * @returns {Object} a promise that resolves to true if the cell is in edit mode
		 *	Note: this only detects if the cell has an editable element in it
		 *	This may not be all encompassing
		 */
		cell.isInEditMode = function () {
			return this.locator.all(by.css('input, select, textarea, md-button, button')).count().then(function (count) {
				return count !== 0;
			});
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.isDirty
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description checks whether or not a cell is in dirty state
		 *
		 * @returns {Object} a promise that resolves to true when if the cell is in dirty state
		 */
		cell.isDirty = function () {
			return this.locator.element(by.css('cell-state-indicator')).getAttribute('is-dirty');
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Cell.isInvalid
		 * @methodOf ViewTestsPage.ViewBomPage.Cell
		 * @description checks whether or not a cell is in invalid state
		 *
		 * @returns {Object} a promise that resolves to true when if the cell is in invalid state
		 */
		cell.isInvalid = function () {
			return this.locator.element(by.css('cell-state-indicator div')).getAttribute('class').then(function (classList) {
				return page.contains(classList, 'invalid', ' ');
			});
		};
	}

	/**
	 * @ngdoc function
	 * @name ViewTestsPage.ViewBomPage#Row
	 * @description A Class encapsulating a row of the Bom table
	 */
	function Row(locator) {
		var row = this;

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#Row.locator
		 * @propertyOf ViewTestsPage.ViewBomPage.Row
		 * @description The locator for the row
		 */
		row.locator = locator;

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#Row.cells
		 * @propertyOf ViewTestsPage.ViewBomPage.Row
		 * @description The `private` cells of the row, Should not be accessed from outside
		 */
		row.cells = {};

		/**
		 * @ngdoc property
		 * @name ViewTestsPage.ViewBomPage#Row.cells.locator
		 * @propertyOf ViewTestsPage.ViewBomPage.Row.cells
		 * @description The `private` locator for the cells of the row
		 */
		row.cells.locator = row.locator.all(by.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'));

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.cells.getCellLocator
		 * @methodOf ViewTestsPage.ViewBomPage.Row.cells
		 * @description Gets the locator for the cell of the row in the specified column
		 *
		 * @returns {Object} The locator for the cell of the row in the specified column
		 */
		row.cells.getCellLocator = function (col) {
			return this.locator.get(col);
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.getCell
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description Gets a Cell for the cell of the row in the specified column
		 *
		 * @returns {Object} a instance of Cell targeting the cell of the row in the specified column
		 */
		row.getCell = function (col) {
			return new Cell(this.cells.getCellLocator(col));
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.getRowExpander
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description Get a locator for the row expander of this row, which may or may not be present
		 *
		 * @returns {Object} a locator for the row expander in the first column
		 */
		row.getRowExpander = function () {
			return this.cells.getCellLocator(page.bom.views.defaultView.columns.itemNumber).element(by.css('.bom-row-expander a'));
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.getAttachedItemIcon
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description Get a locator for the attached items icon
		 *
		 * @returns {Object} a locator for attached items in the first row
		 */
		row.getAttachedItemIcon = function () {
			return this.cells.getCellLocator(page.bom.views.defaultView.columns.attachments).element(by.css('.anchor-button'));
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.isExpandable
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description Determine if the row is expandable
		 *
		 * @returns {Object} a promise that resolves to true if the row has a expander
		 */
		row.isExpandable = function () {
			return this.getRowExpander().isPresent();
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.toggleExpansion
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description Clicks the row expander for the row to expands the row's children if they are collapsed, and vice versa
		 *	Assumes that this.isExpandable is true
		 *
		 * @returns {Object} a promise that resolves when the click on the row expander has finished
		 */
		row.toggleExpansion = function () {
			return this.getRowExpander().click();
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.isDirty
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description checks whether or not a Row is in dirty state
		 *
		 * @returns {Object} a promise that resolves to true when if the Row is in dirty state
		 */
		row.isDirty = function () {
			return this.locator.element(by.css('row-state-indicator div')).getAttribute('class').then(function (classList) {
				return page.contains(classList, 'dirty', ' ');
			});
		};

		/**
		 * @ngdoc method
		 * @name ViewTestsPage.ViewBomPage#Row.isInvalid
		 * @methodOf ViewTestsPage.ViewBomPage.Row
		 * @description checks whether or not a Row is in invalid state
		 *
		 * @returns {Object} a promise that resolves to true when if the Row is in invalid state
		 */
		row.isInvalid = function () {
			return this.locator.element(by.css('row-state-indicator div')).getAttribute('class').then(function (classList) {
				return page.contains(classList, 'invalid', ' ');
			});
		};
	}
	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.rows
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.table
	 * @description The rows of the bom table (not including the column header cells)
	 */
	page.bom.table.rows = {};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewBomPage#bom.table.rows.locator
	 * @propertyOf ViewTestsPage.ViewBomPage.bom.table.rows
	 * @description The locator for the rows of the bom table
	 */
	page.bom.table.rows.locator = page.bom.table.locator.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.rows.getCount
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table.rows
	 * @description Counts the number of rows in the table
	 *
	 * @returns A promise resolving to the number of rows in the table
	 */
	page.bom.table.rows.getCount = getElementCount;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.rows.getRow
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table.rows
	 * @description Gets a Row object for the row at the specified index
	 *
	 * @returns {Object} An instance of Row corresponding to the row at the specified index
	 */
	page.bom.table.rows.getRow = function (rowIndex) {
		var rowLocator = this.locator.get(rowIndex);
		return new Row(rowLocator);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#bom.table.rows.getCell
	 * @methodOf ViewTestsPage.ViewBomPage.bom.table.rows
	 * @description Utility function to get a specific cell from the table
	 *
	 * @returns {Object} An instance of Cell corresponding to the cell at the specified column and row
	 */
	page.bom.table.rows.getCell = function (row, col) {
		return this.getRow(row).getCell(col);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewBomPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events (necessary for Bom page) are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false'
	 * depending on the state of the event listeners.
	 */
	page.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var itemInstanceDeferred = $q.defer();
			var itemInstanceListener = eventService.listen('itemInstance:*:done', function () {
				eventService.unlisten(itemInstanceListener);
				itemInstanceDeferred.resolve();
			});
			promises.push(itemInstanceDeferred.promise);

			var currentUserDeferred = $q.defer();
			var currentUserListener = eventService.listen('currentUser:*:done', function () {
				eventService.unlisten(currentUserListener);
				currentUserDeferred.resolve();
			});
			promises.push(currentUserDeferred.promise);

			var permissionsDeferred = $q.defer();
			var permissionsListener = eventService.listen('userPermissions:*:done', function () {
				eventService.unlisten(permissionsListener);
				permissionsDeferred.resolve();
			});
			promises.push(permissionsDeferred.promise);

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewBomPage#waitForItemUpdate
	 * @methodOf ViewTestsPage.ViewBomPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events (necessary for update target) are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false'
	 * depending on the state of the event listeners.
	 */
	page.waitForItemUpdate = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var itemInstanceDeferred = $q.defer();
			var itemInstanceListener = eventService.listen('itemInstance:*:done', function () {
				eventService.unlisten(itemInstanceListener);
				itemInstanceDeferred.resolve();
			});
			promises.push(itemInstanceDeferred.promise);

			var itemRevisionDeferred = $q.defer();
			var itemRevisionListener = eventService.listen('itemRevisions:*:done', function () {
				eventService.unlisten(itemRevisionListener);
				itemRevisionDeferred.resolve();
			});
			promises.push(itemRevisionDeferred.promise);

			var bomNestedDeferred = $q.defer();
			var bomNestedListener = eventService.listen('bomNestedItem:*:done', function () {
				eventService.unlisten(bomNestedListener);
				bomNestedDeferred.resolve();
			});
			promises.push(bomNestedDeferred.promise);

			return $q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ViewBomPage, AbstractItemViewPage);

module.exports = ViewBomPage;
