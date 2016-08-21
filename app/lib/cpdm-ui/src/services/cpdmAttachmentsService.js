'use strict';

/**
 * @ngdoc object
 * @name Services.cpdmAttachmentsService
 * @description Currently, it's an alternative for WIP data service as
 * WIP data service is on pause right now. A similar service exists with
 * the same name except this has been appended by Classic.
 */
class cpdmAttachmentsService {

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#constructor
	 * @methodOf Services.cpdmAttachmentsService
	 * @description The class constructor
	 */
	constructor(Restangular, $q, _, $log, $http, RESTWrapperService) {
		this.Restangular = Restangular;
		this.RESTWrapperService = RESTWrapperService;
		this.$q = $q;
		this.$log = $log;
		this.$http = $http;
		this._ = _;

		this.attachments = {
			link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments'
		};

		this.attachmentCheckOut = {
			link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments/[fileId]/checkouts'
		};

		this.attachmentDownload = {
			link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments/[fileId]'
		};

		this.attachmentCheckIn = {
			link: 'api/rest/v1/workspaces/[workspaceId]/items/[itemId]/attachments/[fileId]/checkins'
		};

		this.wipAttachments = {
			link: 'api/v3/workspaces/[workspaceId]/items/[itemId]/attachments'
		};

		this.attachmentsTitles = [];
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#setAttachmentsTitleList
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Sets an array of titles of the already uploaded
	 * attachments in this service.
	 *
	 * @param {Object} data The grid data
	 */
	setAttachmentsTitleList(data) {
		this.attachmentsTitles = _.pluck(data, 'resourceName');
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#getAttachmentsTitleList
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Gets the array of titles of the already uploaded
	 * attachments in this service after removing the 'undefined' ones
	 * (from folders).
	 *
	 * @returns {Array} The array of attachment titles.
	 */
	getAttachmentsTitleList() {
		return _.filter(this.attachmentsTitles);
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#createBlob
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Creates a blob for upload.
	 *
	 * @param {Object} fileMeta File meta data
	 * @param {Object} fileStream Octet stream of the file
	 *
	 * @returns {Array} The blob.
	 */
	createBlob(fileMeta, fileStream) {
		// Create FormData to send in the request
		let formData = new FormData();

		// Create Blob for the first part (application/json)
		let fileMetaBlob = new Blob(
			[angular.toJson(fileMeta)],
			{type: 'application/json'}
		);

		// Create Blob for the second part (application/octet-stream)
		let fileBlob = new Blob(
			[fileStream],
			{type: 'application/octet-stream'}
		);

		// Append both parts
		formData.append('fileInfo', fileMetaBlob);
		formData.append('fileData', fileBlob, fileMeta.fileName);

		return formData;
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#getAttachments
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Gets the attachments for a given PLM Item DMSID
	 *
	 * @param {String} workspaceId Workspace ID of the Item for which to retrieve the attachments
	 * @param {String} itemId Item ID of the Item for which to retrieve the attachments
	 *
	 * @returns {Promise} Resolves response or error
	 */
	getAttachments(workspaceId, itemId) {
		let attachmentLink = this.attachments.link
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId);

		return this.Restangular
			.one(attachmentLink)
			.get([undefined, {'Content-Type': 'application/json'}])
			.then(function (contents) {
				return contents.list && contents.list.data;
			});
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#uploadAttachment
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Uploads the selected file.
	 *
	 * @param {String} workspaceId Workspace ID of the item to upload files to
	 * @param {String} itemId Item ID of the item to upload files to
	 * @param {Object} fileMeta The JSON/meta of the file to be uploaded
	 * @param {Object} fileStream The File object (binary stream to be uploaded)
	 *
	 * @returns {Promise} Resolves response or error
	 */
	uploadAttachment(workspaceId, itemId, fileMeta, fileStream) {
		let uploadLink = this.attachments.link
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId);

		let formData = this.createBlob(fileMeta, fileStream);

		// Restangular Custom POST
		return this.Restangular
			.one(uploadLink)
			.withHttpConfig({
				transformRequest: angular.identity,
				timeout: 0 // Avoid global setting's timeout on upload
			})
			.customPOST(formData, undefined, undefined, {
				'Content-Type': undefined
			});
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#checkInAttachment
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Checks in the selected file.
	 *
	 * @param {String} workspaceId Workspace ID of the item to upload files to
	 * @param {String} itemId Item ID of the item to upload files to
	 * @param {Object} fileMeta The JSON/meta of the file to be uploaded
	 * @param {Object} fileStream The File object (binary stream to be uploaded)
	 *
	 * @returns {Promise} Resolves response or error
	 */
	checkInAttachment(workspaceId, itemId, fileMeta, fileStream, fileId) {
		let checkInLink = this.attachmentCheckIn.link
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId)
			.replace('[fileId]', fileId);

		let formData = this.createBlob(fileMeta, fileStream);

		// Restangular Custom POST
		return this.Restangular
			.one(checkInLink)
			.withHttpConfig({
				transformRequest: angular.identity,
				timeout: 0 // Avoid global setting's timeout on upload
			})
			.customPOST(formData, undefined, undefined, {
				'Content-Type': undefined
			});
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#downloadAttachment
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Allows the user to download the attachment
	 *
	 * @param {Number} fileId File ID of the selected item
	 * @param {Number} workspaceID Workspace ID of the selected item
	 * @param {Number} itemID Item ID of the selected item
	 *
	 * @returns {Promise} Resolves response or error
	 */
	downloadAttachment(fileId, workspaceId, itemId) {
		let downloadLink = this.attachmentDownload.link
			.replace('[fileId]', fileId)
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId);

		return this.Restangular
			.one(downloadLink)
			.withHttpConfig({
				responseType: 'blob'
			})
			.customGET(undefined, undefined, {
				Accept: 'application/octet-stream',
				'X-Auth-Token': 'token'
			});
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#checkOutAttachment
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Allows the user to checkout the attachment
	 *
	 * @param {Number} fileId File ID of the selected item
	 * @param {Number} workspaceID Workspace ID of the selected item
	 * @param {Number} itemID Item ID of the selected item
	 *
	 * @returns {Promise} Resolves response or error
	 */
	checkOutAttachment(fileId, workspaceId, itemId) {
		let checkOutLink = this.attachmentCheckOut.link
			.replace('[fileId]', fileId)
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId);

		return this.Restangular.one(checkOutLink).post();
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#undoCheckOut
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Allows the user to undo the checkout
	 *
	 * @param {Number} fileId File ID of the selected item
	 * @param {Number} workspaceID Workspace ID of the selected item
	 * @param {Number} itemID Item ID of the selected item
	 *
	 * @returns {Promise} Resolves response or error
	 */
	undoCheckOut(fileId, workspaceId, itemId) {
		let undoLink = this.attachmentCheckOut.link
			.replace('[fileId]', fileId)
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId);

		return this.Restangular.one(undoLink).remove();
	}

	/**
	 * @ngdoc method
	 * @name Services.cpdmAttachmentsService#getWipAttachments
	 * @methodOf Services.cpdmAttachmentsService
	 * @description Gets the WIP attachments for a given PLM Item DMSID
	 *
	 * @param {String} workspaceId Workspace ID of the Item for which to retrieve the attachments
	 * @param {String} itemId Item ID of the Item for which to retrieve the attachments
	 *
	 * @returns {Promise} Resolves response or error
	 */
	getWipAttachments(workspaceId, itemId) {
		let attachmentLink = this.wipAttachments.link
			.replace('[workspaceId]', workspaceId)
			.replace('[itemId]', itemId);

		return this.RESTWrapperService.get(attachmentLink);
	}
}

export default angular.module(__moduleName, []).factory('cpdmAttachmentsService', [
	'Restangular',
	'$q',
	'_',
	'$log',
	'$http',
	'RESTWrapperService',
	(Restangular, $q, _, $log, $http, RESTWrapperService) => new cpdmAttachmentsService(Restangular, $q, _, $log, $http, RESTWrapperService)
]);
