'use strict';

describe('ViewNamedRelationshipsController', function () {

	let ctrl;
	let $controllerConstructor;
	let $scope;
	let rootScope;
	let state;
	let stateParams;
	let mockLocationObj;
	let $mdDialog;
	let underscore;
	let mockModelsManager;
	let mockNamedRelationshipsItemObj;
	let mockNamedRelationshipsItemsObj;
	let EventService;
	let mockViewNamedRelationshipsData;
	let $q;
	let NotificationService;
	let rowObj;
	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
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
			$state,
			$stateParams,
			_$q_,
			MockLocationObj,
			_$mdDialog_,
			_,
			MockModelsManager,
			_EventService_,
			MockNamedRelationshipsItemObj,
			MockNamedRelationshipsItemsObj,
			MockLocalizationData,
			MockViewNamedRelationshipsData,
			_NotificationService_
		) {
			$controllerConstructor = $controller;
			$scope = $rootScope.$new();
			rootScope = $rootScope;
			state = $state;
			stateParams = $stateParams;
			mockLocationObj = new MockLocationObj();
			$mdDialog = _$mdDialog_;
			underscore = _;
			mockModelsManager = new MockModelsManager();
			EventService = _EventService_;
			mockNamedRelationshipsItemsObj = new MockNamedRelationshipsItemsObj();
			mockViewNamedRelationshipsData = MockViewNamedRelationshipsData.items;
			$q = _$q_;
			NotificationService = _NotificationService_;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-notification/build/notification.html')
				.respond(200);
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);

			rootScope.bundle = MockLocalizationData;

			mockLocationObj.search.returns({
				itemId: '52',
				mode: 'view',
				relationshipKey: 'AML'
			});

			let mockData = _.map(mockViewNamedRelationshipsData, function (data) {
				let mockItem = new MockNamedRelationshipsItemObj();
				mockItem.getItemTitle.returns('683-0000-000 - SBOM PIPING Pneumatic Assembly, Project 621');
				mockItem.getWorkspaceId.returns('8');
				mockItem.getResourceId.returns('8@2725');
				mockItem.getItemDescriptorValue.returns('683-0002-000 - Pneumatic Assembly, Project 621 [REV:A]');
				mockItem.getItemUrn.returns('urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2725');
				return mockItem;
			});
			mockNamedRelationshipsItemsObj.getFullList.returns(mockData);

			ctrl = $controllerConstructor('ViewNamedRelationshipsController', {
				$scope: $scope,
				$rootScope: rootScope,
				$state : state,
				$stateParams: stateParams,
				$location: mockLocationObj,
				_ : underscore,
				ModelsManager: mockModelsManager,
				EventService: EventService
			});

			rowObj = {
				entity: {
					namedRelationshipsObj: {
						json: {
							__self__: '/api/v3/workspaces/52/items/2915/relationships/AML/linked-items/1'
						}
					},
					selection: {
						inlineMenu: true,
						urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1002.8.2725',
						title: '683-0002-000 - Pneumatic Assembly, Project 621'
					}
				},
				isSelected: true
			};

		});
	});

	describe('constructor', function () {
		it('listens for namedRelationships and parses them', function () {
			EventService.send('namedRelations:52~AML:done', mockNamedRelationshipsItemsObj);

			expect(ctrl.tableData.length).to.equal(6);
		});
	});

	describe('parseNamedRelationshipsItems', function () {
		it('adds data to table data', function () {
			ctrl.parseNamedRelationshipsItems(mockNamedRelationshipsItemsObj);

			expect(ctrl.tableData.length > 0).to.be.true;
		});

		it('has the expected Item Descriptor Value', function () {
			ctrl.parseNamedRelationshipsItems(mockNamedRelationshipsItemsObj);
			let data = mockViewNamedRelationshipsData[0];

			let expectedItemDescriptorValue = `${data.item.title} ${data.item.version}`;
			expect(ctrl.tableData[0].linkedItemDescriptor.value).to.equal(expectedItemDescriptorValue);
		});

		it('has the expected Item Descriptor HREF', function () {
			ctrl.parseNamedRelationshipsItems(mockNamedRelationshipsItemsObj);
			let data = mockViewNamedRelationshipsData[0];

			let resourceParts = data.item.link.split('/');
			let resourceId = `${resourceParts[4]}@${resourceParts[6]}`;

			let expectedItemDescriptorHref = state.href('details', {
				tab: 'details',
				view: 'full',
				mode: 'view',
				itemId: resourceId
			});
			expect(ctrl.tableData[0].linkedItemDescriptor.href).to.equal(expectedItemDescriptorHref);
		});
	});

	describe('isViewState', function () {
		it('determines if we are in view mode', function () {
			expect(ctrl.isViewState()).to.be.true;
		});
	});

	// Specs for the add linkable items feature
	describe('add linkable items', () => {
		beforeEach('stub dependencies', () => {
			sinon.stub(EventService, 'send');
			sinon.stub(EventService, 'listen');
			sinon.stub(NotificationService, 'showNotifications');
			sinon.stub(NotificationService, 'addNotification');
		});

		afterEach('restore stubs', () => {
			EventService.send.restore();
			EventService.listen.restore();
			NotificationService.showNotifications.restore();
			NotificationService.addNotification.restore();
		});

		describe('add linkable items listener', () => {
			beforeEach('stub methods', () => {
				sinon.stub(ctrl, 'associateAddedItems');
				ctrl.addFlyout = {
					close: sinon.stub(),
					cancel: sinon.stub(),
					isActive: sinon.stub()
				};
			});

			afterEach('restore stubs', () => {
				ctrl.associateAddedItems.restore();
			});

			it('associates the added items if the results are successful', () => {
				ctrl.associateAddedItems.returns($q.resolve([true, true]));
				EventService.listen.withArgs('linkableItems:added').yields(null, null);

				ctrl.registerAddLinkableItemsListeners();

				$scope.$digest();

				expect(EventService.send).to.have.been.calledWith('itemInstance:52:associationComplete');
			});

			it('does not associate the added items if the results are unsuccessful', () => {
				ctrl.associateAddedItems.returns($q.resolve([true, false]));
				EventService.listen.withArgs('linkableItems:added').yields(null, null);

				ctrl.registerAddLinkableItemsListeners();

				$scope.$digest();

				expect(EventService.send).to.not.have.been.calledWith('itemInstance:52:associationComplete');
			});

			it('closes the flyout if the results are successful', () => {
				ctrl.associateAddedItems.returns($q.resolve([true, true]));
				EventService.listen.withArgs('linkableItems:added').yields(null, null);

				ctrl.registerAddLinkableItemsListeners();

				$scope.$digest();

				expect(ctrl.addFlyout.close).to.have.been.called;
			});

			it('cancels the flyout if the results are unsuccessful', () => {
				ctrl.associateAddedItems.returns($q.resolve([false, true]));
				EventService.listen.withArgs('linkableItems:added').yields(null, null);

				ctrl.registerAddLinkableItemsListeners();

				$scope.$digest();

				expect(ctrl.addFlyout.cancel).to.have.been.called;
			});

			it('displays the notifications', () => {
				ctrl.associateAddedItems.returns($q.resolve([true, true]));
				EventService.listen.withArgs('linkableItems:added').yields(null, null);

				ctrl.registerAddLinkableItemsListeners();

				$scope.$digest();

				expect(NotificationService.showNotifications).to.have.been.called;
			});
		});

		describe('linkable items saved listener', () => {
			it('fetches the data again', () => {
				mockModelsManager.getNamedRelationships.reset();
				EventService.listen.withArgs('itemInstance:52:associationComplete').yields();

				ctrl.registerAddLinkableItemsListeners();

				expect(mockModelsManager.getNamedRelationships).to.have.been.calledOnce;
			});
		});

		describe('associateAddedItems', () => {
			let itemRef;

			beforeEach('setup mock data', () => {
				itemRef = {
					getItemId: angular.noop,
					getItemLink: angular.noop,
					getItemTitle: angular.noop
				};

				ctrl.item = {};
			});

			afterEach('remove mock data', () => {
				itemRef = null;
				ctrl.item = null;
			});

			it('associates each item in the list with the current item', () => {
				ctrl.associateAddedItems(Array(2).fill({
					ref: itemRef
				}));

				expect(EventService.send).to.have.been.calledTwice;
				expect(EventService.send.getCall(0).args[1][0])
					.to.equal(ctrl.item);
				expect(EventService.send.getCall(0).args[1][3])
					.to.equal('AML');
			});

			it('adds success notifications if the association succeeds', () => {
				EventService.listen
					.withArgs('itemInstance:undefined:associationDone')
					.yields(null, true);

				ctrl.associateAddedItems(Array(2).fill({
					ref: itemRef
				}));

				$scope.$digest();

				expect(ctrl.NotificationService.addNotification)
					.to.have.been.calledTwice;
				expect(ctrl.NotificationService.addNotification.getCall(0))
					.to.have.been.calledWith(ctrl.NotificationTypes.SUCCESS);
				expect(ctrl.NotificationService.addNotification.getCall(1))
					.to.have.been.calledWith(ctrl.NotificationTypes.SUCCESS);
			});

			it('adds failure notifications if the association fails', () => {
				EventService.listen
					.withArgs('itemInstance:undefined:associationDone')
					.yields(null, false);

				ctrl.associateAddedItems(Array(2).fill({
					ref: itemRef
				}));

				$scope.$digest();

				expect(ctrl.NotificationService.addNotification)
					.to.have.been.calledTwice;
				expect(ctrl.NotificationService.addNotification.getCall(0))
					.to.have.been.calledWith(ctrl.NotificationTypes.ERROR);
				expect(ctrl.NotificationService.addNotification.getCall(1))
					.to.have.been.calledWith(ctrl.NotificationTypes.ERROR);
			});

			it('returns a promise that resolves with a list of boolean values representing the success state', () => {
				EventService.listen
					.withArgs('itemInstance:undefined:associationDone')
					.onCall(0).yields(null, true);
				EventService.listen
					.withArgs('itemInstance:undefined:associationDone')
					.onCall(1).yields(null, false);

				let promise = ctrl.associateAddedItems(Array(2).fill({
					ref: itemRef
				}));

				expect(promise).to.eventually.deep.equal([true, false]);

				// Somehow this *has* to be after the expectation
				// I will never be able to figure out $q
				$scope.$digest();
			});
		});

		describe('triggerAdd', () => {
			beforeEach('stub dependencies', () => {
				sinon.stub(ctrl.FlyoutService, 'open');
				sinon.stub(ctrl, 'getPermittedRelatedWorkspaces');
				ctrl.getPermittedRelatedWorkspaces.returns($q.resolve());
			});

			afterEach('restore stubs', () => {
				ctrl.FlyoutService.open.restore();
				ctrl.getPermittedRelatedWorkspaces.restore();
			});

			it('gets the list of related workspaces', () => {
				ctrl.triggerAdd(new MouseEvent('click'));

				expect(ctrl.getPermittedRelatedWorkspaces)
					.to.have.been.calledOnce;
			});

			it('displays the addLinkableItems flyout', () => {
				ctrl.triggerAdd(new MouseEvent('click'));

				$scope.$digest();

				expect(ctrl.FlyoutService.open).to.have.been.calledOnce;
				expect(ctrl.FlyoutService.open.getCall(0).args[0]
					.scope.linkableItemsOptions.itemsType)
						.to.equal('namedRelationshipItems~AML');
				expect(ctrl.FlyoutService.open.getCall(0).args[0].resolve)
					.to.include.keys('relatedWorkspaces');
			});
		});
	});

	describe('triggerAdd', function () {
		beforeEach('stub dependencies', function () {
			sinon.stub(ctrl.FlyoutService, 'open');
			sinon.stub(ctrl, 'getPermittedRelatedWorkspaces');
			ctrl.getPermittedRelatedWorkspaces.returns($q.resolve());
		});

		afterEach('restore stubs', function () {
			ctrl.FlyoutService.open.restore();
			ctrl.getPermittedRelatedWorkspaces.restore();
		});

		it('gets the list of related workspaces', function () {
			ctrl.triggerAdd(new MouseEvent('click'));

			expect(ctrl.getPermittedRelatedWorkspaces).to.have.been.calledOnce;
		});

		it('displays the addLinkableItems flyout', function () {
			ctrl.triggerAdd(new MouseEvent('click'));

			$scope.$digest();

			expect(ctrl.FlyoutService.open).to.have.been.calledOnce;
			expect(ctrl.FlyoutService.open.getCall(0).args[0].scope.linkableItemsOptions.itemsType)
				.to.equal('namedRelationshipItems~AML');
			expect(ctrl.FlyoutService.open.getCall(0).args[0].resolve)
				.to.include.keys('relatedWorkspaces');
		});
	});

	describe('performs operations on selected namedRelationships items', function () {
		it('remove the selected item', function () {
			EventService.send('namedRelations:52~AML:done', mockNamedRelationshipsItemsObj);

			// Select an item
			ctrl.selectRow(rowObj);

			// Deselect the same item
			rowObj.isSelected = false;
			expect(ctrl.selectRow(rowObj)).to.equal(0);
			expect(ctrl.selectedItems.length).to.equal(0);
		});
	});

	describe('calls triggerDelete function', function () {
		it('should call removeSelectedItems', function () {
			sinon.stub($mdDialog, 'show').returns($q.resolve());
			sinon.spy(ctrl,'removeSelectedItems');

			ctrl.triggerDelete();
			$scope.$digest();
			expect(ctrl.removeSelectedItems).to.be.calledOnce;
		});
	});

	describe('performs remove operations on selected named relationships items', function () {

		it('selects one item and removes the selected item', function () {
			EventService.send('namedRelations:52~AML:done', mockNamedRelationshipsItemsObj);

			// Select and delete a single item
			ctrl.selectRow(rowObj);
			ctrl.removeSelectedItems();

			EventService.send('namedRelationshipsItem:1~AML:deleteDone', true);
			$scope.$digest();
			expect(ctrl.selectedItems.length).to.equal(0);
		});

		it('adds a success notification after successfully removing an item', function () {
			sinon.stub(NotificationService, 'addNotification');
			// Select and delete a single item
			ctrl.selectRow(rowObj);
			ctrl.removeSelectedItems();

			EventService.send('namedRelationshipsItem:1~AML:deleteDone', true);
			expect(NotificationService.addNotification).to.have.been.calledWith(ctrl.NotificationTypes.SUCCESS);
		});
	});
});
