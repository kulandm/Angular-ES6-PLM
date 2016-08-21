'use strict';

/**
 * Basic unit tests for add item controller. In order to properly test the functionality of add item,
 * we need to create view tests. This unit test is based on the data that contains autonumbers only.
 * It should be updated once more fields are implemented or more functionality is added to the controller.
 */
describe.skip('AddItemController', function () {

	var $controllerConstructor, scope, rootScope, state, stateParams, underscore, q;
	var NotificationService, NotificationTypes;
	var mockModelsManager, mockItemObj, mockUserObj, mockLocationObj;
	var mockViewDetailsData, mockViewDetailsFieldsData, mockUserProfileData;
	var provide, ctrl;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'plm360',
		'plm360.permissions',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(function () {

		module(function ($provide) {
			provide = $provide;
		});

		inject(function (
			$controller,
			$httpBackend,
			$rootScope,
			$state,
			$stateParams,
			$q,
			_,
			_NotificationTypes_,
			_NotificationService_,
			MockLocationObj,
			MockModelsManager,
			MockViewDetailsFieldsData,
			MockViewDetailsData,
			MockUserProfile,
			MockLocalizationData,
			MockItemObj,
			MockUserObj
		) {
			$controllerConstructor = $controller;
			scope = $rootScope.$new();
			rootScope = $rootScope;
			state = $state;
			stateParams = $stateParams;
			q = $q;
			underscore = _;
			NotificationService = _NotificationService_;
			NotificationTypes = _NotificationTypes_;

			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);

			rootScope.bundle = MockLocalizationData;

			mockModelsManager = new MockModelsManager();
			mockItemObj = new MockItemObj();
			mockUserObj = new MockUserObj();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: '100',
				tab: '',
				view: '',
				mode: ''
			});

			mockUserProfileData = MockUserProfile;
			// mockViewDetailsData = MockViewDetailsData.data;
			// mockViewDetailsFieldsData = MockViewDetailsFieldsData;

			// provide.value('ViewDetailsData', mockViewDetailsData);
			provide.value('UserProfileData', mockUserProfileData);

			stateParams = {
				workspaceId: 20,
				itemId: 100
			};

			// mockItemObj.getFullList.returns(mockViewDetailsData);
			// mockItemObj.getSections.returns(mockViewDetailsData.sections);
			// mockItemObj.getViewDetailsFieldsData.returns(q.when(mockViewDetailsFieldsData));
			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
		});

		ctrl = $controllerConstructor('AddItemController', {
			$scope: scope,
			$rootScope: rootScope,
			$state: state,
			$stateParams: stateParams,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes,
			_: underscore
		});
		// ctrl.itemDetailsData = mockViewDetailsData;
	});

	it('initializes the user and item data for the workspace', function () {
		// eventService.send('itemInstance:100:done', mockItemObj);
		// eventService.send('currentUser:currentUser:done', mockUserObj);

		// expect(ctrl.itemDetailsData).to.be.a('object');
		expect(ctrl.dateFormat).to.not.equal(null);
		expect(ctrl.dateAndHourFormat).to.equal(ctrl.dateFormat + ' hh:mm a');
	});

	it('should be able to update changes to data set', function () {
		var flyoutServiceInitiated = false;

		ctrl = $controllerConstructor('AddItemController', {
			$scope: scope,
			$rootScope: rootScope,
			$state: state,
			$stateParams: stateParams,
			ModelsManager: mockModelsManager,
			_: underscore,
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes
		});

		// TODO: Add expectation once updateChanges method is implemented
		// ctrl.updateChanges();
	});
});
