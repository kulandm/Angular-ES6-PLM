'use strict';

/**
 * @ngdoc object
 * @name Models.Picklist
 *
 * @description This class wraps a picklist data into an object
 *
 * ##Dependencies
 *
 */
var Picklist = function Picklist() {};

Picklist.prototype = {
	/**
  * @ngdoc method
  * @name Models.Picklist#fetch
  * @methodOf Models.Ownership
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetchOptions: function fetchOptions(link, requestParams) {
		var that = this;
		var promises = [];
		var totalCount = null;

		that.json = { items: [] };

		function makeRequest(link, requestParams) {
			return that.RESTWrapperService.get(link, null, requestParams, { skipCache: true }).then(function (payload) {

				that.json.items = payload.items ? that.json.items.concat(payload.items) : that.json.items;

				// Manual pagination
				if (totalCount === null) {
					totalCount = payload.totalCount;
				}
				requestParams.offset = payload.offset + 10;
				if (requestParams.offset < totalCount) {
					return makeRequest(link, requestParams);
				} else {
					return that;
				}
			});
		}

		return makeRequest(link, requestParams).then(function () {
			return that.Q.all(promises).then(function () {
				return that;
			});
		});
	},

	fetchSelection: function fetchSelection(link, requestParams) {
		var that = this;
		return that.RESTWrapperService.get(link, null, requestParams, { skipCache: true }).then(function (payload) {
			that.json = payload;
			return that;
		});
	}
};

angular.module('plm360.models').factory('Picklist', ['RESTWrapperService', 'EventService', '$q', function (RESTWrapperService, EventService, $q) {
	var models = {};

	Picklist.prototype.RESTWrapperService = RESTWrapperService;
	Picklist.prototype.Q = $q;

	EventService.listen('picklistWorkspaceOptions:*:get', function (event, params, requestParams) {
		var model = models[params] || new Picklist();
		models[params] = model;
		model.fetchOptions(params, requestParams).then(function (obj) {
			EventService.send('picklistWorkspaceOptions:' + event.split(':')[1] + ':done', obj);
		});
	});

	EventService.listen('picklistWorkspaceSelection:*:get', function (event, params, requestParams) {
		var model = models[params] || new Picklist();
		models[params] = model;
		model.fetchSelection(params, requestParams).then(function (obj) {
			EventService.send('picklistWorkspaceSelection:' + event.split(':')[1] + ':done', obj);
		});
	});

	EventService.listen('picklistoptions:*:get', function (event, params, requestParams) {
		var model = models[params] || new Picklist();
		models[params] = model;
		model.fetchOptions(params, requestParams).then(function (obj) {
			EventService.send('picklistoptions:' + event.split(':')[1] + ':done', obj);
		});
	});

	EventService.listen('picklistselection:*:get', function (event, params, requestParams) {
		var model = models[params] || new Picklist();
		models[params] = model;
		model.fetchSelection(params, requestParams).then(function (obj) {
			EventService.send('picklistselection:' + event.split(':')[1] + ':done', obj);
		});
	});

	return Picklist;
}]);
//# sourceMappingURL=Picklist.js.map
