'use strict';

/**
 * @ngdoc object
 * @name Models.Sourcings
 *
 * @description This class wraps a list of Sourcings payload into an object
 *
 * ##Dependencies
 *
 */

var Sourcings = function Sourcings() {};

Sourcings.prototype = {

	/**
  * @ngdoc method
  * @name Models.Sourcings#fetch
  * @methodOf Models.Sourcings
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = [];
			angular.forEach(payload, function (item, index) {
				that.json[index] = item;
				// that.json[index] = new Sourcing(item);
			}, that);
			return that;
		}, function (error) {
			console.log('Models.Sourcings:fetch:', error);
		});
	},

	/**
  * @ngdoc method
  * @name Models.Sourcings#getFullList
  * @methodOf Models.Sourcings
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	}

};

angular.module('plm360.models').factory('Sourcings', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Sourcings.prototype.RESTWrapperService = RESTWrapperService;

	EventService.listen('sourcings:*:get', function (event, params) {
		var model = models[params] || new Sourcings();
		models[params] = model;

		model.fetch(params).then(function (obj) {
			EventService.send('sourcings:' + event.split(':')[1] + ':done', obj);
		});
	});

	return Sourcings;
}]);
//# sourceMappingURL=Sourcings.js.map
