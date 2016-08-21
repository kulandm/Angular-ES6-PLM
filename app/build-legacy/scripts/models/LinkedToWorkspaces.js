'use strict';

/**
 * @ngdoc object
 * @name Models.LinkedToWorkspaces
 *
 * @description This class wraps the Linked To Workspaces payload into an object
 *
 * ##Dependencies
 *
 */
var LinkedToWorkspaces = function LinkedToWorkspaces() {};
var WORKSPACE_TYPES;

LinkedToWorkspaces.prototype = {
	/**
  * @ngdoc method
  * @name Models.LinkedToWorkspaces#fetch
  * @methodOf Models.LinkedToWorkspaces
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;

		return this.RESTWrapperService.get(link, null, null, { skipCache: true }).then(function (payload) {
			that.json = payload.workspaces;
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.LinkedToWorkspaces#getFullList
  * @methodOf Models.LinkedToWorkspaces
  * @description Returns a copy of the object's JSON
  *
  * @returns {Object} The item object
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.LinkedToWorkspaces#getRevisioningWorkspaces
  * @methodOf Models.LinkedToWorkspaces
  * @description Filters the object's JSON to contain only revisioning
  * workspaces
  *
  * @returns {Object} The filtered object
  */
	getRevisioningWorkspaces: function getRevisioningWorkspaces() {
		return _.filter(this.json, function (linkedToWorkspace) {
			return parseInt(linkedToWorkspace.type.split('/').pop()) === WORKSPACE_TYPES.REVISIONING_WORKSPACE;
		});
	}
};

angular.module('plm360.models').factory('LinkedToWorkspaces', ['RESTWrapperService', 'EventService', 'WorkspaceTypes', function (RESTWrapperService, EventService, WorkspaceTypes) {
	var models = {};
	WORKSPACE_TYPES = WorkspaceTypes;

	LinkedToWorkspaces.prototype.RESTWrapperService = RESTWrapperService;

	// Get
	EventService.listen('linkedToWorkspaces:*:get', function (event, url) {
		var model = models[url] || new LinkedToWorkspaces();
		models[url] = model;
		model.fetch(url).then(function (obj) {
			EventService.send('linkedToWorkspaces:' + event.split(':')[1] + ':done', obj);
		});
	});

	return LinkedToWorkspaces;
}]);
//# sourceMappingURL=LinkedToWorkspaces.js.map
