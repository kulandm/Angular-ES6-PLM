/**
 * @ngdoc object
 * @name E2ETestsSpecs.ReleaseItemPinningPolicyWorkflowSpec
 *
 * @description This is the e2e test for Pinning attachments in WIP attachment
 * tab. It handles workflow transitioning and releasing item to test for the
 * pinning policies of attachments.
 *
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var AppHeader = require('../../components/AppHeader');
var FileBrowser = require('../../components/FileBrowser');
var CommandBar = require('../../components/CommandBar');
var CreateItem = require('../../components/CreateItem');
var ItemHeader = require('../../components/ItemHeader');
var WorkflowTransitionFlyout = require('../../components/WorkflowTransitionFlyout');

var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
var editDetailsViewPage = require('../../pages/EditDetailsViewPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
var wipAttachmentViewPage = require('../../pages/ViewWipAttachmentsViewPage');

describe('ReleaseItemPinningPolicyWorkflowSpec', function () {
	this.timeout(150000);
	var expectedConditions = protractor.ExpectedConditions;

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal(30000);

		// 1:1: Open left nav bar and select a workspace to go to.
		// 1:2: This will open workspace list view.
		// 1:3: Select an item that contains attachments.
		AppHeader.openWorkspace('Engineering', 'Items and BOMs');
		workspaceItemsListPage.scrollDownAndOpenItem('152-0000-000 - 1 1/4 - 20 HEX JAM NUT');

		// 2.1: Open the working version.
		// 2.1: Reach item details view.
		// 2:2: Select attachment tab.
		ItemHeader.getRevisionsDropdownButton().click();
		var revisionsDropdown = ItemHeader.getRevisionsDropdown();
		browser.wait(expectedConditions.visibilityOf(revisionsDropdown), 5000);
		ItemHeader.selectRevision(0);
		itemDetailsPage.switchToTab('Attachments');
		browser.sleep(5000);
	});

	after(function () {
		var table = wipAttachmentViewPage.getAttachmentsTable();
		browser.wait(expectedConditions.visibilityOf(table), 5000);

		wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
			if (count) {
				var cellsInHeaderRow = wipAttachmentViewPage.getHeaderCells(table);
				browser.wait(expectedConditions.elementToBeClickable(cellsInHeaderRow.get(1)), 5000);
				cellsInHeaderRow.get(1).element(by.css('input')).click();

				browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getRemoveBtn()), 5000);
				wipAttachmentViewPage.getRemoveBtn().click();

				browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getDeleteButton()), 5000);
				wipAttachmentViewPage.getDeleteButton().click();
				browser.sleep(5000);

				browser.waitForAngular();
				expect(wipAttachmentViewPage.getTableRows(table).count()).to.eventually.equal(0);
				expect(wipAttachmentViewPage.getEditBtn().getAttribute('disabled')).to.eventually.equal('true');
			}
		});
	});

	describe('[Start from clean attachments slate]', function () {
		it('removes attachments if there are any', function () {
			var table = wipAttachmentViewPage.getAttachmentsTable();
			browser.wait(expectedConditions.visibilityOf(table), 5000);

			wipAttachmentViewPage.getTableRows(table).count().then(function (count) {
				if (count) {
					var cellsInHeaderRow = wipAttachmentViewPage.getHeaderCells(table);
					browser.wait(expectedConditions.elementToBeClickable(cellsInHeaderRow.get(1)), 5000);
					cellsInHeaderRow.get(1).element(by.css('input')).click();

					browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getRemoveBtn()), 5000);
					wipAttachmentViewPage.getRemoveBtn().click();

					browser.wait(expectedConditions.elementToBeClickable(wipAttachmentViewPage.getDeleteButton()), 5000);
					wipAttachmentViewPage.getDeleteButton().click();
					browser.sleep(5000);

					browser.waitForAngular();
					expect(wipAttachmentViewPage.getTableRows(table).count()).to.eventually.equal(0);
					expect(wipAttachmentViewPage.getEditBtn().getAttribute('disabled')).to.eventually.equal('true');
				}
			});
		});
	});

	describe('[Adds & edits at least 3 attachments]', function () {
		var table = wipAttachmentViewPage.getAttachmentsTable();
		var firstRow = wipAttachmentViewPage.getTableRows(table).get(0);
		var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
		var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);
		var fourthRow = wipAttachmentViewPage.getTableRows(table).get(3);

		var thirdRowPinPolicy = wipAttachmentViewPage.getTableCells(thirdRow).get(3);
		var fourthRowPinPolicy = wipAttachmentViewPage.getTableCells(fourthRow).get(3);
		var thirdRowVersion = wipAttachmentViewPage.getTableCells(thirdRow).get(4);

		it('adds 4 attachments', function () {
			// Adds twice the files 'Penguins Version 1.jpg' and 'Lighthouse Version 2.jpg'
			for (var i = 0; i < 2; i++) {
				// Open File Browser
				wipAttachmentViewPage.getAddBtn().click();
				var fileBrowserTable = FileBrowser.getTable();
				browser.wait(expectedConditions.visibilityOf(fileBrowserTable), 5000);

				// If no folder is found, tests will not be run.
				FileBrowser.getFolderCount().then(function (folderCount) {
					if (folderCount) {
						// Expand '[DO NOT MODIFY] Attachments Automation Data' folder
						FileBrowser.getFolderByName('[DO NOT MODIFY] Attachments Automation Data').click();
						browser.wait(expectedConditions.visibilityOf(fileBrowserTable), 5000);

						FileBrowser.getFileCount().then(function (fileCount) {
							if (fileCount) {
								// Select all files to be added
								for (var i = 0; i < fileCount; i++) {
									FileBrowser.getFile().get(i).click();
								}

								var addBtn = FileBrowser.getDialogButton('Add');
								browser.wait(expectedConditions.elementToBeClickable(addBtn), 5000);
								addBtn.click();

								browser.waitForAngular();
								expect(wipAttachmentViewPage.getTableRows(table).count())
									.to.eventually.be.at.least(2);
							}
						});
					}
				});
			}
		});

		it('has \'--\' as pinning policy for all newly added attachments', function () {
			wipAttachmentViewPage.getAttachmentCount().then(function (count) {
				if (count) {
					expect(count).to.be.at.least(4);

					// First & second row: Penguins Version 1.jpg
					// Third & fourth row: Lighthouse Version 2.jpg
					expect(wipAttachmentViewPage.getTableCells(firstRow).get(3)
						.getText()).to.eventually.equal('--');
					expect(wipAttachmentViewPage.getTableCells(secondRow).get(3)
						.getText()).to.eventually.equal('--');
					expect(wipAttachmentViewPage.getTableCells(thirdRow).get(3)
						.getText()).to.eventually.equal('--');
					expect(wipAttachmentViewPage.getTableCells(fourthRow).get(3)
						.getText()).to.eventually.equal('--');
				}
			});
		});

		it('edits the third row pinning policy to \'To Version\'', function () {
			wipAttachmentViewPage.getAttachmentCount().then(function (count) {
				if (count) {
					wipAttachmentViewPage.getEditBtn().click();
					browser.wait(expectedConditions.visibilityOf(table), 5000);

					thirdRowPinPolicy.click();
					wipAttachmentViewPage.getPinningPolicyDropdownIcon(thirdRow).click();
					browser.wait(expectedConditions.visibilityOf(
						wipAttachmentViewPage.getTableCellDropdown(thirdRow, 3)
					), 5000);
					wipAttachmentViewPage.getTableCellDropdownOption(thirdRow, 3, 1).click();
					browser.wait(expectedConditions.invisibilityOf(
						wipAttachmentViewPage.getTableCellDropdown(thirdRow, 3)
					), 5000);

					expect(thirdRowPinPolicy.getText()).to.eventually.equal('To Version');
				}
			});
		});

		it('edits the fourth row pinning policy to \'Float\'', function () {
			wipAttachmentViewPage.getAttachmentCount().then(function (count) {
				if (count) {
					fourthRowPinPolicy.click();
					wipAttachmentViewPage.getPinningPolicyDropdownIcon(fourthRow).click();

					browser.wait(expectedConditions.visibilityOf(
						wipAttachmentViewPage.getTableCellDropdown(fourthRow, 3)
					), 5000);
					wipAttachmentViewPage.getTableCellDropdownOption(fourthRow, 3, 2).click();
					browser.wait(expectedConditions.invisibilityOf(
						wipAttachmentViewPage.getTableCellDropdown(fourthRow, 3)
					), 5000);

					expect(fourthRowPinPolicy.getText()).to.eventually.equal('Float');
				}
			});
		});

		it('edits the third row version', function () {
			wipAttachmentViewPage.getAttachmentCount().then(function (count) {
				if (count) {
					thirdRowVersion.click();
					browser.wait(expectedConditions.visibilityOf(
						wipAttachmentViewPage.getTableCellDropdown(thirdRow, 4)
					), 5000);

					wipAttachmentViewPage.getTableCellDropdownOptions(thirdRow, 4).count().then(function () {
						if (count > 1) {
							wipAttachmentViewPage.getTableCellDropdownOption(thirdRow, 4, 1).click();
							wipAttachmentViewPage.getSaveBtn().click();

							browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);

							expect(wipAttachmentViewPage.getTableCells(fourthRow).get(3)
								.getText()).to.eventually.not.equal('--');
							expect(wipAttachmentViewPage.getTableCells(fourthRow).get(4)
								.getText()).to.eventually.equal('1');
						} else {
							wipAttachmentViewPage.getSaveBtn().click();
							browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);
						}
					});
				}
			});
		});
	});

	describe('[Links item to a new ECO]', function () {
		after(function () {
			CreateItem.isCreateDialogPresent().then(function (isPresent) {
				if (isPresent) {
					CreateItem.closeDialog();
				}
			});
		});
		it('creates new CO', function () {
			browser.wait(expectedConditions.elementToBeClickable(
				ItemHeader.getActionsDropDownButton()
			), 5000, 'wait for interaction with header failed');

			// Create new CO and select 'Save & Manage'
			CreateItem.quickCreateECONoPassword('Test-for-pinningPolicy', 'abc', 'abc', 'abc');
			browser.wait(expectedConditions.elementToBeClickable(
				CreateItem.getFooterButton(1)
			), 5000);
			CreateItem.getFooterButton(1).click();
			browser.waitForAngular();

			// Set lifecycle to 'Production Revision' and select 'Save & Close'
			CreateItem.getManagedViewLifecycleDropDownField().click();
			browser.wait(expectedConditions.visibilityOf(
				CreateItem.getManagedViewLifecycleDropDownMenu()
			), 10000);
			CreateItem.getManagedViewLifecycleDropDownMenuItems().get(1).click();
			browser.wait(expectedConditions.elementToBeClickable(
				CreateItem.getFooterButton(1)
			), 5000);
			CreateItem.clickSaveOptionsElement();
			CreateItem.saveAndCloseButton().click();
			browser.waitForAngular();
		});

		it('sets approvals for newly created CO', function () {
			var table = wipAttachmentViewPage.getAttachmentsTable();
			browser.wait(expectedConditions.visibilityOf(table), 5000);

			AppHeader.openWorkspace('Change Management', 'AQ Change Orders No password');
			workspaceItemsListPage.scrollDownAndOpenItem('CO000001 - Test-for-pinningPolicy -');

			// Go to edit mode of 'Item Details' of newly created CO
			var editBtn = CommandBar.getTranscludedButton(0);
			browser.wait(expectedConditions.elementToBeClickable(editBtn), 5000);
			editBtn.click();

			// Set 'Approvals Required' to PLMAutoTest
			browser.wait(expectedConditions.elementToBeClickable(
				editDetailsViewPage.getApprovalRequiredDropDownField()
			), 5000);
			editDetailsViewPage.getApprovalRequiredDropDownField().click();
			browser.wait(expectedConditions.visibilityOf(
				editDetailsViewPage.getApprovalRequiredDropDownMenu()
			), 5000);
			editDetailsViewPage.getApprovalRequiredDropDownMenuItem(1).click();
			browser.wait(expectedConditions.elementToBeClickable(
				editDetailsViewPage.getSaveBtn()
			), 5000);
			editDetailsViewPage.getSaveBtn().click();
			browser.waitForAngular();

			browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);

			expect(itemDetailsPage.getApprovalsRequired()).to.eventually
				.equal('Selenium1, PLMAutoTest');
		});

		it('transits to a locked state', function () {
			// Trigger actions dropdown
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.actionsDropdown
			), 5000);
			WorkflowTransitionFlyout.actionsDropdown.click();

			// Trigger workflow transition flyout
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workFlowTransitionLink
			), 5000);
			WorkflowTransitionFlyout.workFlowTransitionLink.click();

			// Transit to 'Route Change' workflow
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workflowTransitionSelect
			), 5000);
			WorkflowTransitionFlyout.workflowTransitionSelect.click();
			browser.wait(expectedConditions.visibilityOf(
				WorkflowTransitionFlyout.transitionOptionList.get(2)
			), 5000);
			WorkflowTransitionFlyout.transitionOptionList.get(2).click();
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.saveButton
			), 5000);
			WorkflowTransitionFlyout.saveButton.click();
			browser.waitForAngular();

			browser.wait(expectedConditions.visibilityOf(ItemHeader.getWorkflowLock()), 5000);
			expect(ItemHeader.getWorkflowLock().getText()).to.eventually.contain('Locked');
		});

		it('checks that attachments are pinned due to locked state', function () {
			// Go back to 'Attachments' of item
			AppHeader.openWorkspace('Engineering', 'Items and BOMs');
			workspaceItemsListPage.scrollDownAndOpenItem('152-0000-000 - 1 1/4 - 20 HEX JAM NUT');
			ItemHeader.getRevisionsDropdownButton().click();
			var revisionsDropdown = ItemHeader.getRevisionsDropdown();
			browser.wait(expectedConditions.visibilityOf(revisionsDropdown), 5000);
			ItemHeader.selectRevision(0);
			itemDetailsPage.switchToTab('Attachments');
			browser.sleep(5000);

			var table = wipAttachmentViewPage.getAttachmentsTable();
			var firstRow = wipAttachmentViewPage.getTableRows(table).get(0);
			var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
			var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);
			var fourthRow = wipAttachmentViewPage.getTableRows(table).get(3);

			expect(wipAttachmentViewPage.getTableCells(firstRow).get(3).getText())
				.to.eventually.not.equal('--');
			expect(wipAttachmentViewPage.getTableCells(secondRow).get(3).getText())
				.to.eventually.not.equal('--');
			expect(wipAttachmentViewPage.getTableCells(thirdRow).get(3).getText())
				.to.eventually.equal('--'); // Float pinning policy
			expect(wipAttachmentViewPage.getTableCells(fourthRow).get(3).getText())
				.to.eventually.not.equal('--');

			browser.actions()
				.mouseMove(wipAttachmentViewPage.getPinningPolicy(firstRow))
				.perform();

			var tooltip = wipAttachmentViewPage.getPinningPolicyTooltip(0);
			browser.wait(expectedConditions.visibilityOf(tooltip), 5000);
			expect(tooltip.isDisplayed()).to.eventually.be.true;
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).count())
				.to.eventually.equal(3);
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).get(0).getText())
				.to.eventually.equal('Pinning Policy: On Lock');
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).get(1).getText())
				.to.eventually.equal('Pinned Version: 1');
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).get(2).getText())
				.to.eventually.equal('Latest Version: 1');
		});

		it('transits past the locked state (to CCB Review)', function () {
			// Go to created ECO
			AppHeader.openWorkspace('Change Management', 'AQ Change Orders No password');
			workspaceItemsListPage.openItem('CO000001 - Test-for-pinningPolicy -');
			browser.sleep(5000);

			// Trigger actions dropdown
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.actionsDropdown
			), 5000);
			WorkflowTransitionFlyout.actionsDropdown.click();

			// Trigger workflow transition flyout
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workFlowTransitionLink
			), 5000);
			WorkflowTransitionFlyout.workFlowTransitionLink.click();

			// Select 'Submit to CCB' workflow
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workflowTransitionSelect
			), 5000);
			WorkflowTransitionFlyout.workflowTransitionSelect.click();
			browser.wait(expectedConditions.visibilityOf(
				WorkflowTransitionFlyout.transitionOptionList.get(3)
			), 5000);
			WorkflowTransitionFlyout.transitionOptionList.get(3).click();
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.saveButton
			), 5000);
			WorkflowTransitionFlyout.saveButton.click();
			browser.waitForAngular();

			browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);

			browser.wait(expectedConditions.visibilityOf(ItemHeader.getWorkflowStatus()), 5000);
			expect(ItemHeader.getWorkflowStatus().getText()).to.eventually.contain('CCB Review');
		});

		it('transits past the locked state (to Implementation)', function () {
			// Trigger actions dropdown again
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.actionsDropdown
			), 5000);
			WorkflowTransitionFlyout.actionsDropdown.click();

			// Trigger workflow transition flyout again
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workFlowTransitionLink
			), 5000);
			WorkflowTransitionFlyout.workFlowTransitionLink.click();

			// Select 'Final Approval' workflow
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workflowTransitionSelect
			), 5000);
			WorkflowTransitionFlyout.workflowTransitionSelect.click();
			browser.wait(expectedConditions.visibilityOf(
				WorkflowTransitionFlyout.transitionOptionList.get(0)
			), 5000);
			WorkflowTransitionFlyout.transitionOptionList.get(0).click();
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.saveButton
			), 5000);
			WorkflowTransitionFlyout.saveButton.click();
			browser.waitForAngular();

			browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);

			browser.wait(expectedConditions.visibilityOf(ItemHeader.getWorkflowStatus()), 5000);
			expect(ItemHeader.getWorkflowStatus().getText()).to.eventually.contain('Implementation');
		});

		it('checks that attachments are still pinned after locked state', function () {
			// Go back to 'Attachments' of item
			AppHeader.openWorkspace('Engineering', 'Items and BOMs');
			workspaceItemsListPage.scrollDownAndOpenItem('152-0000-000 - 1 1/4 - 20 HEX JAM NUT');
			ItemHeader.getRevisionsDropdownButton().click();
			var revisionsDropdown = ItemHeader.getRevisionsDropdown();
			browser.wait(expectedConditions.visibilityOf(revisionsDropdown), 5000);
			ItemHeader.selectRevision(0);
			itemDetailsPage.switchToTab('Attachments');
			browser.sleep(5000);

			var table = wipAttachmentViewPage.getAttachmentsTable();
			var firstRow = wipAttachmentViewPage.getTableRows(table).get(0);
			var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
			var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);
			var fourthRow = wipAttachmentViewPage.getTableRows(table).get(3);

			expect(wipAttachmentViewPage.getTableCells(firstRow).get(3).getText())
				.to.eventually.not.equal('--');
			expect(wipAttachmentViewPage.getTableCells(secondRow).get(3).getText())
				.to.eventually.not.equal('--');
			expect(wipAttachmentViewPage.getTableCells(thirdRow).get(3).getText())
				.to.eventually.equal('--'); // Float pinning policy
			expect(wipAttachmentViewPage.getTableCells(fourthRow).get(3).getText())
				.to.eventually.not.equal('--');

			browser.actions()
				.mouseMove(wipAttachmentViewPage.getPinningPolicy(firstRow))
				.perform();

			var tooltip = wipAttachmentViewPage.getPinningPolicyTooltip(0);
			browser.wait(expectedConditions.visibilityOf(tooltip), 5000);
			expect(tooltip.isDisplayed()).to.eventually.be.true;
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).count())
				.to.eventually.equal(3);
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).get(0).getText())
				.to.eventually.equal('Pinning Policy: On Lock');
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).get(1).getText())
				.to.eventually.equal('Pinned Version: 1');
			expect(wipAttachmentViewPage.getPinningPolicyTooltipRow(0).get(2).getText())
					.to.eventually.equal('Latest Version: 1');
		});
	});

	describe('[Release RC item -> Cloning attachments]', function () {
		it('transits to released state', function () {
			// Go to created ECO
			AppHeader.openWorkspace('Change Management', 'AQ Change Orders No password');
			workspaceItemsListPage.openItem('CO000001 - Test-for-pinningPolicy -');
			browser.sleep(5000);

			// Trigger actions dropdown
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.actionsDropdown
			), 5000);
			WorkflowTransitionFlyout.actionsDropdown.click();

			// Trigger workflow transition flyout
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workFlowTransitionLink
			), 5000);
			WorkflowTransitionFlyout.workFlowTransitionLink.click();

			// Select 'Change Order Implemented' workflow
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workflowTransitionSelect
			), 5000);
			WorkflowTransitionFlyout.workflowTransitionSelect.click();
			browser.wait(expectedConditions.visibilityOf(
				WorkflowTransitionFlyout.transitionOptionList.get(0)
			), 5000);
			WorkflowTransitionFlyout.transitionOptionList.get(0).click();
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.saveButton
			), 5000);
			WorkflowTransitionFlyout.saveButton.click();
			browser.waitForAngular();

			browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);

			browser.wait(expectedConditions.visibilityOf(ItemHeader.getWorkflowStatus()), 5000);
			expect(ItemHeader.getWorkflowStatus().getText()).to.eventually.contain('Released');
		});

		it('checks that attachments are cloned in the new working version', function () {
			// Go back to 'Attachments' of new working version of item
			AppHeader.openWorkspace('Engineering', 'Items and BOMs');
			workspaceItemsListPage.scrollDownAndOpenItem('152-0000-000 - 1 1/4 - 20 HEX JAM NUT');
			ItemHeader.getRevisionsDropdownButton().click();
			var revisionsDropdown = ItemHeader.getRevisionsDropdown();
			browser.wait(expectedConditions.visibilityOf(revisionsDropdown), 5000);
			ItemHeader.selectRevision(0);
			itemDetailsPage.switchToTab('Attachments');
			browser.sleep(5000);

			var table = wipAttachmentViewPage.getAttachmentsTable();
			var firstRow = wipAttachmentViewPage.getTableRows(table).get(0);
			var secondRow = wipAttachmentViewPage.getTableRows(table).get(1);
			var thirdRow = wipAttachmentViewPage.getTableRows(table).get(2);
			var fourthRow = wipAttachmentViewPage.getTableRows(table).get(3);

			expect(wipAttachmentViewPage.getTableCells(firstRow).get(3).getText())
				.to.eventually.equal('--');
			expect(wipAttachmentViewPage.getTableCells(secondRow).get(3).getText())
				.to.eventually.equal('--');
			expect(wipAttachmentViewPage.getTableCells(thirdRow).get(3).getText())
				.to.eventually.equal('--');
			expect(wipAttachmentViewPage.getTableCells(fourthRow).get(3).getText())
				.to.eventually.not.equal('--');
			expect(wipAttachmentViewPage.getTableCells(fourthRow).get(4).getText())
				.to.eventually.equal('1');
		});
	});
});
