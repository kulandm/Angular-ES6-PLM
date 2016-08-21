'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewMilestonesController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/milestones.
 *
 * ##Dependencies
 */
var fieldDefinitions;
const STATE = new WeakMap();
const LOCATION = new WeakMap();

class ViewMilestonesController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#constructor
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $location, $stateParams, ModelsManager, EventService, PermissionService, PLMPermissions, moment, $timeout) {
		STATE.set(this, $state);
		LOCATION.set(this, $location);
		this.$timeout = $timeout;
		this.ModelsManager = ModelsManager;
		
		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#moment
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description Moment is required to convert date format not supported by IE to a supported format
		 */
		this.moment = moment;
		
		// Listener IDs
		let itemListenerId;
		let currentUserListenerId;
		let milestoneListenerId;
		let stateChangeListenerId;
		let transitionTakePlace = null;

		// Properties of the fields that will be displayed in the table
		fieldDefinitions = [
			{
				field: 'workflowState.value.selected.name',
				displayName: $rootScope.bundle.milestone.state,
				cellTemplate: 'workflowStateTemplate',
				dataTypeId: 20, // Picklist
				parseValue: (value) => {
					let selectedObj = _.find(this.StatesObj, (state) => {
						return state.name === value.title;
					});

					return {
						selected: selectedObj,
						options: this.StatesObj
					};
				}
			},
			{
				field: 'type.value.selected',
				displayName: $rootScope.bundle.milestone.event,
				cellTemplate: 'milestoneEventTemplate',
				dataTypeId: 20, // Picklist
				parseValue: (value) => {
					let localizedValue = (value.link === '/api/v3/milestone-types/ENTER' ?
						$rootScope.bundle.milestone.enter :
						$rootScope.bundle.milestone.exit);

					return {
						selected: localizedValue,
						options: [$rootScope.bundle.milestone.enter,
							$rootScope.bundle.milestone.exit]
					};
				}
			},
			{
				field: 'shift',
				cellTemplate: 'checkboxTemplate',
				dataTypeId: 9 // Boolean
			},
			{
				field: 'date.value',
				displayName: $rootScope.bundle.milestone.target,
				cellTemplate: 'dateTemplate',
				dataTypeId: 3 // Date
			},
			{
				field: 'status',
				displayName: $rootScope.bundle.milestone.status,
				cellTemplate: 'statusTemplate'
			},
			{
				field: 'daysFrom',
				displayName: $rootScope.bundle.milestone.daysFrom,
				cellTemplate: 'daysFromTemplate'
			},
			{
				field: 'warnThreshold.value',
				displayName: $rootScope.bundle.milestone.warning,
				dataTypeId: 4, // Single line text
				cellTemplate: 'warnTemplate'
			},
			{
				field: 'progress.value',
				displayName: $rootScope.bundle.milestone.progress,
				dataTypeId: 4, // Single line text
				cellTemplate: 'progressTemplate',
				parseValue: (value) => value ? `${value}%` : ''
			}
		];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#MilestoneObj
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The reference to milestones items data model object.
		 */
		this.MilestoneObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#StatesObj
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The reference to workflow states object.
		 */
		this.StatesObj = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The workspace id of the current selected item.
		 */
		this.workspaceId = $stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The item id of the current selected item.
		 */
		this.itemId = $location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#viewPermission
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The view milestones items permission for the user.
		 */
		this.viewPermission = PLMPermissions.VIEW_MILESTONES;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#addPermission
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The add milestones items permission for the user.
		 */
		this.addPermission = PLMPermissions.ADD_MILESTONES;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The edit milestones items permission for the user.
		 */
		this.editPermission = PLMPermissions.EDIT_MILESTONES;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#tableColumns
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description Stores the details of the table's fields.
		 */
		this.tableColumns = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#tableData
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description Stores table data of the affected items.
		 */
		this.tableData = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The format of the date string the user has chosen.
		 */
		this.dateFormat = {
			date: 'yyyy',
			dateAndHour: 'yyyy hh:mm a'
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#edit
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description The state of the editable fields shown in the TDW
		 * (this has to be an object so that any changes in it get automatically
		 * reflected in the fieldData)
		 */
		this.edit = {
			isEdit: angular.isDefined($state.params.editItem)
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description Listener for item object. Determines the workspace type
		 * to initialise the revisioning columns, if needed. And gets the
		 * affected item custom columns meta data.
		 */
		itemListenerId = EventService.listen(`itemInstance:${this.itemId}:done`, (event, itemObj) => {
			EventService.unlisten(itemListenerId);

			// Set the workspaceId
			this.workspaceId = itemObj.workspaceObj.getId();

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.ViewMilestonesController#milestoneStatesListenerId
			 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
			 * @description Listener for workflow states object.
			 */
			let milestoneStatesListenerId = EventService.listen(`itemState:${this.workspaceId}:done`, (event, data) => {
				EventService.unlisten(milestoneStatesListenerId);

				this.parseWorkflowStates(data.json);
				/**
				 * @ngdoc property
				 * @name Controllers.workspaceItem.ViewMilestonesController#milestoneListenerId
				 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
				 * @description Listener for milestones object.
				 */
				milestoneListenerId = EventService.listen(`milestones:${this.itemId}:done`, (event, milestoneObj) => {
					this.parseMilestonesData(milestoneObj);
					if (!transitionTakePlace) {// PLM-15254: Status does not change when a workflow transition take place
						transitionTakePlace = EventService.listen(`itemTransitions:${this.itemId}:done`, (event, itemObj) => {
							this.loadMilestones();
						});
					}

				});
				ModelsManager.getMilestones(this.itemId);
			});

			// If user does not have view permissions, but hit the url manually,
			// redirect user back to the item details view
			PermissionService.checkPermissionByItem(itemObj, this.viewPermission).then((hasViewPermission) => {
				if (!hasViewPermission) {
					$state.go('details', {
						tab: 'details',
						view: $location.search().view,
						mode: 'view',
						itemId: $location.search().itemId
					});
				}
			});

			ModelsManager.getWorkflowStates(this.workspaceId);
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#currentUserListenerId
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description `private` Listener for current user.
		 */
		currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, UserObj) => {
			EventService.unlisten(currentUserListenerId);

			// Set user's date format
			this.dateFormat.date = UserObj.getDateFormat();
			this.dateFormat.dateAndHour = `${UserObj.getDateFormat()} hh:mm a`;
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewMilestonesController#stateChangeListenerId
		 * @propertyOf Controllers.workspaceItem.ViewMilestonesController
		 * @description Listener for state changes. When the state changes,
		 * update the edit object to reflect that change. Also set the
		 * table headers again because some fields are hidden in edit mode.
		 */
		stateChangeListenerId = EventService.listen('state:change:done', () => {
			this.edit.isEdit = angular.isDefined($state.params.editItem);
			this.loadMilestones();
		});
		// Fetch and parse the milestones data
		this.setupTableColumns();
		// need to fire this to have the ui-grid resized properly
		// the order of rendering is the issue
		// TODO: maybe we can find a better solution
		this.$timeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 2000);
		ModelsManager.getItem(this.itemId);

		$scope.$on('$destroy', function () {
			EventService.unlisten(itemListenerId);
			EventService.unlisten(currentUserListenerId);
			EventService.unlisten(milestoneListenerId);
			EventService.unlisten(stateChangeListenerId);
			EventService.unlisten(transitionTakePlace);
			
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#setupTableColumns
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Initialize the table columns, dependent on the edit mode.
	 */
	setupTableColumns() {
		// If we're in view mode, do not show the checkboxes column.
		// If we're in edit mode, show only the columns that have the
		// `dataTypeId` property set (these are the editable ones)
		this.tableColumns = _.filter(fieldDefinitions, (column) => {
			let isCheckboxCol = column.dataTypeId === 9 ? true : false;
			return this.edit.isEdit ? column.dataTypeId : !isCheckboxCol;
		});
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#parseWorkflowStates
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Initialize the workflow states for dropdown in edit mode.
	 *
	 * @params statesObj The object holding the possible workflow states.
	 */
	parseWorkflowStates(statesObj) {
		_.each(statesObj, (state) => {
			this.StatesObj.push(_.pick(state,
				'__self__',
				'customLabel',
				'description',
				'locked',
				'managed',
				'name')
			);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#parseMilestonesData
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Initialize the table data.
	 */
	parseMilestonesData(milestoneObj) {
		this.MilestoneObj = milestoneObj;

		// Add data to the table by transforming the milestone objects based on
		// what the respective cellTemplates need to display
		this.tableData = _.map(this.MilestoneObj.getFullList(), (milestone) => {
			// Add computed properties
			let millisecondsFrom = milestone.actualCompleteDate ?
				this.moment(milestone.actualCompleteDate).toDate() - new Date(milestone.date) :
				new Date() - new Date(milestone.date);

			milestone.daysFrom = Math.floor(millisecondsFrom / 1000 / 60 / 60 / 24);
			milestone.status = !!milestone.actualCompleteDate;

			// Loop through the fields we need to display in the table and
			// decorate the milestone object with properties needed by each
			// field's template (only for editable fields)
			_.each(fieldDefinitions, (fieldDefinition) => {
				// Non-editable fields don't need any extra properties
				if (fieldDefinition.cellTemplate === 'daysFromTemplate' ||
					fieldDefinition.cellTemplate === 'statusTemplate') {
					return;
				}

				// Get the correct field (without the dot notations for sorting)
				let field = fieldDefinition.field.match(/[^.]*/)[0];

				let value;
				if (fieldDefinition.parseValue) {
					value = fieldDefinition.parseValue(milestone[field]);
				} else {
					value = milestone[field];
				}

				milestone[field] = {
					triggerEdit: this.triggerEdit,
					edit: this.edit,
					isEditActive: false,
					value: value,
					originalValue: value,
					metadata: {
						dataTypeId: fieldDefinition.dataTypeId
					}
				};

				if (field === 'workflowState') {
					let selectedState = milestone[field].value.selected;

					milestone[field].originalValue = {
						selected: selectedState
					};

					milestone[field].workflowStateChanged = () => {
						// TODO in edit mode
						console.log('state is changed');
					};
				}

				if (field === 'type') {
					let selectedType = milestone[field].value.selected;

					milestone[field].originalValue = {
						selected: selectedType
					};

					milestone[field].typeChanged = () => {
						// TODO in edit mode
						console.log('type is changed');
					};
				}
			});

			return milestone;
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#triggerEdit
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Triggered by clicking edit button - goes to the EDIT state.
	 */
	triggerEdit() {
		LOCATION.get(this).search({
			tab: LOCATION.get(this).search().tab,
			view: LOCATION.get(this).search().view,
			mode: 'edit',
			itemId: LOCATION.get(this).search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Triggered by clicking save button.
	 *
	 * NOTE: name has to be triggerSave.
	 */
	triggerSave() {
		LOCATION.get(this).search({
			tab: LOCATION.get(this).search().tab,
			view: LOCATION.get(this).search().view,
			mode: 'view',
			itemId: LOCATION.get(this).search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Triggered by clicking cancel button.
	 *
	 * NOTE: name has to be triggerCancel.
	 */
	triggerCancel() {
		LOCATION.get(this).search({
			tab: LOCATION.get(this).search().tab,
			view: LOCATION.get(this).search().view,
			mode: 'view',
			itemId: LOCATION.get(this).search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Determine whether we're in view mode
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	isViewState() {
		return (LOCATION.get(this).search().mode === 'view');
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewMilestonesController#loadMilestones
	 * @methodOf Controllers.workspaceItem.ViewMilestonesController
	 * @description Render Milestones Page depending on the mode (view, edit, create)
	 *
	 * @return {Boolean} true if we are in view mode
	 */
	loadMilestones() {
		this.setupTableColumns();
		this.ModelsManager.getMilestones(this.itemId);
	}
}

export default ViewMilestonesController;
