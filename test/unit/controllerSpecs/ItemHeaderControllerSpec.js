System.get('com/autodesk/filters.js');

'use strict';

// TODO: add unit tests for revision controller workspaces
describe('ItemHeaderController', function () {
	var $controllerConstructor = null;
	var $scope = null;
	var $rootScope = null;
	var $state = null;
	var $q = null;
	var $filter = null;
	var eventService = null;
	var underscore = null;
	var controller = null;
	var mockModelsManager = null;
	var flyoutOpened = false;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'com/autodesk/components/itemHeader/itemHeader.js',
		'plm360', 'plm360.models', 'com/autodesk/filters.js', 'plm360.mockObjects', 'plm360.mockData'));

	beforeEach(function () {

		inject(function ($controller, _$rootScope_, _$state_, _$q_, _$filter_, MockModelsManager, EventService, _, MockLocalizationData) {
			$controllerConstructor = $controller;
			$scope = _$rootScope_.$new();

			$rootScope = _$rootScope_;
			$rootScope.bundle = MockLocalizationData;

			$state = $state;
			$q = _$q_;
			$filter = _$filter_;
			eventService = EventService;
			underscore = _;

			mockModelsManager = new MockModelsManager();
		});

		controller = $controllerConstructor('ItemHeaderController', {
			$scope: $scope,
			$rootScope: $rootScope,
			$state: $state,
			$stateParams: {
				workspaceId: 1,
				itemId: 10
			},
			$q: $q,
			$filter: $filter,
			ModelsManager: mockModelsManager,
			EventService: eventService,
			FlyoutService: {
				open: function () {
					flyoutOpened = true;

					return {
						closed: $q.when(flyoutOpened = false)
					};
				}
			},
			PLMPermissions: {},
			_: underscore
		});
	});

	it('should load workspace icon', function () {
		expect(controller.workspaceIcon).to.be.equal('');

		eventService.send('workspaces:1:done', {
			getSectionIcon: function () {
				return 'test icon';
			}
		});

		expect(controller.workspaceIcon).to.be.equal('test icon');
	});

	it('should load workspace item', function () {
		expect(controller.itemData).to.be.empty;

		eventService.send('itemInstance:10:done', {
			getFullList: function () {
				return {
					fullItemDescriptor: 'test - descriptor',
					itemDescriptor: ['test1', 'test2']
				};
			}
		});

		expect(controller.itemData).to.not.be.empty;
	});

	it('should load current user', function () {
		expect(controller.hasViewWorkflowPermission).to.be.true;

		eventService.send('currentUser:currentUser:done', {
			hasPermission: function () {
				return false;
			},
			getDateFormat: function () {
				return '';
			}
		});

		expect(controller.hasViewWorkflowPermission).to.be.false;
	});

	it('should BASIC_AND_WORKFLOW load data', function () {
		controller.loadData();

		eventService.send('workspaces:1:done', {
			getSectionIcon: function () {
				return 'test icon';
			}
		});

		eventService.send('itemInstance:10:done', {
			getFullList: function () {
				return {
					fullItemDescriptor: 'test - descriptor',
					itemDescriptor: ['test1', 'test2']
				};
			}
		});

		eventService.send('currentUser:currentUser:done', {
			hasPermission: function () {
				return true;
			},
			getDateFormat: function () {
				return '';
			}
		});

		eventService.send('workspaceInstance:1:done', {
			getTypeId: function () {
				return 'BASIC_AND_WORKFLOW';
			}
		});

		expect(controller.workspaceTypeId).to.be.equal('BASIC_AND_WORKFLOW');

		eventService.send('itemTransitions:10:done', {
			transitions: [{
				fromState: {
					title: 'State 1'
				}
			}]
		});

		expect(controller.currentStateName).to.be.equal('State 1');
	});

	it('should BASIC_AND_WORKFLOW workflow transition', function () {
		controller.loadData();

		eventService.send('workspaces:1:done', {
			getSectionIcon: function () {
				return 'test icon';
			}
		});

		eventService.send('itemInstance:10:done', {
			getFullList: function () {
				return {
					fullItemDescriptor: 'test - descriptor',
					itemDescriptor: ['test1', 'test2']
				};
			}
		});

		eventService.send('currentUser:currentUser:done', {
			hasPermission: function () {
				return true;
			},
			getDateFormat: function () {
				return '';
			}
		});

		eventService.send('workspaceInstance:1:done', {
			getTypeId: function () {
				return 'BASIC_AND_WORKFLOW';
			}
		});

		expect(controller.workspaceTypeId).to.be.equal('BASIC_AND_WORKFLOW');

		eventService.send('itemTransitions:10:done', {
			transitions: [{
				fromState: {
					title: 'State 1'
				}
			}]
		});

		expect(controller.currentStateName).to.be.equal('State 1');

		expect(controller.workflowFlyout.selectedTransition).to.be.null;

		controller.changeWorkflowTransition({
			id: 1,
			fromState: {
				title: 'State 1'
			}
		}, 1);

		expect(controller.workflowFlyout.selectedTransition).to.not.be.null;

		controller.cancelTransition();

		expect(controller.workflowFlyout.selectedTransition).to.be.null;
	});
});
