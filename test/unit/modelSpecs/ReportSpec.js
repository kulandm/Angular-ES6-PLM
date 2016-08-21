'use strict';

describe('Report', function () {
	var app;
	var data = {
		id:1,
		name:'name',
		reportDefinition: {
			reportChart: {
				type: 'chart type'
			}
		}
	};

	beforeEach(module('plm360.models'));

	beforeEach(function () {
		app = new Report();
		app.json = data;
	});

	describe('getFullList', function () {
		it('should return the json data', function () {
			expect(app.getFullList()).to.deep.equal(data);
		});
	});

	describe('getType', function () {
		it('should return the type of chart', function () {
			expect(app.getType()).to.equal(data.reportDefinition.reportChart.type);
		});
	});
});
