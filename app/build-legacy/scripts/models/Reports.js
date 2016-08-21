'use strict';

/**
 * @ngdoc object
 * @name Models.Reports
 *
 * @description This class wraps a list of Reports payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Reports = function Reports() {
	var that = this;
};

Reports.prototype = {
	/**
  * @ngdoc method
  * @name Models.Reports#fetch
  * @methodOf Models.Reports
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
			if (that.json.dashboardReportList === null) {
				that.json.dashboardReportList = {
					list: []
				};
			}
			that.json.dashboardReportList.list = _.sortBy(that.json.dashboardReportList.list, function (report) {
				return report.position;
			});
			angular.forEach(that.json.dashboardReportList.list, function (report, ind) {
				report.link = 'api/rest/v1/reports/' + report.id + '/chart.json';
			});
			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.Reports#getFullList
  * @methodOf Models.Reports
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.Reports#getDashboardReports
  * @methodOf Models.Reports
  * @description Returns the list of reports configured for dashboard.
  *
  * @returns {Array} The list of reports
  */
	getDashboardReports: function getDashboardReports() {
		var list = angular.copy(this.json).dashboardReportList.list;
		return list;
	},

	/**
  * @ngdoc method
  * @name Models.Reports#getItemLink
  * @methodOf Models.Reports
  * @description Returns the REST api link for the item given the id
  *
  * @param {Number} reportId The ID of the report to be retrieved
  *
  * @returns {String} The string representation of the REST link
  */
	getReportLink: function getReportLink(reportId) {
		var ret = '';
		angular.forEach(this.json.dashboardReportList.list, function (report) {
			if (reportId === report.id) {
				ret = report.link;
			}
		});
		return ret;
	},

	/**
  * @ngdoc method
  * @name Models.Reports#setItemObj
  * @methodOf Models.Reports
  * @description Attaches the report object to the tree
  *
  * @param {Number} reportId The ID of the report to be stored
  * @param {Object} obj The report object
  */
	setReportObj: function setReportObj(reportId, obj) {
		angular.forEach(this.json.dashboardReportList.list, function (report) {
			if (reportId === report.id) {
				report.obj = obj;
			}
		});
	}
};

angular.module('plm360.models').factory('Reports', ['RESTWrapperService', 'EventService', function (RESTWrapperService, EventService) {
	var models = {};
	Reports.prototype.RESTWrapperService = RESTWrapperService;
	EventService.listen('reports:*:get', function (event, params) {
		var model = models[params] || new Reports();
		models[params] = model;
		model.fetch(params).then(function (obj) {
			EventService.send('reports:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Reports;
}]);
//# sourceMappingURL=Reports.js.map
