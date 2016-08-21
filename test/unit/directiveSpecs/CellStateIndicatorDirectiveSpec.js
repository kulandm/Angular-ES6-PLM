'use strict';

describe('CellStateIndicatorDirective', function () {
	var el;
	var scope;
	var compile;

	beforeEach(module('plm360', 'plm360.mockData', 'plmTemplates'));

	beforeEach(inject(function (
		$compile,
		$rootScope,
		$httpBackend,
		MockLocalizationData
	) {
		scope = $rootScope.$new();
		compile = $compile;

		scope.cell = {
			value: '',
			originalValue: '',
			errorMessage: ''
		};

		$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json')
			.respond(MockLocalizationData);

		el = angular.element('<cell-state-indicator is-dirty="{{cell.value !== cell.originalValue}}" error-message="cell.errorMessage"><div>This is transcluded</div></cell-state-indicator>');
		compile(el)(scope);
		scope.$apply();
	}));

	it('binds the data', function () {
		var cellStateContainerEl = el.children().eq(0);
		var cellIndicatorEl = cellStateContainerEl.children().eq(0).children().eq(0);

		expect(cellStateContainerEl.hasClass('invalid')).to.be.false;
		expect(cellIndicatorEl.hasClass('error')).to.be.false;
		expect(cellIndicatorEl.hasClass('dirty')).to.be.false;

		scope.cell.value = 'test';
		scope.$digest();

		expect(cellStateContainerEl.hasClass('invalid')).to.be.false;
		expect(cellIndicatorEl.hasClass('error')).to.be.false;
		expect(cellIndicatorEl.hasClass('dirty')).to.be.true;

		scope.cell.errorMessage = 'error';
		scope.$digest();

		expect(cellStateContainerEl.hasClass('invalid')).to.be.true;
		expect(cellIndicatorEl.hasClass('error')).to.be.true;
		expect(cellIndicatorEl.hasClass('dirty')).to.be.true;
	});
});

