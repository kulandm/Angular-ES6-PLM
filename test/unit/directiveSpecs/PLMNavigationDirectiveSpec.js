'use strict';

describe('PLMNavigationDirective', function () {

	var el;

	beforeEach(module('plm360', 'plm360.mockData', 'plmTemplates'));

	beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_, _MockLocalizationData_) {
		var scope = _$rootScope_.$new();
		var $rootScope = _$rootScope_;

		_$httpBackend_.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json')
			.respond(_MockLocalizationData_);

		$rootScope.bundle = _MockLocalizationData_;

		_$httpBackend_.when('GET', '/api/rest/v1/token').respond(200, '');

		el = angular.element('<plm-navigation layout="column" id="sidenav"></plm-navigation>');
		_$compile_(el)(scope);

		scope.$apply();
	}));

	describe('[Template structure]', function () {

		var sidenav;

		beforeEach(function () {
			var elements = el.children();
			sidenav = angular.element(elements[0]);
		});

		it('the id of the md-sidenav element should be sidenav-content', function () {
			expect(sidenav.attr('id')).to.equal('sidenav-content');
		});

		it('should have the correct structure of the sidenav', function () {
			var elements = sidenav.children();
			expect(angular.element(elements[0]).attr('id')).to.equal('fusion-lifecycle-logo');
			expect(angular.element(elements[1]).attr('id')).to.equal('sidenav-menu');
			expect(angular.element(elements[2]).attr('id')).to.equal('sidenav-menu-back');
			expect(angular.element(elements[3]).attr('id')).to.equal('workspaces-sidenav-submenu');
			expect(angular.element(elements[4]).attr('id')).to.equal('help-sidenav-submenu');
		});

	});

});
