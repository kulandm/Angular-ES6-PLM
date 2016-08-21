'use strict';

/**
 * @ngdoc object
 * @name Models.EnabledFeatures
 *
 * @description This class wraps a tenant's enabled features payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var EnabledFeatures = function () {};

EnabledFeatures.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.EnabledFeatures#fetch
	 * @methodOf Models.EnabledFeatures
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
	 * @name Models.EnabledFeatures#getDisplayableData
	 * @methodOf Models.EnabledFeatures
	 * @description Returns formatted data of the enabled features
	 *
	 * @returns {Object} An object representation of the formatted data
	 *
	 */
	getDisplayableData: function () {
		var ret = {};

		if ((angular.isDefined(this.json)) && (this.json !== null)) {
			ret = angular.copy(this.json);

			var toBeSpliced = [];

			angular.forEach(ret, function (value, datalistkey) {
				if (!value || (!value.title && !value.urn)) {
					toBeSpliced.push(datalistkey);
					return;
				}
			});

			if (Array.isArray(ret)) {
				var decrementCounter = 0;
				angular.forEach(toBeSpliced, function (value) {
					ret.splice(value - decrementCounter, 1);
					decrementCounter++;
				});
			} else {
				ret = [];
			}
		}

		return {data: ret};
	}
};

angular.module('plm360.models').factory('EnabledFeatures', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		EnabledFeatures.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('enabledFeatures:*:get', function (event, params) {
			var model = models[params] || new EnabledFeatures();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('enabledFeatures:' + event.split(':')[1] + ':done', obj);
			});
		});
		return EnabledFeatures;
	}
]);
