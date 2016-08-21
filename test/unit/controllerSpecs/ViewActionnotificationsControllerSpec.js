// 'use strict';

// describe('ViewActionNotificationsController',function () {

// 	var mockActionNotificationsData = [{
// 		getNotificationId: function () {
// 			return 1;
// 		},
// 		getEventType: function () {
// 			return 'Event Type';
// 		},
// 		getNotificationEvent: function () {
// 			return 'Notification Event';
// 		},
// 		getNotificationGroups: function () {
// 			return 'Notification Groups';
// 		},
// 		getNotificationUsers: function () {
// 			return 'Notification Users';
// 		}
// 	}];

// 	var $controllerConstructor, mockModelsManager, mockLocalizationData, mockActionNotificationsObj, scope, stateParams, q, d, timeout, underscore, win, filter, httpBackend, eventService;

// 	beforeEach(module('plm360','plm360.mockObjects','plm360.mockData','plm360.models','plm360.filters','plm360.permissions'));

// 	/**
// 	 * Setup for each test cases
// 	 */
// 	beforeEach(function () {

// 		mockActionNotificationsObj = sinon.stub({
// 			getFullList: function () {}
// 		});

// 		/**
// 		 * Inject the angular dependencies of the controller
// 		 * Save these in variables so they can be used in the test cases
// 		 */

// 		inject(function ($controller, $rootScope, $stateParams, $q, $timeout, _, $filter, $httpBackend, EventService, MockModelsManager, MockLocalizationData){
// 			q = $q;
// 			timeout = $timeout;
// 			scope = $rootScope;
// 			stateParams = $stateParams;
// 			underscore = _;
// 			$controllerConstructor = $controller;
// 			filter = $filter;
// 			httpBackend = $httpBackend;
// 			eventService = EventService;

// 			// get mock data dependencies
// 			mockLocalizationData = MockLocalizationData;

// 			mockModelsManager = new MockModelsManager();

// 			$httpBackend.when('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
// 			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
// 			httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(mockLocalizationData);
// 		});
// 	});

// 	describe('init',function () {
// 		it('should initialize the controller', function () {

// 			// setup mock service
// 			d = q.defer();

// 			/**
// 			 * Initialize the controller with our parameters of dependencies
// 			 */
// 			var ctrl = $controllerConstructor('ViewActionNotificationsController',{
// 				$scope:scope,
// 				$filter:filter,
// 				$stateParams: {
// 					workspaceId: 1,
// 					itemId: 2
// 				},
// 				EventService: eventService,
// 				ModelsManager: mockModelsManager,
// 				_:underscore

// 			});

// 			mockActionNotificationsObj.getFullList.returns(mockActionNotificationsData);
// 			scope.bundle = mockLocalizationData;
// 			/**
// 			 * Call the function we want to test, in this case, the init function
// 			 */
// 			scope.init();

// 			timeout(function () {
// 				d.resolve({});
// 			}, 5000);
// 			timeout.flush();

// 			eventService.send('actionNotification:2:done', mockActionNotificationsObj);
// 			scope.$digest();

// 			/**
// 			 * The actual test cases for the function (init)
// 			 */
// 			expect(scope.tableData).to.have.length(1);
// 			expect(scope.tableData[0].eventType).to.equal('Event Type');
// 			expect(scope.tableData[0].notificationEvent).to.equal('Notification Event');
// 			expect(scope.tableData[0].groupToNotify).to.equal('Notification Groups');
// 			expect(scope.tableData[0].userToNotify).to.equal('Notification Users');
// 		});
// 	});
// });
