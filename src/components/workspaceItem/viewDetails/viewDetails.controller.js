'use strict';

/**
 * @ngdoc object
 * @name Controllers.workspaceItem.ViewDetailsController
 *
 * @description This controller corresponds to /workspaceItems/{workspaceId}/{itemId}/itemDetails
 * and /workspaceItems/{workspaceId}/{itemId}/itemDetails/edit.
 *
 * ##Dependencies
 *
 */
class ViewDetailsController {

	/*
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#constructor
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description The class constructor.
	 */
	constructor($scope, $rootScope, $state, $stateParams, $location, $timeout, $filter, ModelsManager, EventService, FlyoutService, PLMPermissions, PermissionService, ClassificationService, SECTION_TYPES, FieldTypes, ClassificationUtil, NotificationService, NotificationTypes, OWNER_TYPE, _, $mdDialog) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$stateParams = $stateParams;
		this.$location = $location;
		this.$timeout = $timeout;
		this.$filter = $filter;
		this.ModelsManager = ModelsManager;
		this.EventService = EventService;
		this.FlyoutService = FlyoutService;
		this.PLMPermissions = PLMPermissions;
		this.PermissionService = PermissionService;
		this._ = _;
		this.ClassificationService = ClassificationService;
		this.SECTION_TYPES = SECTION_TYPES;
		this.ClassificationUtil = ClassificationUtil;
		this.FieldTypes = FieldTypes;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.$mdDialog = $mdDialog;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#that
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description `private` Reference to this controller.
		 */
		var that = this;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#workspaceId
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The current workspace ID.
		 */
		this.workspaceId = this.$stateParams.workspaceId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#itemId
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The current item ID.
		 */
		this.itemId = this.$location.search().itemId;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#cached
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Whether we must be use the cached data of the item or retrieve it again from the server.
		 */
		this.cached = angular.isDefined(this.$location.search().cached) && this.$location.search().cached === 'false' ? false : true;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#editPermission
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The permission to be set to control visibility of display button.
		 */
		this.editPermission = this.PLMPermissions.EDIT_ITEMS;

		/**
		 * @ngdoc property
		 * @name Controllers.ItemViewerController#isEditable
		 * @propertyOf Controllers.ItemViewerController
		 * @description Boolean value indicating
		 * whether or not this item is editable
		 */
		this.isEditable = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#dateFormat
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Stores the date format.
		 */
		this.dateFormat = 'yyyy';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#dateAndHourFormat
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Stores the date format, plus hour format
		 */
		this.dateAndHourFormat = 'yyyy hh:mm a';

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#isSavingData
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Set to true when saving data is underway, as to block form elements from editing while saving.
		 */
		this.isSavingData = false;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#itemDetailsData
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Object containing data for this item, untouched, from the endpoint.
		 */
		this.itemDetailsData = {};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#itemDetailsFieldsData
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The array that holds all the key/value pairs for each field of the item, including matrices.
		 */
		this.itemDetailsFieldsData = {};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#ItemObj
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Reference to hold the Item Data Model
		 */
		this.ItemObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#ownershipData
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Holds the ownership data
		 */
		this.ownershipData = null;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#primaryUser
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The Constant for Primary user.
		 */
		this.primaryUser = OWNER_TYPE.PRIMARY;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#additionalUser
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The Constant for Additional user.
		 */
		this.additionalUser = OWNER_TYPE.ADDITIONAL_USER;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#additionalGroup
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description The Constant for Additional Group.
		 */
		this.additionalGroup = OWNER_TYPE.ADDITIONAL_GROUP;

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#classificationState
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Holds the classification state
		 */
		this.classificationState = {
			classification: {
				id: null
			}
		};

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#ownershipListenerId
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Listener for ownership object.
		 */
		this.ownershipListenerId = EventService.listen(`ownership:${this.itemId}:done`, (event, ownershipObj) => {
			EventService.unlisten(this.ownershipListenerId);

			/**
			 * @ngdoc property
			 * @name Controllers.workspaceItem.ViewDetailsController#ownershipObj
			 * @propertyOf Controllers.workspaceItem.ViewDetailsController
			 * @description Holds the ownershipObj with payload initialized.
			 */
			this.ownershipObj = ownershipObj;

			// Sets the ownership data
			this.ownershipData = ownershipObj.getFullList();

			this.parseOwnersDetails();
		});

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#itemListenerId
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Listener for item object.
		 */
		this.itemListenerId = this.EventService.listen(`itemInstance:${this.itemId}:done`, (event, itemObj) => {
			this.EventService.unlisten(this.itemListenerId);

			PermissionService.checkPermissionByItem(itemObj, this.PLMPermissions.VIEW_OWNER_CHANGE_SUMMARY).then(hasPermission =>
				hasPermission && ModelsManager.getOwnershipByLink(this.itemId, itemObj.getOwnershipLink())
			);

			// Assign all returned objects to their respective local objects
			this.ItemObj = itemObj;

			// decide if the item is editable
			this.isEditable = !this._.every(itemObj.getSections(), item => item.sectionLocked === true);

			// Sets the item data object
			this.itemDetailsData = this.ItemObj.getFullList();

			// Sets the item fields data object
			this.itemDetailsFieldsData = this.ItemObj.getSections();

			this.ItemObj.workspaceObj.getSectionsMeta().then(() => {
				// Gets the meta data
				this.itemDetailsMeta = this.ItemObj.workspaceObj.getSectionsMetadata();

				// A special array, ngRepeat-friendly, for item details, filtering only sections found in the item details payload
				// NOTE: this logic is bound to change if we ever get an item details metadata endpoint, which would ideally contain
				// a list of all fields in the section(s) that are blank, hence avoiding having to cross-reference all the data/metadata
				// payloads like we're doing here.
				//
				// NOTE THAT THIS COMPLETELY BREAKS EDITING, THIS SHOULDN'T HAVE BEEN DONE, EVEN THOUGH IT WASN'T BREAKING ANYTHING AT THE TIME BECAUSE EDIT WAS TURNED OFF
				// NEED TO REDO THIS
				this.itemDetailsViewModeData = this._.filter(this.itemDetailsMeta, (section) => {

					if (!this.isClassificationSection(section)) {
						// Add metadata and fieldMetadata to each field in the section
						// NOTE: if the section is empty, section.definition.fields should be an empty array
						this._.each(section.definition.fields, (field) => {

							// Default loop for normal field types
							if (field.type === 'FIELD') {
								let foundField = this.findValue(section.link, field.link);

								// TODO: Temporary workaround for getting the item id from within the filtered picklist directive,
								// since the payload is not retrieving it correctly. Remove also below (line 244?).
								field.mainItemId = this.itemId;

								buildMetaField(field, foundField);
							} else {
								// Loops through each row of the matrix
								this._.each(field.definition.fields, (matrixRow) => {

									this._.each(matrixRow, (matrixColField) => { // Loops through each columns of the matrix
										if (matrixColField !== null) {
											let foundField = this.findValue(section.link, matrixColField.link);

											// TODO: Temporary workaround for getting the item id from within the filtered picklist directive,
											// since the payload is not retrieving it correctly. Remove also above (line 231?).
											matrixColField.mainItemId = this.itemId;

											buildMetaField(matrixColField, foundField);
										}
									});
								});
							}
						});

					} else {
						section.definition.fields = [];
						// Classification sections needs to look for their fields in parts endpoint
						let urn = this.getPartUrn(section);
						this.ClassificationService.getClassificationFields(urn, urn, null, false).then(response => {
							section.definition.fields = response.properties;
							this.classificationState.classification = {
								id: response.classificationId
							};
						});

						this.classificationChangeListenerId = EventService.listen('classification:update', (event, newClassification) => {
							let itemClass = newClassification.selected;

							this.classificationState.classification = itemClass;

							section.definition.fields = [];
							this.ClassificationService.getClassificationFields(urn, urn, itemClass.id, false).then(response => {
								section.definition.fields = response.properties;
							});
						});
					}

					// Only return the section if found in the item details payload
					// NOTE: this shouldn't be a problem as the sections listed on the sections data endpoint
					// should match the ones in the item details payload, so this code could be removed later
					let sectionToReturn = this._.find(this.itemDetailsFieldsData, (foundSection) => {
						return (foundSection.link.substring(foundSection.link.lastIndexOf('/') + 1) === (section.link.substring(section.link.lastIndexOf('/') + 1)));
					});
					return angular.isDefined(sectionToReturn);
				});
			});

			// A helper function to clean up a bit.
			let buildMetaField = (field, foundField) => {
				field.fieldMetadata.readOnly = field.fieldMetadata.editability !== 'ALWAYS';
				if (angular.isDefined(foundField)) {
					// Need to apply lineBreak Filter for paragraph to replace '\n' with '<br>'
					field.value = (foundField.metadata.dataTypeId === this.FieldTypes.PARAGRAPH) ? this.$filter('lineBreakFilter')(foundField.value) : foundField.value;
					field.metadata = foundField.metadata;
					if (angular.isDefined(field.fieldMetadata)) {
						field.options = field.fieldMetadata.picklistPayload;
					}
				} else {
					if (angular.isDefined(field.fieldMetadata)) {
						field.options = field.fieldMetadata.picklistPayload;
					}
					field.metadata = field.fieldMetadata;
					field.metadata.dataTypeId = field.metadata.type.link.substring(field.metadata.type.link.lastIndexOf('/') + 1);
					field.value = '';
				}
			};

			try {
				this.$scope.$digest();
			} catch (e) {

			}
		});

		if (this.itemId) {
			this.ModelsManager.getItem(this.itemId, !this.isViewState(), this.cached);
		}

		/**
		 * @ngdoc property
		 * @name Controllers.workspaceItem.ViewDetailsController#userListenerId
		 * @propertyOf Controllers.workspaceItem.ViewDetailsController
		 * @description Listener for user object.
		 */
		this.userListenerId = this.EventService.listen('currentUser:currentUser:done', (event, userObj) => {
			this.EventService.unlisten(that.userListenerId);

			this.dateFormat = userObj.getDateFormat();
			this.dateAndHourFormat = `${userObj.getDateFormat()} hh:mm a`;
		});

		// Destroy listeners once user leaves this item
		this.$scope.$on('$destroy', () => {
			this.EventService.unlisten(this.itemListenerId);
			this.EventService.unlisten(this.userListenerId);
			this.EventService.unlisten(this.ownershipListenerId);
			// Some items don't have classification data in them, therefore there's nothing to unlisten for
			if (this.classificationChangeListenerId) {
				this.EventService.unlisten(this.classificationChangeListenerId);
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#findSection
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Finds the section by link
	 *
	 * @param {String} sectionLink The resouce link of the section (ex. /api/v3/workspaces/{id}/items/{id}/views/{id}/sections/{id})
	 *
	 * @returns {Obejct} The object that holds the data of the target section
	 *
	 */
	findSection(sectionLink) {
		return this._.find(this.itemDetailsData.sections, (sectionElement) => {
			return (sectionElement.link.substring(sectionElement.link.lastIndexOf('/') + 1) === sectionLink.substring(sectionLink.lastIndexOf('/') + 1));
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#findValue
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Finds value of a supplied field in the item details payload
	 *
	 * @param {String} sectionLink The resouce link of the section (ex. /api/v3/workspaces/{id}/items/{id}/views/{id}/sections/{id})
	 * @param {String} fieldId The resource ID of the field (ex. /api/v3/workspaces/{id}/items/{id}/fields/{id})
	 *
	 * @returns {String} The value, or empty it case it didn't find the field in the item details payload
	 *
	 */
	findValue(sectionLink, fieldId) {
		// Finds the section in the item details payload
		let foundSection = this.findSection(sectionLink);

		let foundField;
		if (angular.isDefined(foundSection)) {
			// Finds the field in the section
			foundField = this._.find(foundSection.fields, (fieldElement) => {
				return (fieldElement.__self__.substring(fieldElement.__self__.lastIndexOf('/') + 1) === fieldId.substring(fieldId.lastIndexOf('/') + 1));
			});
		}

		return foundField;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#updateChanges
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Called whenever a field (of any type) has been updated in the UI.
	 */
	updateChanges(fieldId, newVal) {}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#isSectionEditable
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Tests to see if section is editable
	 *
	 * @param {String} sectionLink The link of the section
	 *
	 * @returns {Boolean} True if the section is not locked
	 */
	isSectionEditable(sectionLink) {
		var section = this.findSection(sectionLink);
		return !section.sectionLocked;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#getFieldIdFromUrn
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Extracts the field ID from the a given urn
	 *
	 * @param {String} A given URN
	 */
	// TODO This should be moved to a PLMUrnService or something like that, with all helper functions related to Urns
	getFieldIdFromUrn(urn) {
		return urn && urn.substring && urn.lastIndexOf && urn.substring(urn.lastIndexOf('.') + 1);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#getValueFromMetadataFields
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Searches the metadata field related to a given field and assigns its value
	 *
	 * @param {String} A field ID
	 * @param {String} An array of metadata fields
	 *
	 * @returns {Object} The field value
	 */
	getValueFromMetadataFields(fieldId, metadataFields) {
		let value = null;
		let that = this;

		if (!fieldId || !metadataFields) {
			return null;
		}

		this._.each(metadataFields, (metadataField) => {
			if (value === null) { // Just to not break the loop
				if (metadataField.type !== 'MATRIX') { // FieldTypes.MATRIX ????
					let metadataFieldId = that.getFieldIdFromUrn(metadataField.urn);
					if (metadataFieldId === fieldId) {
						value = metadataField.value;
					}
				} else {
					value = that.getValueFromMatrixMetadataFields(fieldId, metadataField.definition.fields);
				}
			}
		});
		return value;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#getValueFromMatrixMetadataFields
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Searches a matrix metadata field related to a given field and assigns its value
	 *
	 * @param {String} A field ID
	 * @param {String} An matrix of metadata fields
	 *
	 * @returns {Object} The field value
	 */
	getValueFromMatrixMetadataFields(fieldId, matrixMetadataFields) {
		let value = null;
		let that = this;

		if (!fieldId || !matrixMetadataFields) {
			return null;
		}

		// Finds the value inside the matrix for the passed field
		that._.chain(matrixMetadataFields)
			.flatten(_.map(flatMatrix => flatMatrix))
			.filter(field => field !== null)
			.each((field) => {
				let metadataFieldId = that.getFieldIdFromUrn(field.urn);
				if (metadataFieldId === fieldId) {
					value = field.value;
				}
			});
		return value;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#triggerSave
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Triggered by clicking save button. NOTE: name has to be triggerSave.
	 */
	triggerSave() {
		let that = this;
		let classificationFields = null;
		let classificationSection = null;
		this.isSavingData = true; // When it goes to the VIEW mode, this is going to be set as false again
		this.$scope.isSavingData = true;

		this._.each(this.itemDetailsViewModeData, (metadataSection) => {
			if (this.isClassificationSection(metadataSection) && this.isSectionEditable(metadataSection.link)) {
				// keep a reference, so we can use it later on saving
				classificationSection = metadataSection;
				classificationFields = angular.copy(metadataSection.definition.fields);
			}
		});

		// Loop over the fields data and over the fields metadata (with the values entered from the UI)
		this._.each(this.itemDetailsFieldsData, (section) => {
			this._.each(section.fields, (field) => {
				let fieldId = that.getFieldIdFromUrn(field.urn);

				// Need to refactor this more throughly - it's more complicated than it should be as it is
				this._.each(this.itemDetailsViewModeData, (metadataSection) => {
					// Don't look into CWS section fields, and only look into the sections that match
					if (!this.isClassificationSection(metadataSection) && (section.link.substr(section.link.lastIndexOf('/')) === metadataSection.link.substr(metadataSection.link.lastIndexOf('/')))) {
						let value = that.getValueFromMetadataFields(fieldId, metadataSection.definition.fields);

						field.value = value;
					}
				});
			});
		});

		var saveCwsListenerId = this.EventService.listen(`itemInstance:${this.itemId}:saveCwsDone`, (event, flag) => {
			this.EventService.unlisten(saveCwsListenerId);
			var saveListenerId = this.EventService.listen(`itemInstance:${this.itemId}:saveDone`, (event, flag) => {
				this.EventService.unlisten(saveListenerId);

				if (flag) {
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${this.ItemObj.getItemTitle()}${this.$rootScope.bundle.notification.singleEdit.success}`
					);

					this.$state.go('details', {
						tab: this.$location.search().tab,
						view: this.$location.search().view,
						mode: 'view',
						itemId: this.$location.search().itemId,
						cached: false
					});
				} else {
					this.NotificationService.addNotification(
						this.NotificationTypes.ERROR,
						`${this.ItemObj.getItemTitle()}${this.$rootScope.bundle.notification.singleEdit.failed}`
					);

					this.isSavingData = false;
					this.$scope.isSavingData = false;
				}

				this.NotificationService.showNotifications();
			});

			this.EventService.send(`itemInstance:${this.itemId}:saveItem`, [this.ItemObj, this.itemDetailsFieldsData]);
		});

		if (classificationSection !== null) {
			this.triggerClassificationSave(classificationFields);
		} else {
			// no cws section then just send the event
			this.EventService.send(`itemInstance:${this.itemId}:saveCwsDone`, [true]);
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#triggerCancel
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Triggered by clicking cancel button. NOTE: name has to be triggerCancel.
	 */
	triggerCancel() {
		this.$state.go('details', {
			tab: this.$location.search().tab,
			view: this.$location.search().view,
			mode: 'view',
			itemId: this.$location.search().itemId,
			cached: false
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#triggerClassificationSave
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Triggered by clicking save button.
	 *
	 * @param {Array} rawFields Array of raw fields
	 */
	triggerClassificationSave(rawFields) {
		let newRawFields = [];
		this._.each(rawFields, (cwsFieldAdapter) => {
			newRawFields.push(cwsFieldAdapter.getOriginData());
		});
		this.ClassificationService.saveRawFields(this.classificationState.classification.id, this.ItemObj.getUrn(), newRawFields).then((response) => {
			this.EventService.send(`itemInstance:${this.itemId}:saveCwsDone`, [true]);
		}, (errors) => {
			if (angular.isDefined(errors.phantomRestriction)) {
				this.NotificationService.addNotification(
					this.NotificationTypes.ERROR,
					this.$rootScope.bundle.classifications.section.warning.phantom_class
				);
			} else {
				this._.each(this.ClassificationUtil.errorMessageHandler(errors), (error) => {
					this.NotificationService.addNotification(
						this.NotificationTypes.ERROR,
						error
					);
				});
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#goToEdit
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Triggering edit mode
	 */
	goToEdit() {
		this.$state.go('details', {
			tab: this.$location.search().tab,
			view: this.$location.search().view,
			mode: 'edit',
			itemId: this.$location.search().itemId
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#isViewState
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Determine whether we're in view mode
	 *
	 * @returns {Boolean} True if we are in view mode
	 */
	isViewState() {
		return (this.$location.search().mode === 'view');
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#tooltipFlyout
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Show tooltip if there is an item description.
	 *
	 * @param {Object} event		The event object
	 * @param {String} displayName	The displayName of the item field
	 * @param {String} description	The description of the item field
	 */
	tooltipFlyout(event, displayName, description) {
		var tooltip = this.FlyoutService.open({
			templateUrl: 'partials/workspaceItemTooltip.html',
			scope: this.$scope,
			anchorEl: angular.element(event.target),
			placement: 'left',
			showArrow: true,
			flyoutClass: 'item-tooltip-flyout',
			controller: ($scope, $flyoutInstance) => {
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
	 * @name Controllers.workspaceItem.ViewDetailsController#getPartUrn
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Access to section attributes so we can determine if it is a
	 * classificaiton section or not
	 *
	 * @param {Section} section The step section
	 *
	 * @returns {String} The urn asociated to a classification section
	 */
	getPartUrn(section) {
		if (this.isClassificationSection(section)) {
			return this.ItemObj.getUrn();
		}
		return undefined;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#isClassificationSection
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Determine if a section is or not of type classification
	 *
	 * @param {Section} section The step section
	 *
	 * @returns {Boolean} True if it is a classification section
	 */
	isClassificationSection(section) {
		return (section.definition.type === this.SECTION_TYPES.CLASSIFICATION);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#toggleOwnershipFlyoutDisplay
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description Toggles ownership panel displaying
	 *
	 * @param {Object} validationRules The object which contains the validation rules
	 */
	isRequiredField(validationRules) {
		if (!angular.isDefined(validationRules)) {
			return false;
		}
		return angular.isDefined(validationRules.required) || angular.isDefined(validationRules.dropDownSelection);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#toggleOwnershipFlyoutDisplay
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description `private` Toggles ownership panel displaying
	 *
	 * @param {Object} event The triggerer of the flyout
	 * @param {Integer} userId The id of the user to retrieve info from
	 */
	toggleOwnershipFlyoutDisplay(event, userId) {
		this.FlyoutService.open({
			flyoutClass: 'user-profile-flyout',
			scope: this.$scope,
			anchorEl: event.target,
			template: `<user-profile-summary user-id="${userId}"></user-profile-summary>`
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#parseOwnersDetails
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description parses the owner information and create scope model to use in view
	 */
	parseOwnersDetails() {
		_.each(this.ownershipData.ownership.owners, (owner) => {
			// Need to retrive id as this need to be passed to user-flyout model
			owner.id = owner.detailsLink.substr(owner.detailsLink.lastIndexOf('/') + 1);
			owner.type = owner.ownerType === this.additionalGroup ? this.$rootScope.bundle.details.group : this.$rootScope.bundle.details.user;
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#triggerChangeOwnerDialog
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description triggers the change owner dialog
	 *
	 */
	triggerChangeOwnerDialog() {
		this.$mdDialog.show({
			templateUrl: 'build/components/workspaceItem/changeOwner/changeOwner.html',
			controller: 'ChangeOwnerController as changeOwnerCtrl',
			locals: {
				ownershipObj: this.ownershipObj
			}
		}).then(() => {
			this.$state.reload('details');
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.workspaceItem.ViewDetailsController#triggerEditAdditionalOwnersDialog
	 * @methodOf Controllers.workspaceItem.ViewDetailsController
	 * @description triggers the edit additional owners dialog
	 *
	 */
	triggerEditAdditionalOwnersDialog() {
		this.$mdDialog.show({
			templateUrl: 'build/components/workspaceItem/changeOwner/editAdditionalOwners.html',
			controller: 'EditAdditionalOwnersController as editAdditionalOwnersCtrl',
			locals: {
				ownershipObj: this.ownershipObj
			}
		}).then(() => {
			this.$state.reload('details');
		});
	}
}

export default ViewDetailsController;