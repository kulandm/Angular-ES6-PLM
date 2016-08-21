/**
 * @ngdoc object
 * @name ViewTestsSpecs.CreateItemSpec
 *
 * @description This is the spec for create item.
 *
 * ##Dependencies
 */
var ss = require('../../util/screenshoter');
var AppHeader = require('../../components/AppHeader');
var CommandBar = require('../../components/CommandBar');
var CreateItem = require('../../components/CreateItem');
var ItemHeader = require('../../components/ItemHeader');

function CreateItemSpec() {
	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#testCreateItem
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests for the create item flyout.
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} workspaceName The workspace context of create item dialog.
	 */
	this.triggerQuickCreate = function (page, workspaceName) {
		describe('[QuickCreate]', function () {

			before(function () {
				ItemHeader.actionsDropdown.click().then(function () {
					expect(CreateItem.isCreateBtnDisplayed()).to.eventually.be.true;
					CreateItem.clickCreateBtn();
				});
			});

			after(function () {
				CreateItem.isCreateDialogPresent().then(function (isPresent) {
					if (isPresent === true) {
						CreateItem.closeDialog();
					}
				});
			});

			it('opens the create item dialog when clicking on the create button', function () {
				this._runnable.ssName = name + '-openCreateDialog';

				expect(CreateItem.isCreateDialogDisplayed()).to.eventually.be.true;
			});

			it('contains information of the selected workspace in the dialog header', function () {
				this._runnable.ssName = name + '-createDialogHeader';

				expect(CreateItem.getHeadingText()).to.eventually.equal('Create new:' + workspaceName);
			});

			// TODO THIS NEEDS TO BE UPDATED
			// (when Quick Create is re-enabled)
			it('is able to select different workspaces', function () {
				if (workspaceName) {
					CreateItem.clickHeaderWorkspaceSelector();
					CreateItem.selectHeaderWorkspace(1);
				} else {
					CreateItem.clickWorkspaceSelector();
					CreateItem.selectWorkspace(1);
				}

				// Note This is a hardcoded assumption that the first workspace
				// is Project Management. This will not be an issue because
				// we are using a common tenant.
				expect(CreateItem.getHeadingText()).to.eventually.equal('Create new: Project Management');

				var inputElementList = CreateItem.getFormFields();
				expect(inputElementList.count()).to.eventually.equal(1);

				inputElementList.first().sendKeys('Testing quick create view test');

				var saveButtonEl = CreateItem.getSaveButton();
				expect(saveButtonEl.isDisplayed()).to.eventually.be.true;
				expect(CreateItem.getNotificationContainer().getInnerHtml()).to.eventually.be.empty;
				saveButtonEl.click();

				browser.waitForAngular(function () {
					var notificationEl = CreateItem.getNotification();
					// See notification for save.
					expect(notificationEl.isPresent).to.eventually.be.true;
				});

				// TODO Revisit this code, as its breaking on server.
				/* var notificationEl = CreateItem.getNotification();
				browser.driver.wait(function () {
					return notificationEl.isPresent();
				}, 10000).then(function () {
					expect(notificationEl.getAttribute('class')).to.eventually.contain('success');
				}); */
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#contextualCreateDisabled
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests for the in-contextual create item flyout.
	 *
	 * @param {Object} page The page being tested.
	 */
	this.contextualCreateDisabled = function (page) {
		describe('[ContextualCreateDisabled]', function () {
			it('hides the create button as the item is already in production', function () {
				this._runnable.ssName = page + '-createButtonHidden';

				ItemHeader.clickActionsDropDownButton().then(function () {
					expect(CreateItem.isCreateBtnPresent()).to.eventually.be.false;
				});
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#contextualCreateMultiWorkspaces
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests for the in-contextual create with multiple workspaces.
	 *
	 * @param {Object} page The page being tested.
	 */
	this.contextualCreateMultiWorkspaces = function (page) {
		describe('[ContextualCreateMultiWorkspaces]', function () {
			before(function () {
				ItemHeader.clickActionsDropDownButton().then(function () {
					expect(CreateItem.isCreateBtnDisplayed()).to.eventually.be.true;
					expect(CreateItem.isCreateBtnEnabled()).to.eventually.be.true;
					CreateItem.clickCreateBtn();
				});
			});

			after(function () {
				CreateItem.isCreateDialogPresent().then(function (isPresent) {
					if (isPresent === true) {
						CreateItem.closeDialog();
					}
				});
			});

			it('displays the section to select workspaces', function () {
				this._runnable.ssName = page + '-displaySelectWorkspaces';

				expect(CreateItem.isWorkspaceSelectorDisplayed()).to.eventually.be.true;
			});

			it.skip('displays the dropdown to select workspaces', function () {
				this._runnable.ssName = page + '-displaySelectDropdown';

				CreateItem.clickWorkspaceSelector();

				expect(CreateItem.isSelectDropdownDisplayed()).to.eventually.be.true;
			});

			it('displays the \'Did you know?\' section', function () {
				this._runnable.ssName = page + '-displayDidYouKnow';

				expect(CreateItem.isDidYouKnowDisplayed()).to.eventually.be.true;
			});

			it.skip('displays the fields when a workspace is selected', function () {
				this._runnable.ssName = page + '-displayFieldsAfterSelection';

				CreateItem.clickWorkspaceSelector();
				CreateItem.selectWorkspace(1);

				// TODO: expect a message to go to classical PLM.
			});
		});
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsSpecs.SharedSpec#triggerContextualCreate
	 * @methodOf ViewTestsSpecs.SharedSpec
	 * @description Tests for the in-contextual create item flyout.
	 *
	 * @param {Object} page The page being tested.
	 * @param {String} workspaceName The workspace context of create item dialog.
	 */
	this.triggerContextualCreate = function (page, workspaceName) {
		describe('[ContextualCreate]', function () {

			before(function () {
				ItemHeader.clickActionsDropDownButton().then(function () {
					expect(CreateItem.isCreateBtnDisplayed()).to.eventually.be.true;
					expect(CreateItem.isCreateBtnEnabled()).to.eventually.be.true;
					CreateItem.clickCreateBtn();
				});
			});

			after(function () {
				CreateItem.isCreateDialogPresent().then(function (isPresent) {
					if (isPresent === true) {
						CreateItem.closeDialog();
					}
				});
			});

			it('opens the create item dialog when clicking on the create button', function () {
				this._runnable.ssName = page + '-openCreateDialog';

				expect(CreateItem.isCreateDialogDisplayed()).to.eventually.be.true;
				expect(CreateItem.getHeadingText()).to.eventually.equal('Create new:');
			});

			it('contains information of the selected workspace in the dialog header', function () {
				this._runnable.ssName = page + '-createDialogHeader';
				CreateItem.clickWorkspaceSelector();
				CreateItem.selectWorkspace(1);
				expect(CreateItem.getHeadingText()).to.eventually.equal(workspaceName);
			});

			it('collapses and expands each section of fields', function () {
				this._runnable.ssName = page + '-expandCollapseSections';

				expect(CreateItem.getFirstFieldText()).to.eventually.equal('Title');

				CreateItem.getSectionCaret().click();
				// Wait for animation to be done
				browser.sleep(3000);

				expect(CreateItem.getFirstFieldText()).to.eventually.equal('');

				CreateItem.getSectionCaret().click();
			});

			it('displays the \'Cancel\' and \'Save & Manage\' buttons by default', function () {
				this._runnable.ssName = page + '-defaultButtons';

				expect(CreateItem.getFooterButton(0).getText()).to.eventually.equal('Cancel');
				expect(CreateItem.getFooterButton(1).getText()).to.eventually.equal('Save & Manage');
			});

			it('disables the \'Save & Manage\' button by default', function () {
				this._runnable.ssName = page + '-defaultButtonsDisabled';

				expect(CreateItem.getFooterButton(1).isEnabled()).to.eventually.be.false;
				expect(CreateItem.getSaveOptionsElement().getAttribute('aria-disabled')).to.eventually.include('true');
			});

			it('enables the save buttons upon filling in all fields', function () {
				this._runnable.ssName = page + '-enableButtons';

				var inputElementList = CreateItem.getFormInputFields();
				var textAreaElementList = CreateItem.getFormRichTextFields();

				inputElementList.count().then(function (fieldCount) {
					for (var index = 0; index < fieldCount; index++) {
						inputElementList.get(index).sendKeys('Test ' + index);
					}

					textAreaElementList.count().then(function (fieldCount) {
						for (var index = 0; index < fieldCount; index++) {
							textAreaElementList.get(index).sendKeys('Test ' + index);
						}

						expect(CreateItem.getFooterButton(1).isEnabled()).to.eventually.be.true;
						expect(CreateItem.getSaveOptionsElement().getAttribute('aria-disabled')).to.eventually.include('false');
					});
				});
			});

			it.skip('displays the dropdown for different save types upon click', function () {
				this._runnable.ssName = page + '-saveOptions';

				CreateItem.getSaveOptionsElement().click();
				var saveOptions = element.all(by.css('md-select-menu md-option'));
				expect(saveOptions.count()).to.eventually.equal(2);
				expect(saveOptions.first().getText()).to.eventually.equal('Save & Close');
				expect(saveOptions.last().getText()).to.eventually.equal('Save & View');
				// TODO: click anywhere to remove the select overlay.
			});

			it('changes the dialog content when \'Save & Manage\' is clicked', function () {
				this._runnable.ssName = page + '-displayManageScreen';

				CreateItem.getFooterButton(1).click();

				browser.sleep(6000);

				expect(CreateItem.getManageForm().isDisplayed()).to.eventually.be.true;
			});

			it('checks the labels of the manage item view', function () {
				expect(CreateItem.getManageItemLabels().get(0).getText()).to.eventually.equal('Item');
				expect(CreateItem.getManageItemLabels().get(1).getText()).to.eventually.equal('Lifecycle');
				expect(CreateItem.getManageItemLabels().get(2).getText()).to.eventually.equal('Effectivity');
				expect(CreateItem.getManageItemLabels().get(3).getText()).to.eventually.equal('From');
				expect(CreateItem.getManageItemLabels().get(4).getText()).to.eventually.equal('To');
			});

			it('checks the value data in the manage item view', function () {
				expect(CreateItem.manageViewEffectivity().getText()).to.eventually.equal('On Release');
				expect(CreateItem.manageViewFrom().getText()).to.eventually.equal('');
				expect(CreateItem.manageViewTo().getText()).to.eventually.equal('');
			});

			it.skip('checks the Enabling and Disabling of the save button when \'Please Select\' is chosen in the lifecycle', function () {
				// Check that the button is first disabled
				expect(CreateItem.getFooterButton(1).getAttribute('aria-disabled')).to.eventually.equal('true');

				CreateItem.getManagedViewLifecycleDropDownField().click();
				CreateItem.getManagedViewLifecycleDropDownMenu().isDisplayed().then(function (isDisplayed) {
					CreateItem.getManagedViewLifecycleDropDownMenuItems().get(1).click();
				});
				// After choosing another option, the button should be enabled
				expect(CreateItem.getFooterButton(1).getAttribute('aria-disabled')).to.eventually.equal('false');

				CreateItem.getManagedViewLifecycleDropDownField().click();
				CreateItem.getManagedViewLifecycleDropDownMenu().isDisplayed().then(function (isDisplayed) {
					CreateItem.getManagedViewLifecycleDropDownMenuItems().get(0).click();
				});
				// On choosing 'Please Select', the button should be disabled again
				expect(CreateItem.getFooterButton(1).getAttribute('aria-disabled')).to.eventually.equal('true');

				CreateItem.getManagedViewLifecycleDropDownField().click();
				CreateItem.getManagedViewLifecycleDropDownMenu().isDisplayed().then(function (isDisplayed) {
					CreateItem.getManagedViewLifecycleDropDownMenuItems().get(2).click();
				});
				// After choosing another option, the button should be enabled again
				expect(CreateItem.getFooterButton(1).getAttribute('aria-disabled')).to.eventually.equal('false');
			});

			it.skip('should display field validation error when data is not passing the validation rules', function () {
				var integerField = CreateItem.getManagedViewCustomFields().get(1);
				integerField.element(by.css('input')).sendKeys('1.5');

				CreateItem.getFooterButton(1).click();

				expect(integerField.getAttribute('class')).to.eventually.contain('invalid');

				integerField.element(by.css('input')).clear();
			});
		});
	};
}

module.exports = CreateItemSpec;
