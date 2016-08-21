/**
 * @ngdoc object
 * @name ViewTestsComponents.ItemHeader
 *
 * @description This component corresponds to the item header template.
 *
 * ##Dependencies
 *
 */
function ItemHeader() {

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemIcon
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for item icon.
	 */
	var itemIcon = by.css('#itemnav .item-title-icon');

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemDescriptor
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for item descriptor.
	 */
	var itemDescriptor = element(by.css('#itemviewer-plm-header header .title-wrapper h1 span'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemRevision
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for item revision.
	 */
	var itemRevision = element(by.binding('itemViewerCtrl.selectedRevision.label'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#headerBtns
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for item header buttons.
	 */
	var headerBtns = by.css('#itemnav #header-buttons .btn');

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#actionsDropdown
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for the options in the actions dropdown.
	 */
	var actionsDropdown = element.all(by.css('.menu-buttons .dropdown-widget-wrapper li'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#specialMsg
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for the special messages after item name, e.g. archived and rev.
	 */
	var specialMsg = element(by.css('#itemnav .item-title-specialmessages-wrapper'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#closeButton
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for the close button.
	 */
	var closeButton = element(by.css('#itemnav #closeButton'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemHeaderInfoRow
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for Item Header info row.
	 */
	var itemHeaderInfoRow = element(by.css('#itemviewer-item-header'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemHeaderWorkflowStatus
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for workflow status in the Item Header info row.
	 */
	var itemHeaderWorkflowStatus = element(by.css('#itemviewer-item-header .item-header-icons .__workflowStatus'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemHeaderWorkflowLock
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for workflow lock in the Item Header info row.
	 */
	var itemHeaderWorkflowLock = element(by.css('#itemviewer-item-header .item-header-icons .__workflowLock'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemHeaderEffectivityDate
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for effectivity date in the Item Header info row.
	 */
	var itemHeaderEffectivityDate = element(by.css('#itemviewer-item-header .item-header-icons .__effectivityDate'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemHeaderArchivedStatus
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for effectivity date in the Item Header info row.
	 */
	var itemHeaderArchivedStatus = element(by.css('#itemviewer-item-header .item-header-icons .__archivedStatus'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#itemWrapper
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for the item wrapper, container for item data.
	 */
	var itemWrapper = element(by.css('#itemnav #item-wrapper'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#changeToFullViewButton
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for the changeToFullViewButton button.
	 */
	var changeToFullViewButton = element(by.css('#itemnav #changeToFullViewButton'));

	/**
	 * @ngdoc property
	 * @name ViewTestsComponents.ItemHeader#changeToSplitViewButton
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description `private` WebElement for the changeToSplitViewButton button.
	 */
	var changeToSplitViewButton = element(by.css('#itemnav #changeToSplitViewButton'));

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getHeaderBtn
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets a button from the header buttons.
	 *
	 * @param {Number} index The index of the button.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getHeaderBtn = function (index) {
		return element.all(headerBtns).get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#isHeaderBtnsDisplayed
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets whether all the header buttons are displayed.
	 *
	 * @param {Number} count The total number of buttons.
	 *
	 * @returns {Object} A promise that resolves when the element is found and its display value is retrieved.
	 */
	this.isHeaderBtnsDisplayed = function (count) {
		var promises = [];
		var elements = element.all(headerBtns);
		for (var i = 0; i < count; i++) {
			promises.push(elements.get(i).isDisplayed());
		}
		return protractor.promise.all(promises);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#isItemHeaderDisplayed
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets whether the item header (icon and name) is displayed.
	 *
	 * @returns {Object} A promise that resolves when the elements are found and their display values are retrieved.
	 */
	this.isItemHeaderDisplayed = function () {
		var deferred = protractor.promise.defer();
		var timer = (new Date()).getTime();
		var displayLoop = function () {
			if ((new Date()).getTime() - timer > 60000) {
				expect(false).to.equal(true);
				return;
			}
			element(itemIcon).then(function (element) {
				element.isDisplayed().then(function () {
					deferred.fulfill();
					expect(true).to.equal(true);
				}, function () {
					displayLoop();
				});
			}, function () {
				displayLoop();
			});
		};
		displayLoop();
		return protractor.promise.all([
			deferred.promise,
			itemDescriptor.isDisplayed()
		]);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getItemDescriptor
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets the item name.
	 *
	 * @returns {Object} A promise that resolves when the element is found and its text is retrieved.
	 */
	this.getItemDescriptor = function () {
		return itemDescriptor.getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getItemRevision
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets the item revision.
	 *
	 * @returns {Object} A promise that resolves when the element is found and its text is retrieved.
	 */
	this.getItemRevision = function () {
		return itemRevision.getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getDropdownOption
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets an option in the actions dropdown.
	 *
	 * @params {String} option The option to get
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getDropdownOption = function (option) {
		return actionsDropdown.all(by.css('button[aria-label="' + option + '"]')).get(0);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#isActionsDropdownDisplayed
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets whether the actions dropdown is displayed.
	 *
	 * @returns {Object} A promise that resolves when the element is found and its display value is retrieved.
	 */
	this.isActionsDropdownDisplayed = function () {
		return actionsDropdown.first().isDisplayed();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getSpecialMessages
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets the special messages wrapper.
	 *
	 * @returns {Object} A promise that resolves when the element is found and its text value is retrieved.
	 */
	this.getSpecialMessages = function () {
		return specialMsg.getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeader#getWorkflowStatus
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Gets the workflow status
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getWorkflowStatus = function () {
		return itemHeaderWorkflowStatus;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeader#getWorkflowLock
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Gets the workflow lock.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getWorkflowLock = function () {
		return itemHeaderWorkflowLock;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeader#getEffectivityDate
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Gets the effectivity date.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getEffectivityDate = function () {
		return itemHeaderEffectivityDate;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ItemHeader#getArchivedStatus
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Gets the archived status.
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getArchivedStatus = function () {
		return itemHeaderArchivedStatus;
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeader#getActionsDropDownButton
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Action dropdown coming on top right of the application
	 *
	 * @returns {Object} A promise that resolves when the element is found.
	 */
	this.getActionsDropDownButton = function () {
		return element(by.css('#itemviewer-menu-dropdown-button'));
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeader#clickActionsDropDownButton
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Click the action dropdown
	 *
	 * @returns {Object} A promise.
	 */
	this.clickActionsDropDownButton = function () {
		return this.getActionsDropDownButton().click();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeader#clickCloseButton
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Clicks on the close button.
	 *
	 * @returns {Promise} A promise that resolves when the click has finished.
	 */
	this.clickCloseButton = function () {
		return closeButton.click();
	};

	 /**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeader#isCloseButtonPresent
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Clicks on the close button.
	 *
	 * @returns {Promise} A promise that resolves when the search for the close button end.
	 */
	this.isCloseButtonPresent = function () {
		return closeButton.isPresent();
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeader#isItemFullView
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Check if the item viewer is full mode .
	 *
	 * @returns {Promise} A promise that resolves when the search for the close button end.
	 */
	this.isItemFullView = function () {
		return browser.driver.getCurrentUrl().then(function (url) {
			return url.indexOf('view=full') > 0;
		});
	};

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ItemHeader#isItemViewerClose
	 * @propertyOf ViewTestsPage.ItemHeader
	 * @description Clicks on the close button.
	 *
	 * @returns {Promise} A promise that resolves when the itemViewer is no present on the page.
	 */
	this.isItemViewerClose = function (success) {
		return itemWrapper.isPresent().then(function (isPresent) {
		   return !isPresent;
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getItemHeaderInfoRow
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Gets the item header info row.
	 *
	 * @returns {Element} An element for the Item header md toolbar
	 */
	this.getItemHeaderInfoRow = function () {
		return itemHeaderInfoRow;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#isChangeToFullViewButtonPresent
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Checks if the changeToFullView Button is present or not.
	 *
	 * @returns {Promise} A promise that when it is resolved, returns true if the changeToFullView Button is present
	 */
	this.isChangeToFullViewButtonPresent = function () {
		return changeToFullViewButton.isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#isChangeToSplitlViewButtonPresent
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Checks if the changeToSplitView Button is present or not.
	 *
	 * @returns {Promise} A promise that when it is resolved, returns true if the changeToSplitView Button is present
	 */
	this.isChangeToSplitViewButtonPresent = function () {
		return changeToSplitViewButton.isPresent();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#clickChangeToSplitViewButton
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Click on the changeToSplitView Button.
	 *
	 * @returns {Promise} A promise that it is resolved when the button was clicked
	 */
	this.clickChangeToSplitViewButton = function () {
		return changeToSplitViewButton.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#clickChangeToFullViewButton
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Click on the changeToFullView Button.
	 *
	 * @returns {Promise} A promise that it is resolved when the button was clicked
	 */
	this.clickChangeToFullViewButton = function () {
		return changeToFullViewButton.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getRevisionsDropdownButton
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Get Revisions Dropdown Button.
	 *
	 * @returns {Promise} A promise that it is resolved when the button was found
	 */
	this.getRevisionsDropdownButton = function () {
		return element(by.css('#itemnav #itemviewer-revisions-dropdown-button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#getRevisionsDropdown
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Get Revisions Dropdown element.
	 *
	 * @returns {Promise} A promise that it is resolved when the dropdown was found
	 */
	this.getRevisionsDropdown = function () {
		return element(by.css('#itemviewer-revision-dropdown .dropdown-widget-wrapper'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsComponents.ItemHeader#selectRevision
	 * @propertyOf ViewTestsComponents.ItemHeader
	 * @description Select a revision from Revisions Dropdown.
	 *
	 * @params {Number} index The index number of the option in the dropdown
	 *
	 * @returns {Promise} A promise that it is resolved when the option is clicked
	 */
	this.selectRevision = function (index) {
		return this.getRevisionsDropdown().all(by.css('li')).get(index).click();
	};
}

module.exports = new ItemHeader();
