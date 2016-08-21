'use strict';

/**
  * The basic unit tests for create workspace item. This should be updated when we will support full create.
  */
describe('CommandBarController', function () {
	var controller = null;
	var $controllerConstructor = null;
	var rootScope = null;
	var scope = null;
	var eventService = null;

	beforeEach(module(
		'plm360'
	));

	beforeEach(function () {
		inject(function (
			$controller,
			$rootScope,
			$httpBackend,
			EventService
		) {
			rootScope = $rootScope;
			$controllerConstructor = $controller;
			eventService = EventService;

			scope = rootScope.$new();
			scope.parentCtrl = {};

			$httpBackend.expect('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');

			controller = $controllerConstructor('CommandBarController', {
				$scope: scope,
				EventService: eventService
			});
		});
	});

	it('sends the \'triggerSummary\' event', function () {
		var spy = sinon.spy(eventService, 'send');

		controller.triggerSummary();

		expect(spy.called).to.be.true;
	});
});
