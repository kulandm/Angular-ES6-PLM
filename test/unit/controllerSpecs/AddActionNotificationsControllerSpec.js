System.get('com/autodesk/filters.js');

'use strict';
describe.skip('AddActionNotificationsController', function () {

	var $controllerConstructor, $q, scope, eventService, mockModelsManager, mockItemObj, mockRelatedWorkspacesObj, mockRESTWrapperService, $timeout, ctrl;

	var modalScope, modalController, modalClosed;

	beforeEach(module('com/autodesk/UnderscoreService.js','com/autodesk/EventService.js','plm360', 'plm360.permissions', 'plm360.models','com/autodesk/filters.js','plm360.mockObjects','plm360.mockData','plmTemplates'));

	/**
	 * Setup for each test cases
	 */
	beforeEach(function () {

		inject(function ($controller, $rootScope, _$q_, _$timeout_, _, $filter, $httpBackend, EventService, MockModelsManager, MockItemObj, MockLocalizationData, MockRelatedWorkspaces, MockRESTWrapperService, MockRelatedWorkspacesObj) {

			// get angular dependencies
			$q = _$q_;
			scope = $rootScope;
			$controllerConstructor = $controller;
			$timeout = _$timeout_;
			eventService = EventService;

			// get mock objectrs dependencies
			mockModelsManager = new MockModelsManager();
			mockItemObj = new MockItemObj();
			mockRelatedWorkspacesObj = new MockRelatedWorkspacesObj();
			mockRESTWrapperService = new MockRESTWrapperService();

			mockRelatedWorkspacesObj.getFullList.returns(MockRelatedWorkspaces);

			// setup mock http backend
			$httpBackend.expect('GET', 'templates/appHeader.html').respond(200, '');
			$httpBackend.expect('GET', 'templates/mainDashboard.html').respond(200, '');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);

			$rootScope.bundle = MockLocalizationData;

			// initialization
			modalClosed = false;
			var actionNotificationObj = new ActionNotifications();
			ctrl = $controllerConstructor('ViewActionNotificationsController', {
				$scope: scope,
				$mdDialog: {
					show: function () {
						modalClosed = false;
					}
				},
				ModelsManager: mockModelsManager,
				$stateParams: {
					itemId: 100
				},
				$q: $q,
				EventService: eventService
			});

			modalController = $controllerConstructor('AddActionNotificationsController', {
				$scope: modalScope = scope.$new(),
				$mdDialog: {
					hide: function () {
						modalClosed = true;
					}
				},
				RelatedWorkspacesObj: mockRelatedWorkspacesObj,
				ModelsManager: mockModelsManager,
				$stateParams: {
					workspaceId: 1,
					itemId: 100
				},
				PLMPermissions: {},
				$q: $q
			});

			ActionNotification.prototype.RESTWrapperService = mockRESTWrapperService;
		});
	});

	describe('create new item', function () {
		it('opens create modal', function () {
			modalClosed = true;
			expect(modalClosed).to.be.true;
			ctrl.triggerAdd();
			expect(modalClosed).to.be.false;
		});

		it('saves action notification', function () {
			expect(modalClosed).to.be.false;

			var mockItem = sinon.stub({
				actionNotificationItem: function () {},
				workspaceObj: {
					getId: function () {}
				}
			});
			mockItem.actionNotificationItem.returns($q.when({}));

			eventService.send('itemInstance:100:actionNotificationDone', mockItem);
			scope.$digest();

			mockModelsManager.getItem.returns($q.when({
				actionNotificationItem: function () {
					return $q.when({});
				},
				getAffectedItemsAssociationLink: function () {}
			}));
			// TODO: Need To Revisit and implement the test after Edit is implemented as both will be sharing same mocks
			// expect(ctrl.actionNotificationList).to.have.length(0);
			// modalController.saveAndClose();

			eventService.send('itemInstance:1234:actionNotificationComplete', true);
			scope.$digest();
			// expect(ctrl.actionNotificationList).to.have.length(1);
		});

		it('closes modal', function () {
			expect(modalClosed).to.be.false;
			modalController.close();
			expect(modalClosed).to.be.true;
		});
	});
});
