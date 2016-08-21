import underscoreModule from 'com/autodesk/UnderscoreService.js';
import eventServiceModule from 'com/autodesk/EventService.js';

/**
 * @ngdoc object
 * @name Services.PermissionService
 *
 * @description A utility service that contains permission related methods.
 *
 * ##Dependencies
 * - Requires {@link Services.TokenService}
 *
 */
class PermissionService {

	/**
	 * @ngdoc method
	 * @name Services.PermissionService#constructor
	 * @methodOf Services.PermissionService
	 * @description The class constructor
	 */
	constructor(ModelsManager, EventService, $q, PLMPermissions, WorkspaceTypes, _) {
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.$q = $q;
		this.PLMPermissions = PLMPermissions;
		this.WorkspaceTypes = WorkspaceTypes;
		this._ = _;
	}

	/**
	 * @ngdoc method
	 * @name Services.PermissionService#hasPermissions
	 * @methodOf Services.PermissionService
	 * @description Evaluates whether user has permissions on the workspace or not.
	 *
	 * @param {Array} permissionList : the list of permission to check
	 * @param {String} workspaceId : the id of the workspace on which the permission is evaluated.
	 *
	 * @return {Promise} a promise that resolves with true if user has permissions.
	 */
	hasPermissions(permissionList, workspaceId) {
		let deferObj = this.$q.defer();
		
		let userPermissionsListenerId = this.EventService.listen(`userPermissions:${workspaceId}~*:done`, (event, userPermissionsObj) => {
			this.EventService.unlisten(userPermissionsListenerId);
			let hasPermissions = this._.every(permissionList, function (permission) {
				return userPermissionsObj.hasPermission(permission);
			});

			deferObj.resolve(hasPermissions);
		}, true);

		// This is a special case check for workspace view item permission
		let permissionErrorListenerId = this.EventService.listen(`workspaceInstance:${workspaceId}:permissionError`, (event, workspaceId) => {
			this.EventService.unlisten(permissionErrorListenerId);
			
			deferObj.resolve(false);
		}, true);

		this.ModelsManager.getWorkspace(workspaceId);

		return deferObj.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.PermissionService#checkPermissionByItem
	 * @methodOf Services.PermissionService
	 * @description Evaluates whether user has permission on the workspace or not on the basis of given item object.
	 *
	 * @param {Object} itemObj : workspace item object.
	 * @param {Number} permission : the permission to check
	 * @param {Boolean} applyLock: an optional parameter that will be used only when getting workspace id using {@link $stateParams#itemId}.
	 * This parameter (if provided) will control whether we need to apply extra workspace locking check or not.
	 * @param {Boolean} applyRevisionOverrideLock : an optional parameter that will be used only when getting
	 * workspace id using {@link $stateParams#itemId}. This parameter (if provided) will control whether we need to
	 * enforce extra permissions or not.
	 *
	 * @return {Promise} a promise that resolves with true if user has permissions.
	 */
	checkPermissionByItem(itemObj, permission, applyLock, applyRevisionOverrideLock) {
		let deferObj = this.$q.defer();

		let workspaceTypeId = parseInt(itemObj.workspaceObj.getTypeId());

		let isWorkspaceWithWorkflow = workspaceTypeId === this.WorkspaceTypes.BASIC_WORKSPACE_WITH_WORKFLOW
			|| workspaceTypeId === this.WorkspaceTypes.REVISIONING_WORKSPACE
			|| workspaceTypeId === this.WorkspaceTypes.SUPPLIER_WITH_WORKFLOW;
		if (workspaceTypeId !== this.WorkspaceTypes.REVISION_CONTROLLED_WORKSPACE && applyLock && itemObj.getFullList().itemLocked === true) {
			// Item is locked.
			this.hasPermissions([permission, this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS], itemObj.workspaceObj.getId()).then((hasPermission) => {
				deferObj.resolve(hasPermission);
			});
		} else if (workspaceTypeId === this.WorkspaceTypes.REVISION_CONTROLLED_WORKSPACE && applyRevisionOverrideLock && (itemObj.getFullList().itemLocked === true || itemObj.getFullList().workingVersion === false)) {
			// This permission is only applicable to 1) Revision controller item & 2) non working versions of
			// an item. Note: Working version can be locked if its associated with a revisioning item. For that
			// the if condition above will be used.
			this.hasPermissions([permission, this.PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS], itemObj.workspaceObj.getId()).then((hasPermission) => {
				deferObj.resolve(hasPermission);
			});
		} else if (applyLock && isWorkspaceWithWorkflow) {
			// Reject the promise if item with workflow has no outward transitions.
			let itemTransitionsListenerId = this.EventService.listen(`itemTransitions:${itemObj.getId()}:done`, (event, transitionsObj) => {
				this.EventService.unlisten(itemTransitionsListenerId);
				this.EventService.unlisten(itemTransitionsFailedListenerId);

				if (transitionsObj.transitions && transitionsObj.transitions.length) {
					this.hasPermissions([permission], itemObj.workspaceObj.getId()).then((hasPermission) => {
						deferObj.resolve(hasPermission);
					});
				} else {
					this.hasPermissions([permission, this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS], itemObj.workspaceObj.getId()).then((hasPermission) => {
						deferObj.resolve(hasPermission);
					});
				}
			});
			let itemTransitionsFailedListenerId = this.EventService.listen(`itemTransitions:${itemObj.getId()}:failed`, (event, transitionsObj) => {
				// In case of failure to fetch the transitions, an extra permission of "admin override workflow locks" must
				// be checked along with the given {@link #permission}.
				this.EventService.unlisten(itemTransitionsListenerId);
				this.EventService.unlisten(itemTransitionsFailedListenerId);

				this.hasPermissions([permission, this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS], itemObj.workspaceObj.getId()).then((hasPermission) => {
					deferObj.resolve(hasPermission);
				});
			});
			this.ModelsManager.getTransitionsByLink(itemObj.getId(), itemObj.getTransitionsLink());
		} else {
			this.hasPermissions([permission], itemObj.workspaceObj.getId()).then(function (hasPermission) {
				deferObj.resolve(hasPermission);
			});
		}

		return deferObj.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.PermissionService#checkPermissionByItemId
	 * @methodOf Services.PermissionService
	 * @description Evaluates whether user has permission on the workspace or not on the basis of given item id.
	 * Note: This is a variant of {@link Services.PermisssionService#checkPermissionByItem}.
	 *
	 * @param {String} itemId : id of the workspace item object.
	 * @param {Number} permission : the permission to check
	 * @param {Boolean} applyLock: an optional parameter that will be used only when getting workspace id using {@link $stateParams#itemId}.
	 * This parameter (if provided) will control whether we need to apply extra workspace locking check or not.
	 * @param {Boolean} applyRevisionOverrideLock : an optional parameter that will be used only when getting
	 * workspace id using {@link $stateParams#itemId}. This parameter (if provided) will control whether we need to
	 * enforce extra permissions or not.
	 *
	 * @return {Promise} a promise that resolves with true if user has permissions.
	 */
	checkPermissionByItemId(itemId, permission, applyLock, applyRevisionOverrideLock) {
		let deferObj = this.$q.defer();

		let itemListenerId = this.EventService.listen(`itemInstance:${itemId}:done`, (event, itemObj) => {
			this.EventService.unlisten(itemListenerId);
			this.checkPermissionByItem(itemObj, permission, applyLock, applyRevisionOverrideLock).then((hasPermission) => {
				deferObj.resolve(hasPermission);
			});
		});
		// TODO: Refactors the method for removing the itemId param if it is in fact, not needed.
		// Removing this call to getItem now because is generating a race condition in the item details, and the listener
		// is triggered anyway without it.
		// this.ModelsManager.getItem(itemId);

		return deferObj.promise;
	}
}

export default angular.module(__moduleName, [
	underscoreModule.name,
	eventServiceModule.name
]).factory('PermissionService', [
	'ModelsManager',
	'EventService',
	'$q',
	'PLMPermissions',
	'WorkspaceTypes',
	'_',
	(ModelsManager, EventService, $q, PLMPermissions, WorkspaceTypes, _) => new PermissionService(ModelsManager, EventService, $q, PLMPermissions, WorkspaceTypes, _)
]);

