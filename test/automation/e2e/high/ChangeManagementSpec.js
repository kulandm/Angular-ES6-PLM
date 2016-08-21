var expect = require('../../util/NextPLMSetup').expect;

describe.skip('Workspace: Change Management', function () {
	this.timeout(120000);
	var expectedConditions = protractor.ExpectedConditions;
	var auth = require('../../util/Auth');
	var appHeader = require('../../components/AppHeader');
	var addItemFlyout = require('../../components/AddItemFlyout');
	var itemDetailsPage = require('../../pages/ViewDetailsViewPage');
	var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
	var ViewAffectedItemsPage = require('../../pages/ViewAffectedItemsPage');
	var affectedItemsViewPage = new ViewAffectedItemsPage();
	var EditAffectedItemsPage = require('../../pages/EditAffectedItemsPage');
	var editAffectedItemsPage = new EditAffectedItemsPage();
	var workFlowTransitionFlyoutPage = require('../../components/WorkflowTransitionFlyout');

	before(function () {
		auth.doLogin();
		auth.checkAgreementModal(30000);
	});

	after(function () {
		workFlowTransitionFlyoutPage.flyout.isPresent().then(function (isPresent) {
			if (isPresent === true) {
				workFlowTransitionFlyoutPage.cancelTransitionButton.click();
			}
		});
	});

	it('PLM2.0-110:Workspace: Change Management: Item Revision', function () {
		appHeader.openWorkspace('Change Management', 'Change Orders');
		workspaceItemsListPage.openItem('CO000007 - Test - 3 - High');
		itemDetailsPage.switchToTab('Affected Items');
		addItemFlyout.openAddItemsFlyout();
		addItemFlyout.addItemsSearchBy('162-0001-000');
		addItemFlyout.addItemsListCheckbox(0).click();
		addItemFlyout.getAddItemFlyoutBtns('Add').click();
		editAffectedItemsPage.goEdit();
		editAffectedItemsPage.isAffectedItemsTableDisplayed().then(function () {
			editAffectedItemsPage.changeRowLifecycle(0, 1);
			editAffectedItemsPage.cellsInHeaderRow.get(5).click();
			browser.wait(expectedConditions.elementToBeClickable(editAffectedItemsPage.getEffectivityCell(0)), 5000);
			editAffectedItemsPage.getEffectivityCell(0).click();
			var datePickerButton = editAffectedItemsPage.getEffectivityCell(0).element(by.css('.choose-date'));
			datePickerButton.click();
			var currentDateButton = editAffectedItemsPage.getEffectivityCell(0).element(by.css('.dropdown-menu td .active'));
			currentDateButton.click();
			editAffectedItemsPage.cellsInHeaderRow.get(5).click();
			editAffectedItemsPage.save();
			expect(editAffectedItemsPage.getFromCell(0).getText()).to.eventually.equal('A');
			expect(editAffectedItemsPage.getToCell(0).getText()).to.eventually.equal('B');
		});

		// Select 'Route' transition.
		browser.sleep(5000);
		workFlowTransitionFlyoutPage.actionsDropdown.click();
		workFlowTransitionFlyoutPage.workFlowTransitionLink.click();
		workFlowTransitionFlyoutPage.workflowTransitionSelect.click();
		workFlowTransitionFlyoutPage.transitionOptionList.get(2).click();
		browser.wait(expectedConditions.elementToBeClickable(workFlowTransitionFlyoutPage.saveButton), 1000);
		workFlowTransitionFlyoutPage.saveButton.click();
		browser.waitForAngular();

		// Select 'Submit for DOC change' transition.
		browser.sleep(5000);
		workFlowTransitionFlyoutPage.actionsDropdown.click();
		workFlowTransitionFlyoutPage.workFlowTransitionLink.click();
		workFlowTransitionFlyoutPage.workflowTransitionSelect.click();
		workFlowTransitionFlyoutPage.transitionOptionList.get(2).click();
		browser.wait(expectedConditions.elementToBeClickable(workFlowTransitionFlyoutPage.saveButton), 1000);
		workFlowTransitionFlyoutPage.saveButton.click();
		browser.waitForAngular();

		// Select 'Approve' transition.
		browser.sleep(5000);
		workFlowTransitionFlyoutPage.actionsDropdown.click();
		workFlowTransitionFlyoutPage.workFlowTransitionLink.click();
		workFlowTransitionFlyoutPage.workflowTransitionSelect.click();
		workFlowTransitionFlyoutPage.transitionOptionList.get(0).click();
		browser.wait(expectedConditions.elementToBeClickable(workFlowTransitionFlyoutPage.saveButton), 1000);
		workFlowTransitionFlyoutPage.saveButton.click();
		browser.waitForAngular();

		browser.sleep(2000);
		editAffectedItemsPage.openItem(0).then(function () {
			// TODO: method not there.
			/* itemDetailsPage.getEffectivityText().then(function (value) {
				expect(value).to.equal(helper.getTodayString());
			}); */
			// TODO: method not there.
			// expect(itemDetailsPage.isRevisionOptionPresent('Production A (Superseded)')).to.eventually.be.true;
		});
	});

	// This test needs to be updated. As the test data is not fulfilling the requirements.
	it.skip('PLM2.0-131:Workflow Dropdown: Workflow Transitioning: Permissions', function () {
		auth.doLoginWithParam('qa.UserX_NAME_836A4A1@autodesk.com', 'UserX_PWD_836A4A1');
		auth.checkAgreementModal(30000);
		var categoryName = 'Test WS';
		var wsName = 'R_Affected_Items_Custom_columns';
		var itemName = 'test PLM2.0-131';
		appHeader.openWorkspace(categoryName, wsName);
		workspaceItemsListPage.openItem(itemName);
		itemDetailsPage.switchToTab('Managed Items');
		addItemFlyout.openAddItemsFlyout();
		addItemFlyout.addItemsSearchBy('Peter');
		addItemFlyout.addItemsListCheckbox(0).click();
		addItemFlyout.getAddItemFlyoutBtns('Add').click();
		affectedItemsViewPage.goEdit();
		affectedItemsViewPage.isAffectedItemsTableDisplayed().then(function () {
			editAffectedItemsPage.changeRowLifecycle(0, 1);
			editAffectedItemsPage.cellsInHeaderRow.get(5).click();
			browser.wait(expectedConditions.elementToBeClickable(editAffectedItemsPage.getEffectivityCell(0)), 5000);
			editAffectedItemsPage.getEffectivityCell(0).click();
			var datePickerButton = editAffectedItemsPage.getEffectivityCell(0).element(by.css('.choose-date'));
			datePickerButton.click();
			var currentDateButton = editAffectedItemsPage.getEffectivityCell(0).element(by.css('.dropdown-menu td .active'));
			currentDateButton.click();
			editAffectedItemsPage.cellsInHeaderRow.get(5).click();
			editAffectedItemsPage.save();
		});

		// Select 'addReview' transition.
		browser.sleep(5000);
		workFlowTransitionFlyoutPage.actionsDropdown.click();
		workFlowTransitionFlyoutPage.workFlowTransitionLink.click();
		workFlowTransitionFlyoutPage.workflowTransitionSelect.click();
		workFlowTransitionFlyoutPage.transitionOptionList.get(0).click();
		workFlowTransitionFlyoutPage.saveButton.click();
		browser.waitForAngular();

		browser.sleep(5000);
		workFlowTransitionFlyoutPage.actionsDropdown.click();
		workFlowTransitionFlyoutPage.workFlowTransitionLink.click();
		workFlowTransitionFlyoutPage.workflowTransitionSelect.click();
		expect(workFlowTransitionFlyoutPage.transitionOptionList.count()).to.eventually.equal(0);
		workFlowTransitionFlyoutPage.cancelTransitionButton.click();
		browser.waitForAngular();

		auth.doLogin(); // login use PLMAutoTest
		auth.checkAgreementModal(30000);
		appHeader.openWorkspace(categoryName, wsName);
		workspaceItemsListPage.openItem(itemName);
		browser.sleep(5000);
		workFlowTransitionFlyoutPage.actionsDropdown.click();
		workFlowTransitionFlyoutPage.workFlowTransitionLink.click();
		workFlowTransitionFlyoutPage.workflowTransitionSelect.click();
		expect(workFlowTransitionFlyoutPage.transitionOptionList.count()).to.eventually.equal(1);
		workFlowTransitionFlyoutPage.cancelTransitionButton.click();
		browser.waitForAngular();
	});
});
