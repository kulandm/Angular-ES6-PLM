'use strict';

/**
 * @ngdoc object
 * @name Models.ActionNotifications
 *
 * @description This class wraps a list of ActionNotifications payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var ActionNotifications = function ActionNotifications() {};

ActionNotifications.prototype = {

	/**
  * @ngdoc method
  * @name Models.ActionNotifications#fetch
  * @methodOf Models.ActionNotifications
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, params) {
		var that = this;
		return this.RESTWrapperService.get(link, null, params, {}).then(function (payload) {
			that.json = [];
			if (payload.length > 0) {
				angular.forEach(payload, function (item, index) {
					/* global ActionNotification */
					that.json.push(new ActionNotification(item, this.RESTWrapperService));
				}, that);
			}
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.ActionNotifications#getFullList
  * @methodOf Models.ActionNotifications
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return this.json;
	}
};

angular.module('plm360.models').factory('ActionNotifications', ['RESTWrapperService', 'EventService', '$q', function (RESTWrapperService, EventService, $q) {
	var models = {};
	ActionNotifications.prototype.RESTWrapperService = RESTWrapperService;
	ActionNotifications.prototype.$q = $q;
	EventService.listen('actionNotification:*:get', function (event, params, requestParams) {
		var model = models[params] || new ActionNotifications();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('actionNotification:' + event.split(':')[1] + ':done', obj);
		});
	});
	return ActionNotifications;
}]);
//# sourceMappingURL=ActionNotifications.js.map
