'use strict';

/**
 * @ngdoc object
 * @name Controllers.PLMHeaderController
 *
 * @description This controller is the application header,
 * present in almost all pages.
 *
 * ##Dependencies
 *
 */
angular.module('plm360.plmHeader').controller('PLMHeaderController', ['$rootScope', '$scope', '$state', '$stateParams', '$window', '$mdDialog', '$log', '$filter', '$q', 'AuthenticationService', 'EventService', 'LocalizationService', 'ModelsManager', 'PLMPermissions', '_', 'RESTWrapperService', '$location', function ($rootScope, $scope, $state, $stateParams, $window, $mdDialog, $log, $filter, $q, AuthenticationService, EventService, LocalizationService, ModelsManager, PLMPermissions, _, RESTWrapperService, $location) {

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#workspaceId
  * @propertyOf Controllers.PLMHeaderController
  * @description The workspace id
  */
	$scope.workspaceId = $stateParams.workspaceId;

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#headerText
  * @propertyOf Controllers.PLMHeaderController
  * @description The title of the page (label that will go at the top)
  */
	$scope.headerText = '';

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#currentWorkspace
  * @propertyOf Controllers.PLMHeaderController
  * @description The current workspace object, if in workspace context
  */
	$scope.currentWorkspace = null;

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#searchQuery
  * @propertyOf Controllers.PLMHeaderController
  * @description Holds the value in the query param of the url
  * for the search PLM directive
  */
	$scope.searchQuery = null;

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#workspaceErrorListenerId
  * @propertyOf Controllers.PLMHeaderController
  * @description The reference of the workspaces errors listener
  */
	var workspaceErrorListenerId = '';

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#workspaceTypeId
  * @propertyOf Controllers.PLMHeaderController
  * @description `private` Stores the current workspace type id that is loaded
  */
	var workspaceTypeId = '';

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#itemListenerId
  * @propertyOf Controllers.PLMHeaderController
  * @description `private` Stores the listener for the item data
  */
	var itemListenerId = '';

	/**
  * @ngdoc property
  * @name Controllers.PLMHeaderController#isAddItemPage
  * @propertyOf Controllers.PLMHeaderController
  * @description `private` Stores the listener for the item data
  */
	$scope.isAddItemPage = null;

	// initialize localization bundle
	// this caused the script to halt, causing reload to not load revisions
	var localizationPromise = LocalizationService.init().then(function () {
		$scope.bundle = $rootScope.bundle;
		$scope.createBtnTooltip = $rootScope.bundle.create.createNewItem;
	});

	// Listens for workspace loading
	var workspaceListenerId = EventService.listen('workspaceInstance:*:done', function (event, workspaceObj) {
		if (workspaceObj.getId() === $stateParams.workspaceId) {
			// Sets current workspace
			$scope.currentWorkspaceObj = workspaceObj;

			// Re-assigns the workspaceId variable
			$scope.workspaceId = workspaceObj.getId();

			// Sets the header text (plain workspace name if in workspace items list, or item),
			// otherwise user is at the add item page, hence append the workspace name
			// to the header text
			if (angular.isDefined($stateParams.pageTitle)) {
				// The following check is necessary (albeit ugly) to avoid appending the workspace name
				// multiple times to the header text, when the user interrupts browsing from
				// one page to another, or the pages loads very quickly
				if ($scope.headerText.indexOf(workspaceObj.getDisplayName()) === -1) {
					$scope.headerText += ' ' + workspaceObj.getDisplayName();
				}
			} else {
				$scope.headerText = workspaceObj.getDisplayName();
			}
		}
	});

	/**
  * @ngdoc method
  * @name Controllers.PLMHeaderController#setUpPageHeader
  * @methodOf Controllers.PLMHeaderController
  * @description `private` Sets up the header
  * (e.g. title set in the app.js if it's available in the route params,
  * plus buttons and other dropdowns)
  */
	var setUpPageHeader = function setUpPageHeader() {

		// If it's in the add item page, set up the var as to hide some elements from view
		$scope.isAddItemPage = $location.path().indexOf('/addItem') > -1;

		// make sure localization bundle is loaded
		localizationPromise.then(function () {

			// Custom title, from app definition
			if (angular.isDefined($stateParams.pageTitle)) {

				// Resets current workspace
				$scope.currentWorkspace = null;

				// Find the key in localization
				$scope.headerText = $stateParams.pageTitle.split('.').reduce(function (obj, i) {
					return obj[i];
				}, $rootScope.bundle);

				// If adding an item, triggers the loading of workspace information,
				// so the workspace name will be appended to the header text
				if (angular.isDefined($stateParams.workspaceId)) {
					ModelsManager.getWorkspace($stateParams.workspaceId);
				}
			} else {
				// Dynamic title (workspace or item)

				$scope.currentWorkspace = null;

				// If looking at workspace items list (not in an item)
				if (angular.isDefined($stateParams.workspaceId)) {

					ModelsManager.getWorkspace($stateParams.workspaceId);

					// Listens for a permission error when loading information from the workspace
					workspaceErrorListenerId = EventService.listen('workspaceInstance:' + $stateParams.workspaceId + ':permissionError', function (event, errorObj) {
						// Blanks out the name, in case the user arrived back at this workspace after the permission was revoked
						// by means other than reloading the page
						// NOTE: see this method on ModelsManager - we have to handle this more gracefully in another user story
						$scope.headerText = '';
					});
				} else {
					// This state should not exist, but just catching it here as a warning
					$log.warn('This state should not exist - something\'s wrong with the workspaceId or itemId?');
				}
			}
		});
	};

	// Listens for whenever a new content or view has been loaded in the
	// Note: whenever a pageTitle has been set in the route, it will take precedence
	// over workspaceId and itemId-set titles
	EventService.listen('contentLoad:done', setUpPageHeader);
	EventService.listen('viewLoad:done', setUpPageHeader);

	// This will run only once, for the first time, the the header has finished loading (for whenever the user       
	// reloads the page). This will probably go away once we sort out all changes to the routes
	$scope.$evalAsync(function (event) {
		EventService.send('contentLoad:done');
	});

	// Unlistens to events when removing this directive
	$scope.$on('$destroy', function () {
		EventService.unlisten(workspaceErrorListenerId);
	});
}]);
//# sourceMappingURL=PLMHeaderController.js.map
