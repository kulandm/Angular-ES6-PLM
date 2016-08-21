'use strict';

/**
 * @ngdoc object
 * @name Models.Grid
 *
 * @description This class wraps a list of Grid payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var GridData = function GridData() {
	var that = this;

	/**
  * @ngdoc method
  * @name Models.Grid#fetch
  * @methodOf Models.Grid
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Object} params The parameters used for fetching (ex. page, page size, etc.)
  *
  * @returns {Object} An object representation of the formatted data
  */
	this.fetch = function (link, params) {
		var that = this;
		this.link = link;
		return this.RESTWrapperService.get(link, null, params, {}).then(function (payload) {
			that.json = payload;
			return that;
		});
	};

	/**
  * @ngdoc method
  * @name Models.Grid#getFullList
  * @methodOf Models.Grid
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	this.getFullList = function () {
		return angular.copy(this.json);
	};

	/**
  * @ngdoc method
  * @name Models.Grid#getTransitionLink
  * @methodOf Models.Grid
  * @description Returns the REST api link for the item given the id
  *
  * @param {Number} workspaceId The ID of the workspace of the item to be retrieved
  * @param {Number} dmsId The ID of the item to be retrieved
  * @param {Number} transitionId The ID of the transition to be retrieved
  *
  * @returns {String} The string representation of the REST link
  */
	// getTransitionLink: function (workspaceId, dmsId, transitionId) {
	// 	var ret = '';
	// 	angular.forEach(this.json.availableTransitions.transitions, function (transition) {
	// 		if (transition.transitionID == transitionId) {
	// 			ret = transition.link.replace('[workspaceId]', workspaceId).replace('[itemId]', dmsId);
	// 		}
	// 	});
	// 	return ret;
	// },

	/**
  * @ngdoc method
  * @name Models.Grid#save
  * @methodOf Models.Grid
  * @description Saves the data containing the workspace item grid information
  *
  * @param 	{Object} 		_								The underscore instance
  * @param 	{Object}			modifiedData 				The data that needs to be PUT
  * @param	{Number}		workspaceId						The ID of the workspace
  * @param	{Number}		itemId							The ID of the item
  * @param	{Object}		metadata						The metadata of grid definition
  *
  * @returns {Object} 		A promise of the PUT request
  *
  */
	this.save = function (_, modifiedData, workspaceId, itemId, metadata) {
		var that = this;

		// holds the array of promises
		var promises = [];

		// holds the array of errors
		var errors = {};

		// the promise to be resolved upon all promises resolved
		var saveAllDeferred = this.$q.defer();

		/**
  * Function to make the request, used to keep the reference to rowIndex
  * @param {String} method The method to use for the request
  * @param {Object} rowData The data to be posted/put
  * @param {Array} params The parameter array that RWS uses to construct the URI
  * @param {Number} rowIndex The index of the row in the data array - use this to map the error back - note, we can't use other things because we don't have unique IDs for new rows
  *
  * @return {Object} The promise of the request
  */
		var doRequest = function doRequest(method, rowData, params, rowIndex, newData) {
			var deferred = that.$q.defer();
			that.RESTWrapperService[method]({
				rowData: rowData
			}, params, '', null, null, {}).then(function (response) {
				if (angular.isDefined(newData.rowId.value)) {
					_.each(that.json.rows, function (row) {
						if (row.rowData[0].value === newData.rowId.value) {
							row.rowData = newData;
						}
					});
				} else {
					that.json.rows.push({ rowData: rowData });
				}
				deferred.resolve(response);
			}, function (response) {
				if (!angular.isDefined(errors[newData.rowId.value])) {
					errors[newData.rowId] = [];
				}
				_.each(response.data.errors, function (error) {
					errors[newData.rowId].push(error.errorContext);
				});
				deferred.reject(response);
			});
			return deferred.promise;
		};

		_.each(modifiedData, function (row, rowIndex) {
			var diff = _.find(row, function (col) {
				return col.value !== col.originalValue;
			});
			if (angular.isDefined(diff)) {
				var rowData = [];
				var rowId = row.rowId;
				_.each(row, function (col, key) {
					var found = _.find(metadata, function (meta) {
						return key === meta.link;
					});

					if (angular.isDefined(found) || key === 'rowId' && rowId.value) {
						rowData.push({
							__self__: col.__self__,
							value: col.value
						});
					}
				});

				if (!rowId.value) {
					promises.push(doRequest('post', rowData, that.json.route, rowIndex, row));
				} else {
					promises.push(doRequest('put', rowData, rowData[0].link.substring(1), rowIndex, row));
				}
				// console.log(rowData);
			}
		});

		// saveData is complete when all the promises have been fulfilled
		// copied from AffectedItemsController
		this.RESTWrapperService.allSettled(promises).then(function (results) {
			var succeededRequests = _.filter(results, function (result) {
				return result.success === true;
			});

			// Fulfill if all requests succeeded, reject if some did not
			if (succeededRequests.length === promises.length) {
				saveAllDeferred.resolve(results);
			} else {
				saveAllDeferred.reject(results);
			}
			that.EventService.send('grid:validationsErrors:present', errors);
		});

		return saveAllDeferred.promise;
	};
};

angular.module('plm360.models').factory('GridData', ['RESTWrapperService', 'EventService', 'ModelsManager', '$q', function (RESTWrapperService, EventService, ModelsManager, $q) {
	var models = {};
	GridData.prototype.RESTWrapperService = RESTWrapperService;
	GridData.prototype.EventService = EventService;
	GridData.prototype.$q = $q;

	// get
	EventService.listen('grid:*:get', function (event, params, requestParams) {
		var model = models[params] || new GridData();
		models[params] = model;
		model.fetch(params, requestParams).then(function (obj) {
			EventService.send('grid:' + event.split(':')[1] + ':done', obj);
		});
	});

	// save
	EventService.listen('grid:*:saveGrid', function (event, obj, _, tableData, workspaceId, itemId, gridFields) {
		obj.save(_, tableData, workspaceId, itemId, gridFields).then(function () {
			ModelsManager.resetModels();
			EventService.send('grid:' + event.split(':')[1] + ':saveDone', true, obj);
		}, function () {
			EventService.send('grid:' + event.split(':')[1] + ':saveDone', false, obj);
		});
	});
	return GridData;
}]);
//# sourceMappingURL=GridData.js.map
