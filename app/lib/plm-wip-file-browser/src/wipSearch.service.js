'use strict';

// TODO [PLM-14941] Move WipSearchService out of WipFileBrowser to a separate component
const OAUTH1TOKENPATH = 'api/rest/v1/token?oauth_version=1';
const SEARCH_ENV_PATH = 'api/v3/configurations/SEARCH_SERVICE_ENV';
const STAGING = 'stg';

/**
 * @ngdoc object
 * @name Services.WipSearchService
 * @description for searching files indexed by wip.
 */
class WipSearchService {

	/**
	 * @ngdoc method
	 * @name Services.WipSearchService#constructor
	 * @methodOf Services.WipSearchService
	 * @description The class constructor
	 */
	constructor(RESTWrapperService, App, EnvironmentTypes) {

		let app = new App();

		RESTWrapperService.get(OAUTH1TOKENPATH).then(token => {
			this.token = token.access_token;
		});

		RESTWrapperService.get(app.hubs.link).then(hubs => {
			// Get the folder id, urn:<sourceSystem>:<type>:<id>
			this.rootFolderId = (hubs.items && hubs.items.length) ?
				hubs.items[0].rootFolders[0].split(':').pop() : '';
		});

		RESTWrapperService.get(SEARCH_ENV_PATH).then(searchEnv => {
			/**
			 * @ngdoc property
			 * @name Services.WipSearchService#searchSDK
			 * @propertyOf Services.WipSearchService
			 * @description Search SDK for querying wip files, input enviroment in string stg || prod
			 */
			this.searchSDK = new window.Autodesk.Search.SearchQueryAPI(searchEnv.value);

			// TODO [PLM-14943] consume ABUS environment key from hubs endpoint
			/**
			 * @ngdoc property
			 * @name Services.WipSearchService#folderScope
			 * @propertyOf Services.WipSearchService
			 * @description Scope based on ABUS environment key(wipqa, wipprod) within the search environment
			 */
			this.folderScope = searchEnv.value === STAGING ? EnvironmentTypes.STAGING : EnvironmentTypes.PROD;
		});
	}

	/**
	 * @ngdoc method
	 * @name Services.WipSearchService#search
	 * @methodOf Services.WipSearchService
	 * @description initialize data and call the searchSDK query.
	 *
	 * @param {String} query The object that contains values for search.
	 * @param {String} folderUrn The urn of the current folder wip file browser is displaying.
	 * @param {Function} callback The callback function.
	 */
	query(query, folderUrn, callback) {

		// Get the folder id, urn:<sourceSystem>:<type>:<id>
		let folderId = folderUrn ? folderUrn.split(':').pop() : this.rootFolderId;

		/**
		 * @ngdoc property
		 * @name Services.WipSearchService#PARAMS
		 * @propertyOf Services.WipSearchService
		 * @description Information sent to the Query Service API (user info, query info, etc)
		 */
		const PARAMS = {
			filters: `${this.folderScope}FolderScope~${folderId}`,
			language: '',
			page: 1,
			pid: 'adsk.fusionlifecycle.a360items', // required  do not modify
			profileName: 'plm360', // required do not modify
			query: query,
			sort: 'relevance'
		};

		/**
		 * @ngdoc property
		 * @name Services.WipSearchService#SESSION_INFO
		 * @propertyOf Services.WipSearchService
		 * @description items in header
		 */
		const SESSION_INFO = {
			clientFeatureId: 'a360.itemSearch', // required for search team to spool data
			clientId: 'adsk.plm360', // required for search team to spool data
			sessionId: 'plm360', // required for search team to spool data
			token: this.token || '' // oauth1 token here
		};

		// Run the query & check that query was executed
		this.searchSDK.query(PARAMS, SESSION_INFO, callback);
	}
}

export default angular.module(__moduleName, []).factory('WipSearchService', [
	'RESTWrapperService',
	'App',
	'EnvironmentTypes',
	(RESTWrapperService, App, EnvironmentTypes) => new WipSearchService(RESTWrapperService, App, EnvironmentTypes)
]);
