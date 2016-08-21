'use strict';

/**
 * @ngdoc object
 * @name Controllers.ClassicAttachmentsDialogController
 *
 * @description This controller corresponds to the dialog in Attachments view.
 *
 * TODO Remove junk from this file:
 * fileId, fileVersion and fromCheckIn.
 * Bad Design!
 */
class ClassicAttachmentsDialogController {

	/*
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#constructor
	 * @methodOf Controllers.ClassicAttachmentsDialogController
	 * @description The class constructor
	 */
	constructor($rootScope, $mdDialog, $interval, $q, cpdmAttachmentsService, workspaceId, itemId, selectedFileList, getDefaultTitle, isFromCheckIn, fileInfo) {
		this.$rootScope = $rootScope;
		this.$mdDialog = $mdDialog;
		this.$interval = $interval;
		this.$q = $q;
		this.cpdmAttachmentsService = cpdmAttachmentsService;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#workspaceId
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The workspaceId of the item
		 */
		this.workspaceId = workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#itemId
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The itemId of the item
		 */
		this.itemId = itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#isFromCheckIn
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description Whether the dialog is triggered from check in button
		 */
		this.isFromCheckIn = isFromCheckIn;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#getDefaultTitle
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The default title as a String or a method to get the
		 * default title.
		 */
		this.getDefaultTitle = getDefaultTitle;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#fileInfo
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The file information.
		 */
		this.fileInfo = fileInfo;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#isContentShown
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The flag to collapse or expand each selected item.
		 */
		this.isContentShown = true;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#isUploading
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description True, when uploading is in progress.
		 */
		this.isUploading = false;

		/**
		 * @ngdoc method
		 * @name Controllers.ClassicAttachmentsDialogController#hasDuplicatedTitle
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description True, if there are any duplicated file titles.
		 */
		this.hasDuplicatedTitle = false;

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#errorMessages
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The array of erroneous files that user wanted to upload.
		 * Each array element consist of the respective error message.
		 */
		this.errorMessages = [];

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#folderType
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The binded value to the radio group. Determines if
		 * a file is directly attached or in a folder.
		 */
		this.folderType = 'Directly Attached';

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#attachmentTitles
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The list of uploaded attachment titles/resourceNames.
		 */
		this.attachmentTitles = cpdmAttachmentsService.getAttachmentsTitleList();

		/**
		 * @ngdoc property
		 * @name Controllers.ClassicAttachmentsDialogController#selectedFiles
		 * @propertyOf Controllers.ClassicAttachmentsDialogController
		 * @description The array of selected files, whereby some files are
		 * already selected (and passed into mdDialog). Filtering occurs here
		 * for files with zero file size or files exceeding 512MB.
		 */
		this.selectedFiles = _.filter(selectedFileList, file =>
			this.isWithinFileSizeLimit(file.original.size));

		// Set errors for files out of file size limit when the dialog opens
		_.each(selectedFileList, file => {
			this.setFileSizeError(file.title, file.original.size);
		});

		// Check for duplicated titles only when the dialog is
		// triggered not from check in
		if (!isFromCheckIn) {
			this.checkDuplicatedTitles();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#isWithinFileSizeLimit
	 * @propertyOf Controllers.ClassicAttachmentsDialogController
	 * @description Checks if the file to be uploaded is within the size limit
	 * (0 < fileSize < 512MB).
	 *
	 * @param {Number} fileSize The file size.
	 *
	 * @return {Boolean} True, if file size is within limit.
	 */
	isWithinFileSizeLimit(fileSize) {
		return fileSize > 0 && fileSize <= 512 * 1024 * 1024;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#setFileSizeError
	 * @propertyOf Controllers.ClassicAttachmentsDialogController
	 * @description If the file to be uploaded is not within the size limit,
	 * set an error message.
	 *
	 * @param {Number} fileTitle The file title.
	 * @param {Number} fileSize The file size.
	 */
	setFileSizeError(fileTitle, fileSize) {
		if (!this.isWithinFileSizeLimit(fileSize)) {
			this.errorMessages.push({
				message: `${fileTitle} is not within the file size limit.`
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#checkDuplicatedTitles
	 * @propertyOf Controllers.ClassicAttachmentsDialogController
	 * @description Checks if there are any duplicated file titles within
	 * the selected files to be uploaded. Sets the flag if there are any.
	 */
	checkDuplicatedTitles() {
		// List of all existing file titles and file titles to be added
		let titles = this.attachmentTitles.concat(_.pluck(this.selectedFiles, 'title'));

		this.hasDuplicatedTitle = _.uniq(titles).length !== titles.length;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#removeFile
	 * @propertyOf Controllers.ClassicAttachmentsDialogController
	 * @description Removes selected file from the selected files list.
	 *
	 * @param {Object} file The file to be removed.
	 */
	removeFile(file) {
		this.selectedFiles = _.reject(this.selectedFiles, selectedFile =>
			selectedFile === file);

		// Check for duplicated titles upon removing files
		this.checkDuplicatedTitles();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#triggerUpload
	 * @propertyOf Controllers.ClassicAttachmentsDialogController
	 * @description Triggers the uploading of selected files to server.
	 */
	triggerUpload() {
		this.isUploading = true;

		let promises = _.map(this.selectedFiles, file => {
			file.uploadStatus = 0;

			this.$interval(() => {
				let increment;

				if (file.uploadStatus >= 0 &&
					file.uploadStatus < 25) {
					increment = Math.floor(Math.random() * 3);
				} else if (file.uploadStatus >= 25 &&
					file.uploadStatus < 90) {
					increment = Math.floor(Math.random() * 2);
				} else if (file.uploadStatus >= 90 &&
					file.uploadStatus < 95) {
					increment = Math.round(Math.random());
				} else {
					// After 95%, don't increment
					increment = 0;
				}

				file.uploadStatus += increment;
			}, 100, 0, true);

			// Create the request data to be sent for each file
			let fileMeta = {
				deleted: false,
				fileName: file.name,
				resourceName: this.isFromCheckIn ? this.getDefaultTitle :
					(file.title || this.getDefaultTitle(file.name)),
				description: file.description,
				fileVersion: this.fileInfo && this.fileInfo.fileVersion,
				folderId: this.isFromCheckIn ? (this.fileInfo.folderId) : null,
				folderName: this.isFromCheckIn ? (this.fileInfo.folderName) : null
			};

			if (!this.isFromCheckIn) {
				return this.cpdmAttachmentsService
					.uploadAttachment(this.workspaceId, this.itemId, fileMeta, file.original)
					.then(response => {
						file.uploadStatus = 100;

						// Post successful
						return {
							type: 'success',
							message: `${fileMeta.resourceName}${this.$rootScope.bundle.notification.upload.success}`
						};
					}, error => {
						// Post failed
						return {
							type: 'error',
							message: `${fileMeta.resourceName}${this.$rootScope.bundle.notification.failed}: ${error.data.error[0].message}`
						};
					});
			} else {
				return this.cpdmAttachmentsService
					.checkInAttachment(this.workspaceId, this.itemId, fileMeta, file.original, this.fileInfo.fileId)
					.then(response => {
						file.uploadStatus = 100;

						// Post successful
						return {
							type: 'success',
							message: `${fileMeta.resourceName}${this.$rootScope.bundle.notification.checkedIn.success}`
						};
					}, error => {
						// Post failed
						return {
							type: 'error',
							message: `${fileMeta.resourceName}${this.$rootScope.bundle.notification.failed}: ${error.data.error[0].message}`
						};
					});
			}
		});

		this.$q.all(promises).then(status => {
			this.isUploading = false;

			this.$mdDialog.hide(status);
		}, status => {
			this.isUploading = false;

			this.$mdDialog.hide(status);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ClassicAttachmentsDialogController#closeDialog
	 * @propertyOf Controllers.ClassicAttachmentsDialogController
	 * @description Closes the dialog.
	 */
	closeDialog() {
		this.$mdDialog.hide();
	}
}

export default ClassicAttachmentsDialogController;
