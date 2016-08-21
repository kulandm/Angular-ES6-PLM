angular.module('plm360.resolveConfig', [
]).getResolve = function (path) {
	switch (path) {
		case 'mainDashboard':
			return {
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.mainDashboard',
							files: ['build-legacy/components/mainDashboard/MainDashboardController.js'],
							cache: false
						}
					]);
				}
			}
			break;
		case 'workspaceItems':
			return {
				// WorkspaceViewsFields: function ($stateParams, WorkspaceViewsService) {
				// 	return WorkspaceViewsService.getAvailableFields($stateParams.workspaceId);
				// },
				LocalizationData: function ($rootScope, LocalizationService) {
					return LocalizationService.init().then(function () {
						return $rootScope.bundle;
					});
				},
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.workspaceItems',
							files: ['build-legacy/components/workspaceItems/WorkspaceItemsController.js'],
							cache: false
						}
					]);
				}
			};
			break;
		case 'workspaceItem':
			return {
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.workspaceItem',
							files: ['build-legacy/components/workspaceItem/WorkspaceItemController.js'],
							cache: false
						}
					]);
				}
			};
		case 'itemSourcing':
			return {
				ChangeLogObj: function ($stateParams, ModelsManager, UserObj, LocalizationData) {
					return ModelsManager.getChangeLog($stateParams.workspaceId, $stateParams.itemId);
				},
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.workspaceItemSourcing',
							files: ['build-legacy/components/workspaceItemSourcing/WorkspaceItemSourcingController.js'],
							cache: false
						}
					]);
				}
			};
			break;
		case 'itemWhereUsed':
			return {
				ChangeLogObj: function ($stateParams, ModelsManager, UserObj, LocalizationData) {
					return ModelsManager.getChangeLog($stateParams.workspaceId, $stateParams.itemId);
				},
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.workspaceItemWhereUsed',
							files: ['build-legacy/components/workspaceItemWhereUsed/WorkspaceItemWhereUsedController.js'],
							cache: false
						}
					]);
				}
			};
			break;
		case 'itemSuppliedItems':
			return {
				ChangeLogObj: function ($stateParams, ModelsManager, UserObj, LocalizationData) {
					return ModelsManager.getChangeLog($stateParams.workspaceId, $stateParams.itemId);
				},
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.workspaceItemSuppliedItems',
							files: ['build-legacy/components/workspaceItemSuppliedItems/WorkspaceItemSuppliedItemsController.js'],
							cache: false
						}
					]);
				}
			};
			break;
		case 'itemManagedItems':
			return {
				WorkspaceItemManagedItemsData: function ($stateParams, WorkspaceItemManagedItemsService) {
					return WorkspaceItemManagedItemsService.getWorkspaceItemManagedItemsData($stateParams.workspaceId, $stateParams.itemId);
				},
				/*UserProfileData: function (UserProfileService) {
					return UserProfileService.getCurrentUserProfileData('dateFormat');
				},*/
				LocalizationData: function ($rootScope, LocalizationService) {
					return LocalizationService.init().then(function () {
						return $rootScope.bundle;
					});
				}
			};
			break;
		case 'itemActionNotifications':
			return {
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.workspaceItemActionNotifications',
							files: ['build-legacy/components/workspaceItemActionNotifications/WorkspaceItemActionNotificationsController.js'],
							cache: false
						}
					]);
				}
			};
			break;
		case 'itemWorkflowMap':
			return {
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							serie: true,
							files: [
								"plmlib/mxGraph/js/mxClient.js",
								"plmlib/mxGraph/js/mxApplicationMapLoad.js",
								"plmlib/mxGraph/js/mxGraph.js",
								"plmlib/mxGraph/js/mxPropertiesPanel.js",
								"plmlib/mxGraph/js/mxUtils.js",
								"plmlib/mxGraph/js/mxWorkflowActionsProperties.js",
								"plmlib/mxGraph/js/workflowActions/mxRestApiAjaxCall.js",
								"plmlib/mxGraph/js/workflowActions/mxWorkflowActionsWidget.js"
							],
							cache: false
						}
					]);
				}
			};
			break;
		case 'itemProjectManagement':
			return {
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'gantt',
							serie: true,
							files: [
								'lib/moment/min/moment-with-locales.min.js',
								'lib/angular-moment/angular-moment.js',
								'lib/angular-gantt/dist/angular-gantt.js',
								'lib/angular-gantt/dist/angular-gantt.css',
								'lib/jsPlumb/dist/js/dom.jsPlumb-1.7.4-min.js'
							],
							cache: false
						}
					]);
				}
			};
			break;
        case 'ccc':
			return {
				cccData: function () {
					return null;
				}
			};
            break;
        case 'cpdm':
			return {
				rootFolderUrn: function(plmService){
	                return plmService.getRootFolderUrn();
	        	}
			};
            break;
		case 'init':
			return {
				load: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'plm360.plmHeader',
							serie: true,
							files: ['build-legacy/components/plmHeader/module.js', 'build-legacy/components/plmHeader/PLMHeaderDirective.js', 'build-legacy/components/plmHeader/PLMHeaderController.js'],
							cache: false
						},
						{
							name: 'plm360.reportChart',
							serie: true,
							files: ['build-legacy/components/reportChart/module.js','build-legacy/components/reportChart/ReportChartDirective.js','build-legacy/components/reportChart/ReportChartController.js'],
							cache: false
						},
						{
							name: 'plm360.typeahead',
							files: ['build-legacy/components/typeahead/TypeaheadWidgetDirective.js'],
							cache: false
						},
						{
							name: 'plm360.tabularDataWidget',
							serie: true,
							files: ['build-legacy/components/tabularDataWidget/module.js','build-legacy/components/tabularDataWidget/TabularDataWidgetDirective.js',
								'build-legacy/components/tabularDataWidget/TabularDataWidgetController.js'],
							cache: false
						},
						{
							name: 'plm360.fieldTypes',
							serie: true,
							files: ['build-legacy/components/fieldTypes/module.js',
								'build-legacy/components/fieldTypes/FieldWrapperDirective.js',
								'build-legacy/components/fieldTypes/FieldViewDirective.js',
								'build-legacy/components/fieldTypes/FieldViewTruncationDirective.js',
								'build-legacy/components/fieldTypes/FieldEditDirective.js'],
							cache: false
						},
						{
							name: 'plm360.permissions',
							serie: true,
							files: [
								'build-legacy/components/permissions/module.js',
								'build-legacy/components/permissions/isPermittedDirective.js'
							],
							cache: false
						},
						{
							name: 'plm360.contextMenu',
							files: ['build-legacy/components/contextMenu/contextMenuDirective.js'],
							cache: false
						}
					]);
				}
			};
			break;
		default:
			return {};
			break;
	}
};
