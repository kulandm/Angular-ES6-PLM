/**
 * @ngdoc object
 * @name Controllers.ItemHeaderController
 *
 * @description This controller is attached to ItemHeaderDirective
 *
 * ##Dependencies
 *
 */
class ItemHeaderController {
	/*
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#constructor
	 * @methodOf Controllers.ItemHeaderController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $stateParams, $q, $filter, ModelsManager, EventService, FlyoutService, PLMPermissions, _) {
		var that = this;
		this.$state = $state;
		this.$q = $q;
		this.$filter = $filter;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.PLMPermissions = PLMPermissions;
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#workspaceId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The workspace id associated with the item header
		 */
		this.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#itemId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The item id associated with the item header
		 */
		this.itemId = $stateParams.itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#workspaceIcon
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The CSS class name of the icon for this workspace
		 */
		this.workspaceIcon = '';

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#workspacesListenerId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The reference of the workspaces event listener
		 */
		this.workspacesListenerId = EventService.listen('workspaces:' + this.workspaceId + ':done', function (event, WorkspacesObj) {
			that.workspaceIcon = WorkspacesObj.getSectionIcon(that.workspaceId);
		});

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#workspaceListenerId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The reference of the workspace event listener
		 */
		this.workspaceListenerId = '';

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#ItemObj
		 * @propertyOf Controllers.ItemHeaderController
		 * @description `private` Holds the item data
		 */
		this.ItemObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#itemData
		 * @propertyOf Controllers.ItemHeaderController
		 * @description Object containing data for this item, untouched, from the endpoint
		 */
		this.itemData = {};

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#itemListenerId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The reference of the workspace item event listener
		 */
		this.itemListenerId = EventService.listen('itemInstance:' + this.itemId + ':done', function (event, itemObj) {
			that.ItemObj = itemObj;
			that.itemData = itemObj.getFullList();
		});

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#UserObj
		 * @propertyOf Controllers.ItemHeaderController
		 * @description `private` Holds the user data
		 */
		this.UserObj = {
			getDateFormat: function () {
				return 'yyyy';
			}
		};

		this.hasViewWorkflowPermission = true;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#currentUserListenerId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description The reference of the user event listener
		 */
		this.currentUserListenerId = this.EventService.listen('currentUser:currentUser:done', function (event, userObj) {
			that.UserObj = userObj;
			that.hasViewWorkflowPermission = that.UserObj.hasPermission(that.PLMPermissions.VIEW_WORKFLOW);
		});

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#bundle
		 * @propertyOf Controllers.ItemHeaderController
		 * @description Assigns the local scope's bundle to the $rootScope bundle for localization keys
		 */
		this.bundle = $rootScope.bundle;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#revisioningTranslationKeys
		 * @propertyOf Controllers.ItemHeaderController
		 * @description `private` Stores the reference to the localization keys.
		 */
		this.revisioningTranslationKeys = {
			// NEVER_IN_EFFECT: $rootScope.bundle.revision.neverInEffect, // Temporarily not being used
			OBSOLETE: $rootScope.bundle.revision.obsolete,
			PENDING: $rootScope.bundle.revision.pending,
			LATEST: $rootScope.bundle.revision.latest,
			SUPERSEDED: $rootScope.bundle.revision.superseded,
			UNRELEASED: $rootScope.bundle.revision.unreleased,
			WORKING: $rootScope.bundle.revision.working
		};

		$scope.$on('$destroy', function () {
			that.EventService.unlisten(that.workspacesListenerId);
			that.EventService.unlisten(that.itemListenerId);
			that.EventService.unlisten(that.currentUserListenerId);
			that.EventService.unlisten(that.itemArchiveListenerId);
			that.EventService.unlisten(that.itemUnarchiveListenerId);
			that.EventService.unlisten(that.transitionsListenerId);
		});

		// Listens for changing the status of the archive/unarchive flag
		this.itemArchiveListenerId = this.EventService.listen('item:archive:success', this.loadData, true);
		this.itemUnarchiveListenerId = this.EventService.listen('item:unarchive:success', this.loadData, true);

		this.transitionsListenerId = this.EventService.listen('transitions:*:change', function (event, selectedTransition, cell) {
			var transition = {};
			that._.each(that.workflowTransitions, function (workflowTransition) {
				var fromState = workflowTransition.fromState.link;
				fromState = fromState.substring(fromState.lastIndexOf('/') + 1);
				var toState = workflowTransition.toState.link;
				toState = toState.substring(toState.lastIndexOf('/') + 1);

				if (parseInt(fromState) === cell.fromState && parseInt(toState) === cell.toState) {
					transition = workflowTransition;
				}
			});
			that.workflowFlyout.selectedTransition = transition;
			that.changeWorkflowTransition(transition, selectedTransition);
		});

		// Calls the loading of data from models for the first time
		this.loadData();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#cancelTransition
	 * @methodOf Controllers.ItemHeaderController
	 * @description Closes workflow action transition flyout and reset the action.
	 */
	cancelTransition() {
		this.workflowFlyout.selectedTransition = null;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#changeWorkflowTransition
	 * @methodOf Controllers.ItemHeaderController
	 * @description Handles workflow action change.
	 */
	changeWorkflowTransition(selectedTransition, selectedTransitionId) {
		var that = this;
		this.workflowFlyout.selectedTransition = selectedTransition;

		var anchorEl = angular.element(document.querySelectorAll('#workflow-transition-control')[0]);

		var flyoutInstance = this.FlyoutService.open({
			templateUrl: 'build/components/itemHeader/workflowTransition.html',
			// scope: that,
			anchorEl: angular.element(document.querySelectorAll('#workflow-transition-control')[0]),
			placement: 'bottom-left',
			flyoutClass: 'workflow-flyout',
			controller: 'WorkflowTransitionController',
			resolve: {
				TransitionObj: function () {
					return selectedTransition;
				},
				AnchorElWidth: function () {
					return anchorEl[0].clientWidth;
				}
			}
		});

		flyoutInstance.closed.then(function (result) {
			that.proceedTransition(result, selectedTransitionId);
		}, function () {
			that.cancelTransition();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#changeRevision
	 * @methodOf Controllers.ItemHeaderController
	 * @description Changes the revision of an item (essentially, a link to another item).
	 */
	changeRevision(revision) {
		// The id of the item from the revision endpoint
		var itemId = revision.id;

		// Switches to selected item
		/* global $state */
		$state.go('details', {
			workspaceId: this.workspaceId, // Revisions are always in the same workspace, so this is a valid assumption
			itemId: itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#loadData
	 * @methodOf Controllers.ItemHeaderController
	 * @description Loads the models, and bind them to local objects - this method will be called
	 * by an event listener whenever data has changed somewhere else, and the models need to be reloaded,
	 * because two-way data binding doesn't trigger normally
	 */
	loadData() {
		var that = this;
		this.workspaceListenerId = this.EventService.listen('workspaceInstance:' + this.workspaceId + ':done', function (event, WorkspaceObj) {
			that.processWorkspaceObj(WorkspaceObj);
		});
		this.ModelsManager.getWorkspaces('workspaces:' + this.workspaceId + ':get');
		this.ModelsManager.getWorkspace(this.workspaceId);
		this.ModelsManager.getItem(this.workspaceId, this.itemId);
		this.ModelsManager.getCurrentUser();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#revisioningTranslationKeys
	 * @methodOf Controllers.ItemHeaderController
	 * @description `private` Helper method to retrieve a list of transitions (DRY)
	 *
	 */
	fetchTransitions() {
		var that = this;
		this.ModelsManager.getTransitions(this.workspaceId, this.itemId);
		var itemTransitionsListenerId = this.EventService.listen('itemTransitions:' + this.itemId + ':done', function (event, TransitionsObj) {
			that.EventService.unlisten(itemTransitionsListenerId);

			// Filter transitions based on user permission.
			that.workflowTransitions = that._.filter(TransitionsObj.transitions, function (transition) {
				// TODO: unable to get transition level permissions, need to fix rest end point.
				return true; // transition.permission ? UserObj.hasPermission(parseInt(transition.permission.link.substring(transition.permission.link.lastIndexOf('/') + 1))) : true;
			});

			// TODO: this is a bad bad way for getting current state information. It will not work for a state with no
			// outward transitions or no allowed transitions.
			if (TransitionsObj.transitions && TransitionsObj.transitions.length > 0) {
				that.currentStateName = TransitionsObj.transitions[0].fromState.title;
			} else {
				// TODO: give it an equally bad place holder to remind us that we need to fix it, quickly.
				that.currentStateName = 'Not Found';
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.ItemHeaderController#processWorkspaceObj
	 * @methodOf Controllers.ItemHeaderController
	 * @description Define the workspace (type)
	 *
	 * @param {Object} WorkspaceObj The workspace object
	 */
	processWorkspaceObj(WorkspaceObj) {
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemHeaderController#workspaceTypeId
		 * @propertyOf Controllers.ItemHeaderController
		 * @description A string describing the type of this workspace
		 */
		this.workspaceTypeId = WorkspaceObj.getTypeId();

		this.EventService.unlisten(this.workspaceListenerId);

		// Determined the type of workspace, and display the corresponding widgets
		// This is not taking into account permissions, for now (improve it later)
		// these workspace types contain workflow
		// BASIC_AND_WORKFLOW
		// REVISIONING
		// SUPPLIER_AND_WORKFLOW
		// these workspace types don't have workflow
		// REVISION_CONTROLLED (but contains revisioning, covered below)
		// BASIC
		// SUPPLIER
		switch (this.workspaceTypeId) {
			// These are workflow-controlled workspaces, that display the workflow transitions widget
			case 'BASIC_AND_WORKFLOW':
			case 'REVISIONING':
			case 'SUPPLIER_AND_WORKFLOW':

				/**
				 * @ngdoc property
				 * @name Controllers.ItemHeaderController#workflowFlyout
				 * @propertyOf Controllers.ItemHeaderController
				 * @description Object containing workflow transition flyout related properties.
				 */
				this.workflowFlyout = {
					/**
					 * @ngdoc property
					 * @name Controllers.ItemHeaderController#workflowFlyout#selectedTransition
					 * @propertyOf Controllers.ItemHeaderController
					 * @description The workflow transition selected by the user.
					 */
					selectedTransition: null
				};

				this.fetchTransitions();

				break;

			// This is a revision-controlled workspace, that displays the revisioning dropdown
			case 'REVISION_CONTROLLED':
				this.ModelsManager.getRevisions(this.workspaceId, this.itemId);
				var itemRevisionsListenerId = this.EventService.listen('itemRevisions:' + this.itemId + ':done', function (event, RevisionsObj) {
					that.EventService.unlisten(itemRevisionsListenerId);

					/**
					 * @ngdoc property
					 * @name Controllers.ItemHeaderController#revisionTagStr
					 * @propertyOf Controllers.ItemHeaderController
					 * @description Builds the object for the revisioning (dropdown and effective date)
					 */
					that.revisioningData = RevisionsObj.json;

					/**
					 * @ngdoc property
					 * @name Controllers.ItemHeaderController#revisionDropdownArr
					 * @propertyOf Controllers.ItemHeaderController
					 * @description Builds the object for the revisioning (dropdown and effective date)
					 */
					that.revisionDropdownArr = that._.map(that.revisioningData.versions, function (value, index) {
						var obj = {
							id: value.__self__.substr(value.__self__.indexOf('versions/') + 9),
							effectiveDate: '',
							description: ''
						};

						// The value in the dropdown (description)
						switch (value.status) {
							// If status is UNRELEASED or WORKING, print just the lifecycle value
							case 'UNRELEASED':
							case 'WORKING':
								obj.description += that.revisioningTranslationKeys[value.status];
								// obj.description += value.lifecycle.title; // temporarily leaving this here because we're going to have changes later
								break;
							// Other statuses can only be SUPERSEDED or LATEST
							default:
								obj.description += value.lifecycle.title + ' ' + value.version + ' (' + that.revisioningTranslationKeys[value.status] + ')';
								break;
						}

						// The effective date - checks for STATUS (string of text) or startDate/endDate (date strings)
						if (angular.isDefined(value.effectivity.status)) {
							obj.effectiveDate += that.revisioningTranslationKeys[value.effectivity.status];
						} else {
							obj.effectiveDate += that.$filter('date')(value.effectivity.startDate, that.UserObj.getDateFormat());

							// End date is defined?
							if (angular.isDefined(value.effectivity.endDate)) {
								obj.effectiveDate += ' - ' + that.$filter('date')(value.effectivity.endDate, that.UserObj.getDateFormat());
							}
						}

						return obj;
					});

					/**
					 * @ngdoc property
					 * @name Controllers.ItemHeaderController#selectedRevision
					 * @propertyOf Controllers.ItemHeaderController
					 * @description Finds and sets the current revision, comparing each id on the dropdown with the current itemId
					 */
					that.selectedRevision = that._.find(that.revisionDropdownArr, function (value, index) {
						return (that.itemId.toString() === value.id);
					});

					/**
					 * @ngdoc property
					 * @name Controllers.ItemHeaderController#revisionTagStr
					 * @propertyOf Controllers.ItemHeaderController
					 * @description The revision tag string, retrieved from the endpoint's data
					 */
					that.revisionTagStr = that.itemData.fullItemDescriptor.substr(that.itemData.itemDescriptor.length);

				});

				break;

			case 'BASIC':
			case 'SUPPLIER':
			default:
				break;
		}
	}
}

export default ItemHeaderController;
