'use strict';

describe('BulkEditController', () => {

	let scope = null;
	let rootScope = null;
	let mdDialogInstance = null;
	let eventService = null;
	let mockModelsManager = null;
	let mockWorkflowObj = null;
	let mockWorkflowStateObj = null;
	let ctrl = null;
	let urnParser = null;
	let mockViewAffectedItemsData = null;
	let mockItemObjList = null;
	let mockUserObj = null;
	let mdDateLocale = null;

	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData'
	));

	beforeEach(module(function ($urlRouterProvider, $provide) {
		// Because of ui-router, we have to use httpBackend to ignore the request for mainDashboard, plm-wrapper etc calls.
		// This is not at all related to controller unit testing. One way of handling this, is to use 'deferIntercept' method
		// of the $urlRouterProvide.
		$urlRouterProvider.deferIntercept();

		// Angular-locale-bundle will call to fetch localization bundle json. This is also not related to controller testing,
		// as we will add mockLocalizationData to the rootScope (if needed). Stubbing out these services will allow us not
		// to use httpBackend server at all.
		$provide.value('localeBundleFactory', sinon.stub({}));
		$provide.value('LocalizationService', sinon.stub({}));
	}));

	beforeEach(inject((
		$controller,
		$rootScope,
		$stateParams,
		$mdDialog,
		$mdDateLocale,
		MockUserObj,
		EventService,
		MockModelsManager,
		MockItemObj,
		MockWorkflowObj,
		MockAffectedItemObj,
		MockAffectedItemsObj,
		MockLocalizationData,
		MockViewAffectedItemsData,
		MockWorkflowStateObj,
		UrnParser
	) => {
		scope = $rootScope.$new();
		rootScope = $rootScope;
		eventService = EventService;
		urnParser = UrnParser;
		mockViewAffectedItemsData = MockViewAffectedItemsData;
		mockWorkflowObj = new MockWorkflowObj();
		mockUserObj = new MockUserObj();
		mdDialogInstance = $mdDialog;
		mdDateLocale = $mdDateLocale;

		rootScope.bundle = MockLocalizationData;

		mockModelsManager = new MockModelsManager();
		mockWorkflowStateObj = new MockWorkflowStateObj();

		mockItemObjList = [new MockItemObj(), new MockItemObj(), new MockItemObj()];

		mockViewAffectedItemsData = _.map(mockViewAffectedItemsData, (affectedItem) => {
			var mockAffectedItem = new MockAffectedItemObj(affectedItem);
			mockAffectedItem.json = affectedItem;
			mockAffectedItem.getObject.returns(affectedItem);
			mockAffectedItem.getItemUrn.returns(affectedItem.urn);
			return mockAffectedItem;
		});

		mockItemObjList[0].getLifecycleState.returns({
			link: '/api/v3/workflows/9223372036854775807/states/2',
			title: 'Production',
			urn: 'urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1002.9223372036854775807.2'});
		mockItemObjList[1].getLifecycleState.returns({
			link: '/api/v3/workflows/9223372036854775807/states/0',
			title: 'Unreleased',
			urn: 'urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1002.9223372036854775807.0'});
		mockItemObjList[2].getLifecycleState.returns({
			link: '/api/v3/workflows/9223372036854775807/states/2',
			title: 'Production',
			urn: 'urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1002.9223372036854775807.2'});

		ctrl = $controller('BulkEditController', {
			$scope: scope,
			$rootScope: rootScope,
			ModelsManager: mockModelsManager,
			EventService: eventService,
			workspaceObj: mockWorkflowObj,
			UrnParser: urnParser,
			selectedItems: mockViewAffectedItemsData,
			$mdDialog: mdDialogInstance
		});

		_.each(mockViewAffectedItemsData, (affectedItem, index) => {
			let itemURN = urnParser.encode(affectedItem.getItemUrn());
			eventService.send(`itemInstance:${itemURN}:done`, mockItemObjList[index]);
		});
		scope.$digest();

		mockWorkflowStateObj.getFullList.returns({useEffectivity: true});
		eventService.send('itemState:2:done', mockWorkflowStateObj);
		eventService.send('itemTransitions:2:done', {
			transitions: [{
				name: 'Production Revision',
				__self__: 'link to production revision'
			}, {
				name: 'Obsolete'
			}]
		});

		mockWorkflowStateObj.getFullList.returns({useEffectivity: false});
		eventService.send('itemState:0:done', mockWorkflowStateObj);
		eventService.send('itemTransitions:0:done', {transitions: []});
	}));

	after(function () {
		scope = null;
		rootScope = null;
		mdDialogInstance = null;
		eventService = null;
		mockModelsManager = null;
		mockWorkflowObj = null;
		mockWorkflowStateObj = null;
		ctrl = null;
		urnParser = null;
		mockViewAffectedItemsData = null;
		mockItemObjList = null;
	});

	it('checks the items promise list', () => {
		expect(ctrl.stateLifecycle[0].transitions[0].name).to.equal('Production Revision');
		expect(ctrl.stateLifecycle[0].transitions[1].name).to.equal('Obsolete');
		expect(ctrl.stateLifecycle[1].transitions).to.be.empty;
	});

	it('should retrieve items by state urn', () => {
		let affectedItems = ctrl.getAffectedItemsByState('urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1002.9223372036854775807.2');
		expect(affectedItems.length).to.be.equal(2);

		affectedItems = ctrl.getAffectedItemsByState('urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1002.9223372036854775807.0');
		expect(affectedItems.length).to.be.equal(1);
	});

	it('should update selected items', () => {
		expect(ctrl.stateLifecycle[0].value.link).to.be.undefined;
		ctrl.stateLifecycle[0].value = ctrl.stateLifecycle[0].transitions[0];

		let spy = sinon.spy(mdDialogInstance, 'hide');

		ctrl.updateBulkTransition();

		expect(spy).to.be.called;
		let updatedAffectedItems = spy.args[0][0];
		expect(updatedAffectedItems).to.have.length(2);
	});

	it('checks the format date function', () => {
		eventService.send('currentUser:currentUser:done', mockUserObj);
		expect(mdDateLocale.formatDate(new Date(2016, 9, 1))).to.equal('10/1/2016');
	});
});
