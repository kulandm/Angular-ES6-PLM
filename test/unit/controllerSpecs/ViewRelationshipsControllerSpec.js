'use strict';

describe('ViewRelationshipsController', function () {
	let ctrl;
	let eventService;
	let flyoutService;
	let notificationService;
	let mockItemObj;
	let mockRelatedItemsObj;
	let mockLocationObj;
	let mockModelsManager;
	let PermissionService;
	let urnParser;
	let q;
	let restWrapperService;
	let timeout;
	let $state = {
		params: {
			workspaceId: 42,
			itemId: 42
		},
		href: function () {},
		is: function () {},
		go: function () {}
	};

	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/EventService.js',
		'com/autodesk/flyout.js',
		'plm360',
		'plm360.models',
		'plm360.mockData',
		'plm360.mockObjects',
		'plm360.permissions'
	));

	// Setup for each test
	beforeEach(function () {
		inject(function (
			$controller,
			$httpBackend,
			$rootScope,
			MockModelsManager,
			EventService,
			PLMPermissions,
			MockViewRelationshipsData,
			MockItemObj,
			MockRelatedItemsObj,
			MockLocationObj,
			MockLocalizationData,
			uiGridConstants,
			FlyoutService,
			RESTWrapperService,
			NotificationService,
			_PermissionService_,
			UrnParser,
			$q,
			$timeout,
			_
		) {
			$rootScope.bundle = MockLocalizationData;
			timeout = $timeout;
			q = $q;
			eventService = EventService;
			flyoutService = FlyoutService;
			notificationService = NotificationService;
			restWrapperService = RESTWrapperService;
			PermissionService = _PermissionService_;
			urnParser = UrnParser;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.expect('GET', 'build/components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');
			$httpBackend.expect('GET', 'build/components/notification/notification.html').respond(200, '');

			mockItemObj = new MockItemObj();
			mockRelatedItemsObj = new MockRelatedItemsObj();
			mockModelsManager = new MockModelsManager();
			mockLocationObj = new MockLocationObj();

			mockLocationObj.search.returns({
				itemId: '42',
				tab: '',
				view: '',
				mode: ''
			});

			mockRelatedItemsObj.getFullList.returns(_.map(MockViewRelationshipsData, function (item) {
				return {
					json: item
				};
			}));

			// Setup any stubs and spies before the controller is created
			sinon.stub(PermissionService, 'checkPermissionByItem');
			PermissionService.checkPermissionByItem.returns(q.when());

			ctrl = $controller('ViewRelationshipsController', {
				$scope: $rootScope.$new(),
				$rootScope: $rootScope,
				$state: $state,
				$stateParams: $state.params,
				$location: mockLocationObj,
				ModelsManager: mockModelsManager,
				EventService: eventService,
				NotificationService: notificationService,
				PLMPermissions: PLMPermissions,
				PermissionService: PermissionService,
				uiGridConstants: uiGridConstants,
				FlyoutService: flyoutService,
				_: _
			});
		});
	});

	describe('item listener', function () {
		it('checks whether the user has edit permission before parsing the data', function () {
			PermissionService.checkPermissionByItem.returns(q.when(true));
			ctrl.gridApiInterface = {
				core: {
					notifyDataChange: function () {}
				},
				grid: {
					columns: [{hideColumn: sinon.spy()}]
				}
			};

			expect(ctrl.hasEditPermission).to.be.undefined;
			expect(mockModelsManager.getRelatedItems.callCount).to.equal(0);

			eventService.send('itemInstance:42:done', mockItemObj);
			timeout.flush();

			expect(ctrl.hasEditPermission).not.to.be.undefined;
			expect(mockModelsManager.getRelatedItems.callCount).to.equal(1);
		});

		it('redirects to item details view when there is no view relationships permission', function () {
			PermissionService.checkPermissionByItem.returns(q.when(false));
			sinon.spy($state, 'go');

			eventService.send('itemInstance:42:done', mockItemObj);
			timeout.flush();

			expect($state.go).to.have.been.calledWith('details');
		});

		it('displays enabled checkboxes if there is delete or edit affected items permission', function () {
			PermissionService.checkPermissionByItem.onCall(0).returns(q.when(true));
			PermissionService.checkPermissionByItem.onCall(1).returns(q.when(true));
			PermissionService.checkPermissionByItem.onCall(2).returns(q.when(false));
			PermissionService.checkPermissionByItem.onCall(3).returns(q.when(true));
			PermissionService.checkPermissionByItem.returns(q.when(true));

			eventService.send('itemInstance:42:done', mockItemObj);
			timeout.flush();

			expect(ctrl.hasActionPermission).to.be.true;
			expect(ctrl.disableSelection).to.be.false;
		});

		it('displays disabled checkboxes if there is only add but no delete or edit affected items permission', function () {
			PermissionService.checkPermissionByItem.onCall(0).returns(q.when(false));
			PermissionService.checkPermissionByItem.onCall(1).returns(q.when(false));
			PermissionService.checkPermissionByItem.onCall(2).returns(q.when(true));
			PermissionService.checkPermissionByItem.onCall(3).returns(q.when(false));
			PermissionService.checkPermissionByItem.returns(q.when(true));

			eventService.send('itemInstance:42:done', mockItemObj);
			timeout.flush();

			expect(ctrl.hasActionPermission).to.be.true;
			expect(ctrl.disableSelection).to.be.true;
		});

		it('hides checkboxes if there is no add or delete or edit affected items permission', function () {
			PermissionService.checkPermissionByItem.onCall(0).returns(q.when(false));
			PermissionService.checkPermissionByItem.onCall(1).returns(q.when(false));
			PermissionService.checkPermissionByItem.onCall(2).returns(q.when(false));
			PermissionService.checkPermissionByItem.onCall(3).returns(q.when(false));
			PermissionService.checkPermissionByItem.returns(q.when(true));

			eventService.send('itemInstance:42:done', mockItemObj);
			timeout.flush();

			expect(ctrl.hasActionPermission).to.be.false;
			expect(ctrl.disableSelection).to.be.true;
		});
	});

	describe('related items listener', function () {
		it('populates tableData with existing related items and newly added items', function () {
			sinon.stub(ctrl, 'parseRelatedItems');
			ctrl.parseRelatedItems.returns([1, 2, 3]);

			mockLocationObj.search.returns({
				mode: 'edit'
			});

			let stubAddedItem = {
				id: -1
			};

			$state.params.addedItems = [
				{ref: stubAddedItem},
				{ref: stubAddedItem}
			];

			eventService.send('relatedItems:42:done', mockRelatedItemsObj);

			expect(ctrl.parseRelatedItems).to.have.been.calledTwice;
			expect(ctrl.parseRelatedItems).to.have.been.calledWith([stubAddedItem, stubAddedItem], true);
			expect(ctrl.parseRelatedItems).to.have.been.calledWith(mockRelatedItemsObj.getFullList());
			expect(ctrl.tableData.rows.length).to.equal(6);
		});

		it('populates tableData with existing related items when there are no added items', function () {
			sinon.stub(ctrl, 'parseRelatedItems');
			ctrl.parseRelatedItems.returns([1, 2, 3]);

			mockLocationObj.search.returns({
				mode: 'view'
			});

			eventService.send('relatedItems:42:done', mockRelatedItemsObj);

			expect(ctrl.parseRelatedItems).to.have.been.calledOnce;
			expect(ctrl.parseRelatedItems).to.have.been.calledWith(mockRelatedItemsObj.getFullList());
			expect(ctrl.tableData.rows.length).to.equal(3);
		});
	});

	describe('linked items listener', function () {
		it('gets the items again', function () {
			eventService.send('itemInstance:42:associationComplete');

			expect(mockModelsManager.getRelatedItems).to.have.been.calledWith('42');
		});
	});

	it('displays the appropriate columns in VIEW mode', function () {
		expect(ctrl.tableData.columns.length).to.equal(7);
		expect(ctrl.tableData.columns[2].displayName).to.equal('Item Descriptor');
		expect(ctrl.tableData.columns[3].displayName).to.equal('Workspace');
		expect(ctrl.tableData.columns[4].displayName).to.equal('Current State');
		expect(ctrl.tableData.columns[5].displayName).to.equal('Direction Type');
		expect(ctrl.tableData.columns[6].displayName).to.equal('Description');
	});

	it('parses the data', function () {
		eventService.send('relatedItems:42:done', mockRelatedItemsObj);
		expect(ctrl.tableData.rows.length).to.equal(3);

		// Check that the item contains a href
		expect(ctrl.tableData.rows[0].item).to.include.keys('href');
	});

	it('navigates to item details page of the related item when clicked', function () {
		sinon.spy($state, 'href');

		eventService.send('relatedItems:42:done', mockRelatedItemsObj);
		timeout.flush();

		expect($state.href).to.have.been.calledWith('details');
	});

	it('sets row state to waiting during save process', function () {
		eventService.send('relatedItems:42:done', mockRelatedItemsObj);

		let deferredObj = q.defer();
		mockRelatedItemsObj.save.returns(deferredObj.promise);

		ctrl.triggerSave();

		expect(ctrl.tableData.rows[0].waiting).to.be.true;

		deferredObj.resolve({});

		timeout(function () {
			expect(ctrl.tableData.rows[0].waiting).to.be.false;
		}, 0);
	});

	it('saves the item after editing', function () {
		eventService.send('relatedItems:42:done', mockRelatedItemsObj);
		expect(ctrl.tableData.rows[0].descriptionField.value).to.equal('');

		let deferredObj = q.defer();
		ctrl.tableData.rows[0].descriptionField.value = 'description';
		mockRelatedItemsObj.save.returns(deferredObj.promise);

		ctrl.triggerSave();
		deferredObj.resolve({});

		eventService.send('relatedItems:42:saveDone', {
			isSaved: true,
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		});
		expect(ctrl.tableData.rows[0].descriptionField.value).to.equal('description');
	});

	it('adds a success notification after successfully saving an item', function () {
		sinon.spy(notificationService, 'addNotification');
		eventService.send('relatedItems:42:done', mockRelatedItemsObj);

		let deferredObj = q.defer();
		mockRelatedItemsObj.save.returns(deferredObj.promise);

		ctrl.triggerSave();
		deferredObj.resolve({});

		eventService.send('relatedItems:42:saveDone', {
			isSaved: true,
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		});
		expect(notificationService.addNotification).to.be.calledOnce;
	});

	it('adds an error notification after failing to save an item', function () {
		sinon.spy(notificationService, 'addNotification');
		eventService.send('relatedItems:42:done', mockRelatedItemsObj);

		let deferredObj = q.defer();
		mockRelatedItemsObj.save.returns(deferredObj.promise);

		ctrl.triggerSave();
		deferredObj.resolve({});

		eventService.send('relatedItems:42:saveDone', {
			isSaved: false,
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		});
		expect(notificationService.addNotification).to.be.calledOnce;
	});

	it('shows a flyout when triggerAdd is called', function () {
		let stub = sinon.stub(flyoutService, 'open');
		ctrl.permittedWSPromises = [{}, false, {}];

		let promise = ctrl.triggerAdd({currentTarget: null});

		return promise.then(function () {
			expect(stub).to.be.calledOnce;
			expect(stub.getCall(0).args[0]).to.include.keys(
				'templateUrl',
				'anchorEl',
				'flyoutClass',
				'placement',
				'controller',
				'scope'
			);
		});
	});

	it('adds a success notification after successfully adding an item', function () {
		sinon.spy(notificationService, 'addNotification');
		sinon.stub(eventService, 'send');
		sinon.stub(eventService, 'listen');

		mockLocationObj.search.returns({
			itemId: '424',
			tab: '',
			view: '',
			mode: ''
		});

		eventService.listen.onCall(0).yields('relatedItems:424:saveDone', {
			isSaved: true,
			isAdded: true,
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		});

		ctrl.triggerSave();
		expect(notificationService.addNotification).to.be.calledOnce;
	});

	it('adds an error notification after failing to add an item', function () {
		sinon.spy(notificationService, 'addNotification');
		sinon.stub(eventService, 'send');
		sinon.stub(eventService, 'listen');

		mockLocationObj.search.returns({
			itemId: '424',
			tab: '',
			view: '',
			mode: ''
		});

		eventService.listen.onCall(0).yields('relatedItems:424:saveDone', {
			isSaved: false,
			isAdded: true,
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		});

		ctrl.triggerSave();
		expect(notificationService.addNotification).to.be.calledOnce;
	});

	it('adds a success notification after successfully removing an item', function () {
		sinon.spy(notificationService, 'addNotification');
		sinon.stub(eventService, 'send');
		sinon.stub(eventService, 'listen');

		ctrl.selectedRelationships = [{
			__self__: '/api/v3/workspaces/47/items/424',
			title: 'test',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		}];

		eventService.listen.onCall(0).yields('relatedItem:424:deleteDone', true);

		ctrl.removeSelectedItems();
		expect(notificationService.addNotification).to.be.calledOnce;
	});

	it('adds an error notification after failing to remove an item', function () {
		sinon.spy(notificationService, 'addNotification');
		sinon.stub(eventService, 'send');
		sinon.stub(eventService, 'listen');

		ctrl.selectedRelationships = [{
			__self__: '/api/v3/workspaces/47/items/424',
			title: 'test',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.47.424'
		}];

		eventService.listen.onCall(0).yields('relatedItem:424:deleteDone', false);

		ctrl.removeSelectedItems();
		expect(notificationService.addNotification).to.be.calledOnce;
	});
});
