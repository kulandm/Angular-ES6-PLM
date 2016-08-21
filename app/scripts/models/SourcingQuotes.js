'use strict';

/**
 * @ngdoc object
 * @name Models.SourcingQuotes
 *
 * @description This class wraps a list of Quotes of a Sourcing payload into an object
 *
 * ##Dependencies
 *
 */

var SourcingQuotes = function () {
};

SourcingQuotes.prototype = {

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
	fetch: function (link) {
		var that = this;

		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = [];
			angular.forEach(payload, function (item, index) {
				that.json[index] = item;
			}, that);
			return that;
		}, function (error) {
			console.log('Models.SourcingQuotes:fetch:', error);
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.SourcingQuotes#getFullList
	 * @methodOf Models.SourcingQuotes
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	}

};

angular.module('plm360.models').factory('SourcingQuotes', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		SourcingQuotes.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('sourcingQuotes:*:get', function (event, params) {
			var model = models[params] || new SourcingQuotes();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('sourcingQuotes:' + event.split(':')[1] + ':done', obj);
			});
		});
		return SourcingQuotes;
	}
]);
