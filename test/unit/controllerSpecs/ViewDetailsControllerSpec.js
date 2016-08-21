'use strict';

/**
 * Basic unit tests for workspace item detail controller. In order to properly test the functionality of item details,
 * we need to create view tests. This unit test is based on the data that contains text and paragraph fields only.
 * It should be updated once more fields are implemented or more functionality is added to the controller.
 */
describe('ViewDetailsController', function () {

	var $controllerConstructor, scope, rootScope, state, stateParams, eventService, underscore, q, $mdDialog, $timeout;
	var NotificationService, NotificationTypes, PermissionService;
	var mockModelsManager, mockItemObj, mockUserObj, mockLocationObj, mockOwnerObj, mockOwnerType;
	var mockViewDetailsData, mockViewDetailsFieldsData, mockUserProfileData;
	var provide, ctrl;

	beforeEach(module(
		'com/autodesk/UnderscoreService.js',
		'com/autodesk/EventService.js',
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
			_$mdDialog_,
			_$timeout_,
			_,
			_NotificationTypes_,
			_NotificationService_,
			_PermissionService_,
			EventService,
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
			$mdDialog = _$mdDialog_;
			$timeout = _$timeout_;
			underscore = _;
			PermissionService = _PermissionService_;
			eventService = EventService;
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

			mockOwnerObj = {
				json: {
					ownership: {
						owners: [{
							detailsLink: 'somelink/ownerId',
							ownerType: 'ADDITIONAL_USER'
						}]
					}
				},
				getFullList: function () {
					return this.json;
				}
			};

			mockOwnerType = {
				PRIMARY: 'PRIMARY',
				ADDITIONAL_USER: 'ADDITIONAL_USER',
				ADDITIONAL_GROUP: 'ADDITIONAL_GROUP'
			};

			mockUserProfileData = MockUserProfile;
			mockViewDetailsData = MockViewDetailsData.data;
			mockViewDetailsFieldsData = MockViewDetailsFieldsData;

			provide.value('ViewDetailsData', mockViewDetailsData);
			provide.value('UserProfileData', mockUserProfileData);

			stateParams = {
				workspaceId: 20,
				itemId: 100
			};

			mockItemObj.getFullList.returns(mockViewDetailsData);
			mockItemObj.getSections.returns(mockViewDetailsData.sections);
			mockItemObj.getViewDetailsFieldsData.returns(q.when(mockViewDetailsFieldsData));
			mockUserObj.getDateFormat.returns(mockUserProfileData.json.dateFormat);
		});

		ctrl = $controllerConstructor('ViewDetailsController', {
			$scope: scope,
			$rootScope: rootScope,
			$state: state,
			$stateParams: stateParams,
			$location: mockLocationObj,
			ModelsManager: mockModelsManager,
			EventService: eventService,
			FlyoutService: null,
			PermissionService: PermissionService,
			PLMPermissions: {},
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes,
			_: underscore,
			OWNER_TYPE: mockOwnerType,
			$mdDialog: $mdDialog
		});
		ctrl.itemDetailsData = mockViewDetailsData;

		mockItemObj.workspaceObj = sinon.stub({
			getId: function () {},
			getSectionsMetadata: function () {},
			getTypeId: function () {},
			getSectionsMeta: function () {}
		});

		mockItemObj.workspaceObj.getSectionsMeta.returns(q.when(''));
	});

	it('initializes the item details data', function () {
		eventService.send('itemInstance:100:done', mockItemObj);
		eventService.send('currentUser:currentUser:done', mockUserObj);

		expect(ctrl.itemDetailsData).to.be.a('object');
		expect(ctrl.dateFormat).to.not.equal(null);
		expect(ctrl.dateAndHourFormat).to.equal(ctrl.dateFormat + ' hh:mm a');
	});

	it('saves data on save event', function () {
		sinon.spy(NotificationService, 'addNotification');
		sinon.spy(NotificationService, 'showNotifications');

		eventService.send('itemInstance:100:done', mockItemObj);
		eventService.send('currentUser:currentUser:done', mockUserObj);

		mockItemObj.save.returns(q.when(''));
		ctrl.triggerSave();
		eventService.send('itemInstance:100:saveCwsDone');
		eventService.send('itemInstance:100:saveDone');

		// TODO Add expectations for saved data
		expect(NotificationService.addNotification).to.be.calledOnce;
		expect(NotificationService.showNotifications).to.be.calledOnce;
	});

	it('should cancel the any modifications on cancel event', function () {
		eventService.send('itemInstance:100:done', mockItemObj);
		eventService.send('currentUser:currentUser:done', mockUserObj);

		ctrl.itemDetailsFieldsData[0].fields[0].value = 'updated value';

		expect(ctrl.itemDetailsFieldsData).to.deep.equal(mockViewDetailsData.sections);
	});

	it('should initiate flyout service successfully', function () {
		var flyoutServiceInitiated = false;

		ctrl = $controllerConstructor('ViewDetailsController', {
			$scope: scope,
			$rootScope: rootScope,
			$state: state,
			$stateParams: stateParams,
			ModelsManager: mockModelsManager,
			EventService: eventService,
			_: underscore,
			FlyoutService: {
				open: function () {
					flyoutServiceInitiated = true;
				}
			},
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes
		});

		expect(flyoutServiceInitiated).to.be.false;
		ctrl.tooltipFlyout({}, 'flyout name', 'flyout description');
		expect(flyoutServiceInitiated).to.be.true;
	});

	it('should be able to update changes to data set', function () {
		var flyoutServiceInitiated = false;

		ctrl = $controllerConstructor('ViewDetailsController', {
			$scope: scope,
			$rootScope: rootScope,
			$state: state,
			$stateParams: stateParams,
			ModelsManager: mockModelsManager,
			EventService: eventService,
			_: underscore,
			FlyoutService: {
				open: function () {
					flyoutServiceInitiated = true;
				}
			},
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes
		});

		// TODO: Add expectation once updateChanges method is implemented
		// ctrl.updateChanges();
	});

    describe('[getValueFromMetadataFields]', function () {

        var metadataFields;

        beforeEach(inject(function (MockFieldsMetadata) {
            metadataFields = MockFieldsMetadata;
        }));

        it('should return null if one of the params is ommited', function () {
            expect(ctrl.getValueFromMetadataFields('NUMBER')).to.be.null;
            expect(ctrl.getValueFromMetadataFields(null, metadataFields)).to.be.null;
        });

        it('should find the correct value for the NUMBER field', function () {
            expect(ctrl.getValueFromMetadataFields('NUMBER', metadataFields)).to.equal('test');
        });

        it('should find the correct value for the DESCRIPTION field', function () {
            expect(ctrl.getValueFromMetadataFields('DESCRIPTION', metadataFields)).to.equal('test BOM');
        });

        it('should NOT find the value for the WRONG field', function () {
            expect(ctrl.getValueFromMetadataFields('WRONG', metadataFields)).to.be.null;
        });

        it('should find correctly a null value for the PROJECT_NUMBER field', function () {
            expect(ctrl.getValueFromMetadataFields('PROJECT_NUMBER', metadataFields)).to.be.null;
        });

    });

    describe('[getValueFromMatrixMetadataFields]', function () {

        var matrixMetadataFields;

        beforeEach(inject(function (MockMatrixFieldsMetadata) {
            matrixMetadataFields = MockMatrixFieldsMetadata;
        }));

        it('should return null if one of the params is ommited', function () {
            expect(ctrl.getValueFromMatrixMetadataFields('MATRIX_DATE_FIELD')).to.be.null;
            expect(ctrl.getValueFromMatrixMetadataFields(null, matrixMetadataFields)).to.be.null;
        });

        it('should find the correct value for the MATRIX_DATE_FIELD field', function () {
            expect(ctrl.getValueFromMatrixMetadataFields('MATRIX_DATE_FIELD', matrixMetadataFields))
                .to.equal('2015-12-18T03:00:00.000Z');
        });

        it('should find the correct value for the MATRIXNUMBER field', function () {
            expect(ctrl.getValueFromMatrixMetadataFields('MATRIXNUMBER', matrixMetadataFields))
                .to.equal('sdf');
        });

        it('should find the correct value for the MATRIX_INTEGER field', function () {
            expect(ctrl.getValueFromMatrixMetadataFields('MATRIX_INTEGER', matrixMetadataFields))
                .to.equal('77');
        });

        it('should find correctly a null value for the MATRIX_DESCRIPTION field', function () {
            expect(ctrl.getValueFromMatrixMetadataFields('MATRIX_DESCRIPTION', matrixMetadataFields)).to.be.null;
        });

        it('should NOT find the value for the WRONG field', function () {
            expect(ctrl.getValueFromMatrixMetadataFields('WRONG', matrixMetadataFields)).to.be.null;
        });
    });

    describe('[getFieldIdFromUrn]', function () {

        it('should return nicely if an incorrect value is passed as urn', function () {
            expect(ctrl.getFieldIdFromUrn()).to.be.undefined;
            expect(ctrl.getFieldIdFromUrn(10)).to.be.undefined;
        });

        it('should extract correctly the field ID from the urn', function () {
            expect(ctrl.getFieldIdFromUrn('urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.1.MATRIX_INTEGER'))
                .to.equal('MATRIX_INTEGER');
            expect(ctrl.getFieldIdFromUrn('urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.1.MATRIXNUMBER'))
                .to.equal('MATRIXNUMBER');
        });
    });

	describe('[isSectionEditable]', function () {
		it('should return true if sectionLocked is false', function () {
			expect(ctrl.isSectionEditable('/api/v3/workspaces/23/items/4807/views/1/sections/32')).to.be.true;
		});
		it('should return false if sectionLocked is true', function () {
			expect(ctrl.isSectionEditable('/api/v3/workspaces/23/items/4807/views/1/sections/27')).to.be.false;
		});
	});

	describe('EditabilityWhenSectionsLocked', function () {
		it('should return false if all sectionLocked is true', function () {
			mockItemObj.getSections.returns(
				[
					{sectionLocked:true},
					{sectionLocked:true}
				]
			);
			eventService.send('itemInstance:100:done', mockItemObj);
			expect(ctrl.isEditable).to.be.false;
		});
		it('should return true if any single sectionLocked is false', function () {
			mockItemObj.getSections.returns(
				[
					{sectionLocked:true},
					{sectionLocked:false}
				]
			);
			eventService.send('itemInstance:100:done', mockItemObj);
			expect(ctrl.isEditable).to.be.true;
		});
	});

	describe('triggerChangeOwnerDialog', function () {
		it('should call mdDialog.show once', function () {
			sinon.spy($mdDialog, 'show');
			ctrl.triggerChangeOwnerDialog();
			expect($mdDialog.show).to.be.calledOnce;
		});

		it('should call state reload', function () {
			sinon.stub(state, 'reload');
			sinon.stub($mdDialog, 'show').returns(q.resolve());
			ctrl.triggerChangeOwnerDialog();
			rootScope.$digest();
			expect(state.reload).to.be.calledOnce;
		});
	});

	describe('parseOwnersDetails', function () {
		it('should retrieve id', function () {
			eventService.send('ownership:100:done', mockOwnerObj);
			ctrl.parseOwnersDetails();
			expect(ctrl.ownershipData.ownership.owners[0].id).to.equal('ownerId');
		});

		it('should retrieve owner type', function () {
			eventService.send('ownership:100:done', mockOwnerObj);
			ctrl.parseOwnersDetails();
			expect(ctrl.ownershipData.ownership.owners[0].ownerType).to.equal('ADDITIONAL_USER');
		});
	});

	describe('view owner change summary permission', function () {
		beforeEach(() => {
			sinon.stub(PermissionService, 'checkPermissionByItem');
		});

		it('should call getOwnershipByLink if there is permission', function () {
			PermissionService.checkPermissionByItem.returns(q.when(true));

			eventService.send('itemInstance:100:done', mockItemObj);
			$timeout.flush();

			expect(ctrl.ModelsManager.getOwnershipByLink).to.be.calledOnce;
		});

		it('should NOT call getOwnershipByLink if there is NO permission', function () {
			PermissionService.checkPermissionByItem.returns(q.when(false));

			eventService.send('itemInstance:100:done', mockItemObj);
			$timeout.flush();

			expect(ctrl.ModelsManager.getOwnershipByLink).to.not.be.called;
		});
	});
});
