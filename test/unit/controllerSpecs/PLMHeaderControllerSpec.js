'use strict';

/**
  * The basic unit tests for plmHeaderController.
  */
describe('PLMHeaderController', function () {

	var $controllerConstructor = null;
	var $scope = null;
	var $rootScope = null;
	var $location = null;
	var $window = null;
	var eventService = null;
	var mockState = null;
	var mockModelsManager = null;
	var ctrl = null;

	beforeEach(module(
		'plm360',
		'plm360.plmHeader',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(function () {
		inject(function (
			$controller,
			_$window_,
			_$rootScope_,
			_$location_,
			EventService,
			MockModelsManager,
			MockStateObj,
			MockLocalizationData
		) {
			$controllerConstructor = $controller;
			$scope = _$rootScope_.$new();
			$rootScope = _$rootScope_;
			$rootScope.bundle = MockLocalizationData;
			$location = _$location_;
			$window = _$window_;
			mockModelsManager = new MockModelsManager();
			mockState = new MockStateObj();
			eventService = EventService;
		});
	});

	describe('Add Item page settings', function () {

		beforeEach(function () {
			$location.path('/app/workspaces/999/addItem');
		});

		it('should set the variable related to the add item page accordingly', function () {
			ctrl = $controllerConstructor('PLMHeaderController', {
				$scope: $scope,
				$rootScope: $rootScope,
				$window: $window,
				ModelsManager: mockModelsManager,
				$location: $location
			});
			eventService.send('contentLoad:done');

			expect($scope.isAddItemPage).to.be.true;
		});
	});

});
