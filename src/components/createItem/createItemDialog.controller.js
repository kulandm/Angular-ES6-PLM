'use strict';

/**
 * @ngdoc object
 * @name Controllers.CreateItemDialogController
 *
 * @description The controller for create item dialog.
 * This controller handles the dialog commands such as saving and closing.
 *
 * ##Dependencies
 *
 */
// TODO Stick with ManagedItem terminology over AffectedItems.
// TODO ManagedItem related logic is a simplified version of affected item logic.
// It would be great if things can be reused.
class CreateItemDialogController {
	/*
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#constructor
	 * @methodOf Controllers.CreateItemDialogController
	 * @description The class constructor
	 */
	constructor($rootScope, $scope, $state, $mdDialog, $q, _, EventService, NotificationService, NotificationTypes,
	            ModelsManager, PLMPermissions, UrnParser, CurrentItem, CurrentWorkspace, AddWorkspaceList, FieldTypes,
	            CreateTypes, createType, ValidationUtil, Workspace) {
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$mdDialog = $mdDialog;
		this.$q = $q;
		this.EventService = EventService;
		this.NotificationService = NotificationService;
		this.NotificationTypes = NotificationTypes;
		this.ModelsManager = ModelsManager;
		this.UrnParser = UrnParser;
		this.FieldTypes = FieldTypes;
		this.ValidationUtil = ValidationUtil;
		this._ = _;
		this.Workspace = new Workspace();

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#currentItem
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The current item object
		 */
		this.currentItem = CurrentItem;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#currentWorkspace
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The current workspace object
		 */
		this.currentWorkspace = CurrentWorkspace;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#workspacesList
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description List of permitted workspaces that a user can add item to
		 */
		this.workspacesList = AddWorkspaceList;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#createType
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description String to determine the type of create
		 */
		this.createType = createType;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#isContextualCreate
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description True, if the dialog to be triggered is for in-contextual
		 * create and add to managed items tab
		 */
		this.isContextualCreate = createType === CreateTypes.CONTEXTUAL;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#isQuickCreate
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description True, if the dialog to be triggered is for quick create
		 */
		this.isQuickCreate = createType === CreateTypes.QUICK;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#selectedWorkspace
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The pre-selected workspace, aka the only permitted
		 * workspace in which the user can add item to for quick create
		 */
		this.selectedWorkspace;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#selectedSaveType
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The type of saving selected
		 */
		this.selectedSaveType;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#dialogElement
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The current dialog element
		 */
		this.dialogElement;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#isSavingData
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description Set to true when saving data is underway, as to
		 * block form elements from being edited while saving
		 */
		this.isSavingData = false;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#formFields
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description An array consisting of the form fields
		 */
		this.formFields = [];

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#unsupportedFields
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description An object updated by {@link Directives.createItem}
		 * to indicate if there are any unsupported fields
		 */
		this.unsupportedFields = {
			hasUnsupported: false
		};

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#managedItemObj
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description An instance of managed item model.
		 */
		this.managedItemObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#managedItemFormObj
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description An object that contains details of the managed item fields.
		 */
		this.managedItemFormObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#filterToApply
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The type of filter to apply on the fields
		 */
		this.filterToApply;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#isManagedView
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description Boolean to determine whether manage screen is displayed
		 */
		this.isManagedView = false;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#createdItemObj
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The newly create item object (used for in-contextual
		 * create, in the manage state)
		 */
		this.createdItemObj = null;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#managedViewHeading
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The heading for the managed view
		 */
		this.managedViewHeading = null;

		/**
		 * @ngdoc property
		 * @name Controllers.CreateItemDialogController#viewPermission
		 * @propertyOf Controllers.CreateItemDialogController
		 * @description The view items permission for the user
		 */
		this.viewPermission = PLMPermissions.VIEW_ITEMS;

		// Initialise filter according to create type
		if (this.isQuickCreate) {
			this.filterToApply = this.quickCreateFilter;
		} else if (this.isContextualCreate) {
			this.filterToApply = this.requiredFieldsFilter;
		}

		// The current workspace is the selected workspace to add item to
		// (provided that user can add to the current workspace)
		if (this.isQuickCreate && this.currentWorkspace) {
			this.selectedWorkspace = this._.find(this.workspacesList, workspace =>
				workspace.getId() === this.currentWorkspace.getId());
		} else if (this.isContextualCreate && this.workspacesList.length === 1) {
			this.selectedWorkspace = this.workspacesList[0];
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#getFields
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Returns a flat array of all the fields
	 * in the currently selected workspace
	 *
	 * @returns {Array} List of all the fields
	 */
	getFields() {
		// TODO need to revisit this flattening for full create.
		// It might not be that straight forward.
		return this._.flatten(this._.pluck(this.formFields, 'fields'));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#isFormFilled
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Checks if all fields in the form have been filled
	 *
	 * @returns {Boolean} True, if all fields in the form have been filled
	 */
	isFormFilled() {
		// If there are no fields, don't bother checking if form is filled
		if (!this.getFields().length) {
			return false;
		}

		// Given that there are fields, get the value of each field from every
		// section and pass it to check if they're all truthy. But in the case
		// of 'Autonum' field type, ignore its value.
		let filteredFields = this._.reject(this.getFields(), field => {
			var dataTypeId = parseInt(field.metadata.dataTypeId);

			return dataTypeId === this.FieldTypes.AUTONUM ||
				dataTypeId === this.FieldTypes.AUTOTEXT;
		});

		return this._.every(this._.pluck(filteredFields, 'value'));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#isSaveDisabled
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Checks if the save button should be disabled, depending on
	 * whether we're on the create or managed screen.
	 *
	 * @returns {Boolean} True, if the save button should be disabled
	 */
	isSaveDisabled() {
		if (this.isManagedView) {
			return !this.canSaveManagedItem();
		} else {
			// Enable save if there are no fields, and
			// disable if there are fields and fields are not filled in
			return !!this.getFields().length && !this.isFormFilled();
		}
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#requiredFieldsFilter
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Filter function that can be used with
	 * {@link Item#getViewDetailsFieldsData} to filter for required fields
	 *
	 * TODO Un-editable required field is not considered a required field.
	 *
	 * @param {Object} fieldDefinition The object of the created item
	 *
	 * @returns {Boolean} True, if field is required in the create form
	 */
	requiredFieldsFilter(fieldDefinition) {
		let requiredValidation = false;

		if (fieldDefinition && fieldDefinition.validatorsMeta &&
			fieldDefinition.validatorsMeta.length) {
			requiredValidation = _.find(fieldDefinition.validatorsMeta, validation =>
				validation.validatorName.toUpperCase() === 'REQUIRED' ||
				validation.validatorName.toUpperCase() === 'DROPDOWNSELECTION');
		}

		return requiredValidation;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#quickCreateFilter
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Filter function that can be used with
	 * {@link Item#getViewDetailsFieldsData} to filter for required and
	 * visibleOnPreview fields
	 *
	 * @param {Object} fieldDefinition The object of the created item
	 *
	 * @returns {Boolean} True, if field is required in the create form
	 */
	quickCreateFilter(fieldDefinition) {
		return this.requiredFieldsFilter(fieldDefinition) || fieldDefinition.visibleOnPreview;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#clearFields
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Reset fields to their default values
	 */
	clearFields() {
		this._.each(this.getFields(), field => field.value = field.defaultValue);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#close
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Closes create item dialog
	 */
	close() {
		this.$mdDialog.hide(this.isManagedView);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#onSaveChange
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Upon selecting save type, do the respective save
	 */
	onSaveChange() {
		this.dialogElement = document.querySelector('.create-item-dialog');

		switch (this.selectedSaveType) {
			case this.$rootScope.bundle.create.save:
				if (this.isManagedView) {
					this.manageAndClose();
				} else {
					this.saveAndClose();
				}
				break;
			case this.$rootScope.bundle.create.saveCopy:
				this.saveAndCopy();
				break;
			case this.$rootScope.bundle.create.saveManage:
				this.saveAndManage();
				break;
			case this.$rootScope.bundle.create.saveNew:
				this.saveAndNew();
				break;
			case this.$rootScope.bundle.create.saveView:
				this.saveAndView();
				break;
			default:
				this.save();
		}

		// Reset the selected save type so user can select the same type again
		this.selectedSaveType = null;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#saveAndClose
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves the new item and closes the dialog
	 */
	saveAndClose() {
		this.save().then(() => {
			this.close();
			this.NotificationService.showNotifications();
		}, () => {
			this.NotificationService.showNotifications(this.dialogElement);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#saveAndCopy
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves the new item and moves to the next screen of dialog
	 */
	saveAndCopy() {
		// TODO Handle copy/edit of item
		this.save();
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#saveAndManage
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves the new item and moves to the next screen of dialog
	 */
	saveAndManage() {
		return this.save().then(saveData => {
			return this.addItem().then(() => {
				this.clearFields();
				this.NotificationService.showNotifications(this.dialogElement);
				this.EventService.send('itemAddedToECO:done');

				return this.createManagedItemFormObj().then(managedItemFormObj => {
					this.isManagedView = true;
					this.managedViewHeading = saveData.getFullList().title;
					this.managedItemFormObj = managedItemFormObj;
				});
			});
		}, () => this.NotificationService.showNotifications(this.dialogElement));
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#saveAndNew
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves the new item and clears the form field
	 * so that a new item can be created
	 */
	saveAndNew() {
		this.save().then(() => {
			this.clearFields();
			this.NotificationService.showNotifications(this.dialogElement);
		}, () => {
			this.close();
			this.NotificationService.showNotifications();
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#saveAndView
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves the new item and navigates to the newly created item
	 */
	saveAndView() {
		this.save().then(itemObj => {
			this.$state.go('details', {
				workspaceId: itemObj.getWorkspaceObj().getId(),
				tab: 'details',
				view: 'full',
				mode: 'view',
				itemId: `${this.UrnParser.encode(itemObj.getFullList().urn)}`
			});

			this.NotificationService.showNotifications();
		}, (errorInfo) => {
			this.NotificationService.showNotifications(this.dialogElement);
		}).finally(this.close);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#save
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves a newly created item
	 */
	save() {
		let deferred = this.$q.defer();
		let selectedWorkspaceId = this.selectedWorkspace.getId();

		this.isSavingData = true;

		let saveItemListenerId = this.EventService.listen('itemInstance:newItem:saveDone', (event, response, flag) => {
			this.EventService.unlisten(saveItemListenerId);

			this.ValidationUtil.clearValidationErrors(this.getFields());

			if (flag) {
				// TODO This is hackish. Server is giving an absolute url in the
				// location. We need to map that absolute url of the newly
				// created item to our routing state {workspaceId@dmsId}
				let createItemAbsUrl = response.location;

				let [relativeUrl, workspaceId, dmsId] = createItemAbsUrl
					.match(/workspaces\/(\S*)\/items\/(\S*)/);
				let resourceId = `${workspaceId}@${dmsId}`;

				let itemListenerId = this.EventService.listen(`itemInstance:${resourceId}:done`, (event, itemObj) => {
					this.EventService.unlisten(itemListenerId);

					this.createdItemObj = itemObj;

					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${this.createdItemObj.getItemTitle()}${this.$rootScope.bundle.notification.singleCreate.success}`
					);

					deferred.resolve(itemObj);
				});

				this.ModelsManager.getItem(resourceId);
			} else {
				this.ValidationUtil.mapValidationErrors(this.getFields(), response.data);

				this.NotificationService.addNotification(
					this.NotificationTypes.ERROR,
					`${response.data.length}${response.data.length > 1 ?
						this.$rootScope.bundle.notification.create.errors :
						this.$rootScope.bundle.notification.create.error}`
				);

				deferred.reject(response);
			}

			this.isSavingData = false;
		});

		this.EventService.send('itemInstance:newItem:save',
			[null, selectedWorkspaceId, this.formFields]);

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#addItem
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Add the current item to the managed items tab of the
	 * newly created item
	 */
	addItem() {
		let deferred = this.$q.defer();

		this.EventService.send(`itemInstance:${this.currentItem.getId()}:associateAffectedItem`,
			[this.createdItemObj, this.currentItem.getFullList().__self__,
			this.currentItem.getFullList().title]);

		this.EventService.listen(`itemInstance:${this.currentItem.getId()}:associationDone`, (event, isAdded) => {
			if (isAdded) {
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#createManagedItemFormObj
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Create managed item form object by fetching required
	 * information related to managed item.
	 *
	 * @return {Object} A promise for managed item form object.
	 */
	createManagedItemFormObj() {
		return new Promise((resolve, reject) => {
			this.customFields = [];
			let revisioningItemEncodedURN = this.UrnParser.encode(this.createdItemObj.getFullList().urn);

			let managedItemsMetaListenerId = this.EventService.listen(`affectedItemsMeta:${revisioningItemEncodedURN}:done`, (event, managedItemsMetaObj) => {
				this.EventService.unlisten(managedItemsMetaListenerId);

				let managedItemsMeta = managedItemsMetaObj.getFullList();

				let customFieldPromises = this._.map(managedItemsMeta, field => {
					return this.$q((resolve) => {
						let customCol = {
							displayName: field.name,
							fieldMetadata: field,
							field: managedItemsMetaObj.getFieldId(field),
							dataType: managedItemsMetaObj.getDataTypeId(field),
							edit: field.editability === 'ALWAYS',
							isPicklist: angular.isDefined(field.picklist) && field.picklist !== null
						};

						if (customCol.isPicklist) {
							this.Workspace.setPicklistHook(customCol).then(() => {
								this.customFields.push(customCol);
								resolve();
							});
						} else {
							this.customFields.push(customCol);
							resolve();
						}
					});
				});

				this.$q.all(customFieldPromises).then(() => {
					this.ModelsManager.getAffectedItemsByLink(revisioningItemEncodedURN,
						this.createdItemObj.getAffectedItemsLink());
				});
			});

			let managedItemsListenerId = this.EventService.listen(`affectedItems:${revisioningItemEncodedURN}:done`, (event, managedItemsObj) => {
				this.EventService.unlisten(managedItemsListenerId);

				// Take first item of the list. We know it will only contain
				// one item as we have just created it.
				this.managedItemObj = managedItemsObj.getFullList()[0];

				let formObj = this.getManagedItemFields();

				this.getAvailableTransitions(this.managedItemObj.getId(), formObj, this.managedItemObj.getObject().availableTransitions).then(() => {
					formObj.lifecycle.lifecycleChanged();
					resolve(formObj);
				});
			});

			this.ModelsManager.getAffectedItemsMetaByLink(revisioningItemEncodedURN,
				this.createdItemObj.getAffectedItemsMetaLink());
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#getManagedItemFields
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Create form fields from given
	 * managedItem {@link Models$AffectedItem} object.
	 *
	 * @return {Object} Field information of managed item instance.
	 */
	getManagedItemFields() {
		let formObj = {};
		let managedItemObjData = this.managedItemObj.getObject();
		let itemTitle = managedItemObjData.item.version ?
			`${managedItemObjData.item.title} ${managedItemObjData.item.version}` :
			`${managedItemObjData.item.title}`; // Add rev tag to item, if any
		let effectivityDate = managedItemObjData.effectivityDate ?
			new Date(managedItemObjData.effectivityDate) : null; // `null` implies 'On Release'

		formObj.item = {
			value: itemTitle,
			originalValue: itemTitle,
			metadata: {
				dataTypeId: this.FieldTypes.SINGLE_LINE_TEXT
			},
			edit: false
		};

		formObj.lifecycle = {
			value: {title: ''},
			originalValue: {title: ''},
			metadata: {
				dataTypeId: this.FieldTypes.PICKLIST
			},
			lifecycleChanged: () => {
				if (formObj.lifecycle.value.link) {
					formObj.lifecycle.value = this._.clone(
						this._.find(formObj.lifecycle.options.items, (option) =>
							option.title === formObj.lifecycle.value.title)
					);

					// If effectivity is writable but has no value,
					// set effectivity to its original value or reset the value if effectivity is not writable
					if ((!formObj.effectivity.value && formObj.lifecycle.value &&
						formObj.lifecycle.value.effectivityWritable) ||
						(formObj.lifecycle.value &&
						formObj.lifecycle.value.effectivityWritable === false)) {
						formObj.effectivity.value = formObj.effectivity.originalValue;
					}
				} else {
					formObj.lifecycle.value = this._.clone(formObj.lifecycle.options.items[0]);
				}

				// For 'To' to be editable, revision number generation must
				// be 'MANUAL', and flag for incrementRelease must be true
				let overrideTargetRevision = formObj.lifecycle.value.overrideTargetRevision;
				let increaseRelease = formObj.lifecycle.value.incrementRelease;
				let isToEditable = (overrideTargetRevision === 'MANUAL') && increaseRelease;
				formObj.to.edit = isToEditable;
			}
		};

		formObj.effectivity = {
			value: effectivityDate,
			originalValue: effectivityDate,
			metadata: {
				dataTypeId: this.FieldTypes.DATE,
				datePickerMinDate: new Date()
			},
			placeholder: this.$rootScope.bundle.affectedItems.onRelease
		};

		formObj.from = managedItemObjData.fromRelease !== '0' ?
			managedItemObjData.fromRelease : '';

		formObj.to = {
			value: managedItemObjData.toRelease,
			originalValue: managedItemObjData.toRelease,
			fieldTypeId: 'SINGLE_LINE',
			metadata: {
				dataTypeId: this.FieldTypes.SINGLE_LINE_TEXT,
				fieldLength: 5
			},
			edit: false
		};

		formObj.customFields = this.getManagedItemCustomFields();
		return formObj;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#getManagedItemCustomFields
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Create custom fields from given managedItem
	 * {@link Models$AffectedItem} and meta {@link Models#AffectedItemMeta} objects.
	 *
	 * @return {Array} List of custom field information of managed item instance.
	 */
	getManagedItemCustomFields() {
		let managedItemObjData = this.managedItemObj.getObject();
		let customFormFields = [];

		// To enable editing for custom columns without data to begin with
		this._.each(this.customFields, customField => {
			if (customField.isPicklist) {
				customFormFields.push({
					link: customField.fieldMetadata.__self__,
					title: customField.displayName,
					value: '',
					originalValue: '',
					fieldTypeId: customField.field,
					metadata: this._.extend(customField.fieldMetadata, {
						dataTypeId: parseInt(customField.dataType)
					}),
					options: customField.fieldMetadata.picklistPayload,
					urn: managedItemObjData.urn,
					ref: customField
				});
			} else if (!customField.isPicklist) {
				customFormFields.push({
					title: customField.displayName,
					value: '',
					originalValue: '',
					fieldTypeId: customField.field,
					metadata: this._.extend(customField.fieldMetadata, {
						dataTypeId: parseInt(customField.dataType)
					}),
					ref: customField
				});
			}
		});

		return customFormFields;
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#getAvailableTransitions
	 * @methodOf Controllers.CreateItemDialogController
	 * @description get available transition for a given managed item state.
	 *
	 * @param {String} itemId The id of the item.
	 * @param {Object} itemRecord The details of the item.
	 * @param {String} availTransitLink Link to fetch information of transitions.
	 *
	 * @return {Object} A promise that will be resolved when transitions are fetched.
	 */
	getAvailableTransitions(itemId, itemRecord, availTransitLink) {
		return new Promise((resolve, reject) => {
			let managedItemsTransitionsListenerId = this.EventService.listen(`affectedItemTransitions:${itemId}:done`, (event, data) => {
				this.EventService.unlisten(managedItemsTransitionsListenerId);

				itemRecord.lifecycle.options = {
					items: this._.map(data.json, (transition) => {
						// Picklist expects 'title' and 'link' properties.
						transition.title = transition.name;
						transition.link = transition.__self__;

						return transition;
					})
				};

				itemRecord.lifecycle.options.items.unshift({
					title: this.$rootScope.bundle.affectedItems.pleaseSelect
				});

				itemRecord.lifecycle.value = this._.clone(itemRecord.lifecycle.options.items[0]);

				resolve();
			});

			this.ModelsManager.getAffectedItemsTransitions(itemId, availTransitLink.substring(1));
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#canSaveManagedItem
	 * @methodOf Controllers.CreateItemDialogController
	 * @description To check if managed item form data is in dirty state.
	 *
	 * @return {Boolean} True, if managed item form data is ready for save.
	 */
	canSaveManagedItem() {
		let propertyList = [];
		let requiredCustomFields = this._.filter(this.managedItemFormObj.customFields, field => {
			let dataTypeId = parseInt(field.metadata.dataTypeId);

			return this.requiredFieldsFilter(field.metadata) &&
				!(dataTypeId === this.FieldTypes.AUTONUM ||
				dataTypeId === this.FieldTypes.AUTOTEXT);
		});

		// don't allow save if not all required field are filled or editable 'to' value is empty.
		if (this._.every(this._.pluck(requiredCustomFields, 'value')) === false ||
			(this.managedItemFormObj.to.edit && !this.managedItemFormObj.to.value)) {
			return false;
		}

		// To field is required when editable
		if (this.managedItemFormObj.to.edit) {
			propertyList.push(this.managedItemFormObj.to);
		}

		if (this.managedItemFormObj.lifecycle.value.link) {
			propertyList.push({
				originalValue: this.managedItemFormObj.lifecycle.originalValue ?
					this.managedItemFormObj.lifecycle.originalValue.link : null,
				value: this.managedItemFormObj.lifecycle.value ?
					this.managedItemFormObj.lifecycle.value.link : null
			});
		}

		propertyList.push(this.managedItemFormObj.effectivity);

		return this._.some(propertyList, property => {
			return !this._.isEqual(property.originalValue, property.value);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#updateManagedItemObject
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Update managed item object {@link #managedItemObj} with
	 * the form data {@link #managedItemFormObj}.
	 */
	updateManagedItemObject() {
		if (angular.isDefined(this.managedItemFormObj.to.edit)) {
			this.managedItemObj.setTo(this.managedItemFormObj.to.value);
		}

		if (angular.isDefined(this.managedItemFormObj.lifecycle.value.link)) {
			this.managedItemObj.setLifecycle(this.managedItemFormObj.lifecycle.value);
		}

		this.managedItemObj.setEffectivity(this.managedItemFormObj.effectivity.value ?
			new Date(this.managedItemFormObj.effectivity.value) : null);

		this._.each(this.managedItemFormObj.customFields, customField => {
			let oldVal = customField.originalValue;
			let curVal = customField.value;

			// Note that RADIO is a picklist without 'title' (only has 'link')
			if ((customField.ref.isPicklist && (curVal.title !== oldVal.title ||
				curVal.link !== oldVal.link)) || (!customField.ref.isPicklist &&
				(curVal !== oldVal))) {
				// Make sure dates are in the correct Date format
				if (customField.ref.fieldTypeId === 'DATE') {
					curVal = new Date(curVal);
				}

				this.managedItemObj.setCustomColumnData(customField.ref.field, customField, customField.ref);
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#manageAndClose
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Manages the item and closes the dialog
	 */
	manageAndClose() {
		this.manage().then(() => {
			this.close();
			this.NotificationService.showNotifications();
		}, () => {
			this.close();
			this.NotificationService.showNotifications(this.dialogElement);
		});
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#manageAndView
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Manages the effectivity and lifecycle of the item and
	 * navigates to the affected items tab of the newly created item
	 */
	manageAndView() {
		this.manage().then(() => {
			this.$state.go('affected-items', {
				workspaceId: this.createdItemObj.getWorkspaceObj().getId(),
				tab: 'affected-items',
				view: 'full',
				mode: 'view',
				itemId: this.UrnParser.encode(this.createdItemObj.getFullList().urn)
			});

			this.NotificationService.showNotifications();
		}, (errorInfo) => {
			this.NotificationService.showNotifications(this.dialogElement);
		}).finally(this.close);
	}

	/**
	 * @ngdoc method
	 * @name Controllers.CreateItemDialogController#manage
	 * @methodOf Controllers.CreateItemDialogController
	 * @description Saves the affected items fields of the item. The method also
	 * handles save conflicts in-case of concurrent modifications.
	 *
	 * @return {Object} A promise that will be resolved for successful save or
	 * rejected for unsuccessful attempt.
	 */
	manage() {
		let deferred = this.$q.defer();

		if (this.canSaveManagedItem()) {
			this.updateManagedItemObject();

			let managedItemSaveListenerId = this.EventService.listen(`affectedItem:${this.managedItemObj.getId()}:saveDone`, (event, flag, errorInfo) => {
				this.EventService.unlisten(managedItemSaveListenerId);
				this.EventService.unlisten(managedItemSaveConflictListenerId);

				this.ValidationUtil.clearValidationErrors(this.managedItemFormObj.customFields);

				if (flag) {
					this.NotificationService.addNotification(
						this.NotificationTypes.SUCCESS,
						`${this.managedItemObj.getItemTitle()}${this.$rootScope.bundle.notification.singleSave.success}`
					);

					deferred.resolve();
				} else {
					this.ValidationUtil.mapValidationErrors(
						this.managedItemFormObj.customFields,
						errorInfo.data, {
							predicate: (field, validation) => {
								return validation.field.__self__ ? field.metadata.__self__ === validation.field.__self__ : false;
							}
						});

					this.NotificationService.addNotification(
						this.NotificationTypes.ERROR,
						`${errorInfo.data.length}${errorInfo.data.length > 1 ?
							this.$rootScope.bundle.notification.create.errors :
							this.$rootScope.bundle.notification.create.error}`
					);

					deferred.reject(errorInfo);
				}
			});

			let managedItemSaveConflictListenerId = this.EventService.listen(`affectedItem:${this.managedItemObj.getId()}:saveConflict`, event => {
				this.EventService.unlisten(managedItemSaveListenerId);
				this.EventService.unlisten(managedItemSaveConflictListenerId);

				deferred.reject();
			});

			this.EventService.send(`affectedItem:${this.managedItemObj.getId()}:saveItem`, this.managedItemObj);
		}

		return deferred.promise;
	}
}

export default CreateItemDialogController;
