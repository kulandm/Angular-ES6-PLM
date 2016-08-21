// PLM360 BREADCRUMB configuration
angular.module('plm360.breadcrumbConfig', [
]).getBreadcrumb = function (path) {
	switch (path) {
		case 'dashboard':
			return {
				id: 'dashboard',
				exp: function (injector, q, scope, params) {
					return q.when(scope.bundle.breadcrumb.dashboard);
				}
			};
		case 'workspaceList':
			return {
				parent: 'dashboard',
				id: 'workspaces',
				exp: function (injector, q, scope, params) {
					return q.when(scope.bundle.text.allWorkspaces);
				}
			};
		case 'workspaceItems':
			return {
				parent: 'workspaces',
				id: 'workspace',
				exp: function (injector, q, scope, params) {
					var deferred = q.defer();
					injector.get('ModelsManager').getWorkspace(params.workspaceId);
					var EventService = injector.get('EventService');
					var workspaceListenerId = EventService.listen('workspaceInstance:' + params.workspaceId + ':done', function (event, obj) {
						EventService.unlisten(workspaceListenerId);
						deferred.resolve(obj.getDisplayName());
					}, true);
					return deferred.promise;
				}
			};

		// these tabs will have their own breadcrumb later, when implemented
		// case 'itemGrid':
		// case 'itemChangeLog':
		// case 'itemWhereUsed':
		// case 'itemSuppliedItems':
		// case 'itemManagedItems':
		// case 'itemActionNotifications':
		// case 'itemMilestones':
		// case 'itemProjectManagement':
		// 	return {
		// 		parent: 'workspaceitem',
		// 		id: 'workspaceitemtab',
		// 		exp: function (injector, q, scope, params) {
		// 			var pathName = path.substring(4);
		// 			pathName = pathName.match(/[A-Z][a-z]+/g).join(' ');
		// 			return q.when(pathName);
		// 		}
		// 	};
		// 	break;
		// default, parent breadcrumb for items
		case 'itemDetails': // item Details, the first tab, uses this by default
		case 'workspaceItem':
		case 'itemGrid':
        case 'itemAttachments':
		case 'itemChangeLog':
		case 'itemAffectedItems':
		case 'itemWhereUsed':
		case 'itemSuppliedItems':
		case 'itemManagedItems':
		case 'itemWorkflow':
		case 'itemRelationships':
		case 'itemSourcing':
		case 'itemActionNotifications':
		case 'itemMilestones':
		case 'itemWorkflowMap':
		case 'itemAttachments':
		case 'itemProjectManagement':	
			return {
				parent: 'workspace',
				id: 'workspaceitem',
				exp: function (injector, q, scope, params) {
					var deferred = q.defer();
					injector.get('ModelsManager').getItem(params.workspaceId, params.itemId);
					var EventService = injector.get('EventService');
					var workspaceListenerId = EventService.listen('itemInstance:' + params.itemId + ':done', function (event, obj) {
						EventService.unlisten(workspaceListenerId);
						deferred.resolve(obj.getItemDescriptor());
					}, true);
					return deferred.promise;
				}
			};
		case 'kitchenSink':
			return {
				parent: 'dashboard',
				id: 'kitchenSink',
				exp: function (injector, q, scope, params) {
					return q.when('Kitchen Sink');
				}
			};
        case 'cpdm':
            return {
				parent: 'dashboard',
				id: 'cpdm',
				exp: function (injector, q, scope, params) {
					return q.when(scope.bundle.breadcrumb.cpdm);
				}
			};
        case 'ccc':
            return {
				parent: 'dashboard',
				id: 'ccc',
				exp: function (injector, q, scope, params) {
					return q.when(scope.bundle.breadcrumb.ccc);
				}
			};
		default:
			return {};
	}
};