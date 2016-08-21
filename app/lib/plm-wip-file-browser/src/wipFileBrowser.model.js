'use strict';

/**
 * @ngdoc property
 * @name Models.WipFileBrowserModel#GROUPFOLDER
 * @propertyOf Models.WipFileBrowserModel
 * @description constant file type value of group folder.
 */
const GROUPFOLDER = 'groupfolder';

/**
 * @ngdoc object
 * @name Models.WipFileBrowserModel
 *
 * @description This class wraps a WipFileBrowserModel payload into an object
 *
 * ##Dependencies
 *
 */
class WipFileBrowserModel {

	/**
	 * @ngdoc method
	 * @name Models.WipFileBrowserModel#constructor
	 * @methodOf Models.WipFileBrowserModel
	 * @description Sets the properties of the instance from the payload
	 * @param {Object} json the JSON payload for a WipFileBrowserModel
	 */
	constructor(json) {
		this.json = json;
	}

	/**
	 * @ngdoc method
	 * @name Models.WipFileBrowserModel#fetch
	 * @methodOf Models.WipFileBrowserModel
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
     * @param {Object} params parametrs to send with the GET
	 *
	 * @returns {WipFileBrowserModel} An object representation of the formatted data
	 */
	fetch(folderInfoObj) {

		return this.RESTWrapperService.get(this.App.hubs.link).then((hubs) => {
			if (folderInfoObj) {
				return folderInfoObj.urn;
			}

			return (hubs.items && hubs.items.length) ? hubs.items[0].rootFolders[0] : '';
		}).then((folderUrn) => {
			return this.WipApiService.getWipFolder(folderUrn);
		}).then((payload) => {
			// this callback will be called asynchronously
			// when the response is available
			return new WipFileBrowserModel(payload);
		}, (error) => {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.WipFileBrowserModel#getFolders
	 * @methodOf Models.WipFileBrowserModel
	 * @description The list of folders
	 *
	 * @returns {Array} List of folders to display in Wip file browser
	 */
	getFolders() {
		return this._.filter(this.json.data.folders, (folder) => {
			return !(folder.properties.folderType) || folder.properties.folderType.value === GROUPFOLDER;
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.WipFileBrowserModel#getVersionedFiles
	 * @methodOf Models.WipFileBrowserModel
	 * @description The list of versioned files
	 *
	 * @returns {Array} List of lineage and versioned files to display in Wip file browser
	 */
	getVersionedFiles() {
		return this.json.data.versionedFiles;
	}
}

export default angular.module(__moduleName, []).factory('WipFileBrowserModel', [
	'$http',
	'EventService',
	'RESTWrapperService',
	'App',
	'WipApiService',
	'_',
	function ($http, EventService, RESTWrapperService, App, WipApiService, _) {
		WipFileBrowserModel.prototype.$http = $http;
		WipFileBrowserModel.prototype.RESTWrapperService = RESTWrapperService;
		WipFileBrowserModel.prototype.App = new App();
		WipFileBrowserModel.prototype.WipApiService = WipApiService;
		WipFileBrowserModel.prototype._ = _;

		EventService.listen('wipFileBrowserItems:get', (event, params) => {
			let wipFileBrowser = new WipFileBrowserModel();
			wipFileBrowser.fetch(params).then((obj) => {
				EventService.send('wipFileBrowserItems:done', obj);
			});
		});

		return WipFileBrowserModel;
	}
]);
