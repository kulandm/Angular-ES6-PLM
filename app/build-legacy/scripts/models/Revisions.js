'use strict';

/**
 * @ngdoc object
 * @name Models.Revisions
 *
 * @description This class wraps a list of Revisions payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Revisions = function Revisions() {};

Revisions.prototype = {
	/**
  * @ngdoc method
  * @name Models.Revisions#fetch
  * @methodOf Models.Revisions
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
	},

	/**
  * @ngdoc method
  * @name Models.Revisions#getFullList
  * @methodOf Models.Revisions
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.Revisions#getCurrentId
  * @methodOf Models.Revisions
  * @description Returns the ID of the current revision
  *
  * @returns {String} The ID of the current revision
  */
	getCurrentId: function getCurrentId() {
		return this.json.item.id;
	}

	/**
  * @ngdoc method
  * @name Models.Revisions#getSelectedRevision
  * @methodOf Models.Revisions
  * @description Returns the revision currently selected
  *
  * @returns {Object} The current revision
  */
	// getSelectedRevision: function () {
	// 	var that = this;
	// 	var ret = {};
	// 	angular.forEach(this.json.item.links, function (item, index) {
	// 		if (item.id === that.getCurrentId()) {
	// 			ret = item;
	// 		}
	// 	});
	// 	return ret;
	// }
};

angular.module('plm360.models').factory('Revisions', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Revisions.prototype.RESTWrapperService = RESTWrapperService;
	EventService.listen('itemRevisions:*:get', function (event, params) {
		var model = models[params] || new Revisions();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('itemRevisions:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Revisions;
}]);
//# sourceMappingURL=Revisions.js.map
