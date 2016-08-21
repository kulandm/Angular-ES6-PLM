'use strict';

describe('Reports', function () {
	var app;
	var data = {
		id:1,
		name:'name',
		dashboardReportList: {
			list: [
				{id:1, position: 4},
				{id:2, position: 9},
				{id:3, position: 1},
				{id:4, position: 2},
				{id:5, position: 3},
				{id:6, position: 5},
				{id:64, position: 6},
				{id:7, position: 7},
				{id:8, position: 8}
			]
		}
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new Reports();
		app.json = data;
		if (app.json.dashboardReportList === null) {
			app.json.dashboardReportList = {
				list: []
			};
		}
		app.json.dashboardReportList.list = _.sortBy(app.json.dashboardReportList.list, function (report) {
			return report.position;
		});
		angular.forEach(app.json.dashboardReportList.list, function (report, ind) {
			report.link = 'api/rest/v1/reports/' + report.id + '/chart.json';
		});
	});

	describe('constructor', function () {
		it('should add empty list', function () {
			var emptyApp = new Reports();
			emptyApp.json = {
				dashboardReportList: {
					list: []
				}
			};
			expect(emptyApp.json.dashboardReportList.list).to.deep.equal([]);
		});
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getReportLink', function () {
		it('should return the link of the report if ID is valid', function () {
			expect(app.getReportLink(1)).to.not.equal('');
		});
		it('should return empty string if report ID is invalid', function () {
			expect(app.getReportLink(1234)).to.equal('');
		});
	});

	describe('getDashboardReports',function () {
		it('should return the first nine of reports', function () {
			expect(app.getDashboardReports()).to.deep.equal(data.dashboardReportList.list);
		});
	});
});
