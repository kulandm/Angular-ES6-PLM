'use strict';

describe('FeatureToggleDirective', function () {

	var el, scope, $compile;

	beforeEach(module('plm360',	'plm360.mockObjects'));

	beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {

		scope = _$rootScope_.$new();
		$compile = _$compile_;

		_$httpBackend_.when('GET', '/api/rest/v1/token').respond({});
		_$httpBackend_.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond({});
		_$httpBackend_.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond({});
		_$httpBackend_.when('GET', 'components/mainDashboard/mainDashboard.html').respond({});

		el = angular.element('<button feature-toggle="test"></button>');
		$compile(el)(scope);
		scope.$apply();
	}));

	it('should render correctly', function () {
		var directiveScope = el.isolateScope();
		expect(directiveScope.featureToggle).to.equal('test');
	});

	// TODO: Improve these tests...

});
