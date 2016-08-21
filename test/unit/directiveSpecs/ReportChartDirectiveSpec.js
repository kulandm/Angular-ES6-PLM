'use strict';

describe('ReportChartDirective', function () {
	var el, scope;

	beforeEach(module('plm360', 'plm360.reportChart','plmTemplates','com/autodesk/localization.js'));

	beforeEach(inject(function ($httpBackend) {
		$httpBackend.whenGET('lib/plm-localization/dist/translations/localizationBundleGeneral.json').respond({});
	}));

	beforeEach(inject(function ($compile, $rootScope) {
		scope = $rootScope;

		scope.chartId = 12344;
		scope.chartType = 'COLUMN';
		scope.chartName = 'test chart';

		// create and compile directive
		el = angular.element('<report-chart id="chartId" chart-type="chartType" chart-name="chartName"></report-chart>');
		$compile(el)(scope);
		scope.$apply();
	}));

	it('should create report', function () {
		// Add unit reports unit tests here.
	});
});

