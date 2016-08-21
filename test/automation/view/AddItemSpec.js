/**
 * @ngdoc object
 * @name ViewTestsSpecs.AddItemSpec
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
var CommandBarSpec = require('./sharedspecs/CommandBarSpec');
var commandBar = new CommandBarSpec();
var CommandBar = require('../components/CommandBar');
var picklistComponent = require('../components/PicklistField');
var addItemPage = require('../pages/AddItemPage');
var helper = require('../util/Helper');
var Notification = require('../components/Notification');
var _ = require('underscore');

function AddItemSpec() {

	AddItemSpec.super_.call(this);
	var that = this;

	describe('AddItemPage', function () {
		this.timeout(60000);

		before(function () {
			return auth.doLogin().then(function () {
				return auth.checkAgreementModal().then(function () {
					addItemPage.go();
					return addItemPage.waitForEvents().then(function (result) {
						 expect(result).to.be.true;
					});
				});
			});
		});

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		describe('[Flow test - Cancel, save with validation error]', () => {
			'use strict';

			it('navigates to the item creation page', function () {
				this._runnable.ssName = 'landingOnAddItemPage';

				// URL should be correct
				expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
			});

			it('displays the workspace name as part of the title', function () {
				this._runnable.ssName = 'addItemPage-workspaceName';

				expect(addItemPage.isWorkspaceNameDisplayed()).to.eventually.be.true;

				AppHeader.getWorkspaceName().then(function (wsName) {
					expect(addItemPage.getWorkspaceName()).to.eventually.contain(wsName);
				});
			});

			it('displays the save and cancel buttons', function () {
				this._runnable.ssName = 'addItemPage-saveAndCancelButtons';

				expect(addItemPage.isSaveButtonDisplayed()).to.eventually.be.true;
				expect(addItemPage.isCancelButtonDisplayed()).to.eventually.be.true;
			});

			it('displays sticky action bar on scroll', function () {
				this._runnable.ssName = 'addItemPage-stickyActionBar';

				// scroll to the bottom-most element
				element.all(by.namePattern('input[type="text"]', 'urn.*\.EDIT_ONLY_TEXT')).get(0).click().sendKeys('');
				addItemPage.getSaveButton().getLocation().then(function (location) {
					// The following assertion implies:
					// the bar is sticky (didn't scroll out of view)
					expect(location.y).to.be.above(0);
				});
			});

			it('displays the sections containing fields inside the item creation page with required fields', function () {
				this._runnable.ssName = 'addItemPage-sectionsDisplayedRequiredFieldsPage';

				expect(addItemPage.isSectionBodyDisplayed(3)).to.eventually.be.true;
			});

			it('displays the confirmation dialog after clicking the cancel button', function () {
				this._runnable.ssName = 'addItemPage-dialogForCancelButton';

				addItemPage.getCancelButton().click();
				expect(addItemPage.isCancelDialogDisplayed()).to.eventually.be.true;
			});

			it('stays in the same page after cancelling the cancel operation', function () {
				addItemPage.getDialogCancelButton().click();

				expect(browser.driver.getCurrentUrl()).to.eventually.contain(addItemPage.urlContains);
			});

			it('goes back to workspace items page after confirming the cancel operation', function () {
				addItemPage.getCancelButton().click();

				addItemPage.getDialogOkButton().click();

				browser.sleep(1000); // small delay for the animation of the dialog window to play out
				expect(browser.driver.getCurrentUrl()).to.eventually.not.contain(addItemPage.urlContains);
				expect(browser.driver.getCurrentUrl()).to.eventually.contain('/items');
			});

			it('navigates back to the item creation page', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithMatrix';

				addItemPage.go();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('tries saving with validation errors and get a red error notification banner', function () {
				this._runnable.ssName = 'addItemPage-general-error-notification-on-validationError';
				addItemPage.getSaveButton().click().then(() => {
					expect(Notification.isNotificationPresent()).to.eventually.be.true;
					expect(Notification.getNotificationText()).to.eventually.contain('6 Errors - Please fix the errors below to save the item.');
					Notification.getCloseIcon().click();
				});
			});

		});

		describe('[Matrix fields]', () => {
			'use strict';
			before(function () {
				addItemPage.go();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('checks for the presence of a all matrices', function () {
				this._runnable.ssName = 'addItemPage-matrixIsPresent';
				expect(addItemPage.isMatrixDisplayed(0)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(1)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(2)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(3)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(4)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(5)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(6)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(7)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(8)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(9)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(10)).to.eventually.be.true;
				expect(addItemPage.isMatrixDisplayed(11)).to.eventually.be.true;
			});

			it('checks for the correct column headers when all columns have text', function () {
				this._runnable.ssName = 'addItemPage-matrixColumnHeaders';

				expect(addItemPage.getMatrixColumnHeaderText(3,0)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(3,1)).to.eventually.contain('Validated Fields Matrix - C1');
				expect(addItemPage.getMatrixColumnHeaderText(3,2)).to.eventually.contain('Validated Fields Matrix - C2');
				expect(addItemPage.getMatrixColumnHeaderText(3,3)).to.eventually.contain('Validated Fields Matrix - C3');
				expect(addItemPage.getMatrixColumnHeaderText(3,4)).to.eventually.contain('Validated Fields Matrix - C4');
			});

			it('checks for the correct column headers when some columns have text', function () {
				this._runnable.ssName = 'addItemPage-matrixColumnHeaders';

				expect(addItemPage.getMatrixColumnHeaderText(7,0)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(7,1)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(7,2)).to.eventually.contain('Matrix3 - C2');
			});

			it('checks for the correct column headers when none of the columns have text', function () {
				this._runnable.ssName = 'addItemPage-matrixColumnHeaders';

				expect(addItemPage.getMatrixColumnHeaderText(5,0)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(5,1)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(5,2)).to.eventually.contain('');
			});

			it('checks for the correct row labels when all rows have text', function () {
				this._runnable.ssName = 'addItemPage-matrixRowLabels';

				expect(addItemPage.getMatrixRowLabelText(3, 0)).to.eventually.contain('Validated Fields Matrix - R1');
				expect(addItemPage.getMatrixRowLabelText(3, 1)).to.eventually.contain('Validated Fields Matrix - R2');
				expect(addItemPage.getMatrixRowLabelText(3, 2)).to.eventually.contain('Validated Fields Matrix - R3');
			});

			it('checks for the correct row labels when some rows have text', function () {
				this._runnable.ssName = 'addItemPage-matrixRowLabels';

				expect(addItemPage.getMatrixRowLabelText(7, 0)).to.eventually.contain('');
				expect(addItemPage.getMatrixRowLabelText(7, 1)).to.eventually.contain('Matrix3 - R2');
			});

			it('checks for the correct row labels none of the rows have text', function () {
				this._runnable.ssName = 'addItemPage-matrixRowLabels';

				expect(addItemPage.getMatrixRowLabelText(5, 0)).to.eventually.contain('');
				expect(addItemPage.getMatrixRowLabelText(5, 1)).to.eventually.contain('');
			});

			it('checks for rendering of empty matrix', function () {
				this._runnable.ssName = 'addItemPage-matrixRowLabels';

				expect(addItemPage.getMatrixColumnHeaderText(5,0)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(5,1)).to.eventually.contain('');
				expect(addItemPage.getMatrixColumnHeaderText(5,2)).to.eventually.contain('');

				expect(addItemPage.getMatrixRowLabelText(5, 0)).to.eventually.contain('');
				expect(addItemPage.getMatrixRowLabelText(5, 1)).to.eventually.contain('');
			});

			it('ensures matrix elements in invisible advanced permissions sections not present', function () {
				this._runnable.ssName = 'addItemPage-advancedPerm_fieldsInSectionNotPresent_in_Matrix';
				expect(element.all(by.namePattern('input[type="text"]', 'urn.*\.ADV_PERM_INVISBLE_INT$'))).to.not.be.truthy;
				expect(element.all(by.namePattern('input[type="text"]', 'urn.*\.ADVPERM_EDIT_ONLY_INVISBLE_INTEGER$'))).to.not.be.truthy;
			});

			it('ensures matrix elements in readonly advanced permissions section not editable', function () {
				this._runnable.ssName = 'addItemPage-advancedPerm_fieldsInSectionNotEditable_in_Matrix';
				expect(addItemPage.getMatrixCell(0, 0, 0).all(by.css('long-field > span > span')).getText()).to.eventually.contain('4488');
			});

			it('ensures matrix elements in editable advanced permissions sections are editable', function () {
				this._runnable.ssName = 'addItemPage-advancedPerm_fieldsInSectionEditable_in_Matrix';
				element.all(by.namePattern('input[type="text"]', 'urn.*\.ADVPERM_EDITABLE_GROUP_INTEGER$')).get(0).click().sendKeys('1');
				element.all(by.namePattern('input[type="text"]', 'urn.*\.ADVPERM_BOTH_VIEW_AND_EDIT_GROUP_INTEGER$')).get(0).click().sendKeys('2');
				expect(element.all(by.namePattern('input[type="text"]', 'urn.*\.ADVPERM_EDITABLE_GROUP_INTEGER$')).get(0).isEnabled()).to.eventually.be.true;
				expect(element.all(by.namePattern('input[type="text"]', 'urn.*\.ADVPERM_BOTH_VIEW_AND_EDIT_GROUP_INTEGER$')).get(0).isEnabled()).to.eventually.be.true;
			});

			it('selects a filtered picklists (optional fields) in matrix', function () {
				this._runnable.ssName = 'addItemPage-selectOptional_FPL_in_Matrix';
				// Selects the filtered picklists (not really required, but doing here for the sake of completeness)
				let optionalFilteredPicklists = [
					'FPL_WSBASED_DESCRIPTOR',
					'FPL_WSBASED_GEO',
					'LINKED_FILTERED'
				];

				addItemPage.getFilteredPicklistDropdown(optionalFilteredPicklists[0]).click();
				// browser.sleep(500); // this is necessary due to timeouts in the filtered picklist directive, plus lazy loading of options
				addItemPage.selectFilteredPicklistDropdownOption(optionalFilteredPicklists[0], 0).click();
				addItemPage.getFilteredPicklistDropdownOptionSelectedValue(optionalFilteredPicklists[0]).then(function (value) {
					expect(value).to.be.truthy;
				});

				addItemPage.getFilteredPicklistDropdown(optionalFilteredPicklists[1]).click();
				// browser.sleep(500); // this is necessary due to timeouts in the filtered picklist directive, plus lazy loading of options
				addItemPage.selectFilteredPicklistDropdownOption(optionalFilteredPicklists[1], 0).click();
				addItemPage.getFilteredPicklistDropdownOptionSelectedValue(optionalFilteredPicklists[1]).then(function (value) {
					expect(value).to.be.truthy;
				});

				addItemPage.getFilteredPicklistDropdown(optionalFilteredPicklists[2]).click();
				// browser.sleep(500); // this is necessary due to timeouts in the filtered picklist directive, plus lazy loading of options
				addItemPage.selectFilteredPicklistDropdownOption(optionalFilteredPicklists[2], 0).click();
				addItemPage.getFilteredPicklistDropdownOptionSelectedValue(optionalFilteredPicklists[2]).then(function (value) {
					expect(value).to.be.truthy;
				});
			});

			it('selects a required picklist fields in matrix', function () {
				this._runnable.ssName = 'addItemPage-selectRequired_PL_in_Matrix';

				let requiredLookups = [
					'_api_v3_workspaces_62_views_1_fields_REQUIRED_LOOKUP',
					'_api_v3_workspaces_62_views_1_fields_REQUIRED_LINKED_PL',
					'_api_v3_workspaces_62_views_1_fields_REQUIRED_LINKED_LRL'
				];

				picklistComponent.getPicklistDropdown(requiredLookups[0]).click();
				picklistComponent.selectPicklistDropdownOption(requiredLookups[0], 0).click();
				picklistComponent.getPicklistDropdownSelectedValue(requiredLookups[0]).then(function (value) {
					expect(value).to.be.truthy;
				});

				picklistComponent.getPicklistDropdown(requiredLookups[1]).click();
				picklistComponent.selectPicklistDropdownOption(requiredLookups[1], 0).click();
				picklistComponent.getPicklistDropdownSelectedValue(requiredLookups[1]).then(function (value) {
					expect(value).to.be.truthy;
				});

				picklistComponent.getPicklistDropdown(requiredLookups[2]).click();
				picklistComponent.selectPicklistDropdownOption(requiredLookups[2], 0).click();
				picklistComponent.getPicklistDropdownSelectedValue(requiredLookups[2]).then(function (value) {
					expect(value).to.be.truthy;
				});
			});

			it('selects a picklist with search filter field in matrix', function () {
				this._runnable.ssName = 'addItemPage-select_PL_with_SearchFilter_in_Matrix';
				let elemId = '_api_v3_workspaces_62_views_1_fields_LOOKUP_W_SEARCH_FILTER';

				picklistComponent.getPicklistDropdown(elemId).click().then(function () {
					var targetInput = picklistComponent.getSearchInputField(elemId);
					picklistComponent.fillInput(targetInput, 'ehous').then(function (typedStr) {
						browser.sleep(2000); // Need to wait due to throttling of requests
						picklistComponent.selectPicklistDropdownOption(elemId, 0).click().then(function () {
							picklistComponent.getPicklistDropdownSelectedValue(elemId).then(function (value) {
								expect(value[0]).to.equal('Warehouse Management');
							});
						});
					});
				});
			});

			it('ensures edit-only input fields are editable', function () {
				this._runnable.ssName = 'addItemPage-editOnly_InputFieldsEditable_in_Matrix';
				let editOnlyInputFieldNamePatterns = [
					'urn.*\.EDIT_ONLY_INT',
					'urn.*\.EDIT_ONLY_MONEY',
					'urn.*\.EDIT_ONLY_TEXT',
					'urn.*\.EDIT_ONLY_DATE',
					'urn.*\.EDIT_ONLY_CHECKBOX',
					'urn.*\.EDIT_ONLY_RADIO_BTN'
				];

				editOnlyInputFieldNamePatterns.forEach(pattern => {
					let elem = element.all(by.namePattern('input', pattern)).get(0);
					expect(elem.isEnabled()).to.eventually.be.true;
				});
			});

			it('ensures edit-only picklist fields are editable', function () {
				this._runnable.ssName = 'addItemPage-editOnly_PicklistFieldsEditable_in_Matrix';
				let picklistWrapperIds = [
					'_api_v3_workspaces_62_views_1_fields_EDIT_ONLY_CUSTOM_PL_SS',
					'_api_v3_workspaces_62_views_1_fields_EDIT_ONLY_LINKED_PL_SS',
					'_api_v3_workspaces_62_views_1_fields_EDIT_ONLY_LINKED_LRL_PL_SS',
					'_api_v3_workspaces_62_views_1_fields_EDIT_ONLY_LINKED_PL_MS',
					'_api_v3_workspaces_62_views_1_fields_EDIT_ONLY_CUSTOM_LRL_PL_SS',
					'_api_v3_workspaces_62_views_1_fields_EDIT_ONLY_CUSTOM_LRL_PL_MS'
				];
				picklistWrapperIds.forEach(elemId => {
					let xpath = '//div[@id="' + elemId + '"]//input[@class="search"]';
					let elem = element.all(by.xpath(xpath)).get(0);
					expect(elem.isEnabled()).to.eventually.be.true;
				});
			});

			it('selects a required date field in the date selector widget', function () {
				this._runnable.ssName = 'addItemPage-selectRequiredDateinDateWidget_in_Matrix';
				addItemPage.getOpenCalendarButton().click().then(function () {
					addItemPage.selectFirstDateInCalendar();
					addItemPage.getDateInputValue().then(function (value) {
						expect(value).to.contain('01/28/2001');
					});
				});
			});

			it('selects a multi-select picklist (optional fields) in matrix', function () {
				this._runnable.ssName = 'addItemPage-selectOptional_MS_PL_in_Matrix';

				let optionalMultiselectPicklist = [
					'_api_v3_workspaces_62_views_1_fields_DEPARTMENT_LOOKUP_MULTISELECT'
				];
				optionalMultiselectPicklist.forEach(elemId =>{
					picklistComponent.getPicklistDropdown(elemId).click().then(function () {
						picklistComponent.selectPicklistDropdownOption(elemId, 0).click().then(function () {
							picklistComponent.getMultiSelectPicklistDropdownSelectedValue(elemId).then(function (value) {
								expect(value).to.be.truthy;
								// click somewhere else to close the picklist dropdown
								element.all(by.xpath('//h1')).get(0).click();
							});
						});
					});
				});
			});

			it('fills in the remaining required fields in the workspace in the matrix and performs a save operation', function () {
				this._runnable.ssName = 'addItemPage-matrixFillFields_and_save';

				element.all(by.namePattern('input[type="text"]', 'urn.*\.RANGED_MONEY$')).get(0).click().sendKeys('20.22');
				element.all(by.namePattern('input[type="text"]', 'urn.*\.REGEX_TEXT_STARTSWITH_A_MINLEN_5$')).get(0).click().sendKeys('A-value');

				addItemPage.getSaveButton().click().then(() => {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'view=full&tab=details').then(result => {
						expect(result).to.be.truthy;
					});
				});
			});

			describe('[Matrix fields - Ensure saved correctly after successful save]', () => {
				'use strict';

				let checkXpathExpectedValue = function (testCases) {
					testCases.forEach(testCase => {
						element.all(by.xpath(testCase.xpath)).get(0).getText().then(function (text) {
							expect(text).to.equal(testCase.expectedValue);
						});
					});
				};

				it('Advanced Permission editable fields are saved', function () {
					let advPermEditableFieldsTestCases = [
						{xpath: '//div[@id="view-details"]/div[3]//table/tbody//tbody/tr[1]/td[2]//span["44881"]', expectedValue: '44881'}, // ADVPERM_EDITABLE_GROUP_INTEGER
						{xpath: '//div[@id="view-details"]/div[4]//table/tbody//tbody/tr[2]/td[3]//span["44882"]', expectedValue: '44882'} // ADVPERM_BOTH_VIEW_AND_EDIT_GROUP_INTEGER
					];
					checkXpathExpectedValue(advPermEditableFieldsTestCases);
				});

				it('Filtered Picklists are saved', function () {
					let filteredPicklistTestCases = [
						{xpath: '//div[@id="view-details"]/div[1]//span[@title="Autodesk"]//a', expectedValue: 'Autodesk'}, // FPL_WSBASED_DESCRIPTOR
						{xpath: '//div[@id="view-details"]/div[1]//span[@title="AMER"]//span', expectedValue: 'AMER'}, // FPL_WSBASED_GEO
						{xpath: '//div[@id="view-details"]/div[6]//table/tbody//tbody/tr[1]/td[5]//span[@title="050-0000-000 - REGULATOR PNEUMATIC ,"]//a', expectedValue: '050-0000-000 - REGULATOR PNEUMATIC , [REV:[REV:A]]'} // LINKED_FILTERED
					];
					checkXpathExpectedValue(filteredPicklistTestCases);
				});

				it('Picklist with search filter in matrix is saved', function () {
					let picklistWithSearchFilterTestCases = [
						{xpath: '//div[@id="view-details"]/div[6]//table/tbody//tbody/tr[2]/td[5]//span[@title="Warehouse Management"]', expectedValue: 'Warehouse Management'} // LOOKUP_W_SEARCH_FILTER
					];
					checkXpathExpectedValue(picklistWithSearchFilterTestCases);
				});

				it('Multiselect Picklists are saved', function () {
					let multiselectPicklistTestCases = [
						{xpath: '//div[@id="view-details"]/div[10]//table/tbody//tbody/tr[2]/td[5]//span[@title="Information Technology"]//span', expectedValue: 'Information Technology'} // DEPARTMENT_LOOKUP_MULTISELECT
					];
					checkXpathExpectedValue(multiselectPicklistTestCases);
				});

				it('Required Lookups/Picklists are saved', function () {
					let requiredLookupOrPicklistsTestCases = [
						{xpath: '//div[@id="view-details"]/div[5]//table/tbody//tbody/tr[2]/td[3]//span[@title="Information Technology"]//span', expectedValue: 'Information Technology'}, // REQUIRED_LOOKUP
						{xpath: '//div[@id="view-details"]/div[5]//table/tbody//tbody/tr[2]/td[4]//span[@title="050-0000-000 - REGULATOR PNEUMATIC ,"]//a', expectedValue: '050-0000-000 - REGULATOR PNEUMATIC , [REV:A]'}, // REQUIRED_LINKED_PL
						{xpath: '//div[@id="view-details"]/div[5]//table/tbody//tbody/tr[2]/td[5]//span[@title="050-0000-000 - REGULATOR PNEUMATIC ,"]//a', expectedValue: '050-0000-000 - REGULATOR PNEUMATIC , [REV:A]'} // REQUIRED_LINKED_LRL
					];
					checkXpathExpectedValue(requiredLookupOrPicklistsTestCases);
				});

				it('Required Dates are saved', function () {
					let requiredDatesTestCases = [
						{xpath: '//div[@id="view-details"]/div[5]//table/tbody//tbody/tr[3]/td[2]//span["01/28/2001"]', expectedValue: '01/28/2001'} // DATE_GREATER_THAN_DATE_IN_SPARSE_MATRIX
					];
					checkXpathExpectedValue(requiredDatesTestCases);
				});

				it('Required Money and Text are saved', function () {
					let requiredInputBoxFields = [
						{xpath: '//div[@id="view-details"]/div[5]//table/tbody//tbody/tr[1]/td[3]//span["20.220000000"]', expectedValue: '20.220000000'}, // RANGED_MONEY
						{xpath: '//div[@id="view-details"]/div[5]//table/tbody//tbody/tr[1]/td[4]//span["A-value"]', expectedValue: 'A-value'} // REGEX_TEXT_STARTSWITH_A_MINLEN_5
					];
					checkXpathExpectedValue(requiredInputBoxFields);
				});

			});

		});

		describe('[Picklists + Date fields]', () => {
			'use strict';

			it('navigates to the item creation page of a workspace with some picklists', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithPicklists';

				addItemPage.gotoWorkspaceWithPicklists();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('selects an option in a radio button-based picklist', function () {
				this._runnable.ssName = 'addItemPage-selectOptionRadioButtonPicklist';
				picklistComponent.getRadioButtonPicklistOption(0,1).click().then(function () {
					picklistComponent.getRadioButtonPicklistOption(0,1).all(by.tagName('input')).isSelected().then(function (isSelected) {
						expect(isSelected[0]).to.be.true;
					});
				});
			});

			it('selects a date in the date selector widget', function () {
				this._runnable.ssName = 'addItemPage-selectDateinDateWidget';
				addItemPage.getOpenCalendarButton().click().then(function () {
					addItemPage.selectFirstDateInCalendar();

					addItemPage.getDateInputValue().then(function (value) {
						expect(value).to.contain('01/28/2001');
					});
				});
			});

			it('selects an option in the picklist dropdown', function () {
				this._runnable.ssName = 'addItemPage-selectDateinPicklistDropdown';
				var targetPicklist = '_api_v3_workspaces_22_views_1_fields_DEPARTMENT_AUDITED';

				picklistComponent.getPicklistDropdown(targetPicklist).click().then(function () {
					picklistComponent.selectPicklistDropdownOption(targetPicklist, 1).click().then(function () {
						picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
							expect(value).to.contain('New Product Introduction');
						});
					});
				});
			});

			it('selects an option in the multi-select picklist dropdown', function () {
				this._runnable.ssName = 'addItemPage-selectDateinMultiSelectPicklistDropdown';
				var targetPicklist = '_api_v3_workspaces_22_views_1_fields_RELATED_CAPAS';

				picklistComponent.getPicklistDropdown(targetPicklist).click().then(function () {
					picklistComponent.selectPicklistDropdownOption(targetPicklist, 0).click().then(function () {
						picklistComponent.getMultiSelectPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
							expect(value).to.contain('CA000001 - Valve Yield out of tolerance');
						});
					});
				});
			});

			it('sucessfully creates a new item', function () {
				this._runnable.ssName = 'addItemPage-createdNewItem';

				addItemPage.getSaveButton().click().then(() => {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'view=full&tab=details').then(result => {
						expect(result).to.be.truthy;
					});
				});
			});

		});

		describe('[UOM Picklist]', () => {

			it('navigates to the item creation page of a workspace with UOM picklists', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithUOMPicklists';

				addItemPage.gotoWorkspaceWithUOMPicklist();
				return addItemPage.waitForEvents().then(function (result) {
					expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('checks that the first value to be Each ', function () {
				this._runnable.ssName = 'addItemPage-checkUOMOptionPicklistDropdown';
				var targetPicklist = '_api_v3_workspaces_8_views_1_fields_UNIT_OF_MEASURE';

				picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
					expect(value).to.contain('Each');
				});
			});

			it('selects an option in the UOM picklist dropdown', function () {
				this._runnable.ssName = 'addItemPage-selectUOMinPicklistDropdown';
				var targetPicklist = '_api_v3_workspaces_8_views_1_fields_UNIT_OF_MEASURE';

				picklistComponent.getPicklistDropdown(targetPicklist).click().then(function () {
					picklistComponent.selectPicklistDropdownOption(targetPicklist, 1).click().then(function () {
						picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
							expect(value).to.contain('Meter');
						});
					});
				});
			});

			it('sucessfully creates a new item without changing any data', function () {
				this._runnable.ssName = 'addItemPage-createdNewItem-UOM-picklist';

				addItemPage.getSaveButton().click().then(() => {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'view=full&tab=details').then(result => {
						expect(result).to.be.truthy;
					});
				});
			});

			it('checks item was created with correct values of UOM picklist', function () {
				element.all(by.xpath('//span[@title="Meter"]/span')).get(0).getText().then(function (text) {
					expect(text).to.equal('Meter');
				});
			});
		});

		describe('[Picklist with default values]', () => {

			it('navigates to the item creation page of a workspace with simple picklists and default value after 10th element', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithPicklistsWithDefaults';

				addItemPage.goToWorkspaceWithoutRequiredFields();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('selects an option in the UOM picklist dropdown', function () {
				this._runnable.ssName = 'addItemPage-selectPicklistDropdownWith DefaultAfter10thElement';
				var targetPicklist = '_api_v3_workspaces_50_views_1_fields_PL_WITH_DEFAULT_VALUE';

				picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
					expect(value).to.contain('Canada');
				});
			});

			it('selects an option in the Multi picklist dropdown that\'s after the 10th element', function () {
				this._runnable.ssName = 'addItemPage-selectMultiPicklistDropdownValues';
				var targetPicklist = '_api_v3_workspaces_50_views_1_fields_MULTI_SELECT_PL';

				picklistComponent.getPicklistDropdown(targetPicklist).click().then(function () {
					picklistComponent.selectPicklistDropdownOption(targetPicklist, 0).click().then(function () {
						browser.driver.executeScript('document.querySelectorAll(".section-content.form-group.ng-scope.full-create-section")[3].style.height = "500px";').then(function () {
							browser.sleep(1000); // there's an issue, section hides the list if it's the last field.
							picklistComponent.selectPicklistDropdownOption(targetPicklist, 12).click().then(function () {
								picklistComponent.getMultiSelectPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
									expect(value).to.contain('Emerging Countries');
									expect(value).to.contain('India');
								});
							});
						});
					});
				});
			});

			it('sucessfully creates a new item without changing any data', function () {
				this._runnable.ssName = 'addItemPage-createdNewItem-MultiPicklistDropdownValues';

				addItemPage.getSaveButton().click().then(() => {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'view=full&tab=details').then(result => {
						expect(result).to.be.truthy;
					});
				});
			});

			it('checks item was created with correct values of MultiPicklist', function () {
				// when go to edit, it will be covered in another test (see WorkspaceItemDetailsEditViewSpec)
				element.all(by.xpath('//span[@title="Emerging Countries,India"]//span')).get(0).getText().then(function (text) {
					expect(text).to.equal('Emerging Countries');
				});
				element.all(by.xpath('//span[@title="Emerging Countries,India"]/span[2]/div//span')).get(0).getText().then(function (text) {
					expect(text).to.equal('India');
				});
			});
		});

		describe('[Save successfully without filling fields]', () => {
			'use strict';

			it('navigates to the item creation page of a workspace without required fields', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithourRequiredFields';

				addItemPage.goToWorkspaceWithoutRequiredFields();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('displays the sections containing fields inside the item creation page without required fields', function () {
				this._runnable.ssName = 'addItemPage-sectionsDisplayedNoRequiredFieldsPage';

				expect(addItemPage.isSectionBodyDisplayed(0)).to.eventually.be.true;
			});

			it('sucessfully creates a new item without changing any data', function () {
				this._runnable.ssName = 'addItemPage-createdNewItem';

				addItemPage.getSaveButton().click().then(() => {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'view=full&tab=details').then(result => {
						expect(result).to.be.truthy;
					});
				});
			});
		});

		describe('[Picklists with Search]', () => {
			'use strict';

			it('navigates to the item creation page of a workspace containing picklists with search', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithPicklistsWithSearch';

				addItemPage.gotoWorkspaceWithPicklistsWithSearch();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('searches (and finds, clears, finds again) a result in a picklist with search based on a workspace', function () {
				this._runnable.ssName = 'addItemPage-picklistWithSearchWsBased';

				var targetPicklist = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS';
				var targetInput = picklistComponent.getSearchInputField(targetPicklist);

				picklistComponent.getPicklistDropdown(targetPicklist).click();
				picklistComponent.fillInput(targetInput, 'regulator').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests
					picklistComponent.selectPicklistDropdownOption(targetPicklist, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
						expect(value[0]).to.contain('REGULATOR');
						expect(value[0]).to.contain('[REV:A]');
					});
				});

				browser.actions().mouseMove(picklistComponent.getPicklistDropdown(targetPicklist)).perform(); // Focus the element
				picklistComponent.getClearButton(targetPicklist).click();
				picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
					expect(value[0]).to.contain('');
				});

				// Repeats the selection, since it was cleared
				picklistComponent.getPicklistDropdown(targetPicklist).click();
				picklistComponent.fillInput(targetInput, 'regulator').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests
					picklistComponent.selectPicklistDropdownOption(targetPicklist, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
						expect(value[0]).to.contain('REGULATOR');
						expect(value[0]).to.contain('[REV:A]');
					});
				});
			});

			it('searches (and finds) a result in a picklist with search based on a custom lookup', function () {
				this._runnable.ssName = 'addItemPage-picklistWithSearchNonWsBased';

				var targetPicklist = '_api_v3_workspaces_65_views_1_fields_PLWSF_NONWS';
				var targetInput = picklistComponent.getSearchInputField(targetPicklist);

				// Clear button should not be displayed for PLFs that don't have a value selected in them (i.e. 'Select' is being displayed)
				expect(picklistComponent.getClearButton(targetPicklist).isDisplayed()).to.eventually.be.false;

				picklistComponent.getPicklistDropdown(targetPicklist).click();
				picklistComponent.fillInput(targetInput, 'rework').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests

					expect(picklistComponent.getClearButton(targetPicklist).isDisplayed()).to.eventually.be.false;

					picklistComponent.selectPicklistDropdownOption(targetPicklist, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
						expect(value[0]).to.contain('Rework');
					});
				});
			});

			it('searches (and finds) a result in a picklist with search based on a workspace containing archived items', function () {
				this._runnable.ssName = 'addItemPage-picklistWithSearchWsBasedArchived';

				var targetPicklist = '_api_v3_workspaces_65_views_1_fields_PLWSF_WS_REVDEL';
				var targetInput = picklistComponent.getSearchInputField(targetPicklist);

				// Clear button should not be displayed for PLFs that don't have a value selected in them (i.e. 'Select' is being displayed)
				expect(picklistComponent.getClearButton(targetPicklist).isDisplayed()).to.eventually.be.false;

				picklistComponent.getPicklistDropdown(targetPicklist).click();
				picklistComponent.fillInput(targetInput, 'shot').then(function (typedStr) {
					browser.sleep(2000); // Need to wait due to throttling of requests

					expect(picklistComponent.getClearButton(targetPicklist).isDisplayed()).to.eventually.be.false;

					picklistComponent.selectPicklistDropdownOption(targetPicklist, 0).click();
					picklistComponent.getPicklistDropdownSelectedValue(targetPicklist).then(function (value) {
						expect(value[0]).to.contain('SHOT PIN BLOCK');
						expect(value[0]).to.contain('REV:w');
						expect(value[0]).to.contain('ARCHIVED');
					});
				});
			});

			it('displays default values for single-select picklists', function () {
				this._runnable.ssName = 'addItemPage-picklistsDefaultValues';

				var targetTitle = 'Functional Quality Issue';
				var targetPicklist1 = '_api_v3_workspaces_65_views_1_fields_SSPL_NONWS_DEF';
				var targetPicklist2 = '_api_v3_workspaces_65_views_1_fields_BOM_UOM_PL';
				var targetPicklist3 = '_api_v3_workspaces_65_views_1_fields_SFVAD_WS';

				expect(element.all(by.xpath('//span[@title="Functional Quality Issue"]')).get(0).getText()).to.eventually.contain(targetTitle);
				expect(picklistComponent.getPicklistDropdownSelectedValue(targetPicklist1)).to.eventually.contain('Hand Tool');
				expect(picklistComponent.getPicklistDropdownSelectedValue(targetPicklist2)).to.eventually.contain('Each');
				expect(picklistComponent.getPicklistDropdownSelectedValue(targetPicklist3)).to.eventually.contain('McMaster-Carr Supply Co.');
			});
		});

		describe('[Derived Fields]', () => {
			'use strict';

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

			it('navigates to the item creation page of a workspace derived fields', function () {
				this._runnable.ssName = 'landingOnAddItemPageWithDerivedFields';

				addItemPage.gotoWorkspaceWithDerivedFields();
				return addItemPage.waitForEvents().then(function (result) {
					 expect(result).to.be.true;

					// URL should be correct
					expect(browser.driver.getCurrentUrl()).to.eventually.contain('addItem');
				});
			});

			it('selects a value in the pivot pick list and updates the derived fields', function () {
				this._runnable.ssName = 'addItemPageChangeThePivotAndDerivedFields';

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

			it('sucessfully creates a new item with values for pivot PL and derived fields', function () {
				this._runnable.ssName = 'addItemPageChangeThePivotAndDerivedFieldsSave';

				addItemPage.getSaveButton().click().then(() => {
					return helper.waitForUrlToChangeToAndContain(/itemDetails/, 'view=full&tab=details').then(result => {
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

util.inherits(AddItemSpec, SharedSpec);

module.exports = new AddItemSpec();
