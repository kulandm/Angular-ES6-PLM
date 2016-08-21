'use strict';

/**
 * @ngdoc object
 * @name Models.Milestones
 *
 * @description This class wraps a list of task node objects for the Milestoness tab.
 * ##Dependencies
 *
 */
var Milestones = function Milestones() {};

Milestones.prototype = {

	/**
  * @ngdoc method
  * @name Models.Milestones#fetch
  * @methodOf Models.Milestones
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Object} params The parameters used for fetching (ex. page, page size, etc.)
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
  * @name Models.Milestones#getFullList
  * @methodOf Models.Milestones
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json).milestones;
	}
};

angular.module('plm360.models').factory('Milestones', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Milestones.prototype.RESTWrapperService = RESTWrapperService;
	EventService.listen('milestones:*:get', function (event, params, requestParams) {
		var model = models[params] || new Milestones();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('milestones:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Milestones;
}]);
//# sourceMappingURL=Milestones.js.map
