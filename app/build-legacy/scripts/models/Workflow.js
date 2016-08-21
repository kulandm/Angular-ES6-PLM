'use strict';

/**
 * @ngdoc object
 * @name Models.Workflow
 *
 * @description This class wraps a list of Workflow payload into an object.
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Workflow = function Workflow() {};

Workflow.prototype = {
	/**
  * @ngdoc method
  * @name Models.Workflow#fetch
  * @methodOf Models.Workflow
  * @description Make a call to fetch raw data.
  *
  * @param {String} link		The URL to use for fetching the data.
  * @param {Object} params	The parameters used for fetching (ex. page, page size, etc.).
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, params) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {}).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.Workflow#getFullList
  * @methodOf Models.Workflow
  * @description Returns the full list of data.
  *
  * @returns {Array} The full list of data.
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	}
};

angular.module('plm360.models').factory('Workflow', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Workflow.prototype.RESTWrapperService = RESTWrapperService;
	EventService.listen('workflow:*:get', function (event, params, requestParams) {
		var model = models[params] || new Workflow();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('workflow:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Workflow;
}]);
//# sourceMappingURL=Workflow.js.map
