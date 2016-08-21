System.get('com/autodesk/filters.js');

describe('ViewAffectedItemsController', () => {

	let $controller = null;
	let $state = null;
	let $scope = null;
	let $rootScope = null;
	let $stateParams = null;
	let $mdDialog = null;
	let $timeout = null;
	let $q = null;
	let EventService = null;
	let NotificationService = null;
	let PermissionService = null;
	let mockFlyoutService = null;
	let mockModelsManager = null;
	let mockWorkspaceObj = null;
	let mockItemObj = null;
	let mockUserObj = null;
	let mockAffectedItemObj = null;
	let mockAffectedItemsObj = null;
	let mockAffectedItemsMetaObj = null;
	let mockUserProfileData = null;
	let mockViewAffectedItemsData = null;
	let mockViewAffectedItemsMetaData = null;
	let mockViewAffectedItemTransitionsData = null;
	let mockWorkspaceItemLinkedItemsData = null;
	let MockWorkspaceObj = null;

	let urnParser = null;
	let ctrl = null;
	let flyoutOpened = false;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
		'plm360',
		'plm360.permissions',
		'com/autodesk/filters.js',
		'plm360.models',
		'plm360.mockObjects',
		'plm360.mockData',
		'plmTemplates'
	));

	/**
	 * Setup for each test cases
	 */
	beforeEach(() => {
		inject((
			$httpBackend,
			_$controller_,
			_$rootScope_,
			_$state_,
			_$stateParams_,
			_$mdDialog_,
			_$timeout_,
			_$q_,
			_EventService_,
			_NotificationService_,
			_PermissionService_,
			MockModelsManager,
			_MockWorkspaceObj_,
			MockItemObj,
			MockUserObj,
			MockAffectedItemObj,
			MockAffectedItemsObj,
			MockAffectedItemsMetaObj,
			MockUserProfile,
			MockViewAffectedItemsData,
			MockViewAffectedItemsMetaData,
			MockViewAffectedItemTransitionsData,
			MockLocalizationData,
			UrnParser
		) => {
			$controller = _$controller_;
			$scope = _$rootScope_.$new();
			$rootScope = _$rootScope_;
			$state = _$state_;
			$stateParams = _$stateParams_;
			$mdDialog = _$mdDialog_;
			$timeout = _$timeout_;
			$q = _$q_;
			EventService = _EventService_;
			NotificationService = _NotificationService_;
			PermissionService = _PermissionService_;
			urnParser = UrnParser;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/dist/translations/localizationBundleGeneral.json').respond(MockLocalizationData);
			$httpBackend.when('GET', 'lib/plm-notification/dist/notification.html')
				.respond(200);
			$httpBackend.expect('GET', 'components/plmWrapper/plmWrapper.html').respond(200, '');
			$httpBackend.expect('GET', 'components/mainDashboard/mainDashboard.html').respond(200, '');

			$rootScope.bundle = MockLocalizationData;

			MockWorkspaceObj = _MockWorkspaceObj_;
			mockModelsManager = new MockModelsManager();
			mockWorkspaceObj = new MockWorkspaceObj();
			mockItemObj = new MockItemObj();
			mockItemObj.workspaceObj = new MockWorkspaceObj();
			mockUserObj = new MockUserObj();
			mockAffectedItemObj = new MockAffectedItemObj();
			mockAffectedItemsObj = new MockAffectedItemsObj();
			mockAffectedItemsMetaObj = new MockAffectedItemsMetaObj();
			mockUserProfileData = MockUserProfile;
			mockViewAffectedItemsData = MockViewAffectedItemsData;
			mockViewAffectedItemsMetaData = MockViewAffectedItemsMetaData;
			mockViewAffectedItemTransitionsData = MockViewAffectedItemTransitionsData;

			$stateParams = {
				workspaceId: 1,
				itemId: '100',
				tab: '',
				view: '',
				mode: 'view'
			};

			mockViewAffectedItemsData = _.map(mockViewAffectedItemsData, affectedItem => {
				let mockAffectedItem = new MockAffectedItemObj(affectedItem);
				mockAffectedItem.json = affectedItem;
				mockAffectedItem.getObject.returns(affectedItem);
				mockAffectedItem.getLinkedFieldId.returns('EMAIL');
				mockAffectedItem.getLinkedFieldDataTypeId.returns('10');
				mockAffectedItem.getId.returns('5763');
				mockAffectedItem.getItemUrn.returns('urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763');
				mockAffectedItem.getWorkspaceId.returns('59');
				return mockAffectedItem;
			});

			mockItemObj.workspaceObj.getTypeId.returns('7'); // Revisioning Workspace Type
			mockItemObj.getFullList.returns({itemLocked: false});
			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
			mockAffectedItemsObj.getFullList.returns(mockViewAffectedItemsData);
			mockAffectedItemsMetaObj.getFullList.returns(mockViewAffectedItemsMetaData);
			mockAffectedItemsMetaObj.getFieldId.returns('EMAIL');
			mockAffectedItemsMetaObj.getDataTypeId.returns('18');
		});

		mockFlyoutService = {
			open: () => {
				flyoutOpened = true;
				return {
					closed: $q.when(flyoutOpened = false)
				};
			}
		};

		sinon.spy($state, 'go');

		/**
		 * Initialize the controller with our parameters of dependencies
		 */
		ctrl = $controller('ViewAffectedItemsController', {
			$scope: $scope,
			$rootScope: $rootScope,
			$state: $state,
			$stateParams: $stateParams,
			ModelsManager: mockModelsManager,
			EventService: EventService,
			FlyoutService: mockFlyoutService,
			PermissionService: PermissionService,
			PLMPermissions: {},
			$mdDialog: $mdDialog,
			NotificationService: NotificationService,
			Workspace: MockWorkspaceObj
		});

		$scope.$digest();
		ctrl.Workspace.setPicklistHook.returns($q.when(''));
	});

	it('initializes the affected items table with the default columns', () => {
		expect(ctrl.tableColumns.length).to.equal(8);
		expect(ctrl.tableColumns[4].visible).to.be.false;
	});

	it('initializes the affected items table with revisioning columns, if any', () => {
		EventService.send('itemInstance:100:done', mockItemObj);

		expect(ctrl.tableColumns.length).to.equal(8);
	});

	it('initializes the affected items table with custom columns, if any', () => {
		EventService.send('itemInstance:100:done', mockItemObj);
		EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
		$rootScope.$digest();
		expect(ctrl.tableColumns.length).to.equal(14);
	});

	it('initializes the affected items table with data, including custom column data', () => {
		EventService.send('itemInstance:100:done', mockItemObj);
		EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
		$rootScope.$digest();
		EventService.send('affectedItems:100:done', mockAffectedItemsObj);
		expect(ctrl.tableData.length).to.equal(3);
		expect(ctrl.tableData[0].item.value).to.equal('001-300-A1 - GT216-300-A1 DT ROHS 969FCBGA 29x29 [REV:w]');
		expect(ctrl.tableData[0].item.href).to.contain('workspaces/59/');
		expect(ctrl.tableData[0].item.href).to.contain('itemId=urn');
		expect(ctrl.tableData[0].lifecycle.value.title).to.equal('Production Revision');
		expect(ctrl.tableData[0].EMAIL.value).to.equal('coolestemail@cool.com');
		expect(ctrl.tableData[0].from).to.equal('');
		expect(ctrl.tableData[1].from).to.equal('0');
		expect(ctrl.tableData[2].from).to.equal('E');
	});

	it('sets \'isRadioButtonInGrid\' to true for radio fields', () => {
		mockAffectedItemsObj.getFullList.returns([mockViewAffectedItemsData[1]]);

		EventService.send('itemInstance:100:done', mockItemObj);
		EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
		$rootScope.$digest();
		EventService.send('affectedItems:100:done', mockAffectedItemsObj);
		// Due to how the mocking of data is done, the custom field ID is
		// named 'EMAIL', but we are mocking a 'RADIO' field here.
		expect(ctrl.tableData[0].EMAIL.fieldMetadata.isRadioButtonInGrid).to.be.true;
	});

	it('makes use of FieldData to build fields', () => {
		sinon.spy(ctrl.FieldData, 'fromFieldData');

		EventService.send('itemInstance:100:done', mockItemObj);
		EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
		$rootScope.$digest();
		EventService.send('affectedItems:100:done', mockAffectedItemsObj);

		expect(ctrl.FieldData.fromFieldData).to.be.called;
		expect(ctrl.FieldData.fromFieldData.callCount).to.be.above(1);
		ctrl.FieldData.fromFieldData.reset();
	});

	it('builds the default fields with the correct field types', () => {
		EventService.send('itemInstance:100:done', mockItemObj);
		EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
		$rootScope.$digest();
		EventService.send('affectedItems:100:done', mockAffectedItemsObj);

		expect(ctrl.tableData[0].lifecycle.metadata.dataTypeId).to.equal(700);
		expect(ctrl.tableData[0].effectivity.metadata.dataTypeId).to.equal(3);
		expect(ctrl.tableData[0].to.metadata.dataTypeId).to.equal(4);
	});

	describe('permissions', () => {
		it('redirects to item details view when there is no view affected items permission', () => {
			sinon.stub(PermissionService, 'checkPermissionByItem');
			PermissionService.checkPermissionByItem.returns($q.when(false));

			EventService.send('itemInstance:100:done', mockItemObj);
			$timeout.flush();

			expect($state.go).to.have.been.calledWith('details');
		});

		it('displays enabled checkboxes if there is delete or edit affected items permission', () => {
			sinon.stub(PermissionService, 'checkPermissionByItem');
			PermissionService.checkPermissionByItem.onCall(0).returns($q.when(true));
			PermissionService.checkPermissionByItem.onCall(1).returns($q.when(false));
			PermissionService.checkPermissionByItem.onCall(2).returns($q.when(true));
			PermissionService.checkPermissionByItem.returns($q.when(true));

			EventService.send('itemInstance:100:done', mockItemObj);
			$timeout.flush();

			expect(ctrl.hasActionPermission).to.be.true;
			expect(ctrl.hasAddPermission).to.be.false;
			expect(ctrl.disableSelection).to.be.false;
		});

		it('displays disabled checkboxes if there is only add but no delete or edit affected items permission', () => {
			sinon.stub(PermissionService, 'checkPermissionByItem');
			PermissionService.checkPermissionByItem.onCall(0).returns($q.when(false));
			PermissionService.checkPermissionByItem.onCall(1).returns($q.when(true));
			PermissionService.checkPermissionByItem.onCall(2).returns($q.when(false));
			PermissionService.checkPermissionByItem.returns($q.when(true));

			EventService.send('itemInstance:100:done', mockItemObj);
			$timeout.flush();

			expect(ctrl.hasActionPermission).to.be.true;
			expect(ctrl.hasAddPermission).to.be.true;
			expect(ctrl.disableSelection).to.be.true;
		});

		it('hides checkboxes if there is no add or delete or edit affected items permission', () => {
			sinon.stub(PermissionService, 'checkPermissionByItem');
			PermissionService.checkPermissionByItem.onCall(0).returns($q.when(false));
			PermissionService.checkPermissionByItem.onCall(1).returns($q.when(false));
			PermissionService.checkPermissionByItem.onCall(2).returns($q.when(false));
			PermissionService.checkPermissionByItem.returns($q.when(true));

			EventService.send('itemInstance:100:done', mockItemObj);
			$timeout.flush();

			expect(ctrl.hasActionPermission).to.be.false;
			expect(ctrl.hasAddPermission).to.be.false;
			expect(ctrl.disableSelection).to.be.true;
		});
	});

	describe('performs operations on selected affected items', () => {
		it('selects one item and deselects the same item', () => {
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			let rowObj = {
				entity: {
					affectedItemObj: {
						json: {
							__self__: '/api/v3/workspaces/59/items/6881/affected-items/5763'
						}
					},
					selection: {
						inlineMenu: true,
						urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763',
						title: 'Title'
					}
				},
				isSelected: true
			};

			// Select an item
			expect(ctrl.selectRow(rowObj)).to.equal(1);
			expect(ctrl.selectedItems.length).to.equal(1);

			// Deselect the same item
			rowObj.isSelected = false;
			expect(ctrl.selectRow(rowObj)).to.equal(0);
			expect(ctrl.selectedItems.length).to.equal(0);
		});

		it('checks if the navigation guard is activated', () => {
			sinon.stub(ctrl, 'isViewState').returns(false);
			let emitSpy = sinon.spy(ctrl.$scope, '$emit');
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			$rootScope.$digest();
			expect(emitSpy).to.be.calledOnce;
		});

		it('selects one item and removes the selected item', () => {
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			let rowObj = {
				entity: {
					affectedItemObj: {
						json: {
							__self__: '/api/v3/workspaces/59/items/6881/affected-items/5763'
						}
					},
					selection: {
						inlineMenu: true,
						urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763',
						title: 'Title'
					}
				},
				isSelected: true
			};

			// Select an item
			expect(ctrl.selectRow(rowObj)).to.equal(1);
			expect(ctrl.selectedItems.length).to.equal(1);

			// Delete the selected item
			ctrl.removeSelectedItems();
			EventService.send('affectedItem:5763:deleteDone', mockViewAffectedItemsData[0]);
			$scope.$digest();

			expect(ctrl.selectedItems.length).to.equal(0);
		});

		it('adds a success notification after successfully removing an item', () => {
			sinon.spy(NotificationService, 'addNotification');

			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			let rowObj = {
				entity: {
					affectedItemObj: {
						json: {
							__self__: '/api/v3/workspaces/59/items/6881/affected-items/5763'
						}
					},
					selection: {
						inlineMenu: true,
						urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763',
						title: 'Title'
					}
				},
				isSelected: true
			};

			// Select and delete a single item
			ctrl.selectRow(rowObj);
			ctrl.removeSelectedItems();

			EventService.send('affectedItem:5763:deleteDone', mockViewAffectedItemsData[0]);
			expect(NotificationService.addNotification).to.be.calledOnce;
		});
	});

	describe('in edit mode', () => {
		beforeEach(() => {
			$stateParams = {
				workspaceId: 1,
				itemId: '100',
				tab: '',
				view: '',
				mode: 'edit'
			};

			ctrl = $controller('ViewAffectedItemsController', {
				$scope: $scope,
				$rootScope: $rootScope,
				$stateParams: $stateParams,
				$mdDialog: $mdDialog,
				ModelsManager: mockModelsManager,
				EventService: EventService,
				FlyoutService: mockFlyoutService,
				NotificationService: NotificationService,
				PLMPermissions: {}
			});

			sinon.stub(ctrl, 'isTableRowDirty');
		});

		it('is in the edit mode', () => {
			expect(ctrl.isViewState()).to.be.false;
		});

		it('checks if the \'To\' column is editable', () => {
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);
			EventService.send('affectedItemTransitions:5763:done', mockViewAffectedItemTransitionsData);
			$timeout.flush();

			expect(ctrl.tableData[0].to.editable).to.be.true;
		});

		it('triggers cancel if no item is modified though save is clicked', () => {
			ctrl.isTableRowDirty.returns(false);
			sinon.stub(ctrl, 'triggerCancel');

			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			ctrl.triggerSave();
			expect(ctrl.triggerCancel).to.be.calledOnce;
		});

		it('saves an item after editing', () => {
			ctrl.isTableRowDirty.onFirstCall().returns(true);
			ctrl.isTableRowDirty.onSecondCall().returns(false);
			ctrl.isTableRowDirty.onThirdCall().returns(false);
			let deferred = $q.defer();

			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			// Edit the EMAIL value and trigger save
			ctrl.tableData[0].EMAIL.value = 'awesomeemail@awesome.com';
			mockViewAffectedItemsData[0].save.returns(deferred.promise);
			ctrl.triggerSave();
			deferred.resolve();

			EventService.send('affectedItem:5763:saveDone', true);
			expect(ctrl.tableData[0].EMAIL.value).to.equal('awesomeemail@awesome.com');
		});

		it('adds a success notification after successfully saving an item', () => {
			ctrl.isTableRowDirty.onFirstCall().returns(true);
			ctrl.isTableRowDirty.onSecondCall().returns(false);
			ctrl.isTableRowDirty.onThirdCall().returns(false);
			sinon.spy(NotificationService, 'addNotification');
			let deferred = $q.defer();

			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			ctrl.tableData[0].EMAIL.value = 'awesomeemail@awesome.com';
			mockViewAffectedItemsData[0].save.returns(deferred.promise);
			ctrl.triggerSave();
			deferred.resolve();

			EventService.send('affectedItem:5763:saveDone', true);
			expect(NotificationService.addNotification).to.be.calledOnce;
		});

		it('adds an error notification after failing to save an item', () => {
			ctrl.isTableRowDirty.onFirstCall().returns(true);
			ctrl.isTableRowDirty.onSecondCall().returns(false);
			ctrl.isTableRowDirty.onThirdCall().returns(false);
			sinon.spy(NotificationService, 'addNotification');
			let deferred = $q.defer();

			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);

			ctrl.tableData[0].EMAIL.value = 'awesomeemail@awesome.com';
			mockViewAffectedItemsData[0].save.returns(deferred.promise);
			ctrl.triggerSave();
			deferred.resolve();

			EventService.send('affectedItem:5763:saveDone', false, {data: []});
			expect(NotificationService.addNotification).to.be.calledOnce;
		});

		it('should not save data with client side validation errors', () => {
			sinon.spy(NotificationService, 'addNotification');

			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);
			ctrl.tableData[0].EMAIL.fieldMetadata.validationErrors = [{message: 'this is required.'}];
			expect(ctrl.hasInvalidItems()).to.be.true;
			expect(ctrl.tableData[0].EMAIL.hasClientSideErrors).to.be.true;
			expect(ctrl.isTableRowInvalid(ctrl.tableData[0])).to.be.true;

			ctrl.triggerSave();
			expect(NotificationService.addNotification).to.be.calledOnce;
		});

		it('should quality table row as invalid based on field validation errors', () => {
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);
			ctrl.tableData[0].EMAIL.fieldMetadata.validationErrors = [{message: 'this is required.'}];
			expect(ctrl.hasValidationErrors(ctrl.tableData[0])).to.be.true;
			expect(ctrl.tableData[0].EMAIL.hasClientSideErrors).to.be.true;
			expect(ctrl.isTableRowInvalid(ctrl.tableData[0])).to.be.true;
		});

		it('checks that the vaue of \'Manual To\' is empty when changing the lifecycle', () => {
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);
			ctrl.tableData[0].lifecycle.value.overrideTargetRevision = 'MANUAL';
			ctrl.tableData[0].lifecycle.value.incrementRelease = false;
			ctrl.tableData[0].to.value = 'dummy value';
			ctrl.tableData[0].lifecycle.lifecycleChanged();
			expect(ctrl.tableData[0].to.value).to.equal(null);
		});

		it('checks that the value of \'To\' is set properly to blank when updateAffectedItemRow is called', () => {
			EventService.send('itemInstance:100:done', mockItemObj);
			EventService.send('affectedItemsMeta:100:done', mockAffectedItemsMetaObj);
			$rootScope.$digest();
			EventService.send('affectedItems:100:done', mockAffectedItemsObj);
			ctrl.tableData[0].lifecycle = false;
			ctrl.tableData[0].effectivity = false;
			ctrl.tableData[0].to.isEditToBlank = true;
			ctrl.tableData[0].to.value = null;
			ctrl.tableData[0].to.isDirty = () => true;
			mockAffectedItemsObj = sinon.stub({
				setTo: function (arg) {}
			});
			ctrl.updateAffectedItemRow(ctrl.tableData[0], mockAffectedItemsObj);
			expect(mockAffectedItemsObj.setTo.calledOnce).to.be.true;
			expect(mockAffectedItemsObj.setTo.calledWith(null)).to.be.true;
		});
	});

	describe('related BOM items listener', () => {
		it('hides the mdDialog after associating the added items', () => {
			let stub = sinon.stub(ctrl, 'associateAddedItems');
			let promise = Promise.resolve([false]);
			stub.returns(promise);
			sinon.spy($mdDialog, 'hide');

			EventService.send('relatedBomItems:added', []);

			return promise.then(() => {
				expect($mdDialog.hide).to.have.been.calledOnce;
			});
		});

		it('shows notification after associating the added items', () => {
			sinon.stub(NotificationService, 'showNotifications');
			let stub = sinon.stub(ctrl, 'associateAddedItems');
			let promise = Promise.resolve([false]);
			stub.returns(promise);
			sinon.spy($mdDialog, 'hide');

			EventService.send('relatedBomItems:added', []);

			return promise.then(() => {
				expect(NotificationService.showNotifications).to.have.been.calledOnce;
			});
		});

		it('sends the associationComplete event', () => {
			let stub = sinon.stub(ctrl, 'associateAddedItems');
			let promise = Promise.resolve([true, false]);
			stub.returns(promise);
			sinon.spy(EventService, 'send');

			EventService.send('relatedBomItems:added', []);

			return promise.then(() => {
				expect(EventService.send).to.have.been.calledWith('itemInstance:100:associationComplete');
			});
		});
	});

	describe('associateAddedItems', () => {
		it('sends the associateAffectedItem event and resolves with its results', () => {
			sinon.stub(EventService, 'send');
			sinon.stub(EventService, 'listen');

			EventService.listen.onCall(0).yields(null, true);
			EventService.listen.onCall(1).yields(null, false);

			let items = [
				{
					ref: {
						getItemLink: () => {},
						getItemId: () => {
							return 42;
						},
						getItemTitle: () => {},
						getItemUrn: () => {
							return 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763';
						}
					}
				},
				{
					ref: {
						getItemLink: () => {},
						getItemId: () => {
							return 43;
						},
						getItemTitle: () => {},
						getItemUrn: () => {
							return 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763';
						}
					}
				}
			];

			ctrl.associateAddedItems(items).then((result) => {
				expect(EventService.send).to.have.been.calledWith('itemInstance:42:associateAffectedItem');
				expect(EventService.send).to.have.been.calledWith('itemInstance:43:associateAffectedItem');

				expect(result).to.deep.equal([true, false]);
			});
			$rootScope.$digest();
		});

		it('adds a success notification after successfully adding an item', () => {
			sinon.spy(NotificationService, 'addNotification');
			sinon.stub(EventService, 'send');
			sinon.stub(EventService, 'listen');

			EventService.listen.onCall(0).yields('itemInstance:42:associationDone', true);

			let item = [{
				ref: {
					getItemLink: () => {},
					getItemId: () => {
						return 42;
					},
					getItemTitle: () => {},
					getItemUrn: () => {
						return 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763';
					}
				}
			}];

			ctrl.associateAddedItems(item);

			expect(NotificationService.addNotification).to.be.calledOnce;
		});

		it('adds an error notification after failing to add an item', () => {
			sinon.spy(NotificationService, 'addNotification');
			sinon.stub(EventService, 'send');
			sinon.stub(EventService, 'listen');

			EventService.listen.onCall(0).yields('itemInstance:42:associationDone', false);

			let item = [{
				ref: {
					getItemLink: () => {},
					getItemId: () => 42,
					getItemTitle: () => {},
					getItemUrn: () =>
						'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763'
				}
			}];

			ctrl.associateAddedItems(item);

			expect(NotificationService.addNotification).to.be.calledOnce;
		});
	});

	describe('bulk edit', () => {
		it('checks if the bulk edit icon is enabled properly upon passing proper data', () => {
			ctrl.selectedItems = [
				{type: 'REVISION_CONTROLLED'},
				{type: 'REVISION_CONTROLLED'},
				{type: 'REVISION_CONTROLLED'}
			];

			let rowObj = {
				entity: {
					affectedItemObj: {
						json: {
							__self__: '/api/v3/workspaces/59/items/6881/affected-items/5763'
						}
					},
					selection: {
						inlineMenu: true,
						urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763',
						title: 'Title'
					}
				},
				isSelected: true
			};

			ctrl.selectRow(rowObj);
			expect(ctrl.isBulkEditEnabled).to.be.true;
		});

		it('checks if the bulk edit icon is enabled properly upon passing proper data', () => {
			ctrl.selectedItems = [
				{type: 'NON_REVISION_CONTROLLED'},
				{type: 'NON_REVISION_CONTROLLED'},
				{type: 'NON_REVISION_CONTROLLED'}
			];

			let rowObj = {
				entity: {
					affectedItemObj: {
						json: {
							__self__: '/api/v3/workspaces/59/items/6881/affected-items/5763'
						}
					},
					selection: {
						inlineMenu: true,
						urn: 'urn:adsk.plm:tenant.workspace.item.view.affected-item:DEVINDMACHINE1002.59.5763',
						title: 'Title'
					}
				},
				isSelected: true
			};

			ctrl.selectRow(rowObj);
			expect(ctrl.isBulkEditEnabled).to.be.false;
		});

		it('checks if the bulk edit icon is enabled for revisioning workspace', () => {
			mockItemObj.workspaceObj.getTypeId.returns('7'); // Revisioning Workspace Type
			EventService.send('itemInstance:100:done', mockItemObj);
			expect(ctrl.isRevisioningWorkspace).to.be.true;
		});

		it('checks if the bulk edit icon is disabled for non revisioning workspace', () => {
			mockItemObj.workspaceObj.getTypeId.returns('3'); // Some other non revisioning workspace
			EventService.send('itemInstance:100:done', mockItemObj);
			expect(ctrl.isRevisioningWorkspace).to.be.false;
		});
	});

	describe('buildLifecycleField', () => {
		beforeEach(() => {
			sinon.spy(ctrl, 'buildLifecycleField');
			sinon.stub(ctrl.FieldData, 'fromFieldData');
		});

		it('uses FieldData to create the field', () => {
			let affectedItem = {
				urn: 'urn',
				targetTransition: {}
			};

			ctrl.buildLifecycleField(affectedItem);
			expect(ctrl.FieldData.fromFieldData).to.be.calledOnce;
			expect(ctrl.FieldData.fromFieldData.calledWith(700)).to.be.true;
		});
	});
});
