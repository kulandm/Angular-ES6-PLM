'use strict';

/**
 * @ngdoc object
 * @name Models.GridMeta
 *
 * @description This class wraps a list of GridMeta payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var GridMeta = function () {
};

GridMeta.prototype = {

	/**
	 * @ngdoc method
	 * @name Models.GridMeta#fetch
	 * @methodOf Models.GridMeta
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
			return that.fetchFieldDefinitions().then(function () {
				return that;
			});
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.GridMeta#getFullList
	 * @methodOf Models.GridMeta
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	},

	/**
	 * @ngdoc method
	 * @name Models.GridMeta#setRESTWrapperService
	 * @methodOf Models.GridMeta
	 * @description Sets RESTWrapperService object
	 *
	 * @param {Object} RESTWrapperService The RESTWrapperService object
	 */
	setRESTWrapperService: function (RESTWrapperService) {
		this.RESTWrapperService = RESTWrapperService;
	},

	/**
	 * @ngdoc method
	 * @name Models.GridMeta#fetchFieldDefinitions
	 * @methodOf Models.GridMeta
	 * @description Fetches the field definition of each field
	 *
	 * @param {Object} $q The angular service to handle promises
	 *
	 * @returns {Object} A Promise that resolves after all fetches are complete
	 */
	fetchFieldDefinitions: function () {
		var that = this;
		var deferred = this.$q.defer();
		var promises = []; // Promises array to hold all for fetching field definitions
		var promisesCounter = 0;
		_.each(this.json, function (row, rowIndex) {
			var thisrow = row;
			var promise = that.RESTWrapperService.get(row.link.substring(1), null, null, null, {
				ACCEPT: 'application/vnd.autodesk.plm.meta+json'
			});
			promises.push(promise);
			promise.then(function (ret) {
				thisrow.definition = ret;
				that.RESTWrapperService.get(ret.type.link.substring(1), null, null).then(function (typePayload) {
					thisrow.definition.type = typePayload;
					promisesCounter++;
					if (promisesCounter === promises.length) {
						deferred.resolve();
					}
				});
			});
		});

		return deferred.promise;
	}
};

angular.module('plm360.models').factory('GridMeta', [
	'RESTWrapperService',
	'EventService',
	'$q',
	function (RESTWrapperService, EventService, $q) {
		var models = {};
		GridMeta.prototype.RESTWrapperService = RESTWrapperService;
		GridMeta.prototype.$q = $q;
		EventService.listen('gridMeta:*:get', function (event, params) {
			var model = models[params] || new GridMeta();
			models[params] = model;
			model.fetch(params).then(function (obj) {
				EventService.send('gridMeta:' + event.split(':')[1] + ':done', obj);
			});
		});
		return GridMeta;
	}
]);
