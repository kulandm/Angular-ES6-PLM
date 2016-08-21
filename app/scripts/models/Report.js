'use strict';

/**
 * @ngdoc object
 * @name Models.Report
 *
 * @description This class wraps a Report payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Report = function (json) {
	this.json = json;
};

Report.prototype = {
	/**
	 * @ngdoc method
	 * @name Models.Report#fetch
	 * @methodOf Models.Report
	 * @description Make a call to fetch raw data
	 *
	 * @param {String} link The URL to use for fetching the data
	 *
	 * @returns {Object} An object representation of the formatted data
	 */
	fetch: function (link) {
		var that = this;
		return this.RESTWrapperService.get(link, null, null, null).then(function (payload) {
			that.json = payload;
			return that;
		});
	},

	/**
	 * @ngdoc method
	 * @name Models.Report#getFullList
	 * @methodOf Models.Report
	 * @description Returns the full list of data
	 *
	 * @returns {Array} The full list of data
	 */
	getFullList: function () {
		return angular.copy(this.json);
	},

	/**
	 * @ngdoc method
	 * @name Models.Report#getType
	 * @methodOf Models.Report
	 * @description Returns type of chart
	 *
	 * @returns {String} The type of chart
	 */
	getType: function () {
		return this.json.reportDefinition.reportChart.type;
	},

	/**
	 * @ngdoc method
	 * @name Models.Report#getTitle
	 * @methodOf Models.Report
	 * @description Returns title of chart
	 *
	 * @returns {String} The title of chart
	 */
	getTitle: function () {
		return this.json.reportDefinition.reportChart.title;
	}

	/**
	 * @ngdoc method
	 * @name Models.Report#getItemLink
	 * @methodOf Models.Report
	 * @description Returns the REST api link for the item given the id
	 *
	 * @param {Number} reportId The ID of the report to be retrieved
	 *
	 * @returns {String} The string representation of the REST link
	 */
	// getReportLink: function (reportId) {
	// 	var ret = '';
	// 	angular.forEach(this.json.reportDefinitionList.list, function (report) {
	// 		if (reportId == report.id) {
	// 			ret = report.link;
	// 		}
	// 	});
	// 	return ret;
	// },

	/**
	 * @ngdoc method
	 * @name Models.Report#setItemObj
	 * @methodOf Models.Report
	 * @description Attaches the report object to the tree
	 *
	 * @param {Number} reportId The ID of the report to be stored
	 * @param {Object} The report object
	 */
	// setReportObj: function (reportId, obj) {
	// 	angular.forEach(this.json.reportDefinitionList.list, function (report) {
	// 		if (reportId == report.id) {
	// 			report.obj = obj;
	// 		}
	// 	});
	// }
};

angular.module('plm360.models').factory('Report', [
	'RESTWrapperService',
	'EventService',
	function (RESTWrapperService, EventService) {
		var models = {};
		Report.prototype.RESTWrapperService = RESTWrapperService;
		EventService.listen('report:*:get', function (event, params) {
			var model = models[params] || new Report();
			models[params] = model;
			var reportId = event.split(':')[1];

			model.fetch(params).then(function (obj) {
				EventService.send('report:' + reportId + ':done', obj);
			}, function (obj) {
				EventService.send('report:' + reportId + ':rejected', obj);
			});
		});
		return Report;
	}
]);
