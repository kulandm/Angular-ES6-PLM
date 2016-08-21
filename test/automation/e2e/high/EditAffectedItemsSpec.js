/**
 * @ngdoc object
 * @name E2ETestsSpecs.EditAffectedItemsSpec
 *
 * @description This is the e2e test for Editing Affected Items Tab (Basic View)
 *
 * ##Dependencies
 *
 */
var auth = require('../../util/Auth');
var ss = require('../../util/screenshoter');
var helper = require('../../util/Helper');
var util = require('util');

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
 * @name E2ETestsSpecs.EditAffectedItemsSpec#EditAffectedItemsSpec
 * @propertyOf E2ETestsSpecs.EditAffectedItemsSpec
 * @description The E2E spec for Editing Affected Items
 */
function EditAffectedItemsSpec() {

	describe('EditAffectedItemsSpec:PLM2.0-184', function () {
		this.timeout(120000);
		var expectedConditions = protractor.ExpectedConditions;

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal(30000);
			AppHeader.openWorkspace('Change Management', 'Change Orders');
			workspaceItemsListPage.openItem('CO000002 - Change Valve Fitting - 3 - High');
			itemDetailsPage.switchToTab('Affected Items');
			browser.sleep(5000);
		});

		it('Affected Items Tab: View Affected Items', function () {
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

		it('Affected Items Tab: Add related items menu not Enabled', function () {
			expect(affectedItemsPage.isInlineActionsBtnDisplayed(0)).to.eventually.be.false;
		});

		it('Affected Items Tab: In edit Mode', function () {
			affectedItemsPage.goEdit().then(function () {
				expect(helper.waitForUrlToChangeTo(new RegExp(/mode=edit/))).to.eventually.be.true;
				expect((affectedItemsPage.getSaveBtn()).isPresent()).to.eventually.be.true;
			});
		});

		it('Affected Items Tab: LifeCycle Enabled', function () {
			expect(affectedItemsPage.getLifecycleText(0)).to.eventually.equal('Please Select');
		});

		it('Affected Items Tab: To is blank', function () {
			var text = affectedItemsPage.getRowCell(0).get(7).getText();
			expect(text).to.eventually.equal('');
		});

		it('Affected Items Tab: Effectivity not Enabled', function () {
			editAffectedItemsPage.getEffectivityCell(0).click();
			expect(editAffectedItemsPage.isDatePickerPresent()).to.eventually.be.false;
		});

		it('Affected Items Tab: Effectivity Enabled', function () {
			editAffectedItemsPage.changeRowLifecycle(0, 1);
			affectedItemsPage.cellsInHeaderRow.get(5).click();
			browser.wait(expectedConditions.elementToBeClickable(
				editAffectedItemsPage.getEffectivityCell(0)
			), 5000);
			editAffectedItemsPage.getEffectivityCell(0).click();

			var datePickerEl = editAffectedItemsPage.getEffectivityDatepicker(0);
			browser.wait(expectedConditions.visibilityOf(datePickerEl), 2000);
			expect(datePickerEl.isPresent()).to.eventually.be.true;
		});

		it('Affected Items Tab: Effectivity Disabled', function () {
			editAffectedItemsPage.changeRowLifecycle(0, 2);
			affectedItemsPage.cellsInHeaderRow.get(5).click();
			browser.wait(expectedConditions.elementToBeClickable(
				editAffectedItemsPage.getEffectivityCell(0)
			), 5000);
			editAffectedItemsPage.getEffectivityCell(0).click();

			var datePickerEl = editAffectedItemsPage.getEffectivityDatepicker(0);
			browser.wait(expectedConditions.invisibilityOf(datePickerEl), 2000);
			expect(datePickerEl.isPresent()).to.eventually.be.false;
		});

		// Incorrect test case: 1) logic to day before selection is not correct. What will happen if the correct date is
		// the first day of the month?? 2) Use ExpectedConditions or waits
		/* it('Affected Items Tab: Unable to select daybefore', function () {
			editAffectedItemsPage.changeRowLifecycle(0, 1);
			affectedItemsPage.cellsInHeaderRow.get(5).click();
			editAffectedItemsPage.getEffectivityCell(0).click();
			editAffectedItemsPage.openDatePickerByClickEffectivity();
			editAffectedItemsPage.selectDayBefore();
			expect(editAffectedItemsPage.getDatePickerDate()).to.eventually.equal('');
		}); */

		// Incorrect test case: 1) logic to day after selection is not correct. What will happen if the correct date is
		// the last day of the month?? 2) Use ExpectedConditions or waits
		/* it('Affected Items Tab: Select Tomorrow', function () {
			editAffectedItemsPage.selectTomorrow();
			expect(editAffectedItemsPage.getDatePickerDate()).to.eventually.not.equal('');
		}); */

		it('Affected Items Tab: All changes saved', function () {
			editAffectedItemsPage.changeRowLifecycle(0, 1);
			editAffectedItemsPage.save();
			browser.waitForAngular();

			expect(affectedItemsPage.getLifecycleText(0)).to.eventually.equal('Production Revision');
			expect(affectedItemsPage.isInlineActionsBtnDisplayed(0)).to.eventually.be.true;
			expect(editAffectedItemsPage.getEffectivityCell(0).getText()).to.eventually.not.equal('');
			expect(affectedItemsPage.getRowCell(0).get(7).getText()).to.eventually.not.equal('');
		});

		it('Affected Items Tab: Exit edit mode', function () {
			expect(helper.waitForUrlToChangeTo(new RegExp(/mode=view/))).to.eventually.be.true;
			expect((affectedItemsPage.getSaveBtn()).isDisplayed()).to.eventually.be.false;
		});
	});
}

module.exports = new EditAffectedItemsSpec();
