/**
 * @ngdoc object
 * @name E2ETestsSpecs.AddRelatedBomSpec
 *
 * @description This is the e2e test for Adding Related BOM items for RC items
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var ss = require('../../util/screenshoter');
var helper = require('../../util/Helper');
var util = require('util');
var CommandBar = require('../../components/CommandBar');
var AppHeader = require('../../components/AppHeader');
var Notification = require('../../components/Notification');
var dashboardPage = require('../../pages/MainDashboardPage');
var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
var ViewAffectedItemsPage = require('../../pages/ViewAffectedItemsPage');
var EditAffectedItemsPage = require('../../pages/EditAffectedItemsPage');

var affectedItemsPage = new ViewAffectedItemsPage();
var editAffectedItemsPage = new EditAffectedItemsPage();

/**
 * @ngdoc method
 * @name E2ETestsSpecs.AddFromFlyoutSpec#AddRelatedBomSpec
 * @propertyOf E2ETestsSpecs.AddRelatedBomSpec
 * @description The E2E spec for Adding Related BOM items for RC items
 */
function AddRelatedBomSpec() {

	describe('AddRelatedBomSpec', function () {
		this.timeout(120000);

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal(30000);
			AppHeader.openWorkspace('Change Management', 'Change Orders');
			workspaceItemsListPage.openItem('CO000009 - Test Release 1 - 1 - Low');
			itemDetailsPage.switchToTab('Affected Items');
			browser.sleep(5000);
		});

		after('remove added items', function () {
			affectedItemsPage.affectedItemsRows.count().then(function (count) {
				if (count > 4) {
					// Remove added items
					affectedItemsPage.getRowCell(3).get(1).click();
					affectedItemsPage.goRemove();
					affectedItemsPage.goRemoveConfirm();
				}
			});
		});

		it('Shows Add Related Items button', function () {
			expect(affectedItemsPage.affectedItemsRows.count())
				.to.eventually.equal(4);

			affectedItemsPage.getRowCell(0).get(1).click();
			expect(CommandBar.getTranscludedButtonByLabel('Add Related Items').isDisplayed())
				.to.eventually.be.true;
			expect(CommandBar.getCommandBarText())
				.to.eventually.equal('1 item selected');
			expect(affectedItemsPage.isInlineActionsBtnDisplayed(0))
				.to.eventually.be.true;
		});

		it('Hides Add Related Items button upon deselecting', function () {
			affectedItemsPage.getRowCell(0).get(1).click();
			expect(CommandBar.getTranscludedButtonByLabel('Add Related Items').isPresent())
				.to.eventually.be.false;
		});

		it('Displays Add Related Items dialog box', function () {
			affectedItemsPage.getRowCell(1).get(1).click();
			CommandBar.getTranscludedButtonByLabel('Add Related Items').click();
			expect(affectedItemsPage.openAddBOMModal())
				.to.eventually.be.true;

			expect(affectedItemsPage.getChildrenOption(0).isEnabled())
				.to.eventually.be.true;
			expect(affectedItemsPage.getParentsOption(0).isEnabled())
				.to.eventually.be.true;
			expect(affectedItemsPage.getFilterOption(0).isEnabled())
				.to.eventually.be.true;
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.false;
		});

		it('Shows and hides Search button when Include Children options are toggled', function () {
			affectedItemsPage.getChildrenOption(2).click(); // Selects All Children option
			browser.waitForAngular();
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.true;

			affectedItemsPage.getChildrenOption(0).click(); // Selects None option
			browser.waitForAngular();
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.false;

			affectedItemsPage.getChildrenOption(1).click(); // Selects Direct Children option
			browser.waitForAngular();
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.true;

			affectedItemsPage.getChildrenOption(0).click(); // Selects None option
			browser.waitForAngular();
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.false;
		});

		it('Shows and hides Search button when Include Parents options are toggled', function () {
			affectedItemsPage.getParentsOption(1).click(); // Selects Direct Parents option
			browser.waitForAngular();
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.true;

			affectedItemsPage.getParentsOption(0).click(); // Selects None option
			browser.waitForAngular();
			expect(affectedItemsPage.getSearchBtn().isDisplayed())
				.to.eventually.be.false;
		});

		it('Lists the related items', function () {
			affectedItemsPage.getChildrenOption(2).click();
			affectedItemsPage.getParentsOption(1).click();
			affectedItemsPage.getFilterOption(1).click();
			affectedItemsPage.getSearchBtn().click();
			browser.sleep(3000); // It takes time for the results to be listed

			expect(affectedItemsPage.getRelatedBomItems().count())
				.to.eventually.equal(1);
			expect(affectedItemsPage.getBomItemCheckBox(1).isSelected())
				.to.eventually.be.true;
			expect(affectedItemsPage.getSelectedBomItemsInfo.getText())
				.to.eventually.equal('1 item selected');
		});

		it('Disables Add button when no item is selected', function () {
			affectedItemsPage.getBomItemCheckBox(0).click();
			expect(affectedItemsPage.getSelectedBomItemsInfo.getText())
				.to.eventually.equal('0 item selected');
			expect(affectedItemsPage.getAddSelectedBomItemButton().isEnabled())
				.to.eventually.be.false;
		});

		it('Adds a related item', function () {
			affectedItemsPage.getBomItemCheckBox(1).click();
			affectedItemsPage.getAddSelectedBomItemButton().click();
			affectedItemsPage.assertItemExist('600-0001-000 - SBOM Project 621 Head [REV:w]');

			expect(affectedItemsPage.getRowCell(3).get(4).getInnerHtml())
				.to.eventually.contain('');

			affectedItemsPage.getRowCell(3).get(1).click();
			expect(CommandBar.getTranscludedButtonByLabel('Add Related Items').isPresent())
				.to.eventually.be.false;
			expect(affectedItemsPage.isInlineActionsBtnDisplayed(3))
				.to.eventually.be.false;
			affectedItemsPage.getRowCell(3).get(1).click();

			affectedItemsPage.getRowCell(4).get(1).click();
			expect(CommandBar.getTranscludedButtonByLabel('Add Related Items').isPresent())
				.to.eventually.be.false;
			expect(affectedItemsPage.isInlineActionsBtnDisplayed(4))
				.to.eventually.be.false;
			affectedItemsPage.getRowCell(4).get(1).click();
		});

		it('Shows Add related button after editting', function () {
			// TODO Update selection after PLM-13330 has been fixed
			affectedItemsPage.selectAllCheckbox.click(); // An item is previously selected, unselect all to enable Edit button
			affectedItemsPage.selectAllCheckbox.click();
			affectedItemsPage.goEdit();
			editAffectedItemsPage.changeRowLifecycle(3,1);
			affectedItemsPage.cellsInHeaderRow.get(5).click();
			editAffectedItemsPage.save();

			expect(affectedItemsPage.getLifecycleText(3)).to.eventually.equal('Production Revision');
			expect(affectedItemsPage.isInlineActionsBtnDisplayed(3))
				.to.eventually.be.true;

			affectedItemsPage.getRowCell(3).get(1).click();
			expect(CommandBar.getTranscludedButtonByLabel('Add Related Items').isPresent())
				.to.eventually.be.true;
			affectedItemsPage.getRowCell(3).get(1).click();
		});
	});
}

module.exports = new AddRelatedBomSpec();
