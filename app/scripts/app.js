System.get('com/autodesk/UnderscoreService.js');
System.get('com/autodesk/AuthenticationService.js');
System.get('com/autodesk/ClassicRedirector.js');
System.get('com/autodesk/EventService.js');
System.get('com/autodesk/LoadingDataService.js');
System.get('com/autodesk/RESTWrapperService.js');
System.get('com/autodesk/TokenService.js');

System.get('com/autodesk/localization.js');
System.get('com/autodesk/dropdown.js');
System.get('com/autodesk/notification.js');
System.get('com/autodesk/classification.js');
System.get('com/autodesk/flyout.js');
System.get('com/autodesk/search.js');
System.get('com/autodesk/navGuard/navGuard.js');
System.get('com/autodesk/userAvatar.js');

System.get('com/autodesk/filters.js');
System.get('com/autodesk/apiModelsManager.js');

System.get('com/autodesk/services/FieldTypeMappings.js');
System.get('com/autodesk/services/PermissionService.js');
System.get('com/autodesk/fileOverview.js');
System.get('com/autodesk/services/PLMPermissions.js');
System.get('com/autodesk/services/SupportedFieldsService.js');
System.get('com/autodesk/services/UrlParser.js');
System.get('com/autodesk/services/ValidationUtil.js');
System.get('com/autodesk/services/LocalUserStorage.service.js');

System.get('com/autodesk/UrnParser.js');
System.get('com/autodesk/tableData.js');
System.get('com/autodesk/fieldSelector.js');
System.get('com/autodesk/usersSelector.js');
System.get('com/autodesk/sectionWrapper.js');
System.get('com/autodesk/dashboard.js');
System.get('com/autodesk/jitterbit.js');
System.get('com/autodesk/roamer.js');
System.get('com/autodesk/cpdm.js');

System.get('com/autodesk/components/createItem/createItem.js');
System.get('com/autodesk/components/featureToggle/featureToggle.js');
System.get('com/autodesk/components/itemHeader/itemHeader.js');
System.get('com/autodesk/components/itemViewer/itemViewer.js');
System.get('com/autodesk/components/plmNavigation/plmNavigation.js');
System.get('com/autodesk/components/plmWrapper/plmWrapper.js');
System.get('com/autodesk/components/plmFooter/plmFooter.js');
System.get('com/autodesk/components/fusionHeader/fusionHeader.js');
System.get('com/autodesk/components/featureToggle/featureToggle.js');
System.get('com/autodesk/components/confirmationDialog/confirmationDialog.js');
System.get('com/autodesk/components/plmTableCheckbox/plmTableCheckbox.js');

System.get('com/autodesk/components/workspaceItem/commandBar/commandBar.js');
System.get('com/autodesk/components/workspaceItem/addItem/addItem.js');
System.get('com/autodesk/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.js');
System.get('com/autodesk/components/workspaceItem/changeOwner/changeOwner.js');
System.get('com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.js');
System.get('com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.js');
System.get('com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.js');
System.get('com/autodesk/components/workspaceItem/viewChangeLog/viewChangeLog.js');
System.get('com/autodesk/components/workspaceItem/viewDetails/viewDetails.js');
System.get('com/autodesk/components/workspaceItem/viewBom/viewBom.js');
System.get('com/autodesk/components/workspaceItem/viewGrid/viewGrid.js');
System.get('com/autodesk/components/workspaceItem/viewMilestones/viewMilestones.js');
System.get('com/autodesk/components/workspaceItem/viewNamedRelationships/viewNamedRelationships.js');
System.get('com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.js');
System.get('com/autodesk/components/workspaceItem/viewRelationships/viewRelationships.js');
System.get('com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.js');
System.get('com/autodesk/components/workspaceItem/viewWorkflow/viewWorkflow.js');
System.get('com/autodesk/components/workspaceItem/viewWorkflowActions/viewWorkflowActions.js');
System.get('com/autodesk/components/workspaceItem/viewSourcing/viewSourcing.js');
System.get('com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.js');

System.get('com/autodesk/models/bomApi/bomNestedItem.model.js');
System.get('com/autodesk/models/bomApi/bomNestedItemListeners.service.js');
System.get('com/autodesk/models/bomApi/bomRoot.model.js');
System.get('com/autodesk/models/bomApi/bomRootListeners.service.js');
System.get('com/autodesk/models/bomTable/bomTable.js');
System.get('com/autodesk/models/bomGraph/bomGraph.js');
System.get('com/autodesk/components/workspaceItem/viewBom/bomPinning.directive.js');
System.get('com/autodesk/models/bomViewDefinition/bomViewDefinition.js');
System.get('com/autodesk/models/configurations/configurations.js');
System.get('com/autodesk/plm-bom-module.js');
System.get('com/autodesk/models/bulkBom/bulkBom.js');
System.get('com/autodesk/models/bomAttachment/bomAttachment.js');

var plm360models = angular.module('plm360.models', [
	'com/autodesk/EventService.js',
	'com/autodesk/UrnParser.js',
	'com/autodesk/services/UrlParser.js',
	'com/autodesk/RESTWrapperService.js',
	'com/autodesk/services/PermissionService.js',
	'com/autodesk/services/PLMPermissions.js',
	'com/autodesk/localization.js',
	'com/autodesk/classification.js',
	'com/autodesk/services/FieldTypeMappings.js',
	'com/autodesk/models/bomApi/bomNestedItem.model.js',
	'com/autodesk/models/bomApi/bomNestedItemListeners.service.js',
	'com/autodesk/models/bomApi/bomRoot.model.js',
	'com/autodesk/models/bomApi/bomRootListeners.service.js',
	'com/autodesk/models/bomTable/bomTable.js',
	'com/autodesk/models/bomGraph/bomGraph.js',
	'com/autodesk/models/bomViewDefinition/bomViewDefinition.js',
	'com/autodesk/models/configurations/configurations.js',
	'com/autodesk/models/bulkBom/bulkBom.js',
	'com/autodesk/models/bomAttachment/bomAttachment.js'
]);

var plm360 = angular.module('plm360', [
	'oc.lazyLoad',
	'ui.router',
	'ngRoute',
	'ngResource',
	'ngSanitize',
	'angular-data.DSCacheFactory',
	'angular-locale-bundles',
	'tmh.dynamicLocale',
	'restangular',
	'textAngular',
	'com/autodesk/UnderscoreService.js',
	'com/autodesk/TokenService.js',
	'com/autodesk/AuthenticationService.js',
	'com/autodesk/ClassicRedirector.js',
	'com/autodesk/EventService.js',
	'com/autodesk/services/FieldTypeMappings.js',
	'com/autodesk/LoadingDataService.js',
	'com/autodesk/services/PermissionService.js',
	'com/autodesk/RESTWrapperService.js',
	'com/autodesk/services/SupportedFieldsService.js',
	'com/autodesk/services/UrlParser.js',
	'com/autodesk/services/ValidationUtil.js',
	'com/autodesk/services/LocalUserStorage.service.js',

	'com/autodesk/UrnParser.js',
	'com/autodesk/tableData.js',
	'com/autodesk/fieldSelector.js',
	'com/autodesk/usersSelector.js',
	'com/autodesk/dashboard.js',
	'com/autodesk/jitterbit.js',
	'com/autodesk/search.js',
	'com/autodesk/roamer.js',

	'com/autodesk/components/createItem/createItem.js',
	'com/autodesk/localization.js',
	'com/autodesk/components/itemHeader/itemHeader.js',
	'com/autodesk/components/itemViewer/itemViewer.js',
	'com/autodesk/notification.js',
	'com/autodesk/classification.js',
	'com/autodesk/flyout.js',
	'com/autodesk/components/plmNavigation/plmNavigation.js',
	'com/autodesk/components/plmWrapper/plmWrapper.js',
	'com/autodesk/components/plmFooter/plmFooter.js',
	'com/autodesk/components/fusionHeader/fusionHeader.js',
	'com/autodesk/sectionWrapper.js',
	'com/autodesk/components/confirmationDialog/confirmationDialog.js',
	'com/autodesk/navGuard/navGuard.js',
	'com/autodesk/userAvatar.js',

	'com/autodesk/components/workspaceItem/commandBar/commandBar.js',
	'com/autodesk/components/workspaceItem/addItem/addItem.js',
	'com/autodesk/components/workspaceItem/changeOwner/changeOwner.js',
	'com/autodesk/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.js',
	'com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.js',
	'com/autodesk/components/workspaceItem/viewAttachedItems/viewAttachedItems.js',
	'com/autodesk/components/workspaceItem/viewAttachments/viewAttachments.js',
	'com/autodesk/components/workspaceItem/viewChangeLog/viewChangeLog.js',
	'com/autodesk/components/workspaceItem/viewDetails/viewDetails.js',
	'com/autodesk/components/workspaceItem/viewBom/viewBom.js',
	'com/autodesk/components/workspaceItem/viewGrid/viewGrid.js',
	'com/autodesk/components/workspaceItem/viewMilestones/viewMilestones.js',
	'com/autodesk/components/workspaceItem/viewNamedRelationships/viewNamedRelationships.js',
	'com/autodesk/components/workspaceItem/viewProjectManagement/viewProjectManagement.js',
	'com/autodesk/components/workspaceItem/viewRelationships/viewRelationships.js',
	'com/autodesk/components/workspaceItem/viewWipAttachments/viewWipAttachments.js',
	'com/autodesk/components/workspaceItem/viewWorkflow/viewWorkflow.js',
	'com/autodesk/components/workspaceItem/viewWorkflowActions/viewWorkflowActions.js',
	'com/autodesk/components/workspaceItem/viewSourcing/viewSourcing.js',
	'com/autodesk/components/featureToggle/featureToggle.js',
	'com/autodesk/components/workspaceItem/viewBom/bomPinning.directive.js',
	'com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.js',
	'com/autodesk/components/plmTableCheckbox/plmTableCheckbox.js',

	'com/autodesk/dropdown.js',
	'com/autodesk/apiModelsManager.js',
	'com/autodesk/plm-bom-module.js',

	'plm.httpInterceptor',
	'plm360.models',
	'ADSK.HttpInterceptorService',
	'ngAnimate',
	'ngMaterial',
	'ngAria',
	'ui.grid',
	'ui.grid.autoResize',
	'ui.grid.resizeColumns',
	'ui.grid.moveColumns',
	'ui.grid.treeView',
	'ui.grid.selection',
	'ui.mask',
	'com/autodesk/cpdm.js',
	'digitalfondue.dftabmenu',
	'highcharts-ng',
	'ngFileSaver'
]);

var plm360ResolveConfig = angular.module('plm360.resolveConfig');

plm360.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	'$uiViewScrollProvider',
	'$controllerProvider',
	'$compileProvider',
	'LocalizationServiceProvider',
	'NotificationServiceProvider',
	'$urlMatcherFactoryProvider',
	function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider, $controllerProvider, $compileProvider, LocalizationServiceProvider, NotificationServiceProvider, $urlMatcherFactoryProvider) {
		$locationProvider.html5Mode(true);
		$uiViewScrollProvider.useAnchorScroll();

		LocalizationServiceProvider.setPathToLocaleBundles('lib/plm-localization/dist');
		NotificationServiceProvider.setPathToTemplates('lib/plm-notification/dist');

		// Resolve for workspace item
		var workspaceItemResolves = plm360ResolveConfig.getResolve('workspaceItem');
		/**
		 * Permission check for workspace item
 		 * @param {Object} $state : routing state
		 * @param {Object} $stateParams : state params
		 * @param {Object} $location : location service
		 * @param {Object} $q : promise service
		 * @param {Object} $timeout : timeout service
		 * @param {Object} ModelsManager : model manager service
		 * @param {Object} EventService : event service
		 * @returns {Object} a promise that will be resolved or reject based on the permission.
		 */
		workspaceItemResolves.checkPerm = function ($state, $stateParams, $location, $q, $timeout, ModelsManager, EventService) {
			var deferred = $q.defer();
			var itemListenerId = EventService.listen('itemInstance:' + $location.search().itemId + ':done', function (event, itemObj) {
				EventService.unlisten(itemListenerId);
				deferred.resolve(itemObj);
			});
			var itemErrorListenerId = EventService.listen('preItemInstance:' + $location.search().itemId + ':rejected', function (event, itemObj) {
				EventService.unlisten(itemErrorListenerId);
				if (itemObj.status !== 303) {
					if ($state.current.url === '^') {
						$state.go('dashboard');
					}
					$timeout(function () {
						EventService.send('forbiddenAccess:permissionDenied', {showNow: true});
					}, 500);
					deferred.reject();
				} else {
					deferred.resolve();
				}
			});
			ModelsManager.getItem($location.search().itemId);
			return deferred.promise;
		};

		// Resolve for workspace items list
		var workspaceItemsResolves = plm360ResolveConfig.getResolve('workspaceItems');

		/**
		 * Permission check for workspace items
		 * @param {Object} $state : routing state
		 * @param {Object} $stateParams : state params
		 * @param {Object} $location : location service
		 * @param {Object} $q : promise service
		 * @param {Object} $timeout : timeout service
		 * @param {Object} ModelsManager : model manager service
		 * @param {Object} EventService : event service
		 * @returns {Object} a promise that will be resolved or reject based on the permission.
		 */
		workspaceItemsResolves.checkPerm = function ($state, $stateParams, $location, $q, $timeout, ModelsManager, EventService) {
			var deferred = $q.defer();
			var promises = [];
			var workspaceId = $stateParams.workspaceId;
			var workspacesListenerId = EventService.listen('workspaces:' + workspaceId + ':done', function (event1, workspacesObj) {
				EventService.unlisten(workspacesListenerId);

				if (workspacesObj.getWorkspaceLink(workspaceId)) {
					deferred.resolve();
				} else {
					// TODO: This case needs to be handled for permissions. If user doesn't have a 'VIEW_ITEM' permission
					// TODO: on the workspace, then {@link Workspaces} will not have the link for it. We need to handle this
					// TODO: in a better way to properly communicate this to user.
					if ($state.current.url === '^') {
						$state.go('dashboard');
					}
					$timeout(function () {
						EventService.send('forbiddenAccess:permissionDenied', {showNow: true});
					}, 500);
					deferred.reject();
				}
			});
			ModelsManager.getWorkspaces('workspaces:' + workspaceId + ':get');
			promises.push(deferred.promise);
			return $q.all(promises);
		};

		/**
		 * Custom type for urn state parameter. This type will ensure encoding and decoding of item urn.
		 */
		$urlMatcherFactoryProvider.type('UrnType', {}, function (UrnParser) {
			return {
				encode: function (urn) {
					return UrnParser.encode(urn);
				},

				decode: function (encodedUrn) {
					return UrnParser.decode(encodedUrn);
				},
				is: function (urn) {
					// Check that object is a valid urn
					return angular.isString(urn);
				},
				equals: function (a, b) {
					return a === b;
				}
			};
		});

		/**
		 * controller provider for attachments ui states (view and edit).
		 * @param {Boolean} isWipEnabled : true, if WIP feature is enabled.
		 * @returns {String} controller name to be used with the state.
		 */
		var attachmentsControllerProvider = function (isWipEnabled) {
			var controllerName = isWipEnabled === true ? 'ViewWipAttachmentsController' : 'ViewAttachmentsController';
			return controllerName + ' as viewAttachmentsCtrl';
		};

		/**
		 * template provider for attachments ui states (view and edit).
		 * @param {Object} $templateRequest template request service to get html from url.
		 * @param {Boolean} isWipEnabled : true, if WIP feature is enabled.
		 * @returns {String} html
		 */
		var attachmentsTemplateProvider = function ($templateRequest, isWipEnabled) {
			return $templateRequest(isWipEnabled === true ?
				'build/components/workspaceItem/viewWipAttachments/viewWipAttachments.html' :
				'build/components/workspaceItem/viewAttachments/viewAttachments.html');
		};

		// resolve object for attachments ui states (view and edit).
		var attachmentsResolveObj = {
			isWipEnabled: function (ModelsManager, EventService, $q, _) {
				var deferObj = $q.defer();
				var listenerId = EventService.listen('enabledFeatures:tenant:done', function (event, obj) {
					EventService.unlisten(listenerId);

					var features = obj.getDisplayableData();
					var wipFeature = _.find(features.data, function (feature) {
						return feature && feature.title && feature.title === 'wip.attachment';
					});

					deferObj.resolve(!!wipFeature);
				});
				ModelsManager.getEnabledFeatures();
				return deferObj.promise;
			}
		};

		$stateProvider

		/* Classic PLM */
		.state('classic', {
			controller: function () {
				window.location.href = '/';
			},
			template: '<div></div>'
		})

		/* Base */
		.state('app', {
			abstract: true,
			url: '',
			templateUrl: 'build/components/plmWrapper/plmWrapper.html',
			controller: 'PLMWrapperController',
			resolve: plm360ResolveConfig.getResolve('init')
		})

		/* Login */
		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginController'
		})
		.state('login-redirect', {
			url: '/redirect',
			templateUrl: 'templates/loginRedirect.html',
			controller: 'LoginController'
			// access: {unrestricted: true}
		})

		/* Dashboard */
		.state('dashboard', {
			parent: 'app',
			url: '/mainDashboard',
			templateUrl: 'mainDashboard.html',
			controller: 'MainDashboardController',
			params: {
				pageTitle: 'pageTitle.dashboard'
			}
		})

		/* Search */
		.state('search', {
			parent: 'app',
			url: '/search',
			templateUrl: 'search.html',
			controller: 'SearchPlmController as searchPlmCtrl',
			params: {
				pageTitle: 'pageTitle.search'
			}
		})

		/* Roamer */
		.state('roamer', {
			parent: 'app',
			url: '/roamer/:itemUrn',
			templateUrl: 'roamer.html',
			controller: 'RoamerController as roamerCtrl',
			params: {
				pageTitle: 'pageTitle.roamer',
				itemTab: 'details'
			}
		})

		/* Roamer Item (with nested views) */
		.state('roamer-item', {
			abstract: true,
			parent: 'roamer',
			views: {
				'itemviewer@app': {
					templateUrl: 'build/components/itemViewer/itemViewerContent.html'
				}
			}
		})

		/* Roamer Item Details - BEGIN */
		.state('details-view-roamer', {
			parent: 'roamer-item',
			url: '/itemDetails?view&tab&item&mode&itemId&cached&query',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewDetails/viewDetails.html',
					controller: 'ViewDetailsController as viewDetailsCtrl'
				}
			}
		})
		.state('details-edit-roamer', {
			parent: 'roamer-item',
			url: '/itemDetails?view&tab&item&mode&itemId&cached',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewDetails/viewDetails.html',
					controller: 'ViewDetailsController as viewDetailsCtrl'
				}
			}
		})
		/* Roamer Item Details - END */

		/* Jitterbit Integration View */
		.state('jitterbit', {
			parent: 'app',
			url: '/plmJitterBit',
			templateUrl: 'jitterbit.html',
			controller: 'plmJitterbitIntegrationController',
			params: {
				pageTitle: 'pageTitle.jitterBit'
			}
		})

		/* Workspace Items List */
		.state('workspace-items-list', {
			parent: 'app',
			url: '/workspaces/:workspaceId/items',
			views: {
				'': {
					templateUrl: 'components/workspaceItems/workspaceItems.html',
					controller: 'WorkspaceItemsController'
				}
			},
			resolve: workspaceItemsResolves
		})

		/* Workspace Item (with nested views) */
		.state('workspace-item', {
			abstract: true,
			parent: 'workspace-items-list',
			views: {
				'itemviewer@app': {
					templateUrl: 'build/components/itemViewer/itemViewerContent.html'
				}
			},
			resolve: workspaceItemResolves
		})

		/* Add Item - BEGIN */
		.state('add-item', {
			parent: 'app',
			url: '/workspaces/:workspaceId/addItem',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/addItem/addItem.html',
					controller: 'AddItemController as addItemCtrl'
				}
			},
			params: {
				pageTitle: 'pageTitle.addItem'
			}
		})
		/* Add Item - END */

		/* Item Details - BEGIN */
		.state('details', {
			parent: 'workspace-item',
			url: '/itemDetails?view&tab&mode&itemId&cached',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewDetails/viewDetails.html',
					controller: 'ViewDetailsController as viewDetailsCtrl'
				}
			}
		})
		/* Item Details - END */

		/* Affected Item - BEGIN */
		.state('affected-items', {
			parent: 'workspace-item',
			url: '/affectedItems?view&{itemId:UrnType}&mode&tab',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewAffectedItems/viewAffectedItems.html',
					controller: 'ViewAffectedItemsController as affectedItemsCtrl'
				}
			},
			params: {
				updatedItems: [] // To support bulk edit feature.
			}
		})
		/* Affected Item - END */

		/* BOM Item - BEGIN */
		.state('bom', {
			parent: 'workspace-item',
			url: '/bom?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewBom/viewBom.html',
					controller: 'ViewBomController as viewBomCtrl'
				}
			}
		})
		/* BOM Item - END */

		/* Grid Item - BEGIN */
		.state('grid', {
			parent: 'workspace-item',
			url: '/grid?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewGrid/viewGrid.html',
					controller: 'ViewGridController as viewGridCtrl'
				}
			}
		})
		/* Grid Item - END */

		/* Workflow Map Item - BEGIN */
		.state('workflow-map', {
			parent: 'workspace-item',
			url: '/workflowMap?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewWorkflowActions/viewWorkflowActions.html',
					controller: 'ViewWorkflowActionsController as workflowActionsCtrl'
				}
			}
		})
		/* Workflow Map Item - END */

		/* Change Log Item - BEGIN */
		.state('change-log', {
			parent: 'workspace-item',
			url: '/changeLog?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewChangeLog/viewChangeLog.html',
					controller: 'ViewChangeLogController as viewChangeLogCtrl'
				}
			},
			resolve: {
				checkPerm: function ($q, $timeout) {
					var deferred = $q.defer();
					$timeout(function () {
						deferred.resolve();
					}, 5000);
					return deferred.promise;
				}
			}
		})
		/* Change Log Item - END */

		/* Relationships Item - BEGIN */
		.state('relationships', {
			parent: 'workspace-item',
			url: '/relationships?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewRelationships/viewRelationships.html',
					controller: 'ViewRelationshipsController as viewRelationshipsCtrl'
				}
			},
			params: {
				addedItems: [] // For items that have been added but need to be edited before saving
			}
		})
		/* Relationships Item - END */

		/* Project Management Item - BEGIN */
		.state('project-management', {
			parent: 'workspace-item',
			url: '/project-management?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewProjectManagement/viewProjectManagement.html',
					controller: 'ViewProjectManagementController as viewProjectManagementCtrl'
				}
			}
		})
		/* Project Management Item - END */

		/* Workflow Item - BEGIN */
		.state('workflow', {
			parent: 'workspace-item',
			url: '/workflow?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewWorkflow/viewWorkflow.html',
					controller: 'ViewWorkflowController as viewWorkflowCtrl'
				}
			}
		})
		/* Workflow Item - END */

		/* Milestones Item - BEGIN */
		.state('milestones', {
			parent: 'workspace-item',
			url: '/milestones?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewMilestones/viewMilestones.html',
					controller: 'ViewMilestonesController as viewMilestonesCtrl'
				}
			}
		})
		.state('milestones-view', {
			parent: 'workspace-item',
			url: '/milestones?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewMilestones/viewMilestones.html',
					controller: 'ViewMilestonesController as viewMilestonesCtrl'
				}
			}
		})
		.state('milestones-edit', {
			parent: 'workspace-item',
			url: '/milestones?view&tab&item&mode&itemId',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewMilestones/viewMilestones.html',
					controller: 'ViewMilestonesController as viewMilestonesCtrl'
				}
			}
		})
		/* Milestones Item - END */

		/* Attachments Item - BEGIN */
		.state('attachments', {
			parent: 'workspace-item',
			url: '/attachments?view&tab&mode&{itemId:UrnType}',
			views: {
				'': {
					controllerProvider: attachmentsControllerProvider,
					templateProvider: attachmentsTemplateProvider
				}
			},
			resolve: attachmentsResolveObj
		})
		/* Attachments Item - END */

		.state('named-relationships', {
			parent: 'workspace-item',
			url: '/namedRelationships?view&tab&item&mode&itemId&relationshipKey',
			views: {
				'': {
					templateUrl: 'build/components/workspaceItem/viewNamedRelationships/viewNamedRelationships.html',
					controller: 'ViewNamedRelationshipsController as viewNamedRelationshipsCtrl'
				}
			}
		})

		/* Item Managed Items */
		.state('workspace-item-managed-items', {
			url: '/workspaceItems/:workspaceId/:itemId/managedItems',
			templateUrl: 'templates/workspaceItemManagedItems.html',
			controller: 'WorkspaceItemManagedItemsController',
			resolve: plm360ResolveConfig.getResolve('itemManagedItems')
		})

		/* generic 404 for "not found" */
		.state('not-found', {
			parent: 'app',
			url: '/notFound',
			templateUrl: 'templates/notFound.html'
		});

		/* Ui router consider path and path with trailing slash as two different states. For example: /workspaceItems/10/1 is not
		 * same as /workspaceItems/10/1/. To allow these paths to be treated similarly, we need to add custom rule to remove trailing
		 * slash from the path. */
		$urlRouterProvider.rule(function ($injector, $location) {
			var path = $location.path();
			var hasTrailingSlash = path[path.length - 1] === '/';

			if (hasTrailingSlash) {
				// if last character is a slash, return the same url without the slash
				var newPath = path.substr(0, path.length - 1);
				return newPath;
			}
		});

		/* Landing rule to redirect to dashboard */
		$urlRouterProvider.when('/', '/mainDashboard');
		/* Redirect to workspace-items-list */
		$urlRouterProvider.when('/workspaces/:workspaceId', '/workspaces/:workspaceId/items');
		/* Redirect to generic 404 for "not found" */
		$urlRouterProvider.otherwise('/notFound');
	}
]);

/*
 * Handles state switching, for displaying the loader
 *
 */
plm360.run([
	'$rootScope',
	'$window',
	'LoadingDataService',
	function ($root, $window, LoadingDataService) {

		var requestedPath = null;

		// handle the start of the state change
		$root.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			// don't account for first loads
			if (angular.isDefined(fromState) && angular.isDefined(fromState.name)) {
				if (requestedPath !== null) { // still in the middle of a loading, therefore user probably navigated away
					LoadingDataService.stateChangeSwitch(event, toState, toParams, fromState, fromParams);
				}
			}

			if (angular.isDefined(toState.url)) {
				requestedPath = toState.url;
			}

			if (requestedPath !== null) {
				LoadingDataService.stateChangeStart(event, toState, toParams, fromState, fromParams);
			}
		});

		// handle state change success
		$root.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			requestedPath = null;

			LoadingDataService.stateChangeFinished(event, toState, toParams, fromState, fromParams);
		});

		// handle state change error
		$root.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
			LoadingDataService.stateChangeError(event, toState, toParams, fromState, fromParams);
		});

		// Let's do this in some other way, since we can just remove the plm-animations.scss reference from the index.tpl.html file
		// if (document.URL.match(/\?.*noAnimations/)) {
		// 	document.querySelector('html').className = 'no-animations';
		// }

	}
]);

/*
 * Theme configuration for xeditable
 */
// plm360.run(function (editableOptions) {
// 	editableOptions.theme = 'bs3'; // bootstrap3 theme, matching the rest of the product
// });

/*
 * Set dynamic localization folder location for angular's locale files
 *
 */
plm360.config([
	'tmhDynamicLocaleProvider',
	function (tmhDynamicLocaleProvider) {
		tmhDynamicLocaleProvider.localeLocationPattern('lib/angular-i18n/angular-locale_{{locale}}.js');
	}
]);

/*
 * Configure Restangular
 *
 * (need to create a provider to act as a wrapper for this, to be more elegant and run on 'config', not 'run')
 *
 */

plm360.config([
	'RestangularProvider',
	function (RestangularProvider) {
		// need to access unrestangularized element
		RestangularProvider.setResponseExtractor(function (response, operation, what, url, fullResponse) {
			// Post response of workspace item only request status code and location. For details please see
			// {@link http://vantage.autodesk.com/wiki/index.php/Item_Details#POST_.2Fapi.2Fv3.2Fworkspaces.2FworkspaceId.2Fitems}
			//
			// Therefore, for post requests that results in empty response, we need to devise a way to convey information (which
			// is the location of the newly created workspace item, in the above mentioned scenario) to the component that
			// initiated the request.
			// Please see {@link https://github.com/mgonto/restangular/issues/128} for a discussion related to this problem.
			// One possible solution is to explicitly create a response with 'location' property in this special case. 'setFullResponse'
			// is another solution but will require changes across application and 'CORS' related headers will not fit well.
			if (operation === 'post' && fullResponse.headers('Location') !== '' && !response) {
				return {
					location: fullResponse.headers('Location')
				};
			}

			var newResponse = response;
			if (angular.isDefined(response) && response !== '') {
				if (angular.isArray(response)) {
					angular.forEach(newResponse, function (value, key) {
						newResponse[key].originalElement = angular.copy(value);
					});
				} else if (angular.isObject(response)) {
					newResponse.originalElement = angular.copy(response);
				}
			}

			return newResponse;
		});
		RestangularProvider.setFullResponse(true);
	}
]).run([
	'GlobalSettings',
	'Restangular',
	'EventService',
	function (GlobalSettings, Restangular, EventService) {
		Restangular.setDefaultHttpFields({
			cache: false,
			timeout: GlobalSettings.requestTimeout
		});
	}
]);

/**
* Set useApplyAsync in $httpProvider
*
*/
plm360.config(function ($httpProvider) {
	$httpProvider.useApplyAsync(true);
});

/**
* Load the Models to setup listeners
*/
plm360.run([
	'OutstandingWork',
	'BookmarkedItems',
	'RecentlyViewed',
	'Reports',
	'Report',
	'User',
	'UserPermissions',
	'Workspaces',
	'Workspace',
	'Views',
	'View',
	'Items',
	'Item',
	'BomRootListeners',
	'BomNested',
	'BomNestedItemListeners',
	'ViewDefinitionsListeners',
	'ViewDefinitionListeners',
	'ViewDefinitionFieldListeners',
	'BulkBomListeners',
	'Tabs',
	'Transitions',
	'Revisions',
	'State',
	'ChangeLog',
	'GridData',
	'GridMeta',
	'AffectedItems',
	'AffectedItem',
	'AffectedItemsMeta',
	'LinkedItemTransitions',
	'LinkableItems',
	'LinkedToWorkspaces',
	'Milestones',
	'RelatedItems',
	'RelatedItem',
	'Sourcings',
	'SourcingQuotes',
	'ProjectItems',
	'Workflow',
	'RelatedWorkspaces',
	'Ownership',
	'Groups',
	'RelatedBomItems',
	'RelatedBomItem',
	'NamedRelationshipsItem',
	'NamedRelationshipsItems',
	'EnabledFeatures',
    'Picklist',
	'ConfigurationsListeners',
	'WorkspaceTableau',
	function () {}
]);
