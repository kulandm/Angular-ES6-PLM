'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceItemDetailsEditViewSpec
 *
 * @description This is the view tests for the WorkspaceItemDetailsEditPage.
 *
 * ##Dependencies
 *
 */
var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var CreateItem = require('../components/CreateItem');
var picklistComponent = require('../components/PicklistField');
var ItemMenu = require('../components/ItemMenu');
var ItemHeader = require('../components/ItemHeader');
var workspaceItemDetailsEditPage = require('../pages/WorkspaceItemDetailsEditPage');
var Notification = require('../components/Notification');
var helper = require('../util/Helper');
var _ = require('underscore');

function WorkspaceItemDetailsEditViewSpec() {

	WorkspaceItemDetailsEditViewSpec.super_.call(this);

	describe('WorkspaceItemDetailsEditView', function () {
		this.timeout(60000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					workspaceItemDetailsEditPage.changeRoute(29, 2897);
					workspaceItemDetailsEditPage.go();
					return workspaceItemDetailsEditPage.waitForEvents().then(function (result) {
						 expect(result).to.be.true;
					});
				});
			});
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		// Skipping this for now until we figure something out.
		// Changing of tab is currently not working on Jenkins.
		describe('[Edit mode not persisting]', function () {
			it('Should not stay in edit mode when changing tabs', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-doNotPersistEditMode';

				// Force going to the edit mode of the item details
				workspaceItemDetailsEditPage.changeRoute(29, 2897);
				workspaceItemDetailsEditPage.go();

				// Go to change log tab
				browser.wait(ItemMenu.getItemMenuTabs().isDisplayed);
				ItemMenu.getItemMenuTabs().get(3).element(by.css('a')).click();

				browser.getCurrentUrl().then(function (url) {
					expect(url.indexOf('mode=edit')).to.equal(-1);
				});
			});
		});

		describe('[Date field - Datepicker]', function () {

			var datePicker, datePickerInput, datePickerXClear;

			before(function () {
				workspaceItemDetailsEditPage.changeRoute(29, 2897);
				workspaceItemDetailsEditPage.go();
				browser.wait(element(by.css('.itemdetails-table')).isDisplayed);

				var datePickers = element.all(by.css('.datepicker'));
				datePicker = datePickers.get(0);
				datePickerInput = datePicker.element(by.tagName('input'));
				datePickerXClear = datePicker.element(by.css('.x-clear'));
			});

			after(function () {
				datePicker = null;
				datePickerInput = null;
				datePickerXClear = null;
			});

			it('should have a datepicker component present and displayed', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePicker';

				expect(datePicker.isPresent()).to.eventually.be.true;
				expect(datePicker.isDisplayed()).to.eventually.be.true;
			});

			it('should have a value set', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerWithValueSet';

				expect(datePickerInput.getAttribute('value')).to.eventually.equal('04/19/2013');
			});

			it('should have the x-clear component present but not displayed', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerXClearNotDisplayed';

				expect(datePickerXClear.isPresent()).to.eventually.be.true;
				expect(datePickerXClear.isDisplayed()).to.eventually.be.false;
			});

			it('should show the X when the mouse is over the component', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerXOnHover';

				browser.actions().mouseMove(datePickerInput).perform();
				expect(datePickerXClear.isDisplayed()).to.eventually.be.true;
			});

			it('should clear the value when the X is clicked', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerClearValueOnClick';

				browser.actions().mouseMove(datePickerInput).perform();
				datePickerXClear.isDisplayed().then(function () {
					datePickerXClear.click().then(function () {
						expect(datePickerInput.getAttribute('value')).to.eventually.equal('');
					});
				});
			});

			it('should show placeholder text when value is cleared out', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerDisplayPlaceholder';

				expect(datePickerInput.getAttribute('placeholder')).to.eventually.equal('MM/dd/yyyy');
			});

			it('should be editable', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerEditable';

				expect(datePickerInput.isEnabled()).to.eventually.be.true;
			});

			it('should show mask when it gets focus', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerShowMask';

				datePickerInput.sendKeys('1');
				expect(datePickerInput.getAttribute('value')).to.eventually.equal('1_/__/____');
			});

			it('focus should not let user input non-numeric characters ', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerNonNumericChars';

				datePickerInput.sendKeys('a!2');
				expect(datePickerInput.getAttribute('value')).to.eventually.equal('12/__/____');
			});

			it('focus should not let user input numeric value ', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerNonNumericValue';

				datePickerInput.sendKeys('121000');
				expect(datePickerInput.getAttribute('value')).to.eventually.equal('12/12/1000');
			});

			describe('[Date value sent to server]', function () {
				it('Save should fail with the passed in date value of 12/12/1000', function () {
					this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayDatePickerFailSave';

					workspaceItemDetailsEditPage.getSaveBtn().click().then(function (result) {
						Notification.isNotificationPresent().then(function () {
							Notification.getNotificationText().then(function (text) {
								expect(text).to.contain('Failed to update');
							});
						});
					});

				});
			});
		});

		describe('[Validation] Required field', function () {
			before(function () {
				workspaceItemDetailsEditPage.changeRoute(47, 2948); // item with a required field
				workspaceItemDetailsEditPage.go();

				return workspaceItemDetailsEditPage.waitForEvents().then(function (result) {
					expect(result).to.be.true;
				});
			});

			it('required field has the "required" CSS class', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-displayRequiredField';

				expect(workspaceItemDetailsEditPage.getRequiredField(1).getAttribute('class')).to.eventually.contain('required');
			});
		});

		describe.skip('skipped tests - TODO: this must be revisited', function () {

			it('navigates to the workspace item details edit page', function () {
				this._runnable.ssName = 'landingOnWorkspaceItemDetailsEdit';

				// There should be 4 levels in the breadcrumbs: dashboard > workspaces > workspace > item
				expect(AppHeader.getBreadcrumbElementsCount()).to.eventually.equal(4);
				// App header should be displayed
				expect(AppHeader.isAppHeaderComponentsDisplayed()).to.eventually.be.true;
			});

			it('displays the save and cancel buttons in the edit state', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-editBtns';

				expect(ItemHeader.isHeaderBtnsDisplayed(3)).to.eventually.be.true;
				// The save button should use icon-Checkmark icon
				workspaceItemDetailsEditPage.getSaveBtn().then(function (saveBtn) {
					saveBtn.element(by.tagName('span')).getAttribute('class').then(function (classes) {
						expect(classes).to.contain('icon-Checkmark');
					});
				});
				// The cancel button should use icon-Delete icon
				workspaceItemDetailsEditPage.getCancelBtn().then(function (cancelBtn) {
					cancelBtn.element(by.tagName('span')).getAttribute('class').then(function (classes) {
						expect(classes).to.contain('icon-Delete');
					});
				});
			});

			it('displays the item menu with the item details tab', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-itemMenu';

				// Item menu should be displayed
				expect(ItemMenu.isItemMenuDisplayed()).to.eventually.be.true;

				// Get the tab names on the item menu
				ItemMenu.getItemMenuTabs().map(function (menu) {
					return menu.getText();
				}).then(function (tabNames) {
					expect(tabNames).to.contain('Item Details');
				});

				// Item details should use icon-Info icon
				ItemMenu.getItemMenuTabs().each(function (tab) {
					tab.getText().then(function (name) {
						if (name === 'Item Details') {
							tab.element(by.tagName('span')).getAttribute('class').then(function (classes) {
								expect(classes).to.contain('icon-Info');
							});
						}
					});
				});
			});

			it('has the correct number of collapsible sections', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-noOfSections';

				// Get the title of the first section
				workspaceItemDetailsEditPage.getSections().first().then(function (firstSection) {
					firstSection.getAttribute('header-title').then(function (heading) {
						// Get the number of sections mentioned on section heading
						var noOfSections = parseInt(heading.charAt(heading.length - 2));
						// For some case there will be owner and change summary section, so will be check for atleast the number of sections
						workspaceItemDetailsEditPage.getSections().count().then(function (count) {
							expect(count).to.be.at.least(noOfSections);
						});
					});
				});
			});

			it('has editable input fields', function () {
				this._runnable.ssName = 'WorkspaceItemDetailsEdit-inputFields';

				// TODO: Assumption that there is at least one editable field
				expect(workspaceItemDetailsEditPage.getInputCount()).to.eventually.be.at.least(1);
			});

			// Run shared tests
			// that.testItemHeader(workspaceItemDetailsEditPage, 'WorkspaceItemDetailsEdit', 'TEAM000006 - GT255 Quadro');
			// that.testComments(workspaceItemDetailsEditPage, 'WorkspaceItemDetailsEdit', 4);
		});

		describe('[Picklist with default values]', function () {
			before(function () {
				workspaceItemDetailsEditPage.changeRoute(50, 3666);
				workspaceItemDetailsEditPage.go();

				return workspaceItemDetailsEditPage.waitForEvents().then(function (result) {
					expect(result).to.be.true;
				});
			});

			it('Go to edit mode and check selected values for MultiSelect picklist', function () {
				this._runnable.ssName = 'editPageMultiSelectPicklistSelectedValues';
				var picklistTarget = '_api_v3_workspaces_50_views_1_fields_MULTI_SELECT_PL';

				var picklistValues = element(by.id(picklistTarget)).all(by.css('.label')).getText();

				picklistValues.then(value => {
					expect(value).to.contain('Emerging Countries');
					expect(value).to.contain('India');
				});
			});
		});

		describe('[Picklists with search filter]', function () {
			before(function () {
				workspaceItemDetailsEditPage.changeRoute(65, 3668);
				workspaceItemDetailsEditPage.go();

				return workspaceItemDetailsEditPage.waitForEvents().then(result => {
					expect(result).to.be.true;
				});
			});

			it('Check the existing value of picklists with search', function () {
				this._runnable.ssName = 'itemEditPagePlfCheckValues';
				var targetPlf1 = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS';
				var targetPlf2 = '_api_v3_workspaces_65_views_1_fields_PLWSF_NONWS';
				var targetPlf3 = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS_REVDEL';

				picklistComponent.getPicklistDropdownSelectedValue(targetPlf1).then(function (value) {
					expect(value[0]).to.contain('151-0002-000 - BRACKET [REV:A]');
				});

				picklistComponent.getPicklistDropdownSelectedValue(targetPlf2).then(function (value) {
					expect(value).to.contain('Rework');
				});

				picklistComponent.getPicklistDropdownSelectedValue(targetPlf3).then(function (value) {
					expect(value[0]).to.contain('402-0001-001 - SHOT PIN BLOCK [REV:w] [ARCHIVED]');
				});
			});

			it('Changes the values of the PLFs, checking for the presence of the # of results notification', function () {
				this._runnable.ssName = 'itemEditPagePlfChangeValues';
				var targetPlf1 = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS';
				var targetPlf2 = '_api_v3_workspaces_65_views_1_fields_PLWSF_NONWS';
				var targetPlf3 = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS_REVDEL';
				var targetInput1 = picklistComponent.getSearchInputField(targetPlf1);
				var targetInput2 = picklistComponent.getSearchInputField(targetPlf2);
				var targetInput3 = picklistComponent.getSearchInputField(targetPlf3);

				picklistComponent.getPicklistDropdown(targetPlf1).click();
				picklistComponent.fillInput(targetInput1, 'washer').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests

					picklistComponent.getResultsNotification().getText().then(function (text) {
						expect(text).to.contain('4');
					});

					picklistComponent.selectPicklistDropdownOption(targetPlf1, 3).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPlf1).then(function (value) {
						expect(value[0]).to.equal('156-0002-000 - Helical Spring Lock Washer ANSI/ASME B18.21.1 - 1/2 Hi-Collar. Carbon Steel [REV:A]');
					});
				});

				picklistComponent.getPicklistDropdown(targetPlf2).click();
				picklistComponent.fillInput(targetInput2, 'scrap').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests

					expect(picklistComponent.getResultsNotification().getText()).to.eventually.contain('1');

					picklistComponent.selectPicklistDropdownOption(targetPlf2, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPlf2).then(function (value) {
						expect(value[0]).to.equal('Scrap');
					});
				});

				picklistComponent.getPicklistDropdown(targetPlf3).click();
				picklistComponent.fillInput(targetInput3, 'shot').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests

					expect(picklistComponent.getResultsNotification().getText()).to.eventually.contain('5');

					picklistComponent.selectPicklistDropdownOption(targetPlf3, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPlf3).then(function (value) {
						expect(value[0]).to.equal('402-0001-001 - SHOT PIN BLOCK [REV:w] [ARCHIVED]');
					});
				});
			});

			it('Saves the new PLF values correctly', function () {
				this._runnable.ssName = 'itemEditPagePlfSave';

				workspaceItemDetailsEditPage.getSaveBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=view').then(result => {
						expect(result).to.be.truthy;
					});
					// Temporarily commenting out these checks until we can figure out why just in this instance the notification is flaky
					// expect(Notification.isNotificationPresent()).to.eventually.be.true;
					// expect(Notification.getNotificationText()).to.eventually.contain('Updated Successfully');
					// Notification.getCloseIcon().click();
				});

				expect(picklistComponent.getGenericPicklistByIndex(0).getText()).to.eventually.contain('156-0002-000 - Helical Spring Lock Washer ANSI/ASME B18.21.1 - 1/2 Hi-Collar. Carbon Steel [REV:A]');
				expect(picklistComponent.getGenericPicklistByIndex(1).getText()).to.eventually.contain('Scrap');
			});

			it('Enters edit mode, tests clearing values', function () {
				this._runnable.ssName = 'itemEditPagePlfClearValues';
				var targetPlf1 = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS';
				var targetPlf2 = '_api_v3_workspaces_65_views_1_fields_PLWSF_NONWS';

				workspaceItemDetailsEditPage.getEditBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=edit').then(result => {
						expect(result).to.be.truthy;
					});
				});

				picklistComponent.getPicklistDropdown(targetPlf1).click();
				picklistComponent.getClearButton(targetPlf1).click();
				picklistComponent.getPicklistDropdownSelectedValue(targetPlf1).then(function (value) {
					expect(value[0]).to.equal('Select');
				});

				picklistComponent.getPicklistDropdown(targetPlf2).click();
				picklistComponent.getClearButton(targetPlf2).click();
				picklistComponent.getPicklistDropdownSelectedValue(targetPlf2).then(function (value) {
					expect(value[0]).to.equal('Select');
				});
			});

			it('Saves the empty values correctly', function () {
				this._runnable.ssName = 'itemEditPagePlfClearValuesSave';

				workspaceItemDetailsEditPage.getSaveBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=view').then(result => {
						expect(result).to.be.truthy;
					});
				});

				expect(picklistComponent.getGenericPicklistByIndex(0).getText()).to.eventually.contain('');
				expect(picklistComponent.getGenericPicklistByIndex(1).getText()).to.eventually.contain('');
			});
		});

		describe('[Derived fields]', () => {
			var pivotLocator = '//generic-picklist-field[contains(@field-id, "66.1.PIVOT_PL")]';
			var derivedDescriptorLocator = '//single-line-field[contains(@field-id, "66.1.DERIVED_DESCRIPTOR")]';
			var derivedBomUomLocator = '//generic-picklist-field[contains(@field-id, "66.1.DERIVED_BOM_UOM")]';
			var derivedLinkingPickListLocator = '//generic-picklist-field[contains(@field-id, "66.1.DERIVED_LINKING_PICK_LIST")]';
			var derivedPickListLocator = '//generic-picklist-field[contains(@field-id, "66.1.DERIVED_PICK_LIST")]';
			var derivedRadioButtonLocator = '//radio-field[contains(@field-id, "66.1.DERIVED_RADIO_BUTTON")]';
			var derivedCreatedOnLocator = '//date-field[contains(@field-id, "66.1.DERIVED_CREATED_ON")]';
			var derivedCreatedByLocator = '//single-line-field[contains(@field-id, "66.1.DERIVED_CREATED_BY")]';

			var values = ['AQ Item for derived fields', 'AQ Item for derived fields', 'Cubic Centimeter', '011 - SEMICONDUCTORS AND ACTIVES - AMPLIFIERS, BUFFER -',
										'Accounting', '2 - At Risk', '07/14/2016', 'PLMAutoTest'];

			before(() => {
				workspaceItemDetailsEditPage.changeRoute(66, 3670);
				workspaceItemDetailsEditPage.go();

				return workspaceItemDetailsEditPage.waitForEvents().then(result => {
					expect(result).to.be.true;
				});
			});

			it('Enters edit mode, clear derived fields by unselecting the pivot', function () {
				this._runnable.ssName = 'itemEditPageDerivedFieldsClearValues';
				var pivotPL = '_api_v3_workspaces_66_views_1_fields_PIVOT_PL';

				picklistComponent.getPicklistDropdown(pivotPL).click();
				picklistComponent.getClearButton(pivotPL).click();
				picklistComponent.getPicklistDropdownSelectedValue(pivotPL).then(function (value) {
					expect(value[0]).to.equal('Select');
				});

				_.each([derivedDescriptorLocator, derivedBomUomLocator,
								derivedLinkingPickListLocator, derivedPickListLocator,
								derivedRadioButtonLocator, derivedCreatedOnLocator, derivedCreatedByLocator], locator => {
									expect(element(by.xpath(locator)).getText()).to.eventually.equal('');
								});
			});

			it('Saves the derived fields with empty values correctly', function () {
				this._runnable.ssName = 'itemEditPageDerivedFieldsClearValuesSave';

				workspaceItemDetailsEditPage.getSaveBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=view').then(result => {
						expect(result).to.be.truthy;
					});
				});

				_.each([pivotLocator, derivedDescriptorLocator, derivedBomUomLocator,
								derivedLinkingPickListLocator, derivedPickListLocator,
								derivedRadioButtonLocator, derivedCreatedOnLocator, derivedCreatedByLocator], locator => {
									expect(element(by.xpath(locator)).getText()).to.eventually.equal('');
								});
			});

			it('Enters edit mode, modify derived fields by selecting a value in the pivot', function () {
				this._runnable.ssName = 'itemEditPageDerivedFieldsChangeValues';

				workspaceItemDetailsEditPage.getEditBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=edit').then(result => {
						expect(result).to.be.truthy;
					});
				});

				var pivotPL = '_api_v3_workspaces_66_views_1_fields_PIVOT_PL';
				var inputPivotPL = picklistComponent.getSearchInputField(pivotPL);

				picklistComponent.getPicklistDropdown(pivotPL).click();
				picklistComponent.fillInput(inputPivotPL, 'AQ Item for derived fields').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests

					picklistComponent.selectPicklistDropdownOption(pivotPL, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(pivotPL).then(function (value) {
						expect(value[0]).to.equal('AQ Item for derived fields');
					});

					_.each([pivotLocator, derivedDescriptorLocator, derivedBomUomLocator,
									derivedLinkingPickListLocator, derivedPickListLocator,
									derivedRadioButtonLocator, derivedCreatedOnLocator, derivedCreatedByLocator], function (locator, index) {
										expect(element(by.xpath(locator)).getText()).to.eventually.equal(values[index]);
									});
				});
			});

			it('Saves the derived fields with changed values correctly', function () {
				this._runnable.ssName = 'itemEditPageDerivedFieldsChangeValuesSave';

				workspaceItemDetailsEditPage.getSaveBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=view').then(result => {
						expect(result).to.be.truthy;
					});
				});

				_.each([pivotLocator, derivedDescriptorLocator, derivedBomUomLocator,
								derivedLinkingPickListLocator, derivedPickListLocator,
								derivedRadioButtonLocator, derivedCreatedOnLocator, derivedCreatedByLocator], function (locator, index) {
									expect(element(by.xpath(locator)).getText()).to.eventually.equal(values[index]);
								});
			});

			it('Enters edit mode and saves without changing anything', function () {
				this._runnable.ssName = 'itemEditPageDerivedFieldsSameValues';

				workspaceItemDetailsEditPage.getEditBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=edit').then(result => {
						expect(result).to.be.truthy;
					});
				});

				workspaceItemDetailsEditPage.getSaveBtn().click().then(function (result) {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'mode=view').then(result => {
						expect(result).to.be.truthy;
					});
				});

				_.each([pivotLocator, derivedDescriptorLocator, derivedBomUomLocator,
								derivedLinkingPickListLocator, derivedPickListLocator,
								derivedRadioButtonLocator, derivedCreatedOnLocator, derivedCreatedByLocator], function (locator, index) {
									expect(element(by.xpath(locator)).getText()).to.eventually.equal(values[index]);
								});
			});

		});
	});
}

util.inherits(WorkspaceItemDetailsEditViewSpec, SharedSpec);

module.exports = new WorkspaceItemDetailsEditViewSpec();
