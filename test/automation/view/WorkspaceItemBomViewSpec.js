'use strict';

/**
 * @ngdoc object
 * @name ViewTestsSpecs.WorkspaceItemBomViewSpec
 *
 * @description This is the view tests for the ViewBomPage.
 *
 * ##Dependencies
 *
 */

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AppHeader = require('../components/AppHeader');
var CommandBar = require('../components/CommandBar');
var CreateItem = require('../components/CreateItem');
var ItemMenu = require('../components/ItemMenu');
var ItemHeader = require('../components/ItemHeader');
var AddItemFlyout = require('../components/AddItemFlyout');
var viewDetailsViewPage = require('../pages/ViewDetailsViewPage');
var viewBomPageClass = require('../pages/ViewBomPage');

var viewBomPage = new viewBomPageClass();

var BomConfigurationDropdownSpec = require('./sharedspecs/BomConfigurationDropdownSpec');
var configurationDropdownSpec = new BomConfigurationDropdownSpec(viewBomPage.commandBar.configurationDropdown.component);

function WorkspaceItemBomViewSpec() {
	WorkspaceItemBomViewSpec.super_.call(this);
	var that = this;

	describe('<BomView>', function () {
		this.timeout(200000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					viewBomPage.goToDefaultItem();
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

		describe('[Bom Page]', function () {
			it('navigates to the workspace item bom view page', function () {
				this._runnable.ssName = 'BomView-arriveOnBomPage';

				// App header should be displayed
				AppHeader.isAppHeaderComponentsDisplayed().then(function (componentDisplayStatusList) {
					expect(componentDisplayStatusList[0]).to.be.true;
				});

				// URL should be correct
				expect(browser.driver.getCurrentUrl()).to.eventually.contain('tab=bom');

				// Item Details tab must be the one selected
				ItemMenu.getItemMenuTabs().each(function (tab) {
					tab.getText().then(function (name) {
						if (name === 'BILL OF MATERIALS') {
							expect(tab.getAttribute('class')).to.eventually.contain('active');
						}
					});
				});
			});
		});

		describe('[CommandBar]', function () {
			it('displays the command bar', function () {
				this._runnable.ssName = 'BomView-commandBar';

				expect(CommandBar.isCommandBarDisplayed()).to.eventually.be.true;
			});

			it('displays the Configuration button', function () {
				this._runnable.ssName = 'BomView-bomConfigurationButton';

				expect(viewBomPage.commandBar.configurationDropdown.button.isDisplayed()).to.eventually.be.true;
			});
		});

		describe('[RemoveButton]', function () {
			describe('[Permissions]', function () {
				it('displays a disabled "Remove" button if the user has "Delete" permission and the item is released', function () {
					this._runnable.ssName = 'BomView-displayRemoveButtonDisabled';
					expect(viewBomPage.commandBar.removeButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisabled()).to.eventually.be.true;
				});

				// Need a locked item
				xit('displays a disabled "Remove" button if the user has "Delete" permission and the item is locked', function () {
					this._runnable.ssName = 'BomView-displayRemoveButtonDisabled';
					expect(viewBomPage.commandBar.removeButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisabled()).to.eventually.be.true;
				});

				// Need the ability to change permissions
				xit('Does not display a "Remove" button if the user does not have "Delete" permission', () => {
					this._runnable.ssName = 'BomView-displayRemoveButtonInvisible';
				});

				// Need the ability to change permissions
				xit('displays a enabled "Remove" button if the user has "Delete" permission and the item is released, and the user has override revision permission', function () {
					this._runnable.ssName = 'BomView-displayRemoveButtonRevisionOverride';
					expect(viewBomPage.commandBar.removeButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisabled()).to.eventually.be.false;
				});

				// Need the ability to change permissions
				xit('displays a enabled "Remove" button if the user has "Delete" permission and the item is locked, and the user has override lock permission', function () {
					this._runnable.ssName = 'BomView-displayRemoveButtonLockOverride';
					expect(viewBomPage.commandBar.removeButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisabled()).to.eventually.be.false;
				});
			});

			describe('[UnlockedItem]', function () {
				let checkboxColumn = viewBomPage.bom.views.defaultView.columns.checkbox;
				let checkableRow = 1;
				let checkableCheckbox = viewBomPage.bom.table.rows
											.getCell(checkableRow, checkboxColumn)
											.locator.element(by.css('input[type="checkbox"]'));

				before(function () {
					viewBomPage.goToItem('unlockedItemWithChildren');
				});

				after(function () {
					// return to bom page
					viewBomPage.goToDefaultItem();
				});

				it('Displays an disabled "remove" button if the user has "Delete" permission and the item is not released (working) and no rows are checked', function () {
					this._runnable.ssName = 'BomView-displayRemoveButtonEnabled';
					expect(viewBomPage.commandBar.removeButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisabled()).to.eventually.be.true;
				});

				it('Displays an enabled "remove" button if the user has "Delete" permission and the item is not released (working) and a row is selected', function () {
					this._runnable.ssName = 'BomView-displayRemoveButtonEnabled';
					checkableCheckbox.click();
					expect(checkableCheckbox.isSelected()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.removeButton.isDisabled()).to.eventually.be.false;
				});
			});
		});

		describe('[EditButton]', function () {
			it('displays a disabled "Edit" button if the user has "Add, Edit, or Delete" permission and the item is released', function () {
				this._runnable.ssName = 'BomView-displayEditButtonDisabled';
				expect(viewBomPage.commandBar.editButton.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.editButton.isDisabled()).to.eventually.be.true;
			});

			describe('[unlockedItemWithChildren]', function () {
				// Go to unlocked item first to prevent multiple navigations
				before(function () {
					viewBomPage.goToItem('unlockedItemWithChildren');
				});

				after(function () {
					// return to bom page
					viewBomPage.goToDefaultItem();
				});

				it('displays an enabled "Edit" button if the user has "Add, Edit or Delete" permission and the item is not released (working)', function () {
					this._runnable.ssName = 'BomView-displayEditButtonEnabled';
					// Button should be available
					expect(viewBomPage.commandBar.editButton.isDisplayed()).to.be.eventually.true;
					expect(viewBomPage.commandBar.editButton.isDisabled()).to.be.eventually.false;
				});
				describe('[EditMode]', function () {
					before(function () {
						// enter edit mode
						viewBomPage.commandBar.editButton.click();
					});

					it('should enter edit mode by clicking on edit button and hide edit button', function () {
						this._runnable.ssName = 'BomView-hideEditButton';
						// edit button should no longer be there
						expect(viewBomPage.commandBar.editButton.isDisplayed()).to.eventually.be.false;
					});

					it('should display save and cancel button in edit mode', function () {
						this._runnable.ssName = 'BomView-displayControlButtons';
						// save button should be displayed
						expect(viewBomPage.commandBar.controlButtons.saveButton.isDisplayed()).to.eventually.be.true;

						// cancel button should be displayed
						expect(viewBomPage.commandBar.controlButtons.cancelButton.isDisplayed()).to.eventually.be.true;

					});

					it('should show disabled dropdown buttons for view and bom configuration', function () {

						// the view dropdown button should be disabled
						expect(viewBomPage.commandBar.configurationDropdown.button.isDisabled()).to.eventually.be.true;
						// the bom configuration button should be disabled.
						expect(viewBomPage.commandBar.viewsDropdown.button.isDisabled()).to.eventually.be.true;
					});

					it('should show disabled child rows when the expander is clicked', function () {
						this._runnable.ssName = 'BomView-disableChildRow';
						var initialRowcount = 5;
						var finalRowCount = 15;
						// check the number of rows is correct before the expansion.
						expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(initialRowcount);
						// Expand the row
						viewBomPage.bom.table.rows.getRow(1).toggleExpansion();
						// check the number of rows is correct after the expansion.
						expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(finalRowCount);
						// get a cell from the expanded rows
						var disabledRow = viewBomPage.bom.table.rows.getRow(2);
						// see if its present
						expect(disabledRow.locator.isPresent()).to.eventually.be.true;
						// check if the its disabled
						expect(disabledRow.locator.element(by.className('disabled-ui-grid-row')).isPresent()).to.eventually.be.true;
					});

					it('should show dirty visual status of the cell when being edited', function () {
						this._runnable.ssName = 'BomView-dirtyVisualStatus';

						var row = 1;
						var column = viewBomPage.bom.views.defaultView.columns.quantity;
						var quantityCell = viewBomPage.bom.table.rows.getCell(row, column);
						var editedRow = viewBomPage.bom.table.rows.getRow(row);

						// intially the cell should not be in edit mode
						expect(quantityCell.isInEditMode()).to.eventually.be.false;
						expect(quantityCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('1.0');

						// clicking on a cell takes it to edit mode
						quantityCell.attemptToEnterEditMode();
						expect(quantityCell.isInEditMode()).to.eventually.be.true;

						// clear the cell and enter a new value
						quantityCell.locator.element(by.css('input')).clear();
						quantityCell.locator.element(by.css('input')).sendKeys('45');

						// take the cell out of edit mode
						viewBomPage.bom.header.click();
						expect(quantityCell.isInEditMode()).to.eventually.be.false;

						// Check to make sure that the cell contains the value that was entered.
						expect(quantityCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('45.0');

						// the cell should be in dirty state and visual marker should be there to indicate that
						expect(quantityCell.isDirty()).to.eventually.equal('true');
						// The Row should be have dirty vaisual marker
						expect(editedRow.isDirty()).to.eventually.be.true;
					});

					it('Should remove the visual indicator if the cell is being edited back to its original value', function () {
						this._runnable.ssName = 'BomView-notDirtyVisualStatus';

						var row = 1;
						var column = viewBomPage.bom.views.defaultView.columns.quantity;
						var editedRow = viewBomPage.bom.table.rows.getRow(row);
						var editedCell = viewBomPage.bom.table.rows.getCell(row, column);

						// check the initial state of the cell
						expect(editedCell.isInEditMode()).to.eventually.be.false;
						expect(editedCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('45.0');

						// clicking on a cell takes it to edit mode
						editedCell.attemptToEnterEditMode();
						expect(editedCell.isInEditMode()).to.eventually.be.true;
						editedCell.locator.element(by.css('input')).clear();

						// put the original value back into the cell
						editedCell.locator.element(by.css('input')).sendKeys('1.0');
						viewBomPage.bom.header.click();
						expect(editedCell.isInEditMode()).to.eventually.be.false;
						expect(editedCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('1.0');

						// the cell status should change to not dirty
						expect(editedCell.isDirty()).to.eventually.equal('false');
						// the status column should also change to not dirty
						expect(editedRow.isDirty()).to.eventually.be.false;
					});

					// We will need add a column for which incorrect data could be set in order for this to work.
					xit('Should show invalid visual status on a cell when it is being given a value that is incorrect', function () {
						this._runnable.ssName = 'BomView-invalidVisualStatus';
						var row = 1;
						var column = viewBomPage.bom.views.defaultView.columns.quantity;
						var editedRow = viewBomPage.bom.table.row.getCell(0);
						var editdCell = viewBomPage.bom.table.rows.getCell(row, column);

						expect(editdCell.isInEditMode()).to.eventually.be.false;

						// click on the cell to take it to edit mode
						editdCell.attemptToEnterEditMode();
						expect(editdCell.isInEditMode()).to.eventually.be.true;
						// clear the current value and input an invalid value
						editedCell.locator.element(by.css('input')).clear();
						editdCell.locator.element(by.css('input')).sendKeys(-9999);
						viewBomPage.bom.header.click();

						// cell should be out of edit mode
						expect(editdCell.isInEditMode()).to.eventually.be.false;

						// cell should be shown as dirty
						expect(editdCell.isDirty()).to.eventually.equal('true');
						// the status column should also be indicate dirty status of the row
						expect(editedRow.isDirty()).to.eventually.be.true;

						// try to save the edit with invalid data
						viewBomPage.commandBar.controlButtons.saveButton.click();

						// Bom Should remain in edit mode and control buttons should be there
						expect(viewBomPage.commandBar.controlButtons.saveButton.isDisplayed()).to.eventually.be.true;
						expect(viewBomPage.commandBar.controlButtons.cancelButton.isDisplayed()).to.eventually.be.true;

						// cell status should indicate invalid
						expect(editdCell.isInvalid()).to.eventually.be.true;
						// Status column should show be invalid
						expect(editedRow.isInvalid()).to.eventually.be.true;
					});
				});
			});

			// Disabled pending ability to change user's permissions or otherwise testing with changing permissions/workspaces
			xit('displays an enabled "Edit" button if the user has "Add, Edit, or Delete" permission, "Overrided Release Lock" permission, and the item is released', function () {
				this._runnable.ssName = 'BomView-displayEditButtonEnabledOverrideReleased';

				// TODO: Change User's Permissions to include Override Release Lock

				expect(viewBomPage.commandBar.editButton.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.editButton.isDisabled()).to.eventaully.be.false;

				// TODO: Clean up User's Permissons (remove Override Release Lock)
			});

			// Disabled pending ability to change user's permissions or otherwise testing with changing permissions/workspaces/users
			xit('displays an enabled "Edit" button if the user has "Add, Edit, or Delete" permission, "Overrided Workflow Lock" permission, and the item is locked', function () {
				this._runnable.ssName = 'BomView-displayEditButtonEnabledOverrideWorkflow';

				// TODO: Change User's Permissions to include Override Workflow Lock

				expect(viewBomPage.commandBar.editButton.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.editButton.isDisabled()).to.eventaully.be.false;

				// TODO: Clean up User's Permissons (remove Override Workflow Lock)
			});

			// Disabled pending ability to change user's permissions or otherwise testing with changing permissions/workspaces/users
			xit('does not display an "Edit" button if the user does not have "Add, Edit, or Delete" permission', function () {
				this._runnable.ssName = 'BomView-notDisplayedEditButton';

				// TODO: Change User's Permissions to not include Add, Edit, or Delete Permissions

				expect(viewBomPage.commandBar.editButton.isDisplayed()).to.eventually.be.false;

				// TODO: Clean up User's Permissons (re-add permissions we removed to complete the above)
			});
		});

		describe('[AddButton]', function () {
			it('displays a disabled "Add" button if the user has "Add Bom" permission and the item is released', function () {
				this._runnable.ssName = 'BomView-displayAddButtonDisabled';

				expect(viewBomPage.commandBar.addButton.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.addButton.isDisabled()).to.eventually.be.true;
			});

			describe('[ProductItem]', function () {

				// Go to product item first to prevent multiple navigations
				before(function () {
					viewBomPage.goToItem('productItem');
				});

				after(function () {
					// return to bom page
					viewBomPage.goToDefaultItem();
				});

				var initialRowCount = 13;
				var expectedRowCount = initialRowCount;

				it('displays an enabled "Add" button if the user has "Add Bom" permission and the item is not released (working)', function () {
					this._runnable.ssName = 'BomView-displayAddButtonEnabled';

					// Button should be available
					expect(viewBomPage.commandBar.addButton.isDisplayed()).to.be.eventually.true;
					expect(viewBomPage.commandBar.addButton.isDisabled()).to.be.eventually.false;

					// Flyout element doesn't even exist at this point, so only check for presence at first
					expect(AddItemFlyout.isAddItemFlyoutPresent()).to.eventually.be.false;
					viewBomPage.commandBar.addButton.click();
					expect(AddItemFlyout.isAddItemFlyoutDisplayed()).to.eventually.be.true;
					// add button should be disabled when there is an open flyout
					expect(viewBomPage.commandBar.addButton.isDisabled()).to.be.eventually.true;

					// clean up
					AddItemFlyout.closeAddItemsFlyout();
					expect(AddItemFlyout.isAddItemFlyoutPresent()).to.eventually.be.false;
					// closing the flyout should re-enable the add button
					expect(viewBomPage.commandBar.addButton.isDisabled()).to.be.eventually.false;
				});

				it('It should select an item from the flyout and then it selecting add should take the bom to edit mode', function () {

					this._runnable.ssName = 'BomView-AddItemFromFlyout';

					var itemToAdd = viewBomPage.items.addedItems[0];

					// Table should start with the expected number of rows
					expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedRowCount);

					// Flyout element doesn't even exist at this point, so only check for presence at first
					expect(AddItemFlyout.isAddItemFlyoutPresent()).to.eventually.be.false;
					viewBomPage.commandBar.addButton.click();
					expect(AddItemFlyout.isAddItemFlyoutDisplayed()).to.eventually.be.true;
					// add button should be disabled when there is an open flyout
					expect(viewBomPage.commandBar.addButton.isDisabled()).to.be.eventually.true;

					// We need to use the name here since AddItemFlyout does not allow selection by dmsid
					AddItemFlyout.selectItem(itemToAdd.title);
					AddItemFlyout.add();
					expectedRowCount++;

					// control buttons should be present in edit mode.
					expect(viewBomPage.commandBar.controlButtons.saveButton.isDisplayed()).to.eventually.be.true;
					expect(viewBomPage.commandBar.controlButtons.cancelButton.isDisplayed()).to.eventually.be.true;
					// add button should be re-enabled when the flyout is closed
					expect(viewBomPage.commandBar.addButton.isDisabled()).to.be.eventually.false;
					expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedRowCount);
				});

				it('Should show the newly added row in the correct color', function () {
					this._runnable.ssName = 'BomView-AddedItemStyling';

					var addedRow = viewBomPage.bom.table.rows.getRow(expectedRowCount - 1);

					expect(addedRow.locator.element(by.className('added-ui-grid-row')).isPresent()).to.eventually.be.true;
				});

				it('Should be able to edit the item number of the newly added row', function () {
					this._runnable.ssName = 'BomView-ItemNumberEdit';
					var row = 13;
					var column = viewBomPage.bom.views.defaultView.columns.itemNumber;
					var cell = viewBomPage.bom.table.rows.getCell(row, column);

					// item number cell of the newly added row should have default item number
					expect(cell.locator.element(by.binding('fieldData.value.itemNumber')).getText(), 'Cell value').to.eventually.equal('1.13');

					// initially cell is in edit mode
					expect(cell.isInEditMode()).to.eventually.be.false;

					// click on the bom-item-number cell and make sure its in edit mode
					cell.locator.element(by.css('bom-item-number')).click();
					expect(cell.isInEditMode()).to.eventually.be.true;

					// clear the input field and enter a new value
					cell.locator.element (by.css ('input')).clear();
					cell.locator.element(by.css('input')).sendKeys('2016');

					// click out side of the and make sure the cell is no longer in edit mode
					viewBomPage.bom.header.click();
					expect(cell.isInEditMode()).to.eventually.be.false;
				});

				it('It should be able to edit other editable cells of newly added row ', function () {

					this._runnable.ssName = 'BomView-editCellsOfNewlyAddedRow';
					var row = 13;
					var column = viewBomPage.bom.views.defaultView.columns.quantity;

					// quantity field
					var cell = viewBomPage.bom.table.rows.getCell(row, column);

					expect(cell.isInEditMode()).to.eventually.be.false;
					cell.attemptToEnterEditMode();
					expect(cell.isInEditMode()).to.eventually.be.true;

					// there should be no initial value in the cell
					expect(cell.locator.element(by.model('fieldData.value')).getText(), 'Cell value').to.eventually.equal('');

					cell.locator.element(by.css('input')).sendKeys('50.0');
					viewBomPage.bom.header.click();
				});

				it('Should persist the new row with edited fields', function () {
					// Save the item with edited field
					viewBomPage.commandBar.controlButtons.saveButton.click();

					var row = 13;
					var quantityCell = viewBomPage.bom.table.rows.getCell(row, viewBomPage.bom.views.defaultView.columns.quantity);
					var itemNumbercell = viewBomPage.bom.table.rows.getCell(row, viewBomPage.bom.views.defaultView.columns.itemNumber);

					// verify that the edited fields contains the correct value
					expect(quantityCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('50.0');
					expect(itemNumbercell.locator.element(by.binding('fieldData.value.itemNumber')).getText(), 'Cell value').to.eventually.equal('1.2016');
				});

				it('[REMOVE] Cleans itself up after "add" tests', function () {
					this._runnable.ssName = 'BomView-addCleanup';

					for (let addedRowPos = expectedRowCount; addedRowPos > initialRowCount; --addedRowPos) {
						let checkboxColumn = viewBomPage.bom.views.defaultView.columns.checkbox;
						let addedRowIndex = addedRowPos - 1;
						let checkableCheckbox = viewBomPage.bom.table.rows
													.getCell(addedRowIndex, checkboxColumn)
													.locator.element(by.css('input[type="checkbox"]'));

						checkableCheckbox.click();
						expect(checkableCheckbox.isSelected()).to.eventually.be.true;
					}
					viewBomPage.commandBar.removeButton.click();
					expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
					viewBomPage.commandBar.controlButtons.saveButton.click();

					expectedRowCount = initialRowCount;

					expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedRowCount);
				});
			});

			// Disabled pending ability to change user's permissions or otherwise testing with changing permissions/workspaces
			xit('displays an enabled "Add" button if the user has "Add Bom" permission, "Overrided Release Lock" permission, and the item is released', function () {
				this._runnable.ssName = 'BomView-displayAddButtonEnabledOverrideReleased';

				// TODO: Change User's Permissions to include Override Release Lock

				expect(viewBomPage.commandBar.addButton.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.addButton.isDisabled()).to.eventaully.be.false;

				// TODO: Clean up User's Permissons (remove Override Release Lock)
			});

			// Disabled pending ability to change user's permissions or otherwise testing with changing permissions/workspaces/users
			xit('displays an enabled "Add" button if the user has "Add Bom" permission, "Overrided Workflow Lock" permission, and the item is locked', function () {
				this._runnable.ssName = 'BomView-displayAddButtonEnabledOverrideWorkflow';

				// TODO: Change User's Permissions to include Override Workflow Lock

				expect(viewBomPage.commandBar.addButton.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.addButton.isDisabled()).to.eventaully.be.false;

				// TODO: Clean up User's Permissons (remove Override Workflow Lock)
			});

			// Disabled pending ability to change user's permissions or otherwise testing with changing permissions/workspaces
			xit('does not display an "Add" button if the user does not have "Add Bom" permission', function () {
				this._runnable.ssName = 'BomView-notDisplayedAddButton';

				// TODO: Change User's Permissions to not include Add, Edit, or Delete Permissions

				expect(viewBomPage.commandBar.addButton.isDisplayed()).to.eventually.be.false;

				// TODO: Clean up User's Permissons (re-add permissions we removed to complete the above)
			});
		});

		describe('[Actions Button]', function () {
			it('Should display the actions button', function () {
				this._runnable.ssName = 'BomView-ActionsButtonDisplayed';
				expect(viewBomPage.commandBar.actionsDropdown.button.isDisplayed()).to.eventually.be.true;
			});

			it('Should show the actions dropdown with the correct options when clicked', function () {
				this._runnable.ssName = 'BomView-ActionsButtonDisplayed';

				viewBomPage.commandBar.actionsDropdown.button.click();

				expect(viewBomPage.commandBar.actionsDropdown.dropdown.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.commandBar.actionsDropdown.dropdown.values.getCount()).to.eventually.equal(1);

				viewBomPage.commandBar.actionsDropdown.button.click();
			});
		});

		describe('[ViewSelection]', function () {
			it('dropdown selector should be displayed', function () {
				this._runnable.ssName = 'BomView-viewSelectionDisplayed';

				expect(viewBomPage.commandBar.viewsDropdown.button.isDisplayed()).to.eventually.be.true;
			});

			it('dropdown selector should be able to be opened (clickable)', function () {
				this._runnable.ssName = 'BomView-viewSelectionOpenable';

				// should be initially hidden
				expect(viewBomPage.commandBar.viewsDropdown.dropdown.isDisplayed()).to.eventually.be.false;

				// lets open the dropdown
				viewBomPage.commandBar.viewsDropdown.button.click();

				// expect to see the opened dropdown
				expect(viewBomPage.commandBar.viewsDropdown.dropdown.isDisplayed()).to.eventually.be.true;

				// cleanup
				viewBomPage.commandBar.viewsDropdown.button.click();
			});

			it('should have the correct number of view options', function () {
				this._runnable.ssName = 'BomView-viewSelectionOptionCount';
				var expectedCount = 2;

				viewBomPage.commandBar.viewsDropdown.button.click();
				expect(viewBomPage.commandBar.viewsDropdown.dropdown.values.getCount()).to.eventually.equal(2);

				// cleanup
				viewBomPage.commandBar.viewsDropdown.button.click();
			});

			it('should be able to change views and update the bom columns', function () {
				this._runnable.ssName = 'BomView-viewSelectionChangeable';

				// Check that we are in default view
				viewBomPage.bom.views.defaultView.isInViewTest();

				// Change view
				viewBomPage.commandBar.viewsDropdown.button.click();
				viewBomPage.commandBar.viewsDropdown.dropdown.values.clickValue(viewBomPage.bom.views.secondaryView.index);

				// Check that we are in secondary view
				viewBomPage.bom.views.secondaryView.isInViewTest();
			});

			it('should persist the changed view on page reload', function () {
				this._runnable.ssName = 'BomView-viewSelectionPersists';

				// Check that we are in secondary view
				viewBomPage.bom.views.secondaryView.isInViewTest();

				// Refresh the page
				browser.refresh();

				// Check that we are still in secondary view
				viewBomPage.bom.views.secondaryView.isInViewTest();
			});

			it('should return the original view', function () {
				this._runnable.ssName = 'BomView-viewSelectionCleanup';

				// Check that we are in secondary view
				viewBomPage.bom.views.secondaryView.isInViewTest();

				// Change view
				viewBomPage.commandBar.viewsDropdown.button.click();
				viewBomPage.commandBar.viewsDropdown.dropdown.values.clickValue(viewBomPage.bom.views.defaultView.index);

				// Check that we are in default view
				viewBomPage.bom.views.defaultView.isInViewTest();
			});
		});

		describe('[BomHeader]', function () {
			it('displays the View title in the section header', function () {
				this._runnable.ssName = 'BomView-viewTitle';

				expect(viewBomPage.bom.header.getViewTitle()).to.eventually.equal('Default View');
			});

			it('displays the View date in the section header', function () {
				this._runnable.ssName = 'BomView-viewDate';

				expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('Today');
			});

			it('displays the View bias in the section header', function () {
				this._runnable.ssName = 'BomView-viewBias';

				expect(viewBomPage.bom.header.getBias()).to.eventually.equal('Released Revisions');
			});
		});

		describe('[BomTable]', function () {
			it('displays the bom table', function () {
				this._runnable.ssName = 'BomView-bomTableDisplayed';

				expect(viewBomPage.bom.table.isDisplayed()).to.eventually.be.true;
			});

			it('table contains some expected rows', function () {
				this._runnable.ssName = 'BomView-bomTableRows';

				// Expected row count (including top line)
				var expectedRowCount = 11;

				expect(viewBomPage.bom.table.isDisplayed()).to.eventually.be.true;
				expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedRowCount);
			});

			describe('[FieldSelector]', function () {
				it('renders single-line-text cells with expected value', function () {
					this._runnable.ssName = 'BomView-cellDisplayed';

					// Checking a field for topline
					var row = 0;
					var column = viewBomPage.bom.views.defaultView.columns.revision;
					// Value we expect
					var expectedCellValue = 'B';

					expect(viewBomPage.bom.table.rows.getCell(row, column).locator.element(by.css('span > span')).getText()).to.eventually.equal(expectedCellValue);
				});

				it('renders float cells with expected value', function () {
					this._runnable.ssName = 'BomView-cellDisplayed';

					// Checking a field for topline
					var row = 1;
					var column = viewBomPage.bom.views.defaultView.columns.quantity;
					// Value we expect
					var expectedCellValue = '8.1';

					expect(viewBomPage.bom.table.rows.getCell(row, column).locator.element(by.css('span > span')).getText()).to.eventually.equal(expectedCellValue);
				});
			});

			it('changes column width when the resize handler is dragged', function () {
				this._runnable.ssName = 'BomView-resizeColumn';

				var initialWidth, finalWidth;
				var dragOffset = {
					x: 200,
					y: 0
				};
				var resizableColumn = viewBomPage.bom.views.defaultView.columns.descriptor;

				viewBomPage.bom.table.getColumnWidth(resizableColumn).then(function (width) {
					initialWidth = width;
					// Resize the column using the offset specified above
					browser.actions()
						.dragAndDrop(viewBomPage.bom.table.columnResizers.locator.get(resizableColumn), dragOffset)
						.perform();

					// Width after resizing
					return viewBomPage.bom.table.getColumnWidth(resizableColumn);
				}).then(function (width) {
					finalWidth = width;

					expect(initialWidth).to.not.equal(finalWidth);
				});
			});

			it('collapses and expands nodes', function () {
				this._runnable.ssName = 'BomView-tableNodeCollapseExpand';

				// Toggling the topline
				var rowToToggle = 0;
				// Expected expanded/collapsed counts
				var expectedExpandedRowCount = 11;
				var expectedCollapsedRowCount = 1;

				// Check Initial Count
				expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedExpandedRowCount);

				// Expand the first expandable row
				viewBomPage.bom.table.rows.getRow(rowToToggle).toggleExpansion();
				expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedCollapsedRowCount);

				// collapse the first expandable row
				viewBomPage.bom.table.rows.getRow(rowToToggle).toggleExpansion();
				expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedExpandedRowCount);
			});

			it('doesnt have expanders for rows without children', function () {
				this._runnable.ssName = 'BomView-tableNodeCollapseExpand';

				// Items with and without children (and therefore expanders)
				var rowWithChildren = 0;
				var rowWithoutChildren = 1;

				// Expected Initial Row Count
				var initialRowCount = 11;

				// Expect we have the top line expanded
				expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(initialRowCount);

				// Expect the first row to be expandable
				expect(viewBomPage.bom.table.rows.getRow(rowWithChildren).isExpandable()).to.eventually.be.true;

				// Expect the second row to not be expandable
				expect(viewBomPage.bom.table.rows.getRow(rowWithoutChildren).isExpandable()).to.eventually.be.false;
			});

			describe('[Selection column]', function () {
				let checkboxColumn = viewBomPage.bom.views.defaultView.columns.checkbox;
				let checkableRow = 1;
				let checkableCheckbox = viewBomPage.bom.table.rows
											.getCell(checkableRow, checkboxColumn)
											.locator.element(by.css('input[type="checkbox"]'));
				let notCheckableRow = 0;
				let notCheckableCheckbox = viewBomPage.bom.table.rows
											.getCell(notCheckableRow, checkboxColumn)
											.locator.element(by.css('input[type="checkbox"]'));

				it('Shows checkboxes in rows', function () {
					this._runnable.ssName = 'BomView-tableCheckboxesDisplayed';

					expect(checkableCheckbox.isPresent()).to.eventually.be.true;
					expect(notCheckableCheckbox.isPresent()).to.eventually.be.true;
				});

				it('Shows checkboxs for rows that are first level children as enabled', function () {
					this._runnable.ssName = 'BomView-tableFirstLevelCheckboxesEnabled';

					expect(checkableCheckbox.isEnabled()).to.eventually.be.true;
				});

				it('Shows checkboxs for rows that are not first level children as disabled', function () {
					this._runnable.ssName = 'BomView-tableNotFirstLevelCheckboxesDisabled';

					expect(notCheckableCheckbox.isEnabled()).to.eventually.be.false;
				});
			});

			it('Does not set a cell to edit mode when clicking it when in view mode', function () {
				this._runnable.ssName = 'BomView-noEditInViewMode';

				var row = 1;
				var column = viewBomPage.bom.views.defaultView.columns.quantity;

				var cell = viewBomPage.bom.table.rows.getCell(row, column);

				expect(cell.isInEditMode()).to.eventually.be.false;
				cell.attemptToEnterEditMode();
				expect(cell.isInEditMode()).to.eventually.be.false;
			});

			describe('[Links]', function () {
				afterEach(function () {
					// Return to page whether or not link traversed to the correct place
					viewBomPage.goToDefaultItem();
				});

				it('shows item descriptor link is a link and traverses to the URL we expect', function () {
					this._runnable.ssName = 'BomView-itemDescriptorLink';

					// Row/Column for a corresponding cell which contains a link (topline descriptor)
					var row = 0;
					var column = viewBomPage.bom.views.defaultView.columns.descriptor;

					// Make sure we have the link
					expect(viewBomPage.bom.table.rows.getCell(row, column).isALink()).to.eventually.be.true;

					// Now lets follow it
					viewBomPage.bom.table.rows.getCell(row, column).clickLink();

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

				describe('[ChangeOrderCell]', function () {
					it('Should not show a change order icon if there is no associated change order', function () {
						this._runnable.ssName = 'BomView-noItemChangeOrderIcon';

						// Row/Column for a corresponding cell which does not contain a change order icon link
						var row = 5;
						var column = viewBomPage.bom.views.defaultView.columns.changeOrder;

						expect(viewBomPage.bom.table.rows.getCell(row, column).isALink()).to.eventually.be.false;
					});

					it('Should show a change order icon that traverses to the URL we expect for an item that has an associated change order', function () {
						this._runnable.ssName = 'BomView-itemChangeOrderIcon';

						// Row/Column for a corresponding cell which contains a change order icon link
						var row = 6;
						var column = viewBomPage.bom.views.defaultView.columns.changeOrder;

						// Make sure we have the link
						expect(viewBomPage.bom.table.rows.getCell(row, column).isALink()).to.eventually.be.true;

						// Now lets follow it
						viewBomPage.bom.table.rows.getCell(row, column).clickLink();

						// This is the same test used in Item Details to ensure "we actually made it"
						//	App header should be displayed
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
				});
			});
		});

		describe('[EditMode]', function () {
			describe('[Product item]', function () {
				before(function () {
					viewBomPage.goToItem('productItem');
				});

				after(function () {
					viewBomPage.goToDefaultItem();
				});

				it('Sets a cell with a value to edit mode upon clicking it when in edit mode', function () {
					this._runnable.ssName = 'BomView-canEditInEditMode';

					viewBomPage.bom.enterEditMode();

					var row = 1;
					var column = viewBomPage.bom.views.defaultView.columns.quantity;

					var cell = viewBomPage.bom.table.rows.getCell(row, column);

					expect(cell.isInEditMode()).to.eventually.be.false;
					cell.attemptToEnterEditMode();
					expect(cell.isInEditMode()).to.eventually.be.true;

					// Cleanup
					// The header doesn't do anything when clicked, so just click it to cancel editing of cell
					viewBomPage.bom.header.click();
					expect(cell.isInEditMode()).to.eventually.be.false;
					// Exit edit mode
					viewBomPage.commandBar.controlButtons.cancelButton.click();
					expect(viewBomPage.bom.table.isDisplayed(), 'Cleanup: bom table reloaded').to.eventually.be.true;
				});

				// Requires an item with a blank optional BOM property in order to test
				xit('Sets a cell without a value to edit mode upon clicking it when in edit mode', function () {
					this._runnable.ssName = 'BomView-canEditEmptyInEditMode';

					var row = -1;
					var column = -1;

					var cell = viewBomPage.bom.table.rows.getCell(row, column);

					expect(cell.isInEditMode()).to.eventually.be.false;
					cell.attemptToEnterEditMode();
					expect(cell.isInEditMode()).to.eventually.be.true;

					// Cleanup
					// The header doesn't do anything when clicked, so just click it to cancel editing of cell
					viewBomPage.bom.header.click();
					expect(cell.isInEditMode()).to.eventually.be.false;
					// Exit edit mode
					viewBomPage.commandBar.controlButtons.cancelButton.click();
					expect(viewBomPage.bom.table.isDisplayed(), 'Cleanup: bom table reloaded').to.eventually.be.true;
				});

				it('Returns to view mode with a change persisted when save is clicked after changing the value of a field', function () {
					this._runnable.ssName = 'BomView-canPersistEditsFromEditMode';

					viewBomPage.bom.enterEditMode();

					var row = 2;
					var column = viewBomPage.bom.views.defaultView.columns.quantity;

					var cell = viewBomPage.bom.table.rows.getCell(row, column);

					// Should use a field selector component for access if it becomes avaiable
					var previousValue;
					cell.locator.element(by.css('float-field span span')).getText().then((value) => {
						previousValue = value;

						cell.attemptToEnterEditMode();
						expect(cell.isInEditMode(), 'Cell in edit mode').to.eventually.be.true;
						let input = cell.locator.element(by.css('input'));
						input.clear();
						input.sendKeys('30.0');
						viewBomPage.bom.header.click();
						expect(cell.isInEditMode(), 'Cell in edit mode').to.eventually.be.false;

						// Save the change
						viewBomPage.commandBar.controlButtons.saveButton.click();

						expect(viewBomPage.bom.table.isDisplayed(), 'bom table reloaded').to.eventually.be.true;
						expect(viewBomPage.bom.isInViewMode(), 'in view mode').to.eventually.be.true;
						expect(cell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('30.0');

						// Cleanup
						viewBomPage.bom.enterEditMode();
						cell.attemptToEnterEditMode();
						expect(cell.isInEditMode(), 'Cleanup: Cell in edit mode').to.eventually.be.true;
						input.clear();
						input.sendKeys(previousValue);
						viewBomPage.bom.header.click();
						expect(cell.isInEditMode(), 'Cleanup: Cell in edit mode').to.eventually.be.false;
						viewBomPage.commandBar.controlButtons.saveButton.click();
						expect(viewBomPage.bom.table.isDisplayed(), 'Cleanup: bom table reloaded').to.eventually.be.true;
						expect(viewBomPage.bom.isInViewMode(), 'Cleanup: in view mode').to.eventually.be.true;
						expect(cell.locator.element(by.css('float-field span span')).getText(), 'Cleanup: Cell value').to.eventually.equal(previousValue);
					});
				});

				it('Stays in edit mode with failing changes still applied after clicking save', function () {
					this._runnable.ssName = 'BomView-canReapplyFailingEdits';

					viewBomPage.bom.enterEditMode();

					var row = 2;
					var column = viewBomPage.bom.views.defaultView.columns.quantity;

					var cell = viewBomPage.bom.table.rows.getCell(row, column);

					// Should use a field selector component for access if it becomes avaiable
					var previousValue;
					cell.locator.element(by.css('float-field span span')).getText().then((value) => {
						previousValue = value;

						cell.attemptToEnterEditMode();
						expect(cell.isInEditMode(), 'Cell in edit mode').to.eventually.be.true;
						let input = cell.locator.element(by.css('input'));
						input.clear();
						// Not the best invalid input, since it gives a Jersey error instead of something meaningful
						input.sendKeys('adsk');
						viewBomPage.bom.header.click();
						expect(cell.isInEditMode(), 'Cell in edit mode').to.eventually.be.false;

						// Attempt to Save the change
						viewBomPage.commandBar.controlButtons.saveButton.click();

						expect(viewBomPage.bom.table.isDisplayed(), 'bom table reloaded').to.eventually.be.true;
						expect(viewBomPage.bom.isInViewMode(), 'in view mode').to.eventually.be.false;
						expect(cell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('adsk');

						// clicking on a cell takes it to edit mode
						cell.attemptToEnterEditMode();
						expect(cell.isInEditMode()).to.eventually.be.true;

						// clear the cell and enter a new value
						cell.locator.element(by.css('input')).clear();
						cell.locator.element(by.css('input')).sendKeys(previousValue);
						// take the cell out of edit mode
						viewBomPage.bom.header.click();
						expect(cell.isInEditMode()).to.eventually.be.false;

						// Cleanup
						viewBomPage.commandBar.controlButtons.cancelButton.click();
						expect(cell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal(previousValue);
					});
				});

				describe('[REMOVE]', function () {
					let checkboxColumn = viewBomPage.bom.views.defaultView.columns.checkbox;
					let quantityColumn = viewBomPage.bom.views.defaultView.columns.quantity;
					let checkableRow = 1;
					let checkableCheckbox = viewBomPage.bom.table.rows
												.getCell(checkableRow, checkboxColumn)
												.locator.element(by.css('input[type="checkbox"]'));

					it('Enters edit mode and unchecks checked cells when clicking Remove while not in edit mode', function () {
						this._runnable.ssName = 'BomView-removeButtonFromViewMode';

						checkableCheckbox.click();
						expect(checkableCheckbox.isSelected()).to.eventually.be.true;
						viewBomPage.commandBar.removeButton.click();
						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
						expect(checkableCheckbox.isSelected()).to.eventually.be.false;

						// Cleanup
						viewBomPage.commandBar.controlButtons.cancelButton.click().then (() =>{
							// Needs to revisited to avoid using sleep.
							viewBomPage.getLeaveButton().click();
							browser.sleep(1000);
						});
					});

					it('unchecks checked cells when clicking Remove while in edit mode', function () {
						this._runnable.ssName = 'BomView-removeButtonFromEditMode';

						viewBomPage.bom.enterEditMode();
						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
						checkableCheckbox.click();
						expect(checkableCheckbox.isSelected()).to.eventually.be.true;
						viewBomPage.commandBar.removeButton.click();
						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
						expect(checkableCheckbox.isSelected()).to.eventually.be.false;
						// Cleanup
						viewBomPage.commandBar.controlButtons.cancelButton.click().then (() =>{
							// Needs to revisited to avoid using sleep.
							viewBomPage.getLeaveButton().click();
							browser.sleep(1000);
						});
					});
					it('should apply proper styling to the rows marked for removal', function () {
						this._runnable.ssName = 'BomView-removedItemStyling';

						viewBomPage.bom.enterEditMode();
						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
						checkableCheckbox.click();
						expect(checkableCheckbox.isSelected()).to.eventually.be.true;
						viewBomPage.commandBar.removeButton.click();
						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
						expect(checkableCheckbox.isSelected()).to.eventually.be.false;

						let rowToRemoe = viewBomPage.bom.table.rows.getRow(checkableRow);
						expect(rowToRemoe.locator.element(by.className('pending-remove-ui-grid-row')).isPresent()).to.eventually.be.true;

						// Cleanup
						viewBomPage.commandBar.controlButtons.cancelButton.click().then (() =>{
							// Needs to revisited to avoid using sleep.
							viewBomPage.getLeaveButton().click();
							browser.sleep(1000);
						});
					});

					it('Should revert any edits from a row that is marked for removal and make the cells non editable.', function () {
						this._runnable.ssName = 'BomView-revertEditAndDisableCells';

						// The cells of the row should not be editable.
						let quantityCell = viewBomPage.bom.table.rows.getCell(checkableRow, quantityColumn);

						viewBomPage.bom.enterEditMode();
						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;

						// Initial value of quantityCell
						expect(quantityCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('1.0');

						// Edit the cells of the row.
						quantityCell.attemptToEnterEditMode();
						expect(quantityCell.isInEditMode()).to.eventually.be.true;

						quantityCell.locator.element(by.css('input')).clear();
						quantityCell.locator.element(by.css('input')).sendKeys('25');

						viewBomPage.bom.header.click();

						expect(quantityCell.isInEditMode()).to.eventually.be.false;
						expect(quantityCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('25.0');

						checkableCheckbox.click();

						expect(checkableCheckbox.isSelected()).to.eventually.be.true;
						viewBomPage.commandBar.removeButton.click();

						expect(viewBomPage.bom.isInViewMode()).to.eventually.be.false;
						expect(checkableCheckbox.isSelected()).to.eventually.be.false;

						let rowToRemoe = viewBomPage.bom.table.rows.getRow(checkableRow);
						expect(rowToRemoe.locator.element(by.className('pending-remove-ui-grid-row')).isPresent()).to.eventually.be.true;

						// The cell value should be reverted to its original value.
						expect(quantityCell.locator.element(by.css('float-field span span')).getText(), 'Cell value').to.eventually.equal('1.0');
						quantityCell.attemptToEnterEditMode();

						// Make sure that the cell did not enter edit mode.
						expect(quantityCell.isInEditMode()).to.eventually.be.false;

						// Cleanup
						viewBomPage.commandBar.controlButtons.cancelButton.click().then (() =>{
							// Needs to revisited to avoid using sleep.
							viewBomPage.getLeaveButton().click();
							browser.sleep(1000);
						});
					});

					it('Should be able to remove a newly added item by selecting it and then clicking on remove button.', function () {
						this._runnable.ssName = 'BomView-RemoveNewlyAddedRows';
					  let initialRowCount = 13;
					  let expectedRowCount = initialRowCount;
					  checkableRow = 13;
					  let checkableCheckbox = viewBomPage.bom.table.rows
					                .getCell(checkableRow, checkboxColumn)
					                .locator.element(by.css('input[type="checkbox"]'));

					  let itemToAdd = viewBomPage.items.addedItems[0];

					  // Table should start with the expected number of rows
					  expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedRowCount);
					  expect(AddItemFlyout.isAddItemFlyoutPresent()).to.eventually.be.false;

					  viewBomPage.commandBar.addButton.click();

					  expect(AddItemFlyout.isAddItemFlyoutDisplayed()).to.eventually.be.true;
					  AddItemFlyout.selectItem(itemToAdd.title);
					  AddItemFlyout.add();
					  expectedRowCount++;

					  // control buttons should be present in edit mode.
					  expect(viewBomPage.commandBar.controlButtons.saveButton.isDisplayed()).to.eventually.be.true;
					  expect(viewBomPage.commandBar.controlButtons.cancelButton.isDisplayed()).to.eventually.be.true;

						// Verify that numbers rows in the table has increamented.
					  expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(expectedRowCount);

						// Remove the newly added row.
						checkableCheckbox.click();
						expect(checkableCheckbox.isSelected()).to.eventually.be.true;
						viewBomPage.commandBar.removeButton.click();

						// verify that the newly added row has been removed.
						expect(viewBomPage.bom.table.rows.getCount()).to.eventually.equal(initialRowCount);
					});
				});
			});

			describe('[Items and Boms item]', function () {
				let row = 8;
				let pinColumn = viewBomPage.bom.views.defaultView.columns.pinning;
				let revisionColumn = viewBomPage.bom.views.defaultView.columns.revision;

				let revisionCell = viewBomPage.bom.table.rows.getCell(row, revisionColumn);
				let revisionCellText = revisionCell.locator.element(by.css('selection-field span span span'));

				let pinningCell = viewBomPage.bom.table.rows.getCell(row, pinColumn);
				let pin = pinningCell.locator.element(by.css('.icon-a360-pin'));

				// Need to test on this item because revisions are bugged on non-revisioned workspaces (PLM-12749)
				before(function () {
					viewBomPage.goToItem('unlockedForChangesItem');

					// Check that the row is not pinned
					expect(pin.isPresent(), 'precheck row not pinned').to.eventually.be.false;
					viewBomPage.bom.enterEditMode();
				});

				after(function () {
					viewBomPage.goToDefaultItem();
				});

				describe('[Save pinning an item]', function () {

					it('Can change the revision', function () {
						this._runnable.ssName = 'BomView-canChangeRevisionFromEditMode';

						revisionCell.attemptToEnterEditMode();
						expect(revisionCell.isInEditMode(), 'Cell in edit mode').to.eventually.be.true;

						let dropdown = revisionCell.locator.element(by.css('.ui.dropdown'));

						// Open dropdown menu
						dropdown.click();
						// Check menu visible
						expect(dropdown.element(by.css('.menu'), 'menu displayed').isDisplayed()).to.eventually.be.true;
						// Select revision A
						dropdown.element(by.css('.menu .item:nth-child(2)')).click();

						// Exit edit mode
						viewBomPage.bom.header.click();
						expect(revisionCell.isInEditMode(), 'Cell in edit mode').to.eventually.be.false;
						expect(revisionCellText.getText(), 'new revision').to.eventually.equal('A');
						expect(pin.isDisplayed(), 'icon fully visible').to.eventually.be.true;

						// Check that clicking the pin reverts the dropdown to latest revision
						pin.click();
						// Unselect the pin
						viewBomPage.bom.header.click();
						expect(revisionCellText.getText(), 'reverted revision').to.eventually.equal('B');
						expect(pin.isDisplayed(), 'icon not visible').to.eventually.be.false;
					});

					it('Can not modify pins that are not first level children', function () {
						this._runnable.ssName = 'BomView-cannotPinUnpinnableRows';

						let unpinnableRow = 0;
						let unpinnableCell = viewBomPage.bom.table.rows.getCell(unpinnableRow, pinColumn);
						let nonexistentPin = unpinnableCell.locator.element(by.css('.icon-a360-pin'));

						expect(nonexistentPin.isPresent(), 'icon present').to.eventually.be.false;
						browser.actions().mouseMove(unpinnableCell.locator).perform();
						expect(nonexistentPin.isPresent(), 'icon partially visible').to.eventually.be.false;
					});

					it('Can toggle the item pin', function () {
						// Disabled because of PLM-13175, which stops this functionality from working consistently
						this._runnable.ssName = 'BomView-canPinRowsFromEditMode';

						expect(pin.isPresent(), 'icon present').to.eventually.be.true;
						expect(pin.isDisplayed(), 'icon not visible').to.eventually.be.false;

						// Hover the cell
						browser.actions().mouseMove(pin).perform();

						expect(pin.isDisplayed(), 'icon partially visible').to.eventually.be.true;
						pin.click();

						// Unhover the cell
						browser.actions().mouseMove(viewBomPage.bom.header.locator).perform();
						expect(pin.isDisplayed(), 'icon fully visible').to.eventually.be.true;

						// Attempt to Save the change
						viewBomPage.commandBar.controlButtons.saveButton.click();

						expect(viewBomPage.bom.table.isDisplayed(), 'bom table reloaded').to.eventually.be.true;
						expect(viewBomPage.bom.isInViewMode(), 'in view mode').to.eventually.be.true;
						expect(pin.isPresent(), 'row pinned (present)').to.eventually.be.true;
						expect(pin.isDisplayed(), 'row pinned (displayed)').to.eventually.be.true;
						expect(revisionCellText.getText(), 'new revision').to.eventually.equal('B');

						// Cleanup
						viewBomPage.bom.enterEditMode();
						pin.click();
						// click off the pin so it isn't selected
						viewBomPage.bom.header.click();
						expect(pin.isDisplayed(), 'Cleanup: icon not visible').to.eventually.be.false;
						viewBomPage.commandBar.controlButtons.saveButton.click();
						expect(viewBomPage.bom.table.isDisplayed(), 'Cleanup: bom table reloaded').to.eventually.be.true;
						expect(viewBomPage.bom.isInViewMode(), 'Cleanup: in view mode').to.eventually.be.true;
						expect(pin.isPresent(), 'Cleanup: row pinned').to.eventually.be.false;
					});

					it('Can pin a different revision', function () {
						// Disabled because of PLM-13175, which stops this functionality from working
						this._runnable.ssName = 'BomView-canPinRevision';

						viewBomPage.bom.enterEditMode();
						revisionCell.attemptToEnterEditMode();
						expect(revisionCell.isInEditMode(), 'Cell in edit mode').to.eventually.be.true;

						let dropdown = revisionCell.locator.element(by.css('.ui.dropdown'));
						dropdown.click();
						expect(dropdown.element(by.css('.menu'), 'menu displayed').isDisplayed()).to.eventually.be.true;
						dropdown.element(by.css('.menu .item:nth-child(2)')).click();
						viewBomPage.bom.header.click();
						expect(revisionCellText.getText(), 'revision picked').to.eventually.equal('A');

						viewBomPage.commandBar.controlButtons.saveButton.click();

						expect(viewBomPage.bom.table.isDisplayed(), 'bom table reloaded').to.eventually.be.true;
						expect(viewBomPage.bom.isInViewMode(), 'in view mode').to.eventually.be.true;
						expect(pin.isPresent(), 'row pinned').to.eventually.be.true;
						expect(pin.isDisplayed(), 'row pinned').to.eventually.be.true;
						expect(revisionCellText.getText(), 'new revision').to.eventually.equal('A');

						// Cleanup
						viewBomPage.bom.enterEditMode();
						pin.click();
						viewBomPage.commandBar.controlButtons.saveButton.click();
						expect(viewBomPage.bom.table.isDisplayed(), 'Cleanup: bom table reloaded').to.eventually.be.true;
						expect(pin.isPresent(), 'Cleanup: row pinned').to.eventually.be.false;
						expect(revisionCellText.getText(), 'cleanup: latest revision').to.eventually.equal('B');
					});
				});
			});
		});

		describe('[BomConfiguration]', function () {

			after(function () {
				viewBomPage.goToDefaultItem();
			});

			var checkToplineDescriptor = function (descriptor) {
				var column = viewBomPage.bom.views.defaultView.columns.descriptor;
				var cell = viewBomPage.bom.table.rows.getCell(0, column);
				expect(cell.locator.element(by.css('.ui-grid-cell-contents span')).getText(), 'Descriptor text').to.eventually.equal(descriptor);
			};

			var checkRevisionInSecondaryView = function (revision) {
				var column = viewBomPage.bom.views.secondaryView.columns.revision;
				var cell = viewBomPage.bom.table.rows.getCell(0, column);
				expect(cell.locator.element(by.css('.ui-grid-cell-contents selection-field span span span')).getText(), 'Revision text').to.eventually.equal(revision);
			};

			describe('[Navigating to item]', function () {
				it('Should configure the top row to the item we navigated to when navigating to a released item', function () {
					this._runnable.ssName = 'BomView-bomConfiguration-releasedItemTopline';

					viewBomPage.goToDefaultItem();

					checkToplineDescriptor(viewBomPage.items.defaultItem.descriptor);
					expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:B]');
				});

				it('Should configure the top row to the item we navigated to when navigating to a working item', function () {
					this._runnable.ssName = 'BomView-bomConfiguration-workingItemTopline';

					viewBomPage.goToItem('unlockedForChangesItem');

					checkToplineDescriptor(viewBomPage.items.unlockedForChangesItem.descriptor);
					expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:w]');
				});
			});

			describe('[Configuration changing]', function () {

				// Test the configuration dropdown's functionality
				configurationDropdownSpec.testDropdownFunctionality('BomView');

				describe('[Release Revisions]', function () {
					it('Should configure the top line to the correct revision when viewing a released revison and changing the date backwards', function () {
						this._runnable.ssName = 'BomView-bomConfiguration-dateChangedTopline';

						viewBomPage.goToDefaultItem();
						viewBomPage.commandBar.configurationDropdown.changeEffectiveDateToEarliest();

						checkToplineDescriptor(viewBomPage.items.supercededItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:sA]');

						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/02/2013');
					});

					it('Should configure the top line to the correct revision when viewing a released revison and changing the date forwards', function () {
						this._runnable.ssName = 'BomView-bomConfiguration-dateChangedTopline';

						checkToplineDescriptor(viewBomPage.items.supercededItem.descriptor);
						viewBomPage.commandBar.configurationDropdown.changeEffectiveDateToLatest();

						checkToplineDescriptor(viewBomPage.items.defaultItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:B]');
						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/11/2020');
					});

					it('[Changing view] Should maintain the current released revision and date when changing the view', function () {
						this._runnable.ssName = 'BomView-viewsDropdownReleasedRevision';

						viewBomPage.commandBar.viewsDropdown.changeToView(viewBomPage.bom.views.secondaryView.index);
						viewBomPage.bom.views.secondaryView.isInViewTest();

						checkRevisionInSecondaryView(viewBomPage.items.defaultItem.revision);

						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/11/2020');
					});

					it('[Changing view] Should maintain the current released revision and date when returning to original view', function () {
						this._runnable.ssName = 'BomView-viewsDropdownReleasedRevisionReturn';

						viewBomPage.commandBar.viewsDropdown.changeToView(viewBomPage.bom.views.defaultView.index);
						viewBomPage.bom.views.defaultView.isInViewTest();

						checkToplineDescriptor(viewBomPage.items.defaultItem.descriptor);

						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/11/2020');
					});
				});

				describe('[Working Revisions]', function () {
					it('Should change to the working revision and update the date when changing to the working bias from a released revision', function () {
						this._runnable.ssName = 'BomView-selectWorkingRevision';

						checkToplineDescriptor(viewBomPage.items.defaultItem.descriptor);
						viewBomPage.commandBar.configurationDropdown.changeToBias('working');

						expect(viewBomPage.bom.header.getEffectivityDate(), 'Header date').to.eventually.equal('01/11/2020');
						expect(viewBomPage.bom.header.getBias(), 'Header revision').to.eventually.equal('Working Revisions');
						checkToplineDescriptor(viewBomPage.items.unlockedForChangesItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:w]');
					});

					it('Should stay in the working revision and maintain the date when changing to the releaed bias from a working revision', function () {
						this._runnable.ssName = 'BomView-selectReleaseRevisionFromWorking';

						checkToplineDescriptor(viewBomPage.items.unlockedForChangesItem.descriptor);

						viewBomPage.commandBar.configurationDropdown.changeToBias('release');

						expect(viewBomPage.bom.header.getEffectivityDate(), 'Header date').to.eventually.equal('01/11/2020');
						expect(viewBomPage.bom.header.getBias(), 'Header revision').to.eventually.equal('Released Revisions');
						checkToplineDescriptor(viewBomPage.items.unlockedForChangesItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:w]');
					});

					it('[Changing View] Should maintain the current working revision, the bias, and the date when changing the view', function () {
						this._runnable.ssName = 'BomView-viewsDropdownWorkingRevision';

						viewBomPage.commandBar.viewsDropdown.changeToView(viewBomPage.bom.views.secondaryView.index);
						viewBomPage.bom.views.secondaryView.isInViewTest();

						expect(viewBomPage.bom.header.getEffectivityDate(), 'Header date').to.eventually.equal('01/11/2020');
						expect(viewBomPage.bom.header.getBias(), 'Header revision').to.eventually.equal('Released Revisions');

						// Can't check the descriptor while in export View
						checkRevisionInSecondaryView(viewBomPage.items.unlockedForChangesItem.revision);
					});

					it('[Changing View] Should maintain the current working revision, the bias, and the date when returning to the original view', function () {
						this._runnable.ssName = 'BomView-viewsDropdownWorkingRevisionReturn';

						viewBomPage.commandBar.viewsDropdown.changeToView(viewBomPage.bom.views.defaultView.index);
						viewBomPage.bom.views.defaultView.isInViewTest();

						expect(viewBomPage.bom.header.getEffectivityDate(), 'Header date').to.eventually.equal('01/11/2020');
						expect(viewBomPage.bom.header.getBias(), 'Header revision').to.eventually.equal('Released Revisions');

						checkToplineDescriptor(viewBomPage.items.unlockedForChangesItem.descriptor);
					});

					it('Should configure the top line to the working revision at the correct date when viewing a working revison and changing the date forward', function () {
						this._runnable.ssName = 'BomView-bomConfiguration-dateChangedForwardsFromWorkingTopline';

						viewBomPage.goToDefaultItem();
						viewBomPage.commandBar.configurationDropdown.changeToBias('working');
						viewBomPage.commandBar.configurationDropdown.changeEffectiveDateToLatest();

						checkToplineDescriptor(viewBomPage.items.unlockedForChangesItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:w]');

						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/11/2020');
					});

					it('Should configure the top line to the correct revision at the correct date when viewing a working revison and changing the date to before today', function () {
						this._runnable.ssName = 'BomView-bomConfiguration-dateChangedBackwardsFromWorkingToBeforeTodayTopline';

						viewBomPage.commandBar.configurationDropdown.changeEffectiveDateToEarliest();

						checkToplineDescriptor(viewBomPage.items.supercededItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:sA]');

						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/02/2013');
					});
				});

				describe('[Pending bias]', function () {
					it('Should configure the top line to the correct revision when viewing the released revision and configuring to pending bias', function () {
						this._runnable.ssName = 'BomView-pendingBias';

						viewBomPage.goToItem('inChangeOrderReleasedItem');
						viewBomPage.commandBar.configurationDropdown.changeToBias('changeOrder');

						checkToplineDescriptor(viewBomPage.items.inChangeOrderWorkingItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:w]');
					});
				});

				// Tests for pending and allPending are required

				describe('[Changing the bias and the date]', function () {
					it('Shoud give priority to the date', function () {
						this._runnable.ssName = 'BomView-selectBothDateAndBias';

						viewBomPage.goToDefaultItem();
						viewBomPage.commandBar.configurationDropdown.changeToEarliestDateAndBias('working');

						checkToplineDescriptor(viewBomPage.items.supercededItem.descriptor);
						expect(ItemHeader.getItemRevision()).to.eventually.equal('[REV:sA]');

						expect(viewBomPage.bom.header.getEffectivityDate()).to.eventually.equal('01/02/2013');
					});
				});
			});
		});
	});
}

util.inherits(WorkspaceItemBomViewSpec, SharedSpec);

module.exports = new WorkspaceItemBomViewSpec();
