'use strict';

describe('ChangeOwnerController', () => {

	let $controller, $rootScope, $mdDialog, $q, RESTWrapperService, currentOwner, ctrl, $httpBackend, App, ownershipObj, NotificationService, NotificationTypes;
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
			_$mdDialog_,
			_$httpBackend_,
			_App_,
			_NotificationService_,
			_NotificationTypes_,
			MockLocalizationData
		) => {
			$controller = _$controller_;
			$rootScope = _$rootScope_;
			RESTWrapperService = _RESTWrapperService_;
			$q = _$q_;
			$mdDialog = _$mdDialog_;
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

		sinon.stub($mdDialog, 'hide');
		sinon.stub(NotificationService, 'addNotification');
		sinon.stub(NotificationService, 'showNotifications');

		ownershipObj = {
			json: {
				ownership: {
					owners: [{
						detailsLink: 'somelink'
					}]
				}
			},
			replaceOwner: sinon.stub().returns($q.resolve({})),
			getFullList: function () {
				return this.json;
			}
		};

		ctrl = $controller('ChangeOwnerController', {
			$rootScope: $rootScope,
			$mdDialog: $mdDialog,
			$q: $q,
			RESTWrapperService: RESTWrapperService,
			ownershipObj: ownershipObj,
			App: App,
			NotificationService: NotificationService,
			NotificationTypes: NotificationTypes
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
	});

	describe('triggerSave', () => {
		it('calls replace owner and closes the dialog thereafter', () => {
			ctrl.owners = 'someOwnersA';
			ctrl.selectedOwner = 'someSelectedOwnerA';
			ctrl.isNotifyingOwnerByEmail = false;

			ctrl.triggerSave();

			expect(ctrl.Ownership.replaceOwner).to.be.calledWith(
				'someOwnersA',
				'someSelectedOwnerA',
				false);

			$rootScope.$digest();
			expect($mdDialog.hide).to.be.calledOnce;
			expect(NotificationService.addNotification).to.be.calledOnce;
			expect(NotificationService.showNotifications).to.be.calledOnce;
		});

		it('calls replace owner and closes the dialog thereafter and have notify set to true', () => {
			ctrl.owners = 'someOwnersB';
			ctrl.selectedOwner = 'someSelectedOwnerB';
			ctrl.isNotifyingOwnerByEmail = true;

			ctrl.triggerSave();

			expect(ctrl.Ownership.replaceOwner).to.be.calledWith(
				'someOwnersB',
				'someSelectedOwnerB',
				true);

			$rootScope.$digest();
			expect($mdDialog.hide).to.be.calledOnce;
			expect(NotificationService.addNotification).to.be.calledOnce;
			expect(NotificationService.showNotifications).to.be.calledOnce;
		});
	});

	describe('closeDialog', () => {
		it('should cancel dialog', () => {
			sinon.stub($mdDialog, 'cancel');
			ctrl.closeDialog();
			expect($mdDialog.cancel).to.be.calledOnce;
		});
	});
});