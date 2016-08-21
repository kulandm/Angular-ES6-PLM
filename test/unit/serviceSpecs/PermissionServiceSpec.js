'use strict';

describe('PermissionService', () => {
	let provide;
	let mockModelsManager;
	let EventService;
	let mockUserPermissionsObj;
	let mockItemObj;

	beforeEach(module(
		'com/autodesk/services/PermissionService.js',
		'com/autodesk/services/PLMPermissions.js',
		'plm360.models',
		'plm360.mockObjects'
	));

	beforeEach(() => {
		module(function ($provide) {
			provide = $provide;
		});

		inject((MockModelsManager, _EventService_, MockUserPermissionsObj) => {
			mockModelsManager = new MockModelsManager();
			EventService = _EventService_;
			mockUserPermissionsObj = new MockUserPermissionsObj();

			provide.value('ModelsManager', mockModelsManager);
		});
	});

	describe('getPermissions', () => {
		it('should handle permission error', inject((PermissionService) => {
			EventService.send('workspaceInstance:8:permissionError');
			expect(PermissionService.hasPermissions([1], 8)).to.eventually.be.false;
		}));

		it('should single no permission scenario', inject((PermissionService) => {
			mockUserPermissionsObj.hasPermission.returns(false);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.hasPermissions([1], 8)).to.eventually.be.false;
		}));

		it('should single permission scenario', inject((PermissionService) => {
			mockUserPermissionsObj.hasPermission.returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.hasPermissions([1], 8)).to.eventually.be.true;
		}));

		it('should multiple permissions scenarios', inject((PermissionService) => {
			mockUserPermissionsObj.hasPermission.onCall(0).returns(false);
			mockUserPermissionsObj.hasPermission.onCall(1).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.hasPermissions([1, 2], 8)).to.eventually.be.false;

			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			mockUserPermissionsObj.hasPermission.onCall(1).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.hasPermissions([1, 2], 8)).to.eventually.be.true;
		}));
	});

	describe('checkPermissionByItem', () => {
		beforeEach(inject((MockItemObj, MockWorkspaceObj) => {
			mockItemObj = new MockItemObj();
			mockItemObj.workspaceObj = new MockWorkspaceObj();
			mockItemObj.workspaceObj.getId.returns('1');
			mockItemObj.getId.returns('1000');

		}));

		it('should work with basic workspace', inject((PermissionService) => {
			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('1');
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, false, false)).to.eventually.be.true;
		}));

		it('should work with supplier workspace', inject((PermissionService) => {
			mockItemObj.getFullList.returns({
				itemLocked: false,
				workingVersion: false
			});

			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('3');
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, true, true)).to.eventually.be.true;
		}));

		it('should work with basic workspace with workflow', inject((PermissionService) => {
			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('2');
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, false)).to.eventually.be.true;
		}));

		it('should work with revision controller workspace', inject((PermissionService) => {
			mockItemObj.getFullList.returns({
				itemLocked: false,
				workingVersion: false
			});

			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('6');
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			mockUserPermissionsObj.hasPermission.onCall(1).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			EventService.send('itemTransitions:1000:failed');
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, true)).to.eventually.be.true;
		}));

		it('should work with supplier workspace with workflow', inject((PermissionService) => {
			mockItemObj.getFullList.returns({
				itemLocked: true,
				workingVersion: false
			});

			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('8');
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			EventService.send('itemTransitions:1000:done', {
				transitions: [{}]
			});
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, true)).to.eventually.be.true;
		}));

		it('should work with revisioning workspaces when item is not locked (applyRevisionOverrideLock)', inject((PermissionService) => {
			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('7');

			mockItemObj.getFullList.returns({
				itemLocked: false,
				workingVersion: false
			});
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, false, false)).to.eventually.be.true;
		}));

		it('should work with revisioning workspaces when item is locked (applyRevisionOverrideLock)', inject((PermissionService) => {
			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('7');

			mockItemObj.getFullList.returns({
				itemLocked: true,
				workingVersion: false
			});
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			mockUserPermissionsObj.hasPermission.onCall(1).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, false, true)).to.eventually.be.true;
		}));

		it('should work with revisioning workspaces when item is locked', inject((PermissionService) => {
			mockItemObj.workspaceObj.getTypeId.onCall(0).returns('7');

			mockItemObj.getFullList.returns({
				itemLocked: true,
				workingVersion: false
			});
			mockUserPermissionsObj.hasPermission.onCall(0).returns(true);
			mockUserPermissionsObj.hasPermission.onCall(1).returns(true);
			EventService.send('userPermissions:1~*:done', mockUserPermissionsObj);
			expect(PermissionService.checkPermissionByItem(mockItemObj, 1, true, true)).to.eventually.be.true;
		}));
	});
});
