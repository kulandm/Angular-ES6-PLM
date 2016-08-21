/**
 * @ngdoc object
 * @name ViewTestsComponents.CreateItem
 *
 * @description This component corresponds to the create item function.
 *
 * ##Dependencies
 *
 */
var itemHeaderPage = require('./ItemHeader');

function CreateItem() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CreateItem#createBtn
	 * @propertyOf ViewTestsComponents.CreateItem
	 * @description `private` WebElement for create item button.
	 */
	var createBtn = by.css('.dropdown-widget .create-item-button');

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CreateItem#createDialog
	 * @propertyOf ViewTestsComponents.CreateItem
	 * @description `private` WebElement for create item dialog.
	 */
	var createDialog = element(by.css('.create-item-dialog'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.CreateItem#headingLocator
	 * @propertyOf ViewTestsComponents.CreateItem
	 * @description `private` Locator for heading of create dialog.
	 */
	var headingLocator = by.css('.create-item-dialog .create-item-header');

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isCreateBtnPresent
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets whether the create item button is present in the DOM.
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its present value is retrieved.
	 */
	this.isCreateBtnPresent = function () {
		return element(createBtn).isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isCreateBtnDisplayed
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets whether the create item button is displayed.
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its display value is retrieved.
	 */
	this.isCreateBtnDisplayed = function () {
		return browser.driver.wait(function () {
			return element(createBtn).isDisplayed();
		}, 30000);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isCreateBtnEnabled
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets whether the create item button is enabled.
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its enabled value is retrieved.
	 */
	this.isCreateBtnEnabled = function () {
		return element(createBtn).isEnabled();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#clickCreateBtn
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Clicks the button to trigger the create item flyout.
	 *
	 * @returns {Object} A promise that resolves when the click is completed.
	 */
	this.clickCreateBtn = function () {
		return element(createBtn).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isCreateDialogDisplayed
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets whether the create item flyout is displayed.
	 *
	 * @returns {Object} A promise that resolves when the element is found and
	 * its display value is retrieved.
	 */
	this.isCreateDialogDisplayed = function () {
		return createDialog.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isCreateDialogPresent
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets whether the create item flyout is present.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.isCreateDialogPresent = function () {
		return createDialog.isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getHeadingText
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets the text of the heading.
	 *
	 * @returns {Object} A promise for the text of the heading.
	 */
	this.getHeadingText = function () {
		return element(headingLocator).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#clickHeaderWorkspaceSelector
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Click workspace selector of create dialog header
	 *
	 * @returns {Object} A promise for the click on select workspace control.
	 */
	this.clickHeaderWorkspaceSelector = function () {
		return element(by.model('createItemDialogCtrl.selectedWorkspaceObj')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isWorkspaceSelectorDisplayed
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description The workspace selector of create dialog
	 *
	 * @returns {Object} A promise if the select workspace control is displayed
	 */
	this.isWorkspaceSelectorDisplayed = function () {
		return element(by.model('selectedWorkspace')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#clickWorkspaceSelector
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Click workspace selector of create dialog
	 *
	 * @returns {Object} A promise for the click on select workspace control.
	 */
	this.clickWorkspaceSelector = function () {
		return element(by.model('selectedWorkspace')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#selectHeaderWorkspace
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Clicks on a particular workspace from the selection list
	 * triggered from the dialog header
	 *
	 * @param {Number} index The index of the workspace to be selected.
	 *
	 * @returns {Object} A promise for the click on a particular workspace
	 * given by an index.
	 */
	this.selectHeaderWorkspace = function (index) {
		element(by.repeater('workspace in createItemDialogCtrl.workspacesList')
			.row(index || 0).column('workspace.getDisplayName()')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isSelectDropdownDisplayed
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description The workspace selection list
	 *
	 * @returns {Object} A promise when the dropdown is displayed
	 */
	this.isSelectDropdownDisplayed = function (index) {
		return element(by
			.repeater('workspace in createItemCtrl.workspacesList'))
			.isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#selectWorkspace
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Clicks on a particular workspace from the selection list
	 *
	 * @param {Number} index The index of the workspace to be selected.
	 *
	 * @returns {Object} A promise for the click on a particular workspace
	 * given by an index.
	 */
	this.selectWorkspace = function (index) {
		element(by.repeater('workspace in createItemCtrl.workspacesList')
			.row(index || 0).column('workspace.getDisplayName()')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#isDidYouKnowDisplayed
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description The workspace selection list
	 *
	 * @returns {Object} A promise when the dropdown is displayed
	 */
	this.isDidYouKnowDisplayed = function (index) {
		return element(by.css('.workspace-did-you-know')).isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getSectionCaret
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets the first section caret which is used to collapse and
	 * expand the section
	 *
	 * @returns {ElementFinder} The caret element
	 */
	this.getSectionCaret = function () {
		return createDialog.all(by.css('.caret-flex')).first();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getSectionCaret
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gets the first field name in the first section
	 *
	 * @returns {ElementFinder} The text of the first field element
	 */
	this.getFirstFieldText = function () {
		return createDialog.all(by.css('.section-content .create-item-field'))
			.first().getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getFormFields
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns the list of input fields
	 *
	 * @returns {ElementArrayFinder} An array of elements representing
	 * input fields of create dialog.
	 */
	this.getFormFields = function () {
		return element.all(by.css('.create-item-form input'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getFormInputFields
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns the list of visible input fields
	 *
	 * @returns {ElementArrayFinder} An array of elements representing
	 * input fields of create dialog.
	 */
	this.getFormInputFields = function () {
		return element.all(by.css('.create-item-form .field-plain-text input'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getFormRichTextFields
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns the list of textarea fields
	 *
	 * @returns {ElementArrayFinder} An array of elements representing
	 * textarea fields of create dialog.
	 */
	this.getFormRichTextFields = function () {
		return element.all(by.css('.create-item-form .ta-editor div.ta-bind'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getManageItemLabels
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns the list of labels fields in the manage item view
	 *
	 * @returns {ElementArrayFinder} An array of elements representing
	 * label fields of manage item view.
	 */
	this.getManageItemLabels = function () {
		return element.all(by.css('.managed-item-form label'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getManageForm
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns the manage item section in the dialog
	 *
	 * @returns {ElementFinder} The manage item element.
	 */
	this.getManageForm = function () {
		return element(by.css('.managed-item-form'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getFooterButton
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns a footer button element
	 *
	 * @param {Number} index The index of button on the footer
	 *
	 * @returns {ElementFinder} A footer button element
	 */
	this.getFooterButton = function (index) {
		return element.all(by.css('.create-item-footer .md-button')).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getSaveOptionsElement
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns an element which contains the save options
	 *
	 * @returns {ElementFinder} Returns an element which contains the save options
	 */
	this.getSaveOptionsElement = function () {
		return element.all(by.css('.create-item-footer .save-options'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#clickSaveOptionsElement
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Performs a mouse move and clicks the md-select.
	 * We need this mouse move because md-select element is behind another
	 * button and protractor can't click it.
	 */
	this.clickSaveOptionsElement = function () {
		var selectIcon = element(by.css('.create-item-footer .md-select-icon'));

		browser.actions()
			.mouseMove(selectIcon)
			.click()
			.perform();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getSaveButton
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns a save element
	 *
	 * @returns {ElementFinder} A save element
	 */
	this.getSaveButton = function () {
		return element(by.css('.create-item-dialog .save-create'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#saveAndCloseButton
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of save and close button
	 *
	 * @return {Object} Save and close button element
	 */
	this.saveAndCloseButton = function () {
		return element(by.css('md-option[value="Save & Close"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#saveAndViewButton
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of save and view button
	 *
	 * @return {Object} Save and view button element
	 */
	this.saveAndViewButton = function () {
		return element(by.css('md-option[value="Save & View"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getNotificationContainer
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns a notification container element
	 *
	 * @returns {ElementFinder} A notification container element
	 */
	this.getNotificationContainer = function () {
		return element(by.css('#notifications'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getNotification
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Returns a notification element
	 *
	 * @returns {ElementFinder} A notification element
	 */
	this.getNotification = function () {
		return element(by.css('#notifications .notification'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#closeDialog
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Clicks on the dialog backdrop to close the dialog
	 *
	 * @returns {Object} A promise for the click on the dialog backdrop.
	 */
	this.closeDialog = function () {
		return element(by.css('.md-dialog-container')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#manageItemLabelCount
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the count of the labels elements in the manage item view as a promise
	 *
	 */
	this.manageItemLabelCount = function () {
		return element.all(by.css('.manage-item input')).count();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#manageViewItemDescriptor
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of item descriptor
	 *
	 */
	this.manageViewItemDescriptor = function () {
		return element.all(by.css('.managed-item-form .item-descriptor-fields .managed-item-field')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#manageViewLifecycleTransition
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of Lifecycle Transition
	 *
	 */
	this.manageViewLifecycleTransition = function () {
		return element.all(by.css('.managed-item-form .lifecycle-fields .managed-item-field')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#manageViewEffectivity
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of Effectivity
	 *
	 */
	this.manageViewEffectivity = function () {
		return element.all(by.css('.managed-item-form .effectivity-fields .managed-item-field')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#manageViewFrom
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of From
	 *
	 */
	this.manageViewFrom = function () {
		return element.all(by.css('.managed-item-form .from-fields .managed-item-field')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#manageViewTo
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Gives the element of To
	 *
	 * @return {Object} managed item 'To' field.
	 */
	this.manageViewTo = function () {
		return element.all(by.css('.managed-item-form .to-fields .managed-item-field')).get(1);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getManagedViewCustomFields
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Get the list of custom fields on managed view of create item dialog.
	 *
	 * @return {Array} custom fields
	 */
	this.getManagedViewCustomFields = function () {
		return element.all(by.css('.managed-item-form .managed-item-field.custom-fields'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getManagedViewLifecycleDropDownField
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Get the lifecycle drop down field element of managed item view.
	 *
	 * @return {Object} lifecycle drop down element
	 */
	this.getManagedViewLifecycleDropDownField = function () {
		return element(by.css('.managed-item-form .lifecycle-fields .search'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getManagedViewLifecycleDropDownMenu
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Get the lifecycle drop down menu element of managed item view.
	 *
	 * @return {Object} lifecycle drop down menu element
	 */
	this.getManagedViewLifecycleDropDownMenu = function () {
		return this.getManagedViewLifecycleDropDownField().element(by.css('.menu'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#getManagedViewLifecycleDropDownMenuItems
	 * @methodOf ViewTestsComponents.CreateItem
	 * @description Get the lifecycle drop down menu items of managed item view.
	 *
	 * @return {Array} lifecycle drop down menu items
	 */
	this.getManagedViewLifecycleDropDownMenuItems = function () {
		return this.getManagedViewLifecycleDropDownMenu().all(by.repeater('field in fieldData.options.items'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#quickCreateECO
	 * @propertyOf ViewTestsComponents.CreateItem
	 * @description Open quick Create ECO page of the Item and create new
	 * Change Order
	 *
	 * @param {String} titleText Text for title field
	 * @param {String} descriptionText Text for description field
	 * @param {String} descriptionOfChangeText Text for description of change field
	 * @param {String} reasonDescriptionText Text for reason description field
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its enabled value is retrieved.
	 */
	this.quickCreateECO = function (titleText, descriptionText, descriptionOfChangeText, reasonDescriptionText) {
		itemHeaderPage.clickActionsDropDownButton();
		this.clickCreateBtn();
		this.clickWorkspaceSelector();
		this.selectWorkspace(1);

		var title = this.getFormInputFields().get(0);
		var description = this.getFormRichTextFields().get(0);
		var descriptionOfChange = this.getFormRichTextFields().get(1);
		var reasonDescription = this.getFormRichTextFields().get(2);

		title.sendKeys(titleText);
		description.sendKeys(descriptionText);
		descriptionOfChange.sendKeys(descriptionOfChangeText);
		reasonDescription.sendKeys(reasonDescriptionText);

		return browser.wait(function () {
			return element(by.css('.create-item-save')).isEnabled();
		}, 5000, 'wait for save&manage button failed');
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.CreateItem#quickCreateECONoPassword
	 * @propertyOf ViewTestsComponents.CreateItem
	 * @description Open quick Create ECO page of the Item and create new
	 * AQ Change Order no password
	 *
	 * @param {String} titleText Text for title field
	 * @param {String} descriptionText Text for description field
	 * @param {String} descriptionOfChangeText Text for description of change field
	 * @param {String} reasonDescriptionText Text for reason description field
	 *
	 * @returns {Object} A promise that resolves when element is found and
	 * its enabled value is retrieved.
	 */
	this.quickCreateECONoPassword = function (titleText, descriptionText, descriptionOfChangeText, reasonDescriptionText) {
		itemHeaderPage.clickActionsDropDownButton();
		this.clickCreateBtn();
		this.clickWorkspaceSelector();
		this.selectWorkspace(0);

		var title = this.getFormInputFields().get(0);
		var description = this.getFormRichTextFields().get(0);
		var descriptionOfChange = this.getFormRichTextFields().get(1);
		var reasonDescription = this.getFormRichTextFields().get(2);

		title.sendKeys(titleText);
		description.sendKeys(descriptionText);
		descriptionOfChange.sendKeys(descriptionOfChangeText);
		reasonDescription.sendKeys(reasonDescriptionText);

		return browser.wait(function () {
			return element(by.css('.create-item-save')).isEnabled();
		}, 5000, 'wait for save&manage button failed');
	};
}

module.exports = new CreateItem();
