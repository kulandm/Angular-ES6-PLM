'use strict';

/**
 * @ngdoc object
 * @name Models.ChangeLog
 *
 * @description This class wraps a list of ChangeLog payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var ChangeLog = function () {
};

ChangeLog.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.ChangeLog#fetch
	 * @methodOf Models.ChangeLog
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 * @param {Object} params The parameters used for fetching (ex. page, page size, etc.)
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link, params) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {}).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.ChangeLog#getFullList
	 * @methodOf Models.ChangeLog
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	}

	/**
	 * @ngdoc method
	 * @name Models.ChangeLog#getTransitionLink
	 * @methodOf Models.ChangeLog
	 * @description Returns the REST api link for the item given the id
	 *
	 * @param {Number} workspaceId The ID of the workspace of the item to be retrieved
	 * @param {Number} dmsId The ID of the item to be retrieved
	 * @param {Number} transitionId The ID of the transition to be retrieved
	 *
	 * @returns {String} The string representation of the REST link
	 */
	// getTransitionLink: function (workspaceId, dmsId, transitionId) {
	// 	var ret = '';
	// 	angular.forEach(this.json.availableTransitions.transitions, function (transition) {
	// 		if (transition.transitionID == transitionId) {
	// 			ret = transition.link.replace('[workspaceId]', workspaceId).replace('[itemId]', dmsId);
	// 		}
	// 	});
	// 	return ret;
	// },

	/**
	 * @ngdoc method
	 * @name Models.ChangeLog#setTransitionObj
	 * @methodOf Models.ChangeLog
	 * @description Attaches the transition object to the tree
	 *
	 * @param {Number} transitionId The ID of the transition to be stored
	 * @param {Object} The transition object
	 */
	// setTransitionObj: function (transitionId, obj) {
	// 	angular.forEach(this.json.availableTransitions.transitions, function (transition) {
	// 		if (transition.transitionID == transitionId) {
	// 			transition.obj = obj;
	// 		}
	// 	});
	// }
};

angular.module('plm360.models').factory('ChangeLog', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		ChangeLog.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('changeLog:*:get', function (event, params, requestParams) {
			var model = models[params] || new ChangeLog();
			models[params] = model;
			model.fetch(params, requestParams).then(function (obj) {
				EventService.send('changeLog:' + event.split(':')[1] + ':done', obj);
			});
		});
		return ChangeLog;
	}
]);
