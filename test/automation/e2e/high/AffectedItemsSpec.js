/**
 * @ngdoc object
 * @name E2ETestsSpecs.AffectedItemsSpec
 *
 * @description This is the e2e test for Affected Items Tab (Basic View)
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var ss = require('../../util/screenshoter');
var util = require('util');

var AppHeader = require('../../components/AppHeader');
var Notification = require('../../components/Notification');
var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
var ViewAffectedItemsPage = require('../../pages/ViewAffectedItemsPage');
var affectedItemsPage = new ViewAffectedItemsPage();

/**
 * @ngdoc method
 * @name E2ETestsSpecs.AffectedItemsSpec#AffectedItemsSpec
 * @propertyOf E2ETestsSpecs.AffectedItemsSpec
 * @description The E2E spec for Affected Items
 */
function AffectedItemsSpec() {

	describe('AffectedItemsSpec', function () {
		var expectedConditions = protractor.ExpectedConditions;

		this.timeout(120000);

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal(30000);
			AppHeader.openWorkspace('Change Management', 'Change Orders');
			workspaceItemsListPage.openItem('CO000011 - Test 1 - 3 - High');
			itemDetailsPage.switchToTab('Affected Items');
			browser.sleep(5000);
		});

		after(function () {
			affectedItemsPage.affectedItemsRows.count().then(function (count) {
				if (count) {
					// Remove added items
					affectedItemsPage.selectAllCheckbox.click();
					affectedItemsPage.goRemove();
					affectedItemsPage.goRemoveConfirm();
				}
			});
		});

		it('PLM2.0-113:Affected Items Tab: Add item from RC workspace', function () {
			affectedItemsPage.addLabel.click();
			expect(affectedItemsPage.addAffectedItemFlyout.isDisplayed())
				.to.eventually.be.true;

			affectedItemsPage.searchBoxInput.sendKeys('SBOM Laser Sensor');
			affectedItemsPage.searchCheckbox.click();
			affectedItemsPage.searchSubmitSelection.click();

			expect(affectedItemsPage.getRowCell(0).get(3).getText())
				.to.eventually.equal('500-0000-000 - SBOM Laser Sensor [REV:w]');
		});

		it('PLM2.0-112:Affected Items Tab: Add item from Change Request workspace', function () {
			affectedItemsPage.addLabel.click();
			affectedItemsPage.searchBoxInput.sendKeys('CR000001 - Prevent Damage to Valve');
			affectedItemsPage.searchCheckbox.click();
			affectedItemsPage.searchSubmitSelection.click();

			expect(affectedItemsPage.getRowCell(0).get(3).getText())
				.to.eventually.equal('CR000001 - Prevent Damage to Valve');
		});

		it('PLM2.0-112:Affected Items Tab: Add item from Customer workspace', function () {
			affectedItemsPage.addLabel.click();
			affectedItemsPage.searchBoxInput.sendKeys('Autodesk');
			affectedItemsPage.searchCheckbox.click();
			affectedItemsPage.searchSubmitSelection.click();

			expect(affectedItemsPage.getRowCell(1).get(3).getText())
				.to.eventually.equal('Autodesk');
		});

		it('PLM2.0-112:Affected Items Tab: Add item from Suppliers workspace', function () {
			affectedItemsPage.addLabel.click();
			affectedItemsPage.searchBoxInput.sendKeys('McMaster-Carr Supply Co.');
			affectedItemsPage.searchCheckbox.click();
			affectedItemsPage.searchSubmitSelection.click();

			expect(affectedItemsPage.getRowCell(3).get(3).getText())
				.to.eventually.equal('McMaster-Carr Supply Co.');
		});

		it('PLM2.0-40:Affected Items Tab: It should have predefined columns', function () {
			expect(affectedItemsPage.cellsInHeaderRow.get(1).element(by.css('div'))
				.getAttribute('class')).to.eventually.include('checkbox-column');

			var columnContentPromise = [];
			for (var i = 2; i < 8; i++) {
				columnContentPromise.push(affectedItemsPage.cellsInHeaderRow.get(i).getText());
			}

			return protractor.promise.all(columnContentPromise).then(function (colContent) {
				expect(colContent).to.deep.equal(['# 1', 'ITEM', 'LIFECYCLE', 'EFFECTIVITY', 'FROM', 'TO']);
			});
		});

		it('PLM2.0-42:Affected Items Tab: Verify columns resizers', function () {
			var initialWidth, finalWidth;
			var dragOffset = {
				x: 200,
				y: 0
			};

			var selectionColumn = 1;
			affectedItemsPage.getColumnWidth(selectionColumn).then(function (width) {
				initialWidth = width;

				// Resize the column using the offset specified above
				browser.actions()
					.dragAndDrop(affectedItemsPage.columnResizer, dragOffset)
					.perform();

				// Width after resizing
				return affectedItemsPage.getColumnWidth(selectionColumn);
			}).then(function (width) {
				finalWidth = width;

				expect(initialWidth).to.equal(finalWidth);
			});

			var idColumn = 2;
			affectedItemsPage.getColumnWidth(idColumn).then(function (width) {
				initialWidth = width;

				// Resize the column using the offset specified above
				browser.actions()
					.dragAndDrop(affectedItemsPage.columnResizer, dragOffset)
					.perform();

				// Width after resizing
				return affectedItemsPage.getColumnWidth(idColumn);
			}).then(function (width) {
				finalWidth = width;

				expect(initialWidth).to.equal(finalWidth);
			});

			var itemDescriptionColumn = 3;
			affectedItemsPage.getColumnWidth(itemDescriptionColumn).then(function (width) {
				initialWidth = width;

				// Resize the column using the offset specified above
				browser.actions()
					.dragAndDrop(affectedItemsPage.columnResizer, dragOffset)
					.perform();

				// Width after resizing
				return affectedItemsPage.getColumnWidth(itemDescriptionColumn);
			}).then(function (width) {
				finalWidth = width;

				expect(initialWidth).to.not.equal(finalWidth);
			});
		});

		it('PLM2.0-100:Affected Items Tab: Revert cell editing', function () {
			var singleLineCell = affectedItemsPage.getRowCell(0).get(8);
			expect(singleLineCell.getText()).to.eventually.equal('');

			affectedItemsPage.goEdit();
			singleLineCell.click();
			singleLineCell.element(by.css('input[type="text"]')).sendKeys('test');
			affectedItemsPage.getRowCell(0).get(9).click();
			expect(singleLineCell.getText()).to.eventually.equal('test');

			affectedItemsPage.goCancel();
			browser.wait(expectedConditions.visibilityOf(affectedItemsPage.getLeaveButton()), 5000);
			affectedItemsPage.triggerLeave();
			browser.sleep(1000);
			expect(singleLineCell.getText()).to.eventually.equal('');
		});

		describe('[Bulk Edit]', function () {
			it('applies bulk edit on revision controlled items', function () {
				affectedItemsPage.addLabel.click();
				affectedItemsPage.searchBoxInput.sendKeys(
					'600-0000-000 - SBOM Project 621');
				affectedItemsPage.searchCheckbox.click();
				affectedItemsPage.searchSubmitSelection.click();

				affectedItemsPage.getRowSelectionButtons().first().click();
				browser.waitForAngular();
				expect(affectedItemsPage.bulkEditButton().isDisplayed())
					.to.eventually.be.true;

				affectedItemsPage.bulkEditButton().click();
				browser.waitForAngular();
				expect(affectedItemsPage.bulkEditModal().isDisplayed())
					.to.eventually.be.true;

				affectedItemsPage.lifecycleOption().element(by.css('field-selector')).click();
				affectedItemsPage.getTransitions().get(1).click();

				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.getBulkEditDialogUpdateButton()), 5000);
				affectedItemsPage.getBulkEditDialogUpdateButton().click();
				browser.waitForAngular();

				var lifecycleCell = affectedItemsPage.getRowCell(2).get(4);
				expect(lifecycleCell.getInnerHtml()).to.eventually.contain('Production Revision');

				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.saveBtn), 5000);
				affectedItemsPage.goSave();
				browser.waitForAngular();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.editBtn), 5000);
			});
		});

		describe.skip('[Notifications and Field Validation]', function () {
			before(function () {
				browser.refresh();
				browser.sleep(5000);
			});

			it('displays correct error notification after editing', function () {
				var integerCell = affectedItemsPage.getRowCell(0).get(9);

				affectedItemsPage.goEdit();
				browser.wait(expectedConditions.elementToBeClickable(integerCell), 5000);
				integerCell.click();
				integerCell.element(by.css('input[type="text"]')).clear().sendKeys('test');

				affectedItemsPage.goSave();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.driver.wait(
					expectedConditions.textToBePresentInElement(
						Notification.getNotificationEl(),
						'CR000001 - Prevent Damage to Valve - Has error. Failed to update.'),
					5000);
				Notification.getCloseIcon().click();
				browser.waitForAngular();
				affectedItemsPage.goCancel();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.getLeaveButton()), 5000);
				affectedItemsPage.triggerLeave();
				browser.sleep(1000);
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.editBtn), 5000);
			});

			// Consistently failing on CI. Further investigation needed.
			it.skip('displays success bulk message after bulk editing', function () {
				var firstItem = affectedItemsPage.getRowCell(0).get(8);
				var secondItem = affectedItemsPage.getRowCell(1).get(8);
				affectedItemsPage.goEdit();
				browser.wait(expectedConditions.elementToBeClickable(firstItem), 5000);
				firstItem.click();
				firstItem.element(by.css('input[type="text"]')).clear().sendKeys('1');
				browser.wait(expectedConditions.elementToBeClickable(secondItem), 5000);
				secondItem.click();
				secondItem.element(by.css('input[type="text"]')).sendKeys('2');
				browser.sleep(500);

				affectedItemsPage.goSave();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 10000);
				browser.waitForAngular();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.editBtn), 5000);
			});

			it('displays cell and validation error when editing', function () {
				var integerCell = affectedItemsPage.getRowCell(0).get(9);
				var rowIndicatorEl = affectedItemsPage.getRowStateIndicator(0);
				var cellIndicatorEl = affectedItemsPage.getCellStateIndicator(0, 9);

				affectedItemsPage.goEdit();
				browser.wait(expectedConditions.elementToBeClickable(integerCell), 5000);
				integerCell.click();
				integerCell.element(by.css('input[type="text"]')).clear().sendKeys('test');

				expect(rowIndicatorEl.getAttribute('class')).to.eventually.contain('dirty');
				expect(cellIndicatorEl.getAttribute('class')).to.eventually.contain('dirty');

				affectedItemsPage.goSave();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				Notification.getCloseIcon().click();
				expect(affectedItemsPage.getRowStateIndicator(0).getAttribute('class')).to.eventually.contain('invalid');
				expect(affectedItemsPage.getCellStateIndicator(0, 9).getAttribute('class')).to.eventually.contain('error');
				browser.waitForAngular();
				affectedItemsPage.goCancel();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.getLeaveButton()), 5000);
				affectedItemsPage.triggerLeave();
				browser.sleep(1000);
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.editBtn), 5000);
			});

			it('displays failed bulk message after bulk editing', function () {
				var firstItem = affectedItemsPage.getRowCell(0).get(9);
				var secondItem = affectedItemsPage.getRowCell(1).get(9);

				affectedItemsPage.goEdit();
				browser.wait(expectedConditions.elementToBeClickable(firstItem), 5000);
				firstItem.click();
				firstItem.element(by.css('input[type="text"]')).clear().sendKeys('a');
				browser.wait(expectedConditions.elementToBeClickable(secondItem), 5000);
				secondItem.click();
				secondItem.element(by.css('input[type="text"]')).clear().sendKeys('b');
				browser.sleep(500);

				affectedItemsPage.goSave();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.driver.wait(
					expectedConditions.textToBePresentInElement(
						Notification.getNotificationEl(),
						'No changes saved. Items have errors'),
					5000);
				browser.waitForAngular();
				affectedItemsPage.goCancel();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.getLeaveButton()), 5000);
				affectedItemsPage.triggerLeave();
				browser.sleep(1000);
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.editBtn), 5000);
			});

			it('displays two sections - failure and success - in the dialog', function () {
				var firstInt = affectedItemsPage.getRowCell(0).get(9);
				var secondInt = affectedItemsPage.getRowCell(1).get(9);

				affectedItemsPage.goEdit();
				browser.wait(expectedConditions.elementToBeClickable(firstInt), 5000);
				firstInt.click();
				firstInt.element(by.css('input[type="text"]')).clear().sendKeys('100');
				browser.wait(expectedConditions.elementToBeClickable(secondInt), 5000);
				secondInt.click();
				secondInt.element(by.css('input[type="text"]')).clear().sendKeys('abc');
				browser.sleep(500);

				affectedItemsPage.goSave();
				browser.driver.wait(expectedConditions.elementToBeClickable(Notification.getDetailsLink()), 5000);
				Notification.getDetailsLink().click();
				browser.wait(expectedConditions.presenceOf(Notification.getDetailsDialog()), 5000);
				expect(Notification.getSections().count()).to.eventually.equal(2);
				browser.wait(expectedConditions.elementToBeClickable(Notification.getCloseButton()), 1000);
				Notification.getCloseButton().click();
				browser.waitForAngular();
				affectedItemsPage.goCancel();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.getLeaveButton()), 5000);
				affectedItemsPage.triggerLeave();
				browser.sleep(1000);
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.editBtn), 5000);
			});

			it('displays success notification after adding', function () {
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.addLabel), 5000);
				affectedItemsPage.addLabel.click();
				affectedItemsPage.searchBoxInput.sendKeys('prox target');
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.searchCheckbox), 5000);
				affectedItemsPage.searchCheckbox.click();
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.searchSubmitSelection), 5000);
				affectedItemsPage.searchSubmitSelection.click();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.driver.wait(
					expectedConditions.textToBePresentInElement(
						Notification.getNotificationEl(),
						'402-0011-000 - PROX TARGET - Added Successfully'
					), 5000);
				browser.waitForAngular();
			});

			it('displays success notification after removing', function () {
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.getRowCell(2).get(1)), 5000);
				affectedItemsPage.getRowCell(2).get(1).click();

				affectedItemsPage.goRemove();
				expect(affectedItemsPage.getRemoveDialog().isDisplayed())
					.to.eventually.be.true;
				affectedItemsPage.goRemoveConfirm();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.driver.wait(
					expectedConditions.textToBePresentInElement(
						Notification.getNotificationEl(),
						'402-0011-000 - PROX TARGET - Removed Successfully'
					), 5000);
				browser.waitForAngular();
			});

			it('displays success bulk message after bulk adding', function () {
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.addLabel), 5000);
				affectedItemsPage.addLabel.click();
				affectedItemsPage.searchBoxInput.sendKeys('prox target');
				browser.waitForAngular();
				affectedItemsPage.searchCheckbox.click();
				affectedItemsPage.searchBoxInput.clear().sendKeys('malleable');
				browser.waitForAngular();
				affectedItemsPage.searchCheckbox.click();
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.searchSubmitSelection), 5000);
				affectedItemsPage.searchSubmitSelection.click();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.driver.wait(
					expectedConditions.textToBePresentInElement(
						Notification.getNotificationEl(),
						'Items added successfully'
					), 5000);
				browser.waitForAngular();
			});

			it('displays success bulk message after bulk removing', function () {
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.getRowCell(2).get(1)), 5000);
				affectedItemsPage.getRowCell(2).get(1).click();
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.getRowCell(3).get(1)), 5000);
				affectedItemsPage.getRowCell(3).get(1).click();

				affectedItemsPage.goRemove();
				browser.wait(expectedConditions.visibilityOf(affectedItemsPage.getRemoveDialog()), 5000);
				expect(affectedItemsPage.getRemoveDialog().isDisplayed())
					.to.eventually.be.true;
				affectedItemsPage.goRemoveConfirm();
				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.driver.wait(
					expectedConditions.textToBePresentInElement(
						Notification.getNotificationEl(),
						'Items removed successfully'
					), 5000);
				browser.waitForAngular();
			});

			it('displays success notification after adding related BOM item', function () {
				browser.actions()
					.mouseMove(affectedItemsPage.getRowCell(2).get(1))
					.perform();
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.getInlineActionsBtn(0)), 5000);
				affectedItemsPage.getInlineActionsBtn(0).click();
				browser.wait(expectedConditions.elementToBeClickable(affectedItemsPage.getAddBOMBtn()), 5000);
				affectedItemsPage.getAddBOMBtn().click();

				expect(affectedItemsPage.openAddBOMModal()).to.eventually.be.true;

				affectedItemsPage.getChildrenOption(1).click();
				affectedItemsPage.getFilterOption(1).click();
				affectedItemsPage.getSearchBtn().click();

				affectedItemsPage.getHeaderCheckBox().click();
				affectedItemsPage.getRelatedBomItems().first()
					.element(by.css('.checkbox-column input')).click();
				affectedItemsPage.getAddSelectedBomItemButton().click();

				browser.driver.wait(expectedConditions.presenceOf(Notification.getNotificationEl()), 5000);
				browser.waitForAngular();
			});
		});
	});
}

module.exports = new AffectedItemsSpec();
