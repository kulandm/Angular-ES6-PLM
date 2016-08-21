'use strict';

/**
 * @ngdoc object
 * @name Models.Attachment
 *
 * @description This class to represent attachment model. This model will be
 * created by payload data from plm and wip.
 *
 * ##Dependencies
 */
class Attachment {

	/**
	 * @ngdoc method
	 * @name Models.Attachment#constructor
	 * @methodOf Models.Attachment
	 * @description Sets the properties of the instance from the payload
	 *
	 * @param {String} workspaceId The ID of the workspace whose item to retrieve
	 * @param {String} itemId The ID of the item to retrieve
	 */
	constructor(json) {
		this.json = json;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#setLatestVersionInfo
	 * @methodOf Models.Attachment
	 * @description Sets the versioned file information for the model
	 *
	 * @param {Object} versionedFile Latest version file information
	 */
	setLatestVersionInfo(versionedFile) {
		this.latestVersionFile = versionedFile;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#setPinnedVersionInfo
	 * @methodOf Models.Attachment
	 * @description Sets the versioned file information for the model
	 *
	 * @param {Object} pinnedVersionedFile Pinned version file information
	 */
	setPinnedVersionInfo(pinnedVersionedFile) {
		this.pinnedVersionFile = pinnedVersionedFile;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#isPinnedToLatestVersion
	 * @methodOf Models.Attachment
	 * @description Checks if the attachment is pinned to its latest version
	 *
	 * @returns {Boolean} True, if the attachment is pinned to its latest version
	 */
	isPinnedToLatestVersion() {
		return this.getPinnedVersion() === this.getVersion();
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#hasExtension
	 * @methodOf Models.Attachment
	 * @description Checks if the file name contains its extension
	 *
	 * @returns {Boolean} True, if the file name contains its extension
	 */
	hasExtension() {
		let fileExtensionPattern = new RegExp(`(\\.${this.getFileType()})$`, 'gi');
		return !!this.getTitle().match(fileExtensionPattern);
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getLineageUrn
	 * @methodOf Models.Attachment
	 * @description Gets the lineageUrn (from PLM payload)
	 *
	 * @returns {String} Lineage urn of an attachment
	 */
	getLineageUrn() {
		return this.json.lineageUrn;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinningPolicy
	 * @methodOf Models.Attachment
	 * @description Gets the pinning policy (from PLM payload)
	 *
	 * @returns {String} Pinning policy of an attachment
	 */
	getPinningPolicy() {
		return this.json.pinningPolicy;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedVersion
	 * @methodOf Models.Attachment
	 * @description Gets the pinning version number (from PLM payload),
	 * Returns null if unavailable
	 *
	 * @returns {String} Pinned version number
	 */
	getPinnedVersion() {
		return this.json.version ? `${this.json.version}` : null;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedVersionUrn
	 * @methodOf Models.Attachment
	 * @description Gets the pinning version urn (from PLM payload),
	 * Returns null if unavailable
	 *
	 * @returns {String} versionUrn
	 */
	getPinnedVersionUrn() {
		return this.json.versionUrn || null;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#setPinnedVersion
	 * @methodOf Models.Attachment
	 * @description Sets the pinning version
	 *
	 * @param {String} version passed to set
	 */
	setPinnedVersion(version) {
		this.json.version = version;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedVersionFileInfo
	 * @methodOf Models.Attachment
	 * @description Gets the pinned versioned file info (from WIP payload)
	 *
	 * @returns {Object} Pinned versioned file information
	 */
	getPinnedVersionFileInfo() {
		return this.pinnedVersionFile;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedTitle
	 * @methodOf Models.Attachment
	 * @description Gets the file title of pinned version (from WIP payload)
	 *
	 * @returns {String} Pinned versioned file title
	 */
	getPinnedTitle() {
		return this.getPinnedVersionFileInfo() &&
			this.getPinnedVersionFileInfo().title;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedMimeType
	 * @methodOf Models.Attachment
	 * @description Gets the mime type of pinned version (from WIP payload)
	 *
	 * @returns {String} Pinned versioned file mime type
	 */
	getPinnedMimeType() {
		return this.getPinnedVersionFileInfo() &&
			this.getPinnedVersionFileInfo().mimeType;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedFileType
	 * @methodOf Models.Attachment
	 * @description Gets the file type of pinned version (from WIP payload)
	 *
	 * @returns {String} Pinned versioned file type
	 */
	getPinnedFileType() {
		return this.getPinnedVersionFileInfo() &&
			this.getPinnedVersionFileInfo().fileType;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedFileSize
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file size of pinned version
	 * (from WIP payload)
	 *
	 * @returns {Number} Pinned versioned file size
	 */
	getPinnedFileSize() {
		return this.getPinnedVersionFileInfo() &&
			this.getPinnedVersionFileInfo().fileSize;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedCreateUserName
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file create username of pinned version
	 * (from WIP payload)
	 *
	 * @returns {String} Pinned versioned file create username
	 */
	getPinnedCreateUserName() {
		return this.getPinnedVersionFileInfo() &&
			this.getPinnedVersionFileInfo().createUserName;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getPinnedCreateTime
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file create time of pinned version
	 * (from WIP payload)
	 *
	 * @returns {String} Pinned versioned file create time
	 */
	getPinnedCreateTime() {
		return this.getPinnedVersionFileInfo() &&
			this.getPinnedVersionFileInfo().createTime;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getLatestVersionFileInfo
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file info (from WIP payload)
	 *
	 * @returns {Object} Versioned file information
	 */
	getLatestVersionFileInfo() {
		return this.latestVersionFile;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getVersionUrn
	 * @methodOf Models.Attachment
	 * @description Gets the latest version urn (from WIP payload)
	 *
	 * @returns {String} Version urn
	 */
	getVersionUrn() {
		return this.getLatestVersionFileInfo().urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getTitle
	 * @methodOf Models.Attachment
	 * @description Gets the file title (from WIP payload)
	 *
	 * @returns {String} Versioned file title
	 */
	getTitle() {
		return this.getLatestVersionFileInfo().title;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getMimeType
	 * @methodOf Models.Attachment
	 * @description Gets the mime type (from WIP payload)
	 *
	 * @returns {String} Versioned file mime type
	 */
	getMimeType() {
		return this.getLatestVersionFileInfo().mimeType;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getFileType
	 * @methodOf Models.Attachment
	 * @description Gets the file type (from WIP payload)
	 *
	 * @returns {String} Versioned file type
	 */
	getFileType() {
		return this.getLatestVersionFileInfo().fileType;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getFileSize
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file size (from WIP payload)
	 *
	 * @returns {Number} Versioned file size
	 */
	getFileSize() {
		return this.getLatestVersionFileInfo().fileSize;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getCreateUserName
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file create username (from WIP payload)
	 *
	 * @returns {String} Versioned file create username
	 */
	getCreateUserName() {
		return this.getLatestVersionFileInfo().createUserName;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getCreateTime
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file create time (from WIP payload)
	 *
	 * @returns {String} Versioned file create time
	 */
	getCreateTime() {
		return this.getLatestVersionFileInfo().createTime;
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getVersion
	 * @methodOf Models.Attachment
	 * @description Gets the versioned file version number (from WIP payload)
	 *
	 * @returns {String} Versioned file version number
	 */
	getVersion() {
		return this.getLatestVersionFileInfo().versionNumber.toString();
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getAllVersions
	 * @methodOf Models.Attachment
	 * @description Make a call to get all versions of an attachment
	 * @returns {Object} A Promise
	 */
	getAllVersions() {
		return Attachment.AttachmentVersion.getVersions(this.getLineageUrn());
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#fetchAttachments
	 * @methodOf Models.Attachment
	 * @description Make a WIP call to fetch all attachments
	 *
	 * @param {Object[]} lineageUrns List of lineage urns
	 *
	 * @returns {Object} A Promise
	 */
	static fetchAttachments(lineageUrns) {
		return Attachment.WipApiService.getFiles(lineageUrns);
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#fetchSingleAttachment
	 * @methodOf Models.Attachment
	 * @description Make a WIP call to fetch a single attachments given its
	 * version urn
	 *
	 * @param {String} versionUrn Version urn
	 *
	 * @returns {Object} A Promise
	 */
	static fetchSingleAttachment(versionUrn) {
		return Attachment.WipApiService.getWipSingleVersion(versionUrn);
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#addAttachment
	 * @methodOf Models.Attachment
	 * @description Make a POST call to add an attachment
	 *
	 * @returns {Object} A Promise for the POST
	 */
	static addAttachment(attachment, workspaceId, itemId, itemUrn) {
		let data = {
			itemId: itemUrn,
			lineageUrn: attachment.urn,
			pinningPolicy: 'On Lock'
		};

		return Attachment.RESTWrapperService.post(
			data,
			'api/v3',
			[{workspaces: workspaceId}, {items: itemId}, 'attachments'],
			null,
			{'Content-Type': 'application/json'},
			{}
		);
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#deleteAttachment
	 * @methodOf Models.Attachment
	 * @description Make a call to delete the attached item
	 *
	 * @param {String} delUrl URL used to perform a unique delete
	 *
	 * @returns {Object} A Promise
	 */
	static deleteAttachment(delUrl) {
		let link = delUrl.slice(1, delUrl.length);
		let headers = {'Content-Type': 'application/json'};
		return Attachment.RESTWrapperService.delete(link, null, {}, headers, null);
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#downloadAttachment
	 * @methodOf Models.Attachment
	 * @description Make a WIP call to download an attachment
	 * NOTE: This only supports OSS storage type
	 *
	 * @param {String} versionUrn URN of attachment to download
	 * @param {String} filename Optional, file name (with extension) of attachment
	 *
	 * @returns {Object} A Promise
	 */
	static downloadAttachment(versionUrn, filename) {
		return Attachment.WipApiService.downloadFile(versionUrn, filename);
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#saveAttachment
	 * @methodOf Models.Attachment
	 * @description Make a call to save the item
	 *
	 * @param {Object} data The edited data to save
	 *
	 * @returns {Object} A Promise
	 */
	static saveAttachment(data) {
		let link = data.__self__.slice(1, data.__self__.length);
		let headers = {'Content-Type': 'application/json'};
		return Attachment.RESTWrapperService.put(data, link, null, {}, headers, null);
	}
}

let AttachmentFactory = ($http, $q, WipApiService, RESTWrapperService, AttachmentVersion, $rootScope) => {
	Attachment.$http = $http;
	Attachment.$q = $q;
	Attachment.WipApiService = WipApiService;
	Attachment.RESTWrapperService = RESTWrapperService;
	Attachment.AttachmentVersion = AttachmentVersion;
	Attachment.$rootScope = $rootScope;

	return Attachment;
};

export default angular.module(__moduleName, []).factory('Attachment', [
	'$http',
	'$q',
	'WipApiService',
	'RESTWrapperService',
	'AttachmentVersion',
	'$rootScope',
	AttachmentFactory
]);
