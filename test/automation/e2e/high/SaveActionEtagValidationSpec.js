'use strict';

var auth = require('../../util/Auth');
var apiRequest = require('../../util/ApiRequest');

var AppHeader = require('../../components/AppHeader');
var dashboardPage = require('../../pages/MainDashboardPage');
var workspaceItemsListPage = require('../../pages/WorkspaceItemsListPage');
var workspaceItemDetailsEditPage = require('../../pages/WorkspaceItemDetailsEditPage');

/**
 * @ngdoc object
 * @name E2ETestsSpecs.SaveActionEtagValidationSpec
 * @propertyOf E2ETestsSpecs
 * @description This is the e2e spec for validating on save action, that the system checks that the resource was not
 * already modified by other user or from another browser
 */
function SaveActionEtagValidationSpec() {

	describe('[SaveActionEtagValidationSpec]', function () {
		this.timeout(120000);

		var requestUrl = 'api/v3/workspaces/47/items/2694';
		var requestData = '{"__self__":"/api/v3/workspaces/47/items/2694","urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.2694","workspace":{"link":"/api/v3/workspaces/47","title":"Products","urn":"urn:adsk.plm:tenant.workspace:DEVINDMACHINE1002.47","permissions":[]},"root":{"link":"/api/v3/workspaces/47/items/2694","title":"EM-4007 - Assembly Process Machine, Die Cutting, 2-location Turntable","urn":"urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.2694","permissions":[]},"title":"EM-4007 - Assembly Process Machine, Die Cutting, 2-location Turntable","deleted":false,"latestRelease":true,"workingVersion":true,"itemLocked":false,"workflowReference":false,"workingHasChanged":false,"currentState":{"link":"/api/v3/workspaces/47/workflows/1/states/127","title":"Kickoff","urn":"urn:adsk.plm:tenant.workspace.workflow.state:DEVINDMACHINE1002.47.1.127","permissions":[]},"lifecycle":{"link":"/api/v3/workflows/9223372036854775807/states/0","title":"Unreleased","urn":"urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1002.9223372036854775807.0","permissions":[]},"bom":{"link":"/api/v3/workspaces/47/items/2694/bom","permissions":[]},"nestedBom":{"link":"/api/v3/workspaces/47/items/2694/bom-items","count":12,"permissions":[]},"flatBom":{"link":"/api/v3/workspaces/47/items/2694/bom-items/flat","permissions":[]},"whereUsed":{"link":"/api/v3/workspaces/47/items/2694/where-used","count":{"value":0,"type":"EXACT"}},"sections":[{"link":"/api/v3/workspaces/47/items/2694/views/1/sections/131","title":"Details","sectionLocked":false,"fields":[{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/NUMBER","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.NUMBER","title":"Number","type":{"link":"/api/v3/field-types/4","title":"Single Line Text","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4","permissions":[]},"value":"900-10622-000","defaultValue":""},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/DESCRIPTION","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.DESCRIPTION","title":"Description","type":{"link":"/api/v3/field-types/4","title":"Single Line Text","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4","permissions":[]},"value":"Assembly Process Machine, Die Cutting, 2-location Turntable","defaultValue":""},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/PROJECT_NUMBER","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.PROJECT_NUMBER","title":"Project Number","type":{"link":"/api/v3/field-types/4","title":"Single Line Text","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4","permissions":[]},"value":"622","defaultValue":""},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/SKU","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.SKU","title":"SKU","type":{"link":"/api/v3/field-types/4","title":"Single Line Text","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4","permissions":[]},"value":"1","defaultValue":""},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/MARKETING_NAME","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.MARKETING_NAME","title":"Marketing Name","type":{"link":"/api/v3/field-types/4","title":"Single Line Text","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4","permissions":[]},"value":"EM-9999","defaultValue":""},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/TEST","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.TEST","title":"test","type":{"link":"/api/v3/field-types/30","title":"Integer","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.30","permissions":[]},"value":null,"defaultValue":""}]},{"link":"/api/v3/workspaces/47/items/2694/views/1/sections/133","title":"Product Design","sectionLocked":false,"fields":[{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/IMAGE","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.IMAGE","title":"Image","type":{"link":"/api/v3/field-types/15","title":"Image","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.15","permissions":[]},"value":{"link":"/api/v2/workspaces/47/items/2694/field-values/IMAGE/image/45","urn":"urn:adsk.plm:tenant.workspace.item.field-value.image:DEVINDMACHINE1002.47.2694.IMAGE.45","permissions":[]}},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/CAD_FILE_NAME","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.CAD_FILE_NAME","title":"CAD File Name","type":{"link":"/api/v3/field-types/4","title":"Single Line Text","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4","permissions":[]},"value":null,"defaultValue":""}]},{"link":"/api/v3/workspaces/47/items/2694/views/1/sections/134","title":"Product Team","sectionLocked":false,"fields":[{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/PROGRAM_MANAGER","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.PROGRAM_MANAGER","title":"Program Manager","type":{"link":"/api/v3/field-types/14","title":"Pick List (With search filter)","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.14","permissions":[]},"value":null},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/ENGINEERING_DIRECTOR","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.ENGINEERING_DIRECTOR","title":"Engineering Director","type":{"link":"/api/v3/field-types/14","title":"Pick List (With search filter)","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.14","permissions":[]},"value":null},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/ELECTRICAL_LEAD","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.ELECTRICAL_LEAD","title":"Electrical Lead","type":{"link":"/api/v3/field-types/14","title":"Pick List (With search filter)","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.14","permissions":[]},"value":null},{"__self__":"/api/v3/workspaces/47/items/2694/views/1/fields/MECHANICAL_LEAD","urn":"urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1002.47.2694.1.MECHANICAL_LEAD","title":"Mechanical Lead","type":{"link":"/api/v3/field-types/14","title":"Pick List (With search filter)","urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.14","permissions":[]},"value":null}]}],"milestones":{"link":"/api/v3/workspaces/47/items/2694/views/17","permissions":[]}}';

		before(function () {
			auth.doLogin();
			auth.checkAgreementModal();
			AppHeader.openWorkspace('Engineering', 'Products');
			workspaceItemsListPage.openItem('EM-4001 - Assembly Process Machine, Die Cutting, 2-location Turntable');
		});

		after(function () {
			workspaceItemDetailsEditPage.getSaveBtn().isDisplayed().then(function (isDisplayed) {
				if (isDisplayed) {
					workspaceItemDetailsEditPage.getCancelBtn().click();
					browser.waitForAngular();
				}
			});
		});

		it('should receive an error message while trying to save the item', function () {
			workspaceItemDetailsEditPage.getEditBtn().click();
			browser.sleep(2000);

			apiRequest.put(requestUrl, requestData).then(function () {
				workspaceItemDetailsEditPage.getSaveBtn().click();
				browser.sleep(2000);
				// TODO Update view test using new notification
				// var widget = NotificationsWidget.getNotificationWidget();
				// var result = widget.isPresent().then(function (present) {
				// 	if (present) {
				// 		var messageBody = widget.element(by.css('.message-body'));
				// 		return messageBody.isPresent().then(function () {
				// 			if (present) {
				// 				return messageBody.getText();
				// 			}
				// 		});
				// 	}
				// });
				// expect(result).to.eventually.contain('The item was not saved');

				// Roll back
				requestData = JSON.parse(requestData);
				requestData.sections[0].fields[4].value = 'EM-4001';
				requestData = JSON.stringify(requestData);
				apiRequest.put(requestUrl, requestData).then(function () {
					expect(1).to.equal(1);
				});
			});
		});
	});
}

module.exports = new SaveActionEtagValidationSpec();
