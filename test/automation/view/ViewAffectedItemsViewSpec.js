/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewAffectedItemsViewSpec
 *
 * @description This is the view tests for the AffectedItemsViewPage.
 *
 * ##Dependencies
 *
 */

var auth = require('../util/Auth');
var ss = require('../util/screenshoter');
var util = require('util');
var SharedSpec = require('./SharedSpec');
var AddItemSpec = require('./sharedspecs/AddItemSpec');
var addItem = new AddItemSpec();
var addItemFlyout = require('../components/AddItemFlyout');
var CommandBarSpec = require('./sharedspecs/CommandBarSpec');
var commandBar = new CommandBarSpec();
var CommandBar = require('../components/CommandBar');
var _ = require('underscore');

var AffectedItemsViewPageObj = require('../pages/ViewAffectedItemsPage');
var affectedItemsViewPage = new AffectedItemsViewPageObj();
var mainDashboardPage = require('../pages/MainDashboardPage');

function ViewAffectedItemsViewSpec() {

	ViewAffectedItemsViewSpec.super_.call(this);
	var that = this;

	describe('ViewAffectedItemsView', function () {
		this.timeout(150000);

		before(function () {
			// Returning a promise manually that will resolve when the inner requirement resolves
			var deferred = protractor.promise.defer();
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					affectedItemsViewPage.go();
					affectedItemsViewPage.waitForEvents().then(function (result) {
						expect(result).to.be.true;
						deferred.fulfill();
					});
				});
			});
			return deferred.promise;
		});

		after(function () {
			// auth.doLogout();
		});

		afterEach('take a screenshot if a test fails', function () {
			if (this.currentTest.state === 'failed') {
				ss.writeSS(this.currentTest.ssName);
			}
		});

		commandBar.displaysEditAddRemove('ViewAffectedItemsView');
		addItem.triggerAdd('ViewAffectedItemsView');

		it('displays the list of affected items', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-affectedItemsList';

			expect(affectedItemsViewPage.isAffectedItemsTableDisplayed()).to.eventually.be.true;
			expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.be.at.least(1);
			expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.equal(7);
		});

		it('checks if the Edit button and the secondary buttons are visible and accordingly greyed out', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-editAndSecondaryButtonsState';

			expect(affectedItemsViewPage.editBtn.isDisplayed()).to.eventually.be.true;
			expect(affectedItemsViewPage.editBtn.isEnabled()).to.eventually.be.true;
			expect(affectedItemsViewPage.removeBtn.isDisplayed()).to.eventually.be.true;
			expect(affectedItemsViewPage.removeBtn.isEnabled()).to.eventually.be.false;
		});

		it('should not have duplicate row Ids and should be sorted by rowId', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-noDuplicates';

			expect(affectedItemsViewPage.isAffectedItemsTableDisplayed()).to.eventually.be.true;
			expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.be.at.least(1);
			expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.equal(7);

			var rowIdPromises = [];
			for (var i = 0; i < 7; i++) {
				rowIdPromises.push(affectedItemsViewPage.getRowCell(i).get(2)
					.element(by.css('.ui-grid-cell-contents')).getInnerHtml());
			}

			return protractor.promise.all(rowIdPromises).then(function (rowIds) {
				expect(rowIds).to.eql(['1', '2', '3', '4', '5', '6', '7']);
			});
		});

		it('should not have duplicate item descriptors', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-noDuplicates';

			expect(affectedItemsViewPage.isAffectedItemsTableDisplayed()).to.eventually.be.true;
			expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.be.at.least(1);
			expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.equal(7);

			var rowIdPromises = [];
			for (var i = 0; i < 7; i++) {
				rowIdPromises.push(affectedItemsViewPage.getRowCell(i).get(3)
					.element(by.css('.ui-grid-cell-contents')).getInnerHtml());
			}

			return protractor.promise.all(rowIdPromises).then(function (rowDescriptors) {
				expect(_.uniq(rowDescriptors)).to.deep.equal(rowDescriptors);
			});
		});

		it('shows the item descriptor as a link', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-itemDescriptorLink';

			expect(affectedItemsViewPage.isItemDescriptorLinkToItem()).to.eventually.be.true;
		});

		it('shows the inline action drop-down icon when mouse hover', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-inlineActionsDropdown';

			browser.actions()
				.mouseMove(affectedItemsViewPage.getRowCell(0).get(1))
				.perform();
			expect(affectedItemsViewPage.getInlineActionsBtn(0).isDisplayed()).to.eventually.be.true;
		});

		it('displays the sorting indicator on the # column by default', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-sortingIndicator';

			expect(affectedItemsViewPage.getHeaderCellClasses(2)).to.eventually.match(/ui-grid-icon-up-dir/);
		});

		it('changes column width when the resize handler is dragged', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-resizeColumn';

			var initialWidth, finalWidth;
			var dragOffset = {
				x: 200,
				y: 0
			};

			affectedItemsViewPage.getColumnWidth(3).then(function (width) {
				initialWidth = width;

				// Resize the column using the offset specified above
				browser.actions()
					.dragAndDrop(affectedItemsViewPage.columnResizer, dragOffset)
					.perform();

				// Width after resizing
				return affectedItemsViewPage.getColumnWidth(3);
			}).then(function (width) {
				finalWidth = width;

				expect(initialWidth).to.not.equal(finalWidth);
			});
		});

		it('select items to perform action', function () {
			this._runnable.ssName = 'ViewAffectedItemsView-selectItems';

			expect(CommandBar.getTranscludedButtonCount()).to.eventually.be.equal(3);

			affectedItemsViewPage.getRowSelectionButtons().first().click();
			browser.waitForAngular();

			expect(CommandBar.getTranscludedButtonCount()).to.eventually.be.equal(4);

			affectedItemsViewPage.getRowSelectionButtons().first().click();
			browser.waitForAngular();

			expect(CommandBar.getTranscludedButtonCount()).to.eventually.be.equal(3);
		});

		it('add 2 items to the list and check the result', function () {
			var itemName1 = '401-0001-000 - PART MARKER MOUNT [REV:w]';
			var itemName2 = '401-0003-000 - UPPER GUIDE [REV:w]';
			addItemFlyout.openAddItemsFlyout();
			addItemFlyout.addItemsSearchBy('401');
			addItemFlyout.addItemsListCheckbox(0).click();
			addItemFlyout.addItemsListCheckbox(1).click();
			addItemFlyout.getAddItemFlyoutBtns('Add').click();
			affectedItemsViewPage.assertItemExist(itemName1);
			affectedItemsViewPage.assertItemExist(itemName2);
		});

		describe('[AddRelatedBomModal]', function () {
			beforeEach('open the modal', function () {
				browser.actions()
					.mouseMove(affectedItemsViewPage.getRowCell(0).get(1))
					.perform();
				affectedItemsViewPage.getInlineActionsBtn(0).click();
				affectedItemsViewPage.getAddBOMBtn().click();
			});

			it('opens the modal and lists the direct children and direct parent of the selected item', function () {
				this._runnable.ssName = 'ViewAffectedItemsView-openBomModal';

				expect(affectedItemsViewPage.openAddBOMModal()).to.eventually.be.true;
				affectedItemsViewPage.getChildrenOption(1).click();
				affectedItemsViewPage.getParentsOption(1).click();
				affectedItemsViewPage.getFilterOption(1).click();
				affectedItemsViewPage.getSearchBtn().click();

				// Check that the revision tag is present
				expect(affectedItemsViewPage.getRelatedBomItems().get(0).getText()).to.eventually.contain('[REV:w]');
				expect(affectedItemsViewPage.getRelatedBomItems().count()).to.eventually.equal(1);

				affectedItemsViewPage.getModalCancelBtn().click();
			});

			it('lists all the children of the selected item', function () {
				this._runnable.ssName = 'ViewAffectedItemsView-listChildren';

				affectedItemsViewPage.getChildrenOption(2).click();
				affectedItemsViewPage.getParentsOption(1).click();
				affectedItemsViewPage.getFilterOption(1).click();
				affectedItemsViewPage.getSearchBtn().click();
				expect(affectedItemsViewPage.getRelatedBomItems().count()).to.eventually.be.equal(1);

				affectedItemsViewPage.getModalCancelBtn().click();
			});

			it('lists empty when search has no results ', function () {
				this._runnable.ssName = 'ViewAffectedItemsView-emptyList';

				affectedItemsViewPage.getChildrenOption(1).click();
				affectedItemsViewPage.getParentsOption(0).click();
				affectedItemsViewPage.getFilterOption(1).click();
				affectedItemsViewPage.getSearchBtn().click();
				expect(affectedItemsViewPage.getRelatedBomItems().count()).to.eventually.be.equal(0);

				affectedItemsViewPage.getModalCancelBtn().click();
			});

			it('displays selected items count', function () {
				this._runnable.ssName = 'ViewAffectedItemsView-selectedCount';

				affectedItemsViewPage.getChildrenOption(1).click();
				affectedItemsViewPage.getParentsOption(1).click();
				affectedItemsViewPage.getFilterOption(1).click();
				affectedItemsViewPage.getSearchBtn().click();
				expect(affectedItemsViewPage.getSelectedBomItemsInfo.getText()).to
					.eventually.contain('1 item selected');
				affectedItemsViewPage.getHeaderCheckBox().click();
				expect(affectedItemsViewPage.getSelectedBomItemsInfo.getText()).to
					.eventually.contain('0 item selected');

				affectedItemsViewPage.getModalCancelBtn().click();
			});

			it('adds a related bom item', function () {
				this._runnable.ssName = 'ViewAffectedItemsView-addBomItem';

				expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.equal(9);

				affectedItemsViewPage.getChildrenOption(1).click();
				affectedItemsViewPage.getParentsOption(1).click();
				affectedItemsViewPage.getFilterOption(1).click();
				affectedItemsViewPage.getSearchBtn().click();
				affectedItemsViewPage.getAddSelectedBomItemButton().click();

				expect(affectedItemsViewPage.affectedItemsRows.count()).to.eventually.equal(10);
			});
		});

		describe('Bulk Edit functionality', function () {
			it('checks if the bulk edit icon is visible if more than one revision controlled item is selected', function () {
				affectedItemsViewPage.getRowSelectionButtons().first().click();
				browser.waitForAngular();
				browser.sleep('1000');
				expect(affectedItemsViewPage.bulkEditButton().isDisplayed()).to.eventually.be.true;
			});

			it('checks if the bulk edit icon is hidden if no revision controlled item is selected', function () {
				affectedItemsViewPage.getRowSelectionButtons().first().click();
				browser.waitForAngular();
				browser.sleep('1000');
				expect(affectedItemsViewPage.bulkEditButton().isPresent()).eventually.to.be.false;
			});

			it('opens the bulk edit modal window', function () {
				affectedItemsViewPage.getRowSelectionButtons().first().click();
				browser.waitForAngular();
				affectedItemsViewPage.bulkEditButton().click();
				browser.waitForAngular();
				browser.sleep(1000);
				expect(affectedItemsViewPage.bulkEditModal().isDisplayed()).to.eventually.be.true;
			});

			it('has the correct heading for the bulk edit modal window', function () {
				expect(affectedItemsViewPage.bulkEditModalHeading().getText()).to.eventually.equal('Bulk Lifecycle Change');
			});

			it('has the correct sub heading for the bulk edit modal window', function () {
				expect(affectedItemsViewPage.bulkEditModalSubHeading().getText()).to.eventually.equal('Set Lifecycle Transition');
			});

			it('has the correct state', function () {
				expect(affectedItemsViewPage.lifecycleOption().element(by.css('label')).getText()).to.eventually.equal('Production');
			});

			it('has the correct transitions for the relevant state', function () {
				affectedItemsViewPage.lifecycleOption().element(by.css('field-selector')).click();
				browser.sleep(1000);
				expect(affectedItemsViewPage.getTransitions().get(1).getText()).eventually.equal('Production Revision');
				expect(affectedItemsViewPage.getTransitions().get(2).getText()).eventually.equal('Obsolete');
			});

			it('should be able to toggle effectivity options.', function () {
				expect(affectedItemsViewPage.getEffectivityDateField().getAttribute('aria-disabled'), 'effectivity date field').to.eventually.equal('true');

				affectedItemsViewPage.getEffectivityOptions().get(1).click();

				expect(affectedItemsViewPage.getEffectivityOptions().first().getAttribute('aria-checked')).to.eventually.equal('false');
				expect(affectedItemsViewPage.getEffectivityDateField().getAttribute('aria-disabled')).to.eventually.equal('false');
			});

			it('should check if some value is coming after selecting the date from the datepicker', function () {
				affectedItemsViewPage.chooseDateButton().click();
				browser.sleep(2000);
				affectedItemsViewPage.dateToBeClicked().click();
				browser.sleep(3000);
				affectedItemsViewPage.datepickerInput().getAttribute('value').then(function (val) {
					// It won't be possible to check the exact value of the date as the
					// datepicker has a combination of min date and user defined format.
					// So, checking that after choosing the date, the field is populated with some chars
					// Chars can be like 10/12/2016, so counting the chars are 10
					expect(val).length.to.be(10);
					affectedItemsViewPage.getBulkEditDialogCloseElement().click();
					browser.sleep(1000);
				});
			});

			// Below can be uncommented when we have the relevant data for non-revisioning workspace
			// TODO: the tenant data is not consistent with this test. Need to revise.
			it.skip('should check that bulk edit functionality is not being triggered on non-revisioning workspace', function () {
				affectedItemsViewPage.changeRoute('26', '2860');
				affectedItemsViewPage.go();
				affectedItemsViewPage.waitForEvents();
				browser.sleep(1000);

				affectedItemsViewPage.getRowSelectionButtons().first().click();
				browser.waitForAngular();
				browser.sleep(1000);
				expect(affectedItemsViewPage.bulkEditButton().isDisplayed()).to.eventually.be.false;
			});
		});

		describe('Remove all functionality', function () {

			it('should hide the bulk edit button once remove all functionality has been triggered', function () {
				affectedItemsViewPage.goRemove();
				browser.waitForAngular();
				browser.sleep(1000);
				affectedItemsViewPage.goRemoveConfirm();
				browser.waitForAngular();
				expect(affectedItemsViewPage.bulkEditButton().isPresent()).to.eventually.be.false;
				expect(affectedItemsViewPage.editBtn.isDisplayed()).to.eventually.be.true;
				expect(affectedItemsViewPage.editBtn.isEnabled()).to.eventually.be.false;
				expect(affectedItemsViewPage.removeBtn.isDisplayed()).to.eventually.be.true;
				expect(affectedItemsViewPage.removeBtn.isEnabled()).to.eventually.be.false;
			});
		});

		// Testing scenarios when a workspace item is only related to single workspace for managed item view.
		describe('Single Related Workspace', function () {
			beforeEach(function () {
				affectedItemsViewPage.changeRoute('53', '3293');
				affectedItemsViewPage.go();
				affectedItemsViewPage.waitForEvents();

				addItemFlyout.openAddItemsFlyout();
			});

			afterEach('close the flyout', function () {
				addItemFlyout.closeAddItemsFlyout();
			});

			it('should not display workspace selector element', function () {
				expect(addItemFlyout.getWorkspaceSelectorElement().isDisplayed()).to.eventually.be.false;
			});
		});

		// Run shared tests
		that.testWorkspacesMenu(affectedItemsViewPage, 'ViewAffectedItemsView');
	});
}

util.inherits(ViewAffectedItemsViewSpec, SharedSpec);

module.exports = new ViewAffectedItemsViewSpec();
