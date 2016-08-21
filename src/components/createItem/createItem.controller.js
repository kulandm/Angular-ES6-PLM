'use strict';

/**
 * @ngdoc object
 * @name Controllers.CreateItemController
 *
 * @description The controller for {@link Directives.createItem}.
 * Based on the given list of workspaces, this controller fetches the
 * field definitions and allow creating one or more workspace items.
 * It also contain logic for both quick create and full create.
 *
 * ##Dependencies
 *
 * TODO: preview enable fields.
 */
class CreateItemController {
	/*
	 * @ngdoc method
	 * @name Controllers.CreateItemController#constructor
	 * @methodOf Controllers.CreateItemController
	 * @description The class constructor.
	 */
	constructor($rootScope, $scope, $log, CreateTypes, EventService, FlyoutService, ModelsManager, SupportedFieldsService, FieldTypes, SECTION_TYPES, ClassificationService, _) {
		this.$scope = $scope;
		this.$log = $log;
		this.CreateTypes = CreateTypes;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.ModelsManager = ModelsManager;
		this.SupportedFieldsService = SupportedFieldsService;
		this.FieldTypes = FieldTypes;
		this.SECTION_TYPES = SECTION_TYPES;
		this.ClassificationService = ClassificationService;
		this._ = _;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#contextualCreate
		 * @propertyOf Controllers.CreateItemController
		 * @description Boolean for whether this is in-contextual create
		 * (converts the string to a boolean)
		 */
		this.contextualCreate = $scope.createType === this.CreateTypes.CONTEXTUAL;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#quickCreate
		 * @propertyOf Controllers.CreateItemController
		 * @description Boolean for whether this is quick create
		 * (converts the string to a boolean)
		 */
		this.quickCreate = $scope.createType === this.CreateTypes.QUICK;
		
		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#fullCreate
		 * @propertyOf Controllers.CreateItemController
		 * @description Boolean for whether this is full create
		 * (converts the string to a boolean)
		 */
		this.fullCreate = $scope.createType === this.CreateTypes.FULL;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#workspaceId
		 * @propertyOf Controllers.CreateItemController
		 * @description The workspace id of the workspace to fetch fields from
		 */
		this.workspaceId = null;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#loading
		 * @propertyOf Controllers.CreateItemController
		 * @description True, when component is still loading the fields
		 * of a selected workspace
		 */
		this.loading = false;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#workspacesList
		 * @propertyOf Controllers.CreateItemController
		 * @description The list of workspaces that a user can add item
		 */
		this.workspacesList = $scope.workspacesList;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#sectionIndex
		 * @propertyOf Controllers.CreateItemController
		 * @description Stores the value of the section
		 */
		this.sectionIndex = 0;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#isContentShown
		 * @propertyOf Controllers.CreateItemController
		 * @description The flag to collapse or expand each selected item.
		 * This property is assigned to the scope since it's just for the view.
		 */
		$scope.isContentShown = true;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemController#isSavingData
		 * @propertyOf Controllers.CreateItemController
		 * @description The flag that blocks the editing of textfields when saving is being done
		 */
		this.isSavingData = false;

		// Whenever entered saving process, set the variable accordingly
		$scope.$watch('waiting', (newValue, oldValue) => {
			this.isSavingData = newValue;
		});
		
		// When the selected workspace has changed, fetch the relevant fields
		// from the newly selected workspace (only for quick create)
		$scope.$watch('selectedWorkspace', (newValue, oldValue) => {
			if (newValue && !_.isEqual(newValue, oldValue) && !this.loading) {
				this.fetchFieldDefinitions();
			}
		});

		// Fetch fields for the first time
		if ($scope.selectedWorkspace) {
			this.fetchFieldDefinitions();
		}

		let classificationChangeListenerId = EventService.listen('classification:update', (event, newClassification) => {
			this.$scope.classificationId = newClassification.selected.id;
			_.some(this.$scope.formFields, section => {
				if (this.isClassificationSection(section)) {
					((section) => {
						this.ClassificationService.getClassificationFields(this.$scope.workspaceUrn, this.$scope.workspaceUrn, newClassification.selected.id, true).then(response => {
							section.fields = response.properties;
						});
					})(section);
					return true;
				}
				return false;
			});
		});
		// Destroy listeners once user leaves this item
		this.$scope.$on('$destroy', () => {
			this.EventService.unlisten(classificationChangeListenerId);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#fetchFieldDefinitions
	 * @methodOf Controllers.CreateItemController
	 * @description Fetches the field definition given a workspace
	 *
	 * @param {Object} workspace The workspace to fetch fields from
	 */
	fetchFieldDefinitions() {
		// In the case of full create, workspaceId will be defined, instead of being an object containing an array of workspaces
		this.workspaceId = (typeof this.$scope.selectedWorkspace === 'object') ? this.$scope.selectedWorkspace.getId() : this.$scope.selectedWorkspace;

		this.loading = true;

		let workspaceListenerId = this.EventService.listen(`workspaceInstance:${this.workspaceId}:done`, (event, workspaceObj) => {
			this.EventService.unlisten(workspaceListenerId);

			this.$scope.workspaceUrn = workspaceObj.getWorkspaceUrn();

			workspaceObj.getViewDetailsFieldsData(this.$scope.filter).then(workspaceItemSectionList => {
				/**
				 * @ngdoc method
				 * @name Controllers.CreateItemController#formFields
				 * @methodOf Controllers.CreateItemController
				 * @description Helper function for augmenting the field object with extra info needed by this page
				 */
				let processFieldHelper = (field) => {
					field.dataTypeId = this.parseTypeId(field.type.link);

					if (angular.isDefined(field.fieldMetadata)) {
						field.fieldMetadata.readOnly = field.fieldMetadata.editability === 'NEVER';
						field.options = field.fieldMetadata.picklistPayload;

						// This is not very clean - forcing the mainItemId to be undefined, because there's no itemId
						// at this level (we're not in the item, hence why we have only the workspaceId)
						field.mainItemId = undefined;
						field.mainWorkspaceId = this.workspaceId;
						
						field.metadata = field.fieldMetadata;
						field.metadata.dataTypeId = parseInt(field.metadata.type.link.substring(field.metadata.type.link.lastIndexOf('/') + 1));
						
						// NOTE: there's a risky assumption here: due to a backend inconsistency, sometimes defaultValue equals to "0" (string zero),
						// some other times, to null. Right now the frontend is not sending the key "value" when POSTing picklists that don't have an
						// option selected in them, but that should change to be consistent to what's being done for other fields (empty values get
						// POSTed as null). This needs to be address as part of PLM-13671, and also changed in radioField.directive.js
						field.value = (field.fieldMetadata.defaultValue &&	!field.fieldMetadata.picklist) ?	field.fieldMetadata.defaultValue : '';
					}
					
					return field;
				};
				
				/**
				 * @ngdoc property
				 * @name Controllers.CreateItemController#formFields
				 * @propertyOf Controllers.CreateItemController
				 * @description The list of sections of the workspace item.
				 * Each section will contain list of field definitions.
				 */
				this.$scope.formFields = workspaceItemSectionList;
				
				// Stores the flattened list of fields
				let itemFields = this.getFields();
				
				// Iterates through matrices in the page and send each non-null value to the field helper
				_.chain(itemFields)
				.filter(field => !field.isClassificationField)
				.filter(field => (field.type === 'MATRIX'))
				.map(matrix => _.flatten(matrix.definition.fields, true)) // flattens the fields inside the matrix definition
				.flatten(_.map(flatMatrix => flatMatrix)) // flattens the fields inside all the matrices in the page into a single array
				.filter(flatMatrixIndex => flatMatrixIndex !== null) // removes all nulls (empty cells)
				.each(processFieldHelper);
				
				// Iterates through "normal" fields in the page
				_.chain(itemFields)
				.filter(field => !field.isClassificationField)
				.filter(field => (field.type !== 'MATRIX'))
				.each(processFieldHelper);
				
				/**
				 * @ngdoc property
				 * @name Controllers.CreateItemController#unsupportedFields
				 * @propertyOf Controllers.CreateItemController
				 * @description Checks if there are any unsupported fields,
				 * after the fields have been fetched
				 */
				this.$scope.unsupportedFields.hasUnsupported = _.find(this.getFields(), (field) => {
					if (field.type !== 'MATRIX') {
						return this.SupportedFieldsService.isFieldUnsupported(field.metadata.dataTypeId) || field.editability === 'NEVER';
					}
				});

				this.loading = false;
			}, () => {
				this.$log.error(`Problem fetching field definitions for workspace ${this.workspaceId}.`);
				this.loading = false;
			});
		});

		this.ModelsManager.getWorkspace(this.workspaceId);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#onWorkspaceChange
	 * @methodOf Controllers.CreateItemController
	 * @description Calls the fetch function upon changing selected workspace
	 *
	 * @param {Object} workspace The newly selected workspace
	 */
	onWorkspaceChange(workspace) {
		this.$scope.selectedWorkspace = workspace;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#parseTypeId
	 * @methodOf Controllers.CreateItemController
	 * @description Parses the field link to get data type ID.
	 * TODO Use urn so that we don't need to parse for ID.
	 *
	 * @param {String} typeLink The field link
	 *
	 * @returns {String} The data type id
	 */
	parseTypeId(typeLink) {
		// This check is necessary because matrices are NOT fields
		if (typeof typeLink === 'string') {
			let lastSlashIndex = typeLink.lastIndexOf('/');
			return typeLink.substring(lastSlashIndex + 1);
		} else {
			return '';
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#getFields
	 * @methodOf Controllers.CreateItemController
	 * @description Returns a flat array of all the fields
	 * in the currently selected workspace
	 *
	 * @returns {Array} List of all the fields
	 */
	getFields() {
		// TODO need to revisit this flattening for full create.
		// It might not be that straight forward.
		return _.flatten(_.pluck(this.$scope.formFields, 'fields'));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#parseSectionVisibility
	 * @methodOf Controllers.CreateItemController
	 * @description Returns a flat array of all the fields
	 * in the currently selected workspace
	 *
	 * @returns {Boolean} True/false if the section should be displayed
	 */
	parseSectionVisibility(listOfSections, section) {
		// TO DO: need to optimize this call due to ng-if calling this many times due to digest cycle
		this.sectionIndex = listOfSections.indexOf(section) + 1;
		
		if (this.fullCreate || (this.contextualCreate && section.fields.length)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#isSectionEditable
	 * @methodOf Controllers.CreateItemController
	 * @description Finds the section by link. NOTE: This code has been partly duplicated from viewDetails.controller - we should be looking
	 * into moving this code to a common component that can be used later in VIEW/EDIT modes there as well
	 *
	 * @param {String} section The object containing section data)
	 *
	 * @returns {Boolean} True/false if the section should be locked
	 *
	 */
	isSectionEditable(section) {
		return !section.sectionLocked;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#tooltipFlyout
	 * @methodOf Controllers.CreateItemController
	 * @description Show tooltip if there is an item description.
	 *
	 * @param {Object} event The event object
	 * @param {String} displayName The displayName of the item field
	 * @param {String} description The description of the item field
	 */
	tooltipFlyout(event, displayName, description) {
		let tooltip = this.FlyoutService.open({
			templateUrl: 'partials/workspaceItemTooltip.html',
			scope: this.$scope,
			anchorEl: angular.element(event.target),
			placement: 'left',
			showArrow: true,
			flyoutClass: 'item-tooltip-flyout item-tooltip-quick-create',
			disableDefaultZIndexAllocation: false,
			controller: function ($scope, $flyoutInstance) {
				$scope.displayName = displayName;
				$scope.description = description;
				$scope.closeFlyout = () => {
					$flyoutInstance.close();
				};
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#getPartUrn
	 * @methodOf Controllers.CreateItemController
	 * @description Access to section attributes so we can determine if it is a
	 * classificaiton section or not
	 *
	 * @param {Section} section The step section
	 *
	 * @returns {String} The urn asociated to a classification section
	 */
	getPartUrn(section) {
		if (this.isClassificationSection(section)) {
			return this.$scope.workspaceUrn;
		}
		return undefined;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemController#isClassificationSection
	 * @methodOf Controllers.CreateItemController
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

export default CreateItemController;
