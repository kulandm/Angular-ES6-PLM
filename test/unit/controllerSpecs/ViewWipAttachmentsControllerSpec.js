'use strict';

describe('ViewWipAttachmentsController', () => {
	let $state = null;
	let $timeout = null;
	let $q = null;
	let FileOverviewService;
	let WipApiService;
	let EventService = null;
	let PermissionService = null;
	let RESTWrapperService;
	let mockItemObj = null;
	let viewWipAttachmentsCtrl = null;
	let mockWindow = {
		location: {
			href: 'http://href'
		}
	};
	let $mdDialog;

	// Load the modules used by the controller
	beforeEach(module(
		'com/autodesk/EventService.js',
		'com/autodesk/fileOverview.js',
		'com/autodesk/WipApiService.js',
		'plm360',
		'plm360.mockData',
		'plm360.mockObjects',
		'plm360.permissions'
	));

	beforeEach(() => {
		inject((
			$controller,
			$rootScope,
			_$state_,
			_$timeout_,
			_$q_,
			$httpBackend,
			MockItemObj,
			MockLocalizationData,
			MockModelsManager,
			MockWorkspaceObj,
			_EventService_,
			_FileOverviewService_,
			_WipApiService_,
			_PermissionService_,
			_RESTWrapperService_,
			PLMPermissions,
			UrnParser
		) => {
			$state = _$state_;
			$timeout = _$timeout_;
			$q = _$q_;
			EventService = _EventService_;
			FileOverviewService = _FileOverviewService_;
			WipApiService = _WipApiService_;
			PermissionService = _PermissionService_;
			RESTWrapperService = _RESTWrapperService_;

			$httpBackend.when('GET', '/api/rest/v1/token').respond('');
			$httpBackend.when('GET', 'lib/plm-localization/build/translations/localizationBundleGeneral.json').respond(MockLocalizationData);

			mockItemObj = new MockItemObj();
			mockItemObj.workspaceObj = new MockWorkspaceObj;
			mockItemObj.getId.returns('88');
			mockItemObj.workspaceObj.getId.returns('8');
			mockItemObj.getFullList.returns({itemLocked: false});
			mockItemObj.isLocked.returns(false);

			$mdDialog = {
				show: () => {
					return {
						then: () => {}
					};
				}
			};

			sinon.stub($state, 'go');
			sinon.spy(FileOverviewService, 'setHost');
			sinon.spy(WipApiService, 'setHost');
			sinon.stub(RESTWrapperService, 'get');
			RESTWrapperService.get.returns($q.resolve({
				items: [{
					links: {
						link: {
							href: 'http://a360.url'
						}
					}
				}],
				value: 'https://some.api.autodesk.com/wipdata-serv-qa'
			}));

			viewWipAttachmentsCtrl = $controller('ViewWipAttachmentsController', {
				$scope: $rootScope.$new(),
				$state: $state,
				$stateParams: {
					itemId: '88',
					tab: '',
					view: '',
					mode: 'view'
				},
				$window: mockWindow,
				EventService: EventService,
				FileOverviewService: FileOverviewService,
				WipApiService: WipApiService,
				ModelsManager: new MockModelsManager(),
				PermissionService: PermissionService,
				PLMPermissions: PLMPermissions,
				RESTWrapperService: RESTWrapperService,
				UrnParser: UrnParser,
				$mdDialog: $mdDialog
			});
		});
	});

	it('defines the controller', () => {
		expect(viewWipAttachmentsCtrl).to.not.be.null;
	});

	it('initializes the itemId and workspaceId', () => {
		EventService.send('itemInstance:88:done', mockItemObj);

		expect(viewWipAttachmentsCtrl.workspaceId).to.equal('8');
		expect(viewWipAttachmentsCtrl.itemId).to.equal('88');
	});

	it('sets the A360 url in the FileOverviewService', inject($rootScope => {
		$rootScope.$apply();
		expect(FileOverviewService.setHost).to.have.been.calledWith('http://a360.url');
	}));

	it('sets the WipApiService url in the FileOverviewService', inject($rootScope => {
		$rootScope.$apply();
		expect(WipApiService.setHost).to.have.been.calledWith('https://some.api.autodesk.com/wipdata-serv-qa');
	}));

	it('redirects to item details view when there is no view attachments permission', () => {
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(false));

		EventService.send('itemInstance:88:done', mockItemObj);
		$timeout.flush();

		expect($state.go).to.have.been.calledWith('details');
	});

	it('checks for the workspace id', () => {
		sinon.stub(PermissionService, 'checkPermissionByItem');
		PermissionService.checkPermissionByItem.returns($q.when(true));

		EventService.send('itemInstance:88:done', mockItemObj);
		$timeout.flush();

		expect(viewWipAttachmentsCtrl.workspaceId).to.be.equal('8');
	});

	it('checks if the item is locked', () => {
		mockItemObj.isLocked.returns(true);
		EventService.send('itemInstance:88:done', mockItemObj);
		$timeout.flush();

		expect(viewWipAttachmentsCtrl.isItemLocked).to.be.true;
	});

	describe('[setSelectedFiles]', () => {
		let file = {file: 'dummy'};

		it('adds selected files', () => {
			expect(viewWipAttachmentsCtrl.selectedFiles.size).to.equal(0);
			viewWipAttachmentsCtrl.setSelectedFiles(file);
			expect(viewWipAttachmentsCtrl.selectedFiles.size).to.equal(1);
		});

		it('deletes selected files', () => {
			viewWipAttachmentsCtrl.setSelectedFiles(file);
			expect(viewWipAttachmentsCtrl.selectedFiles.size).to.equal(1);

			viewWipAttachmentsCtrl.setSelectedFiles(file);
			expect(viewWipAttachmentsCtrl.selectedFiles.size).to.equal(0);
		});
	});

	describe('[Trigger Methods]', () => {
		it('triggers the edit mode', () => {
			viewWipAttachmentsCtrl.triggerEdit();

			expect($state.go).to.be.calledWith('attachments', {
				tab: '',
				view: '',
				mode: 'edit',
				itemId: '88'
			});
		});

		it('triggers the view mode', () => {
			viewWipAttachmentsCtrl.triggerCancel();

			expect($state.go).to.be.calledWith('attachments', {
				tab: '',
				view: '',
				mode: 'view',
				itemId: '88'
			});
		});

		it('sends an event upon triggering download', () => {
			sinon.spy(EventService, 'send');
			viewWipAttachmentsCtrl.triggerDownload();

			expect(EventService.send).to.be.calledWith(`wipAttachment:${viewWipAttachmentsCtrl.itemId}:download`);
		});

		it('displays a dialog with the selected files', () => {
			sinon.spy($mdDialog, 'show');
			viewWipAttachmentsCtrl.triggerFileBrowserDialog();
			expect($mdDialog.show).to.be.calledOnce;
		});

		it('sends an event upon triggering save', () => {
			sinon.spy(EventService, 'send');
			viewWipAttachmentsCtrl.triggerSave();

			expect(EventService.send).to.be.calledWith(`wipAttachment:${viewWipAttachmentsCtrl.itemId}:save`);
		});

		it('triggers the view mode after save', () => {
			viewWipAttachmentsCtrl.triggerSave();
			EventService.send(`wipAttachment:${viewWipAttachmentsCtrl.itemId}:saveDone`);

			expect($state.go).to.be.calledWith('attachments', {
				tab: '',
				view: '',
				mode: 'view',
				itemId: '88'
			});
		});
	});
});
