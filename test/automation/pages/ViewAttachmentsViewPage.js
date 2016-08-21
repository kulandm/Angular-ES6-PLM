/**
 * @ngdoc object
 * @name ViewTestsPage.ViewAttachmentsViewPage
 *
 * @description This page corresponds to the attachment view / tab of the workspace item.
 *
 * ##Dependencies
 * NOTE: Taken from PLMSinglePage.
 */
var util = require('util');
var GenericPage = require('../pages/GenericPage');

function ViewAttachmentsViewPage() {

	ViewAttachmentsViewPage.super_.call(this);

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAttachmentsViewPage#route
	 * @propertyOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description The URL for this page.
	 */
	this.route = '/' + browser.params.baseName + '/workspaces/54/items/attachments?tab=attachments&view=split&mode=view&itemId=54@2946';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAttachmentsViewPage#urlRegex
	 * @propertyOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description The regular expression for this page's URL.
	 */
	this.urlRegex = new RegExp('\/item\/\d+@\d+\/attachments');

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAttachmentsViewPage#urlContains
	 * @propertyOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description The piece of substring that this page's URL should contain.
	 */
	this.urlContains = 'attachments';

	/**
	 * @ngdoc property
	 * @name ViewTestsPage.ViewAttachmentsViewPage#attachmentDialog
	 * @propertyOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description The dialog element.
	 */
	this.attachmentDialog = null;

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getUploadButton
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns input element that is used to upload a file.
	 *
	 * @returns {Object} An element that represents an input element to upload a file.
	 */
	this.getUploadButton = function () {
		return element(by.css('div[type=upload] input'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getCheckInButton
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns input element that is used to check in a file.
	 *
	 * @returns {Object} An element that represents an input element to checkin a file.
	 */
	this.getCheckInButton = function () {
		return element(by.css('div[type=checkin] input'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getDownloadButton
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns input element that is used to download a file.
	 *
	 * @returns {Object} An element that represents an input element to download a file.
	 */
	this.getDownloadButton = function () {
		return element(by.css('div[type=download] button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getCheckOutButton
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns input element that is used to check in a file.
	 *
	 * @returns {Object} An element that represents an input element to checkout a file.
	 */
	this.getCheckOutButton = function () {
		return element(by.css('div[type=checkout] button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getUndoButton
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns input element that is used to undo a checkout.
	 *
	 * @returns {Object} An element that represents an input element to undo.
	 */
	this.getUndoButton = function () {
		return element(by.css('div[type=undo] button'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getUploadDialog
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns an element that represents an upload dialog.
	 *
	 * @returns {Object} An element that represents an upload dialog.
	 */
	this.getUploadDialog = function () {
		if (!this.attachmentDialog) {
			this.attachmentDialog = element(by.css('.attachments-dialog'));
		}

		return this.attachmentDialog;
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#clickCancelBtn
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the click event to trigger cancel.
	 *
	 * @returns {Promise} The cancel dialog click event.
	 */
	this.clickCancelBtn = function () {
		return this.attachmentDialog.all(by.css('md-dialog-actions .md-button'))
			.first().click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#clickUploadBtn
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the click event to trigger upload.
	 *
	 * @returns {Promise} The upload click event.
	 */
	this.clickUploadBtn = function () {
		return this.attachmentDialog.element(by.css(
			'md-dialog-actions .md-button.md-primary')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getNoOfItemsSelected
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the message displayed for number of items selected.
	 *
	 * @returns {Object} The message displaying number of items selected.
	 */
	this.getNoOfItemsSelected = function () {
		return this.attachmentDialog.element(by.css('.item-selected')).getText();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getDuplicateFileTitleError
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the element displaying duplicate file title error.
	 *
	 * @returns {Object} The element displaying duplicate file title error.
	 */
	this.getDuplicateFileTitleError = function () {
		return this.attachmentDialog.element(by.css('md-toolbar[ng-show="hasDuplicatedTitle"]'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getSelectedFileList
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns a list of files selected for upload.
	 *
	 * @returns {Object} An element array finder that represents a list of
	 * files selected for upload.
	 */
	this.getSelectedFileList = function () {
		return this.attachmentDialog.all(by.repeater('file in selectedFiles'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getCollapsibleContentField
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the first field for a selected item in the dialog.
	 *
	 * @returns {Object} An element that represents the first field i.e. Title.
	 */
	this.getCollapsibleContentField = function () {
		return this.attachmentDialog.all(by
			.css('.collapsible-section .field'))
			.first();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#clickCollapsibleCaret
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the click event to collapse the section.
	 *
	 * @returns {Object} The collapse content click event.
	 */
	this.clickCollapsibleCaret = function () {
		return this.attachmentDialog.element(by
			.css('.section-caret')).click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getRemoveFileButtons
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the list of remove file buttons/icons.
	 *
	 * @returns {Array} The remove file buttons/icons.
	 */
	this.getRemoveFileButtons = function () {
		return this.attachmentDialog.all(by.css('.zmdi-delete'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getRemoveFileButton
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the remove file button/icon.
	 *
	 * @returns {Object} The remove file button/icon.
	 */
	this.getRemoveFileButton = function () {
		return this.attachmentDialog.all(by.css('.zmdi-delete')).first();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getUploadMoreButton
	 * @propertyOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description The buttons in the footer of the dialog.
	 *
	 * @param {Object} btnText The text of the button.
	 *
	 * @returns {Object} A Promise when the elements are found.
	 */
	this.getDialogFooterButton = function (btnText) {
		var buttonIndices = {
			Cancel: 0,
			Save: 1
		};

		return this.attachmentDialog.all(by.css('md-dialog-actions button'))
			.get(buttonIndices[btnText]);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getAttachments
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the list of attachments.
	 *
	 * @returns {Object} An element that represents the attachments row.
	 */
	this.getAttachments = function () {
		return element.all(by
			.css('#itemnav .ui-grid-render-container-body .ui-grid-viewport .ui-grid-canvas .ui-grid-row'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getColumns
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns all columns of the first row of attachments.
	 *
	 * @returns {Object} An element that represents the list of columns/cells of
	 * the first attachment.
	 */
	this.getColumns = function () {
		return this.getAttachments().first().all(by
			.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getColumn
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns a column of the first row of attachments.
	 *
	 * @param {Number} index The index of the column.
	 *
	 * @returns {Object} An element that represents the column/cell of
	 * the first attachment.
	 */
	this.getColumn = function (index) {
		return this.getColumns().get(index);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getCell
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns a column of the first row of attachments.
	 *
	 * @param {Number} row The row number of the cell.
	 * @param {Number} col The column number of the cell.
	 *
	 * @returns {Object} An element that represents the cell of
	 */
	this.getCell = function (row, col) {
		return this.getAttachments().get(row).all(by
			.repeater('(colRenderIndex, col) in colContainer.renderedColumns track by col.uid'))
			.get(col);
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#getFolders
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the folder rows (icon and name).
	 *
	 * @returns {Object} An element that represents the folder row.
	 */
	this.getFolders = function () {
		return element.all(by.css('.folder-icon-container'));
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#expandAllFolders
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns the row having the folder name
	 *
	 * @returns {Object} An promise for the click operation.
	 */
	this.expandAllFolders = function () {
		var expanded = element(by
			.css('.attachment-container .folder-icon-container .md-folder-open'));

		browser.wait(function () {
			return expanded.isPresent().then(function (isExpanded) {
				if (isExpanded) {
					expanded.click();
				}

				return true;
			});
		});

		var el = element(by
			.css('.attachment-container .folder-icon-container .md-folder'));
		return el.click();
	};

	/**
	 * @ngdoc method
	 * @name ViewTestsPage.ViewAttachmentsViewPage#waitForEvents
	 * @methodOf ViewTestsPage.ViewAttachmentsViewPage
	 * @description Returns a promise that will be resolved to 'true' if all
	 * events (necessary for main dashboard page) are complete.
	 *
	 * @returns {Object} A promise that will be resolved to 'true' or 'false'
	 * depending on the state of the event listeners.
	 */
	this.waitForEvents = function () {
		return browser.executeAsyncScript(function (callback) {
			var injector = angular.injector(['plm360.models']);
			var eventService = injector.get('EventService');
			var $q = injector.get('$q');

			var promises = [];

			var currentUserDeferred = $q.defer();
			var currentUserListener = eventService.listen('currentUser:currentUser:done', function () {
				eventService.unlisten(currentUserListener);
				currentUserDeferred.resolve();
			});
			promises.push(currentUserDeferred.promise);

			var itemsDeferred = $q.defer();
			promises.push(itemsDeferred.promise);
			var itemsListener = eventService.listen('itemInstance:*:done', function () {
				eventService.unlisten(itemsListener);
				itemsDeferred.resolve();
			});

			$q.all(promises).then(function () {
				callback(true);
			}, function () {
				callback(false);
			});
		});
	};
}

util.inherits(ViewAttachmentsViewPage, GenericPage);

module.exports = new ViewAttachmentsViewPage();
