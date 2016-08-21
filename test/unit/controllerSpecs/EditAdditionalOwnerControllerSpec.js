'use strict';

describe('EditAdditionalOwnersController', () => {

	let $controller, $scope, $rootScope, $mdDialog, $q, RESTWrapperService, currentOwner, ctrl, $httpBackend, App, ownershipObj, NotificationService, NotificationTypes;
	beforeEach(module(
		'com/autodesk/RESTWrapperService.js',
		'com/autodesk/apiModelsManager.js',
		'com/autodesk/notification.js',
		'com/autodesk/components/workspaceItem/changeOwner/changeOwner.js',
		'plm360.mockData'
	));

	beforeEach(() => {
		inject((
			_$controller_,
			_RESTWrapperService_,
			_$rootScope_,
			_$q_,
			_$httpBackend_,
			_App_,
			_NotificationService_,
			_NotificationTypes_,
			MockLocalizationData
		) => {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			$scope = $rootScope.$new();
			RESTWrapperService = _RESTWrapperService_;
			$q = _$q_;
			$mdDialog = {
				hide: sinon.stub(),
				cancel: sinon.stub()
			};
			$httpBackend = _$httpBackend_;
			App = _App_;
			NotificationService = _NotificationService_;
			NotificationTypes = _NotificationTypes_;
			$rootScope.bundle = MockLocalizationData;
		});

		$httpBackend.when('GET', '/api/rest/v1/token').respond($q.when({
			something: 'something'
		}));

		sinon.spy(RESTWrapperService, 'get');

		ownershipObj = {
			json: {
				ownership: {
					owners: [{
						detailsLink: 'somelink'
					}]
				}
			},
			editAdditionalOwners: sinon.stub().returns($q.resolve({})),
			getFullList: function () {
				return this.json;
			}
		};

		ctrl = $controller('EditAdditionalOwnersController', {
			$scope: $scope,
			$rootScope: $rootScope,
			$mdDialog: $mdDialog,
			$q: $q,
			RESTWrapperService: RESTWrapperService,
			ownershipObj: ownershipObj,
			App: App
		});

	});

	describe('constructor', () => {
		it('should call users endpoint', () => {
			$rootScope.$apply();
			expect(RESTWrapperService.get).to.be.calledWith('api/v3/users/', [], {
				limit: 1000, // not expecting more than 1000 users
				offset: 0,
				mappedOnly: false
			}, {}, {
				Accept: 'application/vnd.autodesk.plm.users.bulk+json'
			});
		});

		it('should call groups endpoint', () => {
			$rootScope.$apply();
			expect(RESTWrapperService.get).to.be.calledWith('api/v3/groups');
		});
	});

	describe('triggerSave', () => {
		it('calls editAdditionalOwners and closes the dialog thereafter', () => {
			sinon.stub(NotificationService, 'addNotification');
			sinon.stub(NotificationService, 'showNotifications');

			ctrl.triggerSave();

			expect(ctrl.Ownership.editAdditionalOwners).to.be.calledOnce;

			$rootScope.$digest();

			expect($mdDialog.hide).to.be.calledOnce;
			expect(NotificationService.addNotification).to.be.calledOnce;
			expect(NotificationService.showNotifications).to.be.calledOnce;
		});
	});

	describe('closeDialog', () => {
		it('should cancel dialog', () => {
			ctrl.closeDialog();
			expect($mdDialog.cancel).to.be.calledOnce;
		});
	});
});