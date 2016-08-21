/**
 * @ngdoc object
 * @name Controllers.ClassicAttachmentsActionButtonController
 * @description This controller corresponds to
 * {@link Directives.ClassicAttachmentsActionButton}.
 *
 * It consists of the logic required to trigger the following actions:
 *
 * - Upload: Adds/Uploads a file to the attachments grid
 * - Download: Downloads a selected file from the attachments grid
 * - Delete: Deletes a selected file from the attachments grid
 * - Checkout: Checks out a selected file from the attachments grid
 * - More: Triggers a dropdown menu for user to select more actions to perform
 */
class ClassicAttachmentsActionButtonController {
	/*
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#constructor
	 * @methodOf Controllers.ClassicAttachmentsActionButtonController
	 * @description The class constructor
	 */
	constructor($rootScope, $scope, $mdDialog, fileSizeFilterFilter, cpdmAttachmentsService) {
		this.$rootScope = $rootScope;
		this.$mdDialog = $mdDialog;
		this.fileSizeFilter = fileSizeFilterFilter;
		this.cpdmAttachmentsService = cpdmAttachmentsService;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsActionButtonController#selectedFiles
		 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
		 * @description The array of selected files to be uploaded.
		 */
		this.selectedFiles = [];
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#getDefaultTitle
	 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
	 * @description Get the default title of a file to be uploaded. The
	 * default title is the file name without its extension.
	 *
	 * @param {String} fileName The file name.
	 *
	 * @return {String} The default file title.
	 */
	getDefaultTitle(fileName) {
		return fileName.lastIndexOf('.') !== -1 ?
			fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#createFileObj
	 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
	 * @description A helper function to create an object for a selected file.
	 *
	 * @param {File} file A default File object.
	 *
	 * @returns {Object} An object consisting of the relevant information
	 * about the selected file.
	 */
	createFileObj(file) {
		return {
			name: file.name,
			size: this.fileSizeFilter(file.size),
			ext: file.name.match(/\.(.+)/)[1],
			type: file.type,
			lastModified: file.lastModifiedDate,
			folder: '',
			title: this.getDefaultTitle(file.name),
			description: '',
			original: file
		};
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#triggerDialog
	 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
	 * @description Gets the list of selected files to be uploaded and
	 * triggers the dialog to display the selected files.
	 *
	 * @param {Array} selectedFileList The array of selected file(s).
	 * @param {Boolean} isFromCheckIn True, if triggered from Check In button.
	 */
	triggerDialog(selectedFileList, isFromCheckIn) {
		// Assign either the selected file title if from check in,
		// or the function to get default title
		let getDefaultTitle = isFromCheckIn ? this.fileInfo.fileTitle : this.getDefaultTitle;

		if (selectedFileList.length > 0) {
			this.selectedFiles = _.map(selectedFileList, file => this.createFileObj(file));

			this.$mdDialog.show({
				templateUrl: 'components/classicAttachmentsDialog/classicAttachmentsDialog.html',
				controller: 'ClassicAttachmentsDialogController',
				controllerAs: 'ClassicAttachmentsDialogCtrl',
				locals: {
					workspaceId: this.workspaceId,
					itemId: this.itemId,
					selectedFileList: this.selectedFiles,
					createFileObj: this.createFileObj,
					getDefaultTitle: getDefaultTitle,
					isFromCheckIn: isFromCheckIn,
					fileInfo: this.fileInfo
				}
			}).then(status => {
				// Send the message to viewAttachmentsCtrl in NextPLM
				this.actionStatus({responseList: status});

				this.$rootScope.$broadcast(`attachment:${this.itemId}:refresh`);
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#triggerDownload
	 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
	 * @description The method to trigger download for the selected file.
	 */
	triggerDownload() {
		this.cpdmAttachmentsService
			.downloadAttachment(this.fileInfo.fileId, this.workspaceId, this.itemId)
			.then(content => {
				let downloadElement = document.createElement('a');

				document.getElementsByTagName('body')[0]
					.appendChild(downloadElement);

				downloadElement.id = 'downloadLink';
				downloadElement.href = window.URL.createObjectURL(content);

				if (navigator.msSaveBlob) {
					navigator.msSaveBlob(content, this.fileInfo.fileName);
				} else {
					downloadElement.download = this.fileInfo.fileName;
					downloadElement.click();
				}
			});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#triggerUndo
	 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
	 * @description The method to trigger undo checkout for the selected file.
	 */
	triggerUndo() {
		this.cpdmAttachmentsService
			.undoCheckOut(this.fileInfo.fileId, this.workspaceId, this.itemId)
			.then(() => {
				this.$rootScope.$broadcast(`attachment:${this.itemId}:refresh`);

				this.actionStatus({
					responseList: [{
						type: 'success',
						message: `${this.fileInfo.fileName}${this.$rootScope.bundle.notification.undo.success}`
					}]
				});
			}, error => {
				this.actionStatus({
					responseList: [{
						type: 'error',
						message: `${this.fileInfo.fileName}${this.$rootScope.bundle.notification.failed}`
					}]
				});
			});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsActionButtonController#triggerCheckout
	 * @propertyOf Controllers.ClassicAttachmentsActionButtonController
	 * @description The method to trigger checkout for the selected file.
	 */
	triggerCheckout() {
		// Call the download function as checkOut comprises of download
		// along with the changing of the checkout status
		this.triggerDownload(this.fileInfo.fileId, this.fileInfo.fileName);

		this.cpdmAttachmentsService
			.checkOutAttachment(this.fileInfo.fileId, this.workspaceId, this.itemId)
			.then(() => {
				this.$rootScope.$broadcast(`attachment:${this.itemId}:refresh`);

				this.actionStatus({
					responseList: [{
						type: 'success',
						message: `${this.fileInfo.fileName}${this.$rootScope.bundle.notification.checkedOut.success}`
					}]
				});
			}, error => {
				let errorMessage = error.data.error[0].message;
				let fileName = error.data.error[0].fieldId;
				let updatedErrorMessage = errorMessage.replace('{0}', fileName);

				this.$rootScope.$broadcast(`attachment:${this.itemId}:refresh`);

				this.actionStatus({
					responseList: [{
						type: 'error',
						message: `${this.fileInfo.fileName}${this.$rootScope.bundle.notification.failed}: ${updatedErrorMessage}`
					}]
				});
			});
	}
}

export default ClassicAttachmentsActionButtonController;
