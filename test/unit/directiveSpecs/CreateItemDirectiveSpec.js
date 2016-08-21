'use strict';

describe('CreateItemDirective', function () {

	var el;
	var scope;

	beforeEach(module(
		'plm360',
		'plm360.mockData',
		'plm360.mockObjects',
		'plmTemplates'
	));

	beforeEach(function () {
		inject(function (
			$compile,
			$rootScope,
			$httpBackend,
			MockWorkspaceObj,
			MockLocalizationData
		) {
			$httpBackend.whenGET('/api/rest/v1/token').respond(200, '');
			$httpBackend.whenGET('templates/appHeader.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json')
				.respond(MockLocalizationData);

			scope = $rootScope.$new();
			scope.selectedWorkspace = new MockWorkspaceObj();
			scope.allowedWorkspaceList = [scope.selectedWorkspace];

			el = angular.element('<create-item selected-workspace="selectedWorkspace" workspaces-list="allowedWorkspaceList"></create-item>');
			$compile(el)(scope);
			scope.$apply();
		});
	});

	it('has two way binding with the selected workspace of parent scope', function () {
		scope.selectedWorkspace.getId.returns('test id');

		var directiveScope = el.isolateScope();
		expect(directiveScope.selectedWorkspace.getId()).to.equal('test id');
	});
});
