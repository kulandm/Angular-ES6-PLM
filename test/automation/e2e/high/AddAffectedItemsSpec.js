/**
 * @ngdoc object
 * @name E2ETestsSpecs.AddAffectedItemsSpec
 *
 * @description This is the e2e test for Adding items under Affected Items Tab (Basic View)
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var ss = require('../../util/screenshoter');
var util = require('util');
var AddItemSpec = require('../../view/sharedspecs/AddItemSpec');
var addItem = new AddItemSpec();
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
 * @name E2ETestsSpecs.AddAffectedItemsSpec#AddAffectedItemsSpec
 * @propertyOf E2ETestsSpecs.AddAffectedItemsSpec
 * @description The E2E spec for Adding Affected Items
 */
function AddAffectedItemsSpec() {

	describe('[PLM2.0-183] Affected Items Tab: AddAffectedItemsSpec', function () {
		this.timeout(120000);
		var expectedConditions = protractor.ExpectedConditions;

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal(30000);
			var outstandingWork = dashboardPage.getOutstandingWork();
			browser.wait(expectedConditions.visibilityOf(outstandingWork), 5000);

			AppHeader.openWorkspace('Change Management', 'Change Orders');
			workspaceItemsListPage.openItem('CO000007 - Test - 3 - High');
			itemDetailsPage.switchToTab('Affected Items');
			browser.sleep(5000);
		});

		after('remove added items', function () {
			affectedItemsPage.affectedItemsRows.count().then(function (count) {
				if (count) {
					// Remove added items
					affectedItemsPage.selectAllCheckbox.click();
					affectedItemsPage.goRemove();
					affectedItemsPage.goRemoveConfirm();
				}
			});
		});

		describe('[CommandBar Buttons]', function () {
			it('displays Add Button', function () {
				expect(affectedItemsPage.addLabel.isDisplayed())
					.to.eventually.be.true;
			});

			it('disables Edit Button', function () {
				expect(affectedItemsPage.editBtn.isEnabled())
					.to.eventually.be.false;
			});

			it('disables Remove Button', function () {
				expect(affectedItemsPage.removeBtn.isEnabled())
					.to.eventually.be.false;
			});
		});

		describe('[Add Flyout]', function () {
			addItem.triggerAdd('PLM2.0-183-AddAffectedItemsSpec');

			it('dismisses flyout on clicking Cancel', function () {
				affectedItemsPage.addLabel.click();

				affectedItemsPage.searchBoxInput.sendKeys('SBOM Laser Sensor');
				affectedItemsPage.searchCheckbox.click();

				affectedItemsPage.searchBoxInput.clear();

				affectedItemsPage.searchBoxInput.sendKeys('CR000001 - Prevent Damage to Valve');
				affectedItemsPage.searchCheckbox.click();

				affectedItemsPage.cancelSelection.click();
				expect(affectedItemsPage.addAffectedItemFlyout.isPresent())
					.to.eventually.be.false;
			});
		});

		describe('[Adding items]', function () {
			it('sorts added items in ascending order', function () {
				affectedItemsPage.addLabel.click();

				// Add items from RC workspace (Items & BOMs)
				affectedItemsPage.searchBoxInput.sendKeys('SBOM Laser Sensor');
				affectedItemsPage.searchCheckbox.click();
				affectedItemsPage.searchBoxInput.clear();
				expect(affectedItemsPage.searchSubmitSelection.isEnabled())
					.to.eventually.be.true;

				affectedItemsPage.searchBoxInput.sendKeys('402-0001-000 - FOOT PAD');
				affectedItemsPage.searchCheckbox.click();
				affectedItemsPage.searchBoxInput.clear();

				// Add item from Basic workspace (Customers)
				affectedItemsPage.searchBoxInput.sendKeys('Autodesk');
				affectedItemsPage.searchCheckbox.click();
				affectedItemsPage.searchBoxInput.clear();

				// Add item from Basic workspace with workflow (Change Request)
				affectedItemsPage.searchBoxInput.sendKeys('CR000001 - Prevent Damage to Valve');
				affectedItemsPage.searchCheckbox.click();

				affectedItemsPage.searchSubmitSelection.click();

				expect(affectedItemsPage.getRowCell(0).get(3).getText())
					.to.eventually.equal('CR000001 - Prevent Damage to Valve');

				expect(affectedItemsPage.getRowCell(1).get(3).getText())
					.to.eventually.equal('Autodesk');

				expect(affectedItemsPage.getRowCell(2).get(3).getText())
					.to.eventually.equal('402-0001-000 - FOOT PAD [REV:w]');

				expect(affectedItemsPage.getRowCell(3).get(3).getText())
					.to.eventually.equal('500-0000-000 - SBOM Laser Sensor [REV:w]');
			});

			it('disables added items', function () {
				affectedItemsPage.addLabel.click();

				affectedItemsPage.searchBoxInput.sendKeys('SBOM Laser Sensor');
				expect(affectedItemsPage.searchCheckbox.getAttribute('disabled'))
					.to.eventually.equal('true');
				affectedItemsPage.searchBoxInput.clear();

				affectedItemsPage.searchBoxInput.sendKeys('402-0001-000 - FOOT PAD');
				expect(affectedItemsPage.searchCheckbox.getAttribute('disabled'))
					.to.eventually.equal('true');
				affectedItemsPage.searchBoxInput.clear();

				// Add item from Basic workspace with workflow (Products)
				affectedItemsPage.searchBoxInput.sendKeys('EM-4001 - Assembly Process Machine');
				affectedItemsPage.searchCheckbox.click();

				affectedItemsPage.searchSubmitSelection.click();
				expect(affectedItemsPage.getRowCell(4).get(3).getText())
					.to.eventually.equal('EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable');
			});

			it('checks Edit details', function () {
				affectedItemsPage.goEdit();
				browser.wait(expectedConditions.visibilityOf(
					affectedItemsPage.affectedItemsTable
				), 5000);

				expect(affectedItemsPage.getLifecycleText(0)).to.eventually.not.equal('Please Select');
				expect(affectedItemsPage.getLifecycleText(1)).to.eventually.not.equal('Please Select');
				expect(affectedItemsPage.getLifecycleText(2)).to.eventually.equal('Please Select');
				expect(affectedItemsPage.getLifecycleText(3)).to.eventually.equal('Please Select');
				expect(affectedItemsPage.getLifecycleText(4)).to.eventually.not.equal('Please Select');

				expect(editAffectedItemsPage.getEffectivityCell(0).getText())
					.to.eventually.not.equal('On Release');
				expect(editAffectedItemsPage.getEffectivityCell(1).getText())
					.to.eventually.not.equal('On Release');
				expect(editAffectedItemsPage.getEffectivityCell(2).getText())
					.to.eventually.equal('On Release');
				expect(editAffectedItemsPage.getEffectivityCell(3).getText())
					.to.eventually.equal('On Release');
				expect(editAffectedItemsPage.getEffectivityCell(4).getText())
					.to.eventually.not.equal('On Release');

				affectedItemsPage.cancelBtn.click();
			});
		});
	});
}

module.exports = new AddAffectedItemsSpec();
