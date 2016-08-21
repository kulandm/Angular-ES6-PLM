'use strict';

/**
 * @ngdoc object
 * @name Models.State
 *
 * @description This class wraps a list of Transitions payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var State = function () {
};

State.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.State#fetch
	 * @methodOf Models.State
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.State#getFullList
	 * @methodOf Models.State
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	},

	/**
	 * @ngdoc method
	 * @name Models.State#getName
	 * @methodOf Models.State
	 * @description Returns the name of the state
	 *
	 * @returns {String} The name of the state
	 */
	getName: function () {
		return this.json.data.currentStateName;
	},

	/**
	 * @ngdoc method
	 * @name Models.State#getTransitions
	 * @methodOf Models.State
	 * @description Returns the available transitions of the state
	 *
	 * @returns {Array} The available transitions of the state
	 */
	getTransitions: function () {
		return this.json.data.workflowTransitions;
	},

	/**
	 * @ngdoc method
	 * @name Models.State#getTransitionLink
	 * @methodOf Models.State
	 * @description Returns the REST api link for the item given the id
	 *
	 * @param {Number} workspaceId The ID of the workspace of the item to be retrieved
	 * @param {Number} dmsId The ID of the item to be retrieved
	 * @param {Number} transitionId The ID of the transition to be retrieved
	 *
	 * @returns {String} The string representation of the REST link
	 */
	getTransitionLink: function (workspaceId, dmsId, transitionId) {
		var ret = '';
		angular.forEach(this.json.availableTransitions.transitions, function (transition) {
			if (transition.transitionID === transitionId) {
				ret = transition.link.replace('[workspaceId]', workspaceId).replace('[itemId]', dmsId);
			}
		});
		return ret;
	}
};

angular.module('plm360.models').factory('State', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		State.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('itemState:*:get', function (event, params) {
			var model = models[params] || new State();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('itemState:' + event.split(':')[1] + ':done', obj);
			});
		});
		return State;
	}
]);
