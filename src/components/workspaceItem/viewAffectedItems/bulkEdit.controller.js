'use strict';
/**
 * @ngdoc object
 * @name Controllers.workspaceItem.BulkEditController
 *
 * @description This controller responsible for handling the modal window for bulk edit
 * This controller takes the selected items from the affected items view and fetched the state id and thereafter the
 * corresponding transitions
 * stateLifecycle is an array in the controller that contains the stateObj which inturns has the object contains the state name and the 
 * corresponding avilable transitions
 */
class BulkEditController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BulkEditController#constructor
	 * @methodOf Controllers.workspaceItem.BulkEditController
	 * @description The class constructor.
	 */
	constructor($q, $rootScope, $mdDialog, workspaceObj, selectedItems, ModelsManager, EventService, UrnParser, _, $filter, $mdDateLocale) {

		let todaysDate = new Date();

		// Setting the min date
		// Cannot just use the new Date() as it contains some timezone information
		this.minDate = new Date(
			todaysDate.getFullYear(),
			todaysDate.getMonth(),
			todaysDate.getDate());

		this.$rootScope = $rootScope;
		this.$mdDialog = $mdDialog;
		this._ = _;
		this.selectedItems = selectedItems;
		this.UrnParser = UrnParser;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BulkEditController#stateLifecycle
		 * @propertyOf Controllers.workspaceItem.BulkEditController
		 * @description It holds the complete lifecycle stateinformation including the state title and transitions
		 */
		this.stateLifecycle = [];

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BulkEditController#effectivity
		 * @propertyOf Controllers.workspaceItem.BulkEditController
		 * @description an object to hold the data related to effectivity date.
		 */
		this.effectivity = {
			enabled: false,
			data: {
				datePickerMinDate: new Date()
			}
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BulkEditController#meta
		 * @propertyOf Controllers.workspaceItem.BulkEditController
		 * @description an object to hold metaData the field selector
		 */
		this.meta = {
			isDisabled: true,
			datePickerMinDate: new Date()
		};	

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BulkEditController#itemMap
		 * @propertyOf Controllers.workspaceItem.BulkEditController
		 * @description A map of workspace item keyed by item urn.
		 */
		this.itemMap = {};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BulkEditController#itemPromiseList
		 * @propertyOf Controllers.workspaceItem.BulkEditController
		 * @description It holds the list of promises of itemObj
		 */
		this.itemPromiseList = this._.map(selectedItems, (affectedItem) => {
			return $q((resolve) => {
				let itemURN = UrnParser.encode(affectedItem.getItemUrn());
				EventService.listen(`itemInstance:${itemURN}:done`, (event, itemObj) => {
					resolve(this.itemMap[itemURN] = itemObj);
				});
				ModelsManager.getItem(itemURN);
			});			
		});

		$q.all(this.itemPromiseList).then((itemList) => {

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.BulkEditController#stateList
			 * @propertyOf Controllers.workspaceItem.BulkEditController
			 * @description It holds the state list
			 */
			let stateList = this._.map(itemList, item => item.getLifecycleState());

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.BulkEditController#distinctStateList
			 * @propertyOf Controllers.workspaceItem.BulkEditController
			 * @description It holds the distinct state list
			 */
			let distinctStateList = this._.uniq(stateList, false, stateObj => stateObj.urn);

			// For each state, get the available transitions
			this._.each(distinctStateList, (stateObj) => {
				// Get Id of the state from URN.
				let splitURN = stateObj.urn.split('.');
				let stateId = splitURN[splitURN.length - 1];

				// Get 'effectivity' information of each state.
				let stateListener = EventService.listen(`itemState:${stateId}:done`, (event, stateModelObj) => {
					EventService.unlisten(stateListener);
					stateObj.useEffectivity = stateModelObj.getFullList().useEffectivity;
					ModelsManager.getTransitionsByLink(stateId, workspaceObj.getLifecycleWorkflowStateTransitionsLink(stateId));
				});

				// Get 'transitions' of each state.
				let transitionListener = EventService.listen(`itemTransitions:${stateId}:done`, (event, transitionsObj) => {
					EventService.unlisten(transitionListener);
					stateObj.value = null;
					stateObj.transitions = transitionsObj.transitions;

					// Create 'options' property to make it work with existing picklist.
					stateObj.options = {
						items: this._.map(stateObj.transitions, transition => {
							// Create 'title' and 'link' properties on each transitions to make it work with existing picklist.
							transition.title = transition.name;
							transition.link = transition.__self__;
							return transition;
						})
					};

					stateObj.options.items.unshift({
						title: $rootScope.bundle.affectedItems.pleaseSelect
					});

					stateObj.value = this._.clone(stateObj.options.items[0]);

					this.stateLifecycle.push(stateObj);
				});

				ModelsManager.getStateByLink(stateId, workspaceObj.getLifecycleWorkflowStateLink(stateId));
			});
		});
		
		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.BulkEditController#InvalidDateValidation
		 * @propertyOf Controllers.workspaceItem.BulkEditController
		 * @description It is responsible for showing the invalid date validation
		 */
		 // To be uncommented when angular material datepicker validation/error handling is reolved
		// this.InvalidDateValidation = false;

		// Retrieves the date format for the current logged in user
		// To be uncommented when angular material datepicker validation/error handling is reolved
		/* let currentUserListenerId = EventService.listen('currentUser:currentUser:done', (event, userObj) => {
			EventService.unlisten(currentUserListenerId);

			// Setting the date format of the datepicker
			$mdDateLocale.formatDate = (date) => {
				this.InvalidDateValidation = false;
				return date ? $filter('date')(date, userObj.getDateFormat()) : '';
			};

			$mdDateLocale.parseDate = (date) => {
				let convertedDate = new Date(date);
				let todaysDate = new Date();
				if (convertedDate.toDateString() === 'Invalid Date' || (todaysDate > convertedDate)) {
					this.InvalidDateValidation = true;
				} else {
					this.InvalidDateValidation = false;
				}
			};
		}, true);
		ModelsManager.getCurrentUser();*/
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BulkEditController#getAffectedItemsByState
	 * @methodOf Controllers.workspaceItem.BulkEditController
	 * @description Get affected items by state urn. This method uses {@link #itemMap} to map state urn to affected item
	 *
	 * @param {String} stateURN the urn of the state.
	 *
	 * @return {Array} the list of affected items based on the given state urn.
	 */
	getAffectedItemsByState(stateURN) {
		return this._.filter(this.selectedItems, (affectedItemObj) => {
			let itemURN = this.UrnParser.encode(affectedItemObj.getItemUrn());
			return this.itemMap[itemURN].getLifecycleState().urn === stateURN;
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BulkEditController#closeBulkTransition
	 * @methodOf Controllers.workspaceItem.BulkEditController
	 * @description Responsible for closing the bulk edit modal overlay
	 */
	closeBulkTransition() {
		this.$mdDialog.cancel();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BulkEditController#updateBulkTransition
	 * @methodOf Controllers.workspaceItem.BulkEditController
	 * @description update selected affected items based on the selected lifecycle and effectivity options. It also closes
	 * the dialog and passes the updated affected items to the parent component.
	 */
	updateBulkTransition() {
		let modifiedAffectedItems = [];

		this._.each(this.stateLifecycle, (stateInfo) => {
			// if any transition selected.
			if (stateInfo.value && stateInfo.value.link) {
				modifiedAffectedItems = modifiedAffectedItems.concat(this._.map(this.getAffectedItemsByState(stateInfo.urn), (affectedItemObj) => {
					affectedItemObj.setLifecycle(stateInfo.value);
					if (this.effectivity.enabled === true && stateInfo.useEffectivity === true) {
						affectedItemObj.setEffectivity(this.effectivity.data.value ? new Date(this.effectivity.data.value) : null);
					}
					return affectedItemObj;
				}));
			}
		});

		this.$mdDialog.hide(modifiedAffectedItems);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.BulkEditController#effectivityChanged
	 * @methodOf Controllers.workspaceItem.BulkEditController
	 * @description Used for disabling and enabling the date field
	 */
	effectivityChanged(val) {
		if (val === true) {
			this.meta.isDisabled = false;
		} else {
			this.meta.isDisabled = true;
			this.effectivity.data = {};
		}
	}
}

export default BulkEditController;