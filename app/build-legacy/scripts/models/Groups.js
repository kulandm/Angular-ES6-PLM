'use strict';

/**
 * @ngdoc object
 * @name Models.this
 *
 * @description This class wraps a groups payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Groups = function Groups() {};

Groups.prototype = {
	/**
  * @ngdoc method
  * @name Models.this#fetch
  * @methodOf Models.this
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;
			return that;
		});
	}
};

angular.module('plm360.models').factory('Groups', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Groups.prototype.RESTWrapperService = RESTWrapperService;
	Groups.prototype.EventService = EventService;
	EventService.listen('groups', function (event, params) {
		var model = models[params] || new Groups();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('availableGroups:done', obj);
		});
	});
	return Groups;
}]);
//# sourceMappingURL=Groups.js.map
