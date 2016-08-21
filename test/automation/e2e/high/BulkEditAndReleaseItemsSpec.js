
/**
 * @ngdoc object
 * @name E2ETestsSpecs.bulkEditAndReleaseItemsSpec
 *
 * @description This is the e2e test for Bulk edit and release items
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var util = require('util');
var AppHeader = require('../../components/AppHeader');
var Notification = require('../../components/Notification');
var AddItemFlyout = require('../../components/AddItemFlyout');
var WorkflowTransitionFlyout = require('../../components/WorkflowTransitionFlyout');
var ItemHeader = require('../../components/ItemHeader');
var CreateItem = require('../../components/CreateItem');
var BulkEdit = require('../../components/BulkEdit');

var dashboardPage = require('../../pages/MainDashboardPage');
var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
var ViewAffectedItemsPage = require('../../pages/ViewAffectedItemsPage');
var affectedItemsPage = new ViewAffectedItemsPage();

/**
 * @ngdoc method
 * @name E2ETestsSpecs.EditAffectedItemsSpec#bulkEditAndReleaseItemsSpec
 * @propertyOf E2ETestsSpecs.EditAffectedItemsSpec
 * @description The E2E spec for Bulk edit and release items
 */
function BulkEditAndReleaseItemsSpec() {

	describe('End to End validation - Bulk edit and release items', function () {
		this.timeout(120000);
		var expectedConditions = protractor.ExpectedConditions;

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal(30000);
			AppHeader.openWorkspace('Engineering', 'Items and BOMs');
			workspaceItemsListPage.scrollDownAndOpenItem('101-0000-000 -');
			browser.sleep(5000);
		});

		after(function () {
			WorkflowTransitionFlyout.flyout.isPresent().then(function (isPresent) {
				if (isPresent === true) {
					WorkflowTransitionFlyout.cancelTransitionButton.click();
				}
			});
		});

		it('creates new CO', function () {
			CreateItem.quickCreateECO('Test-for-workflow', 'abc', 'abc', 'abc');
			CreateItem.clickSaveOptionsElement();
			CreateItem.saveAndViewButton().click();
			browser.waitForAngular();

			expect(ItemHeader.getItemDescriptor()).to.eventually
				.equal('CO000012 - Test-for-workflow -');
		});

		it('searches and adds RC/non-RC items', function () {
			itemDetailsPage.switchToTab('Affected Items');
			affectedItemsPage.addLabel.click();

			expect(affectedItemsPage.addAffectedItemFlyout.isDisplayed())
				.to.eventually.be.true;

			affectedItemsPage.searchBoxInput.sendKeys('101-0000-000 -');
			affectedItemsPage.searchCheckbox.click();
			AddItemFlyout.clearSearch();
			affectedItemsPage.searchBoxInput.sendKeys('FLOATING JOINT');
			affectedItemsPage.searchCheckbox.click();
			AddItemFlyout.clearSearch();
			affectedItemsPage.searchBoxInput.sendKeys('McMaster-Carr Supply Co.');
			affectedItemsPage.searchCheckbox.click();
			affectedItemsPage.searchSubmitSelection.click();
			browser.waitForAngular();

			expect(affectedItemsPage.affectedItemsRows.count()).to.eventually.equal(3);
		});

		it('selects all and bulk edit', function () {
			affectedItemsPage.selectAllCheckbox.click();
			affectedItemsPage.bulkEditButton().click();

			browser.wait(expectedConditions.visibilityOf(
				BulkEdit.getLifecycleContainer()
			), 5000, 'wait for bulk-edit failed');

			expect(BulkEdit.lifecycleCurrentStates().count()).to.eventually.equal(2);
		});

		it('chooses lifecycle, effectivity, date and saves', function () {
			BulkEdit.selectLifecycleTransition(1, 1);
			BulkEdit.selectLifecycleTransition(2, 1);
			BulkEdit.setEffectivityOptionYes();

			browser.wait(function () {
				return affectedItemsPage.chooseDateButton().isEnabled();
			}, 5000, 'wait for choose date button failed');
			affectedItemsPage.chooseDateButton().click();
			browser.wait(function () {
				return affectedItemsPage.getEffectivityDateField()
					.element(by.css('ul.dropdown-menu'))
					.isDisplayed();
			}, 5000, 'wait for date picker failed');
			affectedItemsPage.dateToBeClicked().click();
			affectedItemsPage.getBulkEditDialogUpdateButton().click();
			affectedItemsPage.saveBtn.click();
			browser.waitForAngular();

			expect(affectedItemsPage.getRowCell(0).get(4).getText())
				.to.eventually.equal('Initial Design Revision');
			expect(affectedItemsPage.getRowCell(0).get(5).getText())
				.to.eventually.equal('On Release');

			expect(affectedItemsPage.getRowCell(1).get(4).getText())
				.to.eventually.equal('Production Revision');
			expect(affectedItemsPage.getRowCell(1).get(5).getText())
				.to.eventually.not.equal('');

			expect(affectedItemsPage.getRowCell(2).get(4).getText())
				.to.eventually.equal('');
			expect(affectedItemsPage.getRowCell(2).get(5).getText())
				.to.eventually.equal('');
		});

		it('transits to \'Route Change\' workflow', function () {
			// Trigger actions dropdown
			browser.wait(ItemHeader.getActionsDropDownButton().isDisplayed);
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.actionsDropdown
			), 5000, 'wait for actions dropdown failed');
			WorkflowTransitionFlyout.actionsDropdown.click();

			// Trigger workflow transition flyout
			browser.wait(expectedConditions.elementToBeClickable(
				WorkflowTransitionFlyout.workFlowTransitionLink
			), 5000);
			WorkflowTransitionFlyout.workFlowTransitionLink.click();

			// Select 'Route Change' workflow
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
			expect(ItemHeader.getWorkflowLock().getText())
				.to.eventually.contain('Locked');
			expect(ItemHeader.getWorkflowStatus().getText())
				.to.eventually.contain('Route Change & Lock Items');
		});
	});
}

module.exports = new BulkEditAndReleaseItemsSpec();
