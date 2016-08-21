'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.AddItemController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/addItem
 *
 * ##Dependencies
 *
 */
class AddItemController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#constructor
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $stateParams, $location, $mdDialog, EventService, ModelsManager, NotificationService, NotificationTypes, UrnParser, ValidationUtil, ClassificationService, ClassificationUtil, SECTION_TYPES, _) {

		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$mdDialog = $mdDialog;
		this.$location = $location;
		this.EventService = EventService;
		this.ModelsManager = ModelsManager;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.UrnParser = UrnParser;
		this.ValidationUtil = ValidationUtil;
		this.ClassificationService = ClassificationService;
		this.ClassificationUtil = ClassificationUtil;
		this.SECTION_TYPES = SECTION_TYPES;
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddItemController#that
		 * @propertyOf Controllers.workspaceItem.AddItemController
		 * @description `private` Reference to this controller.
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddItemController#workspaceId
		 * @propertyOf Controllers.workspaceItem.AddItemController
		 * @description The current workspace ID.
		 */
		this.workspaceId = this.$stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddItemController#isSavingData
		 * @propertyOf Controllers.workspaceItem.AddItemController
		 * @description Set to true when saving data is underway, as to block form elements from editing while saving.
		 */
		this.isSavingData = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddItemController#unsupportedFields
		 * @propertyOf Controllers.workspaceItem.AddItemController
		 * @description An object updated by {@link Directives.createItem}
		 * to indicate if there are any unsupported fields
		 */
		this.unsupportedFields = {
			hasUnsupported: false
		};
		
		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddItemController#createType
		 * @propertyOf Controllers.workspaceItem.AddItemController
		 * @description Fixed type of create item for {@link Directives.createItem} (FULL)
		 */
		this.createType = 2;
		
		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.AddItemController#formFields
		 * @propertyOf Controllers.workspaceItem.AddItemController
		 * @description Array that will updated by {@link Directives.createItem} once user edits information
		 */
		this.formFields = [];

		/**
		* @ngdoc property
		* @name Controllers.workspaceItem.AddItemController#workspaceUrn
		* @propertyOf Controllers.workspaceItem.AddItemController
		* @description The workspace urn of the workspace to fetch cws fields from
		*/
		this.workspaceUrn = null;

		/**
		* @ngdoc property
		* @name Controllers.workspaceItem.AddItemController#classificationId
		* @propertyOf Controllers.workspaceItem.AddItemController
		* @description Holds the selected classification id for the new item
		*/
		this.classificationId = null;

		/**
		* @ngdoc property
		* @name Controllers.workspaceItem.AddItemController#saveItemListenerId
		* @propertyOf Controllers.workspaceItem.AddItemController
		* @description Holds the listener for saving the item
		*/
		this.saveItemListenerId = null;

		/**
		* @ngdoc property
		* @name Controllers.workspaceItem.AddItemController#saveCwsListenerId
		* @propertyOf Controllers.workspaceItem.AddItemController
		* @description Holds the listener for saving the cws section
		*/
		this.saveCwsListenerId = null;
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#isViewState
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Always returns false since we're not in view mode
	 *
	 * @returns {Boolean} True if we are in view (item) mode
	 */
	isViewState() {
		return false;
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#isAddState
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Determine whether we're in add (create) item mode
	 *
	 * @returns {Boolean} True if we are in add (create) item mode
	 */
	isAddState() {
		return true;
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#getFields
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Returns a flat array of all the fields in the currently selected workspace
	 *
	 * @returns {Array} List of all the fields
	 */
	getFields() {
		return this._.flatten(this._.pluck(this.formFields, 'fields'));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#triggerSave
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Triggered by clicking the save button. NOTE: name has to be triggerSave.
	 */
	triggerSave() {
		
		// Blocks fields from being edited while saving
		this.isSavingData = true;

		this.saveItemListenerId = this.EventService.listen('itemInstance:newItem:saveDone', (event, response, flag) => {
			this.EventService.unlisten(this.saveItemListenerId);

			this.ValidationUtil.clearValidationErrors(this.getFields());

			if (flag) {
				// TODO This is hackish. Server is giving an absolute url in the
				// location. We need to map that absolute url of the newly
				// created item to our routing state {workspaceId@dmsId}
				let createItemAbsUrl = response.location;

				let [relativeUrl, workspaceId, dmsId] = createItemAbsUrl.match(/workspaces\/(\S*)\/items\/(\S*)/);
				let resourceId = `${workspaceId}@${dmsId}`;

				// call again once we have a dmsId, this time it will update the part.
				this.triggerClassificationSave(dmsId);

				let itemListenerId = this.EventService.listen(`itemInstance:${resourceId}:done`, (event, itemObj) => {
					this.EventService.unlisten(itemListenerId);

					this.createdItemObj = itemObj;
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${this.createdItemObj.getItemTitle()}${this.$rootScope.bundle.notification.singleCreate.success}`
					);

					// TODO START
					// The code below should be enough to navigate to the newly created item, but since the itemId is not
					// there when workspaceItemResolves.checkPerm checks for the $location.search() object, the redirection
					// fails. The $state.href was the best way we found to navigate correctly, at this stage. We will be
					// returning here soon anyway.

					// Go to newly-created item
					// this.$state.go('details', {
					//	workspaceId: this.workspaceId,
					//	tab: 'details',
					//	view: 'full',
					//	mode: 'view',
					//	itemId: this.UrnParser.encode(this.createdItemObj.getUrn()),
					//	cached: false
					// });

					// Build the new item path including the base
					let href = this.$state.href('details', {
						workspaceId: this.workspaceId,
						tab: 'details',
						view: 'full',
						mode: 'view',
						itemId: this.UrnParser.encode(this.createdItemObj.getUrn()),
						cached: false
					});

					// Remove the base '/app'
					href = href.substring(4);

					// Navigate
					this.$location.url(href);
					// TODO END

					this.NotificationService.showNotifications();
				});

				this.ModelsManager.getItem(resourceId);
			} else {
				// Resets the saving data flag to re-enable editing of fields
				this.isSavingData = false;
				
				// This validation is probably not taking into account matrices, this the fields are POSTed in a flat array for each sectionCopy
				this.ValidationUtil.mapValidationErrors(this.getFields(), response.data);
				this.NotificationService.addNotification(this.NotificationTypes.ERROR, `${response.data.length}${response.data.length > 1 ? this.$rootScope.bundle.notification.create.errors : this.$rootScope.bundle.notification.create.error}`);
				this.NotificationService.showNotifications();
			}
		});
		
		// Flattens the matrices inside the sections into a new array, that's going to be POSTed
		// NOTE: since this is not the same original array, we may have to re-work the validation code on line 200
		let formFieldsFlat = [];
		_.each(this.formFields, (section) => {
			
			// Clones the original section, since it's two-way binded to the fields in the view
			let sectionClone = {};
			_.extend(sectionClone, section);
			
			// Strips out the matrices to a new array
			let normalFields = _.chain(sectionClone.fields)
				.filter(field => (field.type !== 'MATRIX'))
				.value();
			
			// Flattens the fields of all matrices in this section to a new array
			let flatMatrixFields = _.chain(sectionClone.fields)
				.filter(field => field.type === 'MATRIX')
				.map(matrix => _.flatten(matrix.definition.fields, true))
				.flatten(_.map(flatMatrix => flatMatrix))
				.filter(flatMatrixIndex => flatMatrixIndex !== null)
				.value();
			
			sectionClone.fields = normalFields.concat(flatMatrixFields);
			
			formFieldsFlat.push(sectionClone);
		});

		this.saveCwsListenerId = this.EventService.listen('itemInstance:newItem:saveCwsDone', (event, flag) => {
			this.EventService.unlisten(this.saveCwsListenerId);
			// This is going to send the entire chunk of fields to be POSTed as a flat array, with fields from matrices at the end of each section.fields array
			this.EventService.send('itemInstance:newItem:save', [null, this.workspaceId, formFieldsFlat]);
		});

		// call on initial save
		this.triggerClassificationSave();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#triggerClassificationSave
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Triggered by clicking save button.
	 *
	 * @param {Number} dmsId the item id if exist.
	 */
	triggerClassificationSave(dmsId = undefined) {
		let cwsRawFields = [];
		let initialClassificationId = null;
		let cwsSectionExist = false;
		cwsSectionExist = _.some(this.formFields, section => {
			if (this.isClassificationSection(section)) {
				initialClassificationId = section.initialClassificationId;
				cwsRawFields = this._.map(section.fields, (cwsFieldAdapterInstance) => {
					return cwsFieldAdapterInstance.getOriginData();
				});
				return true;
			}
			return false;
		});

		if (!cwsSectionExist) {
			this.EventService.send('itemInstance:newItem:saveCwsDone', [true]);
		} else {
			this.classificationId = (this.classificationId === null) ? initialClassificationId : this.classificationId;
			this.ClassificationService.saveRawFields(this.classificationId, this.workspaceUrn, cwsRawFields, dmsId).then((response) => {
				this.EventService.send('itemInstance:newItem:saveCwsDone', [true]);
			}, errors => {
				this.isSavingData = false;
				// un-listen when errors, it will be attach again once trigger save gets call again.
				this.EventService.unlisten(this.saveItemListenerId);
				this.EventService.unlisten(this.saveCwsListenerId);
				if (angular.isDefined(errors.phantomRestriction)) {
					this.NotificationService.addNotification(this.NotificationTypes.ERROR, this.$rootScope.bundle.classifications.section.warning.phantom_class);
				} else {
					this._.each(this.ClassificationUtil.errorMessageHandler(errors), (error) => {
						this.NotificationService.addNotification(this.NotificationTypes.ERROR, error);
					});
				}
				this.NotificationService.showNotifications();
			});
		}
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#triggerCancel
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Triggered by clicking the cancel button. NOTE: name has to be triggerCancel.
	 */
	triggerCancel() {
		this.$mdDialog.show({
			controller: 'ConfirmationDialogController',
			controllerAs: 'confirmationDialogCtrl',
			templateUrl: 'build/components/confirmationDialog/confirmationDialog.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		})
		.then(() => {
			this.triggerCancelConfirm();
		}, () => {
		});
	}
	
	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#triggerCancelConfirm
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Triggered by clicking the confirm button inside the dialog
	 */
	triggerCancelConfirm() {
		this.$state.go('workspace-items-list', {
			workspaceId: this.workspaceId,
			itemId: null
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.AddItemController#isClassificationSection
	 * @methodOf Controllers.workspaceItem.AddItemController
	 * @description Determine if a section is or not of type classification
	 *
	 * @param {Section} section The step section
	 *
	 * @returns {Boolean} True if it is a classification section
	 */
	isClassificationSection(section) {
		return (section.type === this.SECTION_TYPES.CLASSIFICATION);
	}
}

export default AddItemController;
