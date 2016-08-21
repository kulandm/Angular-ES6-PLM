/**
 * @ngdoc object
 * @name Controllers.WipAttachmentsListController
 *
 * @description This controller is responsible for fetching the data for WIP
 * attachments.
 */
class WipAttachmentsListController {

	/*
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsListController#constructor
	 * @methodOf Controllers.WipAttachmentsListController
	 * @description The class constructor.
	 */
	constructor($rootScope, $q, cpdmAttachmentsService, Attachment, FileOverviewService, NotificationService, NotificationTypes) {
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.Attachment = Attachment;
		this.cpdmAttachmentsService = cpdmAttachmentsService;
		this.FileOverviewService = FileOverviewService;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;

		/**
		 * @ngdoc property
		 * @name Controllers.WipAttachmentsListController#attachmentList
		 * @propertyOf Controllers.WipAttachmentsListController
		 * @description List of attachments
		 */
		this.attachmentList = [];

		this.getData();

		this.FileOverviewService.getHost().then((host) => {
			/**
			 * @ngdoc method
			 * @name Controllers.WipAttachmentsListController#getFolderUri
			 * @methodOf Controllers.WipAttachmentsListController
			 * @description get the parent folder URI
			 *
			 * @param {String} urn URN to the parent folder
			 *
			 * @returns {Object} A function that will build the attachment's folder uri
			 */
			this.getFolderUri = (urn) => this.FileOverviewService.getContainingFolderLinkWithHost(host, urn);

			/**
			 * @ngdoc method
			 * @name Controllers.WipAttachmentsListController#getFileOverviewUri
			 * @methodOf Controllers.WipAttachmentsListController
			 * @description get the file overview link
			 *
			 * @param {String} urn URN to the file overview
			 * @param {String} version version of the file
			 *
			 * @returns {Object} A function that will build the attachment's file overview uri
			 */
			this.getFileOverviewUri = (urn, version) => this.FileOverviewService.getFileOverviewLinkWithHost(host, urn, version);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsListController#getData
	 * @propertyOf Controllers.WipAttachmentsListController
	 * @description Get attachment data and populate attachmentList
	 */
	getData() {
		this.cpdmAttachmentsService.getWipAttachments(this.workspaceId, this.itemId).then(wipAttachments => {
			if (wipAttachments.length) {
				// Concat all lineage urns into an array for WIP POST endpoint
				// Note: WIP endpoint cannot accept duplicate urns
				let lineageUrns = _.uniq(_.map(wipAttachments, wipAttachment => wipAttachment.lineageUrn));

				return this.Attachment.fetchAttachments(lineageUrns).then(response => {
					let attachmentsInfo = response.data.versionedFiles;

					return this.$q.all(_.map(wipAttachments, wipAttachment => {
						let attachment = new this.Attachment(wipAttachment);
						let attachmentInfo = _.find(attachmentsInfo, info =>
							info.versionedFile.lineageUrn === attachment.getLineageUrn());
						attachment.setLatestVersionInfo(attachmentInfo.versionedFile);

						if (attachment.getPinnedVersionUrn()) {
							return this.Attachment.fetchSingleAttachment(attachment.getPinnedVersionUrn()).then(pinnedVersionInfo => {
								attachment.setPinnedVersionInfo(pinnedVersionInfo.data.versionedFile);

								return {
									fileInfo: {
										name: attachment.getPinnedTitle(),
										mimeType: attachment.getPinnedMimeType(),
										fileType: attachment.getPinnedFileType(),
										fileSize: attachment.getPinnedFileSize(),
										createUserName: attachment.getPinnedCreateUserName(),
										createTime: attachment.getPinnedCreateTime(),
										version: attachment.getPinnedVersion(),
										versionUrn: attachment.getPinnedVersionUrn(),
										urn: attachment.getLineageUrn(),
										parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
									}
								};
							});
						} else {
							return {
								fileInfo: {
									name: attachment.getTitle(),
									mimeType: attachment.getMimeType(),
									fileType: attachment.getFileType(),
									fileSize: attachment.getFileSize(),
									createUserName: attachment.getCreateUserName(),
									createTime: attachment.getCreateTime(),
									version: attachment.getVersion(),
									versionUrn: attachment.getVersionUrn(),
									urn: attachment.getLineageUrn(),
									parentFolderUrn: attachmentInfo.lineage.parentFolderUrn
								}
							};
						}
					}));
				});
			}
		}).then(results => {
			this.attachmentList = results || [];
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsListController#download
	 * @methodOf Controllers.WipAttachmentsListController
	 * @description Calls the download method in attachment model
	 *
	 * @param {String} versionUrn Urn of selected file to download
	 *
	 * @return {Object} Promise after download completes
	 */
	download(versionUrn) {
		return this.Attachment.downloadAttachment(versionUrn).then(response => {
			window.location.href = `${response.data}&response-content-type=${encodeURIComponent('application/octet-stream')}`;
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.WipAttachmentsListController#triggerSingleDownload
	 * @methodOf Controllers.WipAttachmentsListController
	 * @description Triggers download for a single selected file.
	 *
	 * @param {Object} attachment One selected attachment for download
	 *
	 * @return {Object} Promise
	 */
	triggerSingleDownload(attachment) {
		return this.download(attachment.fileInfo.versionUrn)
			.then(() => {
				// Show download success notification
				this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, `${attachment.fileInfo.name}${this.$rootScope.bundle.attachments.downloadStarted}`);
				this.NotificationService.showNotifications();
			}, () => {
				// Show download failed notification
				this.NotificationService.addNotification(this.NotificationTypes.ERROR, `${attachment.fileInfo.name}${this.$rootScope.bundle.attachments.downloadFailed}`);
				this.NotificationService.showNotifications();
			});
	}
}

export default WipAttachmentsListController;
