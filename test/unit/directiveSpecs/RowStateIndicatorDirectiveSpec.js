'use strict';

describe('RowStateIndicatorDirective', function () {
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

		scope.row = sinon.stub({
			isRowDirty: function () {},
			isRowInvalid: function () {}
		});

		scope.row.isRowDirty.returns(false);
		scope.row.isRowInvalid.returns(false);

		$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json')
			.respond(MockLocalizationData);

		el = angular.element('<row-state-indicator is-dirty="row.isRowDirty()" is-invalid="row.isRowInvalid()"></row-state-indicator>');
		compile(el)(scope);
		scope.$apply();
	}));

	it('binds the data', function () {
		var rowStateContainerEl = el.children().eq(0);

		expect(rowStateContainerEl.hasClass('invalid')).to.be.false;
		expect(rowStateContainerEl.hasClass('dirty')).to.be.false;

		scope.row.isRowDirty.returns(true);
		scope.$digest();

		expect(rowStateContainerEl.hasClass('invalid')).to.be.false;
		expect(rowStateContainerEl.hasClass('dirty')).to.be.true;

		scope.row.isRowInvalid.returns(true);
		scope.$digest();

		expect(rowStateContainerEl.hasClass('invalid')).to.be.true;
		expect(rowStateContainerEl.hasClass('dirty')).to.be.true;
	});
});

