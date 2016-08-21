'use strict';

/**
 * @ngdoc object
 * @name Models.AttachmentVersion
 *
 * @description This class to represent AttachmentVersion model.
 *
 * ##Dependencies
 */
class AttachmentVersion {

	/**
	 * @ngdoc method
	 * @name Models.AttachmentVersion#constructor
	 * @methodOf Models.AttachmentVersion
	 * @description Sets the properties of the instance from the payload
	 */
	constructor(json) {
		this.json = json;
	}

	/**
	 * @ngdoc method
	 * @name Models.AttachmentVersion#getVersionUrn
	 * @methodOf Models.AttachmentVersion
	 * @description Gets the urn
	 *
	 * @returns {String} The version urn
	 */
	getVersionUrn() {
		return this.json.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.AttachmentVersion#getVersionNumber
	 * @methodOf Models.AttachmentVersion
	 * @description Gets the versionNumber
	 *
	 * @returns {String} Version Number of the attachment
	 */
	getVersionNumber() {
		return this.json.versionNumber.toString();
	}

	/**
	 * @ngdoc method
	 * @name Models.Attachment#getVersions
	 * @methodOf Models.AttachmentVersion
	 * @description Gets all the versions of an attachment
	 *
	 * @param {lineageUrn} lineageUrn of the attachment
	 *
	 * @returns {String} Lineage urn of an attachment
	 */
	static getVersions(lineageUrn) {
		return AttachmentVersion.WipApiService.getWipFileVersions(lineageUrn).then(results => {
			return _.map(results.data.collection, versionJson => {
				return new AttachmentVersion(versionJson);
			});
		});
	}
}

let AttachmentVersionFactory = (WipApiService) => {
	AttachmentVersion.WipApiService = WipApiService;

	return AttachmentVersion;
};

export default angular.module(__moduleName, []).factory('AttachmentVersion', [
	'WipApiService',
	AttachmentVersionFactory
]);
