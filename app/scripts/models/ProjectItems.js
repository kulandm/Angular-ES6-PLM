'use strict';

/**
 * @ngdoc object
 * @name Models.ProjectItems
 *
 * @description This class wraps the items for the Project Management tab
 *
 * ##Dependencies
 *
 */
var ProjectItems = function () {
};

ProjectItems.prototype = {

	/**
	 * @ngdoc method
	 * @name Models.ProjectItems#fetch
	 * @methodOf Models.ProjectItems
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 * @param {Object} params The parameters used for fetching (ex. page, page size, etc.)
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link, params, headers) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {}, headers).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.ProjectItems#getFullList
	 * @methodOf Models.ProjectItems
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	}
};

angular.module('plm360.models').factory('ProjectItems', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		ProjectItems.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('projectItems:*:get', function (event, params, requestParams) {
			var model = models[params] || new ProjectItems();
			models[params] = model;
			model.fetch(params, requestParams).then(function (obj) {
				EventService.send('projectItems:' + event.split(':')[1] + ':done', obj);
			});
		});
		EventService.listen('milestoneProjectItems:*:get', function (event, params, requestParams) {
			var model = models[params] || new ProjectItems();
			var headers = {
				Accept: 'application/vnd.autodesk.plm.project.item'
			};

			models[params] = model;

			model.fetch(params, requestParams, headers).then(function (obj) {
				EventService.send('projectItems:' + event.split(':')[1] + ':done', obj);
			});
		});
		return ProjectItems;
	}
]);
