/**
 * @ngdoc object
 * @name ViewTestsSpecs.ViewAffectedItemsEditSpec
 *
 * @description This is the view tests for the AffectedItemsEditPage.
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

var AffectedItemsEditPage = require('../pages/EditAffectedItemsPage');
var affectedItemsEditPage = new AffectedItemsEditPage();

function ViewAffectedItemsEditSpec() {

	ViewAffectedItemsEditSpec.super_.call(this);
	var that = this;
	var expectedConditions = protractor.ExpectedConditions;

	describe('ViewAffectedItemsEdit', function () {
		this.timeout(150000);

		before(function () {
			auth.doLogin().then(function () {
				auth.checkAgreementModal().then(function () {
					affectedItemsEditPage.go();
					affectedItemsEditPage.waitForEvents().then(function (result) {
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

		describe('[CommandBar]', function () {
			it('displays the command bar', function () {
				this._runnable.ssName = 'ViewAffectedItemsEdit-commandBar';

				expect(CommandBar.isCommandBarDisplayed()).to.eventually.be.true;
			});

			it('displays the Save and Cancel buttons', function () {
				this._runnable.ssName = 'ViewAffectedItemsEdit-transcludedButtons';

				expect(CommandBar.getControlButton(0).all(by.tagName('span'))
					.last().getText()).to.eventually.equal('Save');

				expect(CommandBar.getControlButton(1).all(by.tagName('span'))
					.last().getText()).to.eventually.equal('Cancel');
			});

			it('disabled the Add and Remove buttons', function () {
				this._runnable.ssName = 'ViewAffectedItemsEdit-disabledButtons';

				expect(CommandBar.getRemoveButton().getAttribute('disabled')).to.eventually.equal('true');

				expect(CommandBar.getAddButton().getAttribute('disabled')).to.eventually.equal('true');
			});
		});

		it('displays the list of affected items', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-affectedItemsList';
			expect(affectedItemsEditPage.isAffectedItemsTableDisplayed()).to.eventually.be.true;
			expect(affectedItemsEditPage.affectedItemsRows.count()).to.eventually.be.at.least(1);
			expect(affectedItemsEditPage.affectedItemsRows.count()).to.eventually.equal(7);
		});

		it('shows the item descriptor as a link', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-itemDescriptorLink';

			expect(affectedItemsEditPage.isItemDescriptorLinkToItem()).to.eventually.be.true;
		});

		it('changes Lifecycle into a dropdown upon clicking', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-lifecycleDropdown';

			affectedItemsEditPage.getLifecycleCell(0).click();

			affectedItemsEditPage.getLifecycleCell(0).element(by.css('.search')).click().then(function () {
				affectedItemsEditPage.getLifecycleCell(0).element(by.css('.menu')).isDisplayed().then(function (isDisplayed) {
					expect(isDisplayed).to.be.true;
					affectedItemsEditPage.getRowCell(0, 2).click();
				});
			});

		});

		/* it('changes the cell to dirty state after changing the Lifecycle, and enables editing on Effectivity cell', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-changeLifecycle';

			var currentLifecycle;
			affectedItemsEditPage.getLifecycle(0).then(function (lifecycle) {
				currentLifecycle = lifecycle;
			});

			affectedItemsEditPage.getLifecycleCell(0).click().then(function () {
				affectedItemsEditPage.getLifecycleDropdown().click().then(function () {
					affectedItemsEditPage.getLifecycleDropdownOptions().count().then(function (noOfOptions) {
						// If dropdown has more than one option, change the lifecycle
						if (noOfOptions > 1) {
							affectedItemsEditPage.getLifecycleDropdownOptions().first().getText().then(function (firstOption) {
								if (firstOption !== currentLifecycle) {
									affectedItemsEditPage.getLifecycleDropdownOptions().first().click();
								} else {
									affectedItemsEditPage.getLifecycleDropdownOptions().last().click();
								}
							});

							// Lifecycle cell should be in dirty state
							affectedItemsEditPage.getLifecycleCell().element(by.css('.fieldWrapper')).then(function (editedCell) {
								expect(editedCell.getAttribute('class')).to.eventually.match(/dirty/);
								expect(editedCell.getCssValue('box-shadow')).to.eventually.match(/1px/);
							});

							// Check that effectivity cannot be edited
							affectedItemsEditPage.getEffectivityCell().click().then(function () {
								expect(affectedItemsEditPage.isEffectivityEditable()).to.eventually.be.false;
							});

							// Revert icon should be displayed now upon hovering on Lifecycle cell
							browser.actions()
								.mouseMove(affectedItemsEditPage.getLifecycleCell())
								.perform();
							affectedItemsEditPage.getFromCell(1).click(); //click outside the editbox so the undo icon can show
							expect(affectedItemsEditPage.getLifecycleBtns().get(1).isDisplayed()).to.eventually.be.true;
							affectedItemsEditPage.getLifecycleBtns().get(1).element(by.tagName('span')).getAttribute('class').then(function (classes) {
								expect(classes).to.equal('icon-Revert');
							});

							// Revert Lifecycle
							// TODO: clicking revert did not revert effectivity to be editable (bug)
							// Manually reverting by clicking dropdown option for now
							affectedItemsEditPage.getLifecycleCell().click().then(function () {
								affectedItemsEditPage.getLifecycleDropdown().click().then(function () {
									affectedItemsEditPage.getLifecycleDropdownOptions().first().getText().then(function (firstOption) {
										if (firstOption === currentLifecycle) {
											affectedItemsEditPage.getLifecycleDropdownOptions().first().click();
										} else {
											affectedItemsEditPage.getLifecycleDropdownOptions().last().click();
										}
									});
								});
							});
						}
					});
				});
			});

			affectedItemsEditPage.getIndexCell().click();
		}); */

		it('displays a datepicker when editing the Effectivity', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-effectivityDatepicker';

			affectedItemsEditPage.isEffectivityEditable(0).then(function (isEditable) {
				if (isEditable) {
					affectedItemsEditPage.getEffectivityCell(0).click().then(function () {
						var datepicker = affectedItemsEditPage.getEffectivityDatepicker(0);
						datepicker.element(by.css('.choose-date span')).getAttribute('class').then(function (classes) {
							expect(classes).to.equal('md-event-note');
						});

						datepicker.click().then(function () {
							expect(affectedItemsEditPage.getEffectivityCalendar(0).isDisplayed()).to.eventually.be.true;
						});
					});
				}
			});

			affectedItemsEditPage.getIndexCell(0).click();
		});

		it('Displays the rich text field overlay upon clicking pargraph cell', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-RichTextField';
			affectedItemsEditPage.getParagraphCell(0).click();
			expect(affectedItemsEditPage.isRichTextFieldPresent()).to.eventually.be.true;
		});

		it('Closes the rich text field overlay upon clicking somewhere outside', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-RichTextField';
			browser.actions().mouseMove(affectedItemsEditPage.getMenuBackDrop(), {x: 300, y: 300}).click().perform();
			expect(affectedItemsEditPage.isRichTextFieldPresent()).to.eventually.be.false;
		});

		it('Checks that the effectivity is always On Release for the transitions having the effectivity flag as false', function () {
			this._runnable.ssName = 'ViewAffectedItemsEdit-effectivityFalse';
			affectedItemsEditPage.getLifecycleCell(0).click();
			browser.sleep(200);
			affectedItemsEditPage.getLifecycleDropdown().click();
			affectedItemsEditPage.getLifecycleOption(1).click();
			browser.sleep(200);
			expect(affectedItemsEditPage.getEffectivityCell(0).getText()).to.eventually.equal('On Release');
			affectedItemsEditPage.getLifecycleCell(0).click();
			browser.sleep(200);
			affectedItemsEditPage.getLifecycleDropdown().click();
			affectedItemsEditPage.getLifecycleOption(0).click();
			browser.sleep(200);
		});

		describe.skip('[Client Validation]', () => {

			before(() => {
				affectedItemsEditPage.changeRoute(64, 3667);
				affectedItemsEditPage.go();
				affectedItemsEditPage.waitForEvents().then(function (result) {
					expect(result).to.be.true;
				});
			});

			it('try saving data without updating required fields', () => {
				var commentsCell = affectedItemsEditPage.getRowCell(0, 8);
				expect(commentsCell.element(by.css('.field-selector'))
					.getAttribute('class')).to.eventually.include('required-field-invalid');
				expect(commentsCell.element(by.css('.cell-state-container'))
					.getAttribute('class')).to.not.eventually.include('invalid');

				browser.wait(expectedConditions.elementToBeClickable(CommandBar.getControlButton(0)), 5000);
				CommandBar.getControlButton(0).click();

				expect(commentsCell.element(by.css('.field-selector'))
					.getAttribute('class')).to.eventually.include('required-field-invalid');
				expect(commentsCell.element(by.css('.cell-state-container'))
					.getAttribute('class')).to.eventually.include('invalid');

				// Cancel.
				CommandBar.getControlButton(1).click();
			});
		});
	});

}

util.inherits(ViewAffectedItemsEditSpec, SharedSpec);

module.exports = new ViewAffectedItemsEditSpec();
