'use strict';

/**
 * @ngdoc object
 * @name Models.Workspace
 *
 * @description This class wraps a workspace payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Workspace = function Workspace() {
	this.section = null;
	this.workspace = null;
};

Workspace.prototype = {
	/**
  * @ngdoc method
  * @name Models.Workspace#fetch
  * @methodOf Models.Workspace
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Object} workspacesObj The data model of workspaces
  *
  * @returns {Object} An object representation of the formatted data
  */
	fetch: function fetch(link, workspaceId, workspacesObj) {
		var that = this;

		return this.RESTWrapperService.get(link, null, null, {}).then(function (payload) {
			that.json = payload;
			that.json.id = workspaceId.indexOf('/') ? workspaceId.substring(workspaceId.lastIndexOf('/') + 1) : workspaceId;

			that.views = {
				link: 'api/v3/workspaces/' + that.json.id + '/slices'
			};
			that.viewDefs = {
				link: 'api/v3/workspaces/' + that.json.id + '/views/5'
			};
			that.fieldsDefs = {
				link: 'api/v3/workspaces/' + that.json.id + '/fields'
			};
			that.item = {
				link: 'api/v3/workspaces/' + that.json.id + '/items/[dmsId]'
			};
			that.tabs = {
				link: 'api/v3/workspaces/' + that.json.id + '/tabs'
			};
			that.userPermissions = {
				link: 'api/v3/workspaces/' + that.json.id + '/users/[userId]/permissions'
			};
			that.affectedItemRelatedWorkspaces = {
				link: 'api/v3/workspaces/' + that.json.id + '/views/100/related-workspaces'
			};
			that.relationshipRelatedWorkspaces = {
				link: 'api/v3/workspaces/' + that.json.id + '/views/10/related-workspaces'
			};
			that.bomRelatedWorkspaces = {
				link: 'api/v3/workspaces/' + that.json.id + '/views/200/related-workspaces'
			};
			that.namedRelationshipRelatedWorkspaces = {
				link: 'api/v3/workspaces/' + that.json.id + '/relationships/[namedRelationshipId]/range'
			};
			that.affectedItemLinkedToWorkspaces = {
				link: 'api/v3/workspaces/' + that.json.id + '/views/11/linkedto-workspaces'
			};
			that.workflowStates = {
				link: 'api/v3/workspaces/' + that.json.id + '/workflows/1/states'
			};
			that.lifecycleWorkflowStates = {
				link: 'api/v3/workspaces/' + that.json.id + '/workflows/9223372036854775807/states'
			};
			that.lifecycleWorkflowState = {
				link: 'api/v3/workspaces/' + that.json.id + '/workflows/9223372036854775807/states/[stateId]'
			};
			that.workflowTransitions = {
				link: 'api/v3/workspaces/' + that.json.id + '/workflows/0/transitions'
			};
			that.lifecycleWorkflowStateTransitions = {
				link: 'api/v3/workspaces/' + that.json.id + '/workflows/9223372036854775807/states/[stateId]/transitions'
			};

			var data = workspacesObj.getFullList();

			that._.each(data.sections, function (section) {
				if (!that.getWorkspace()) {
					that.setWorkspace(_.find(section.workspaces, function (workspace) {
						if (workspace.id === parseInt(that.json.id)) {
							that.setSection(section);
							return true;
						}
					}));
				}
			});

			return that;
		});
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getFullList
  * @methodOf Models.Workspace
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  */
	getFullList: function getFullList() {
		return angular.copy(this.json);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getWorkspace
  * @methodOf Models.Workspace
  * @description Returns this workspace
  *
  * @returns {Object} The workspace object
  */
	getWorkspace: function getWorkspace() {
		return angular.copy(this.workspace);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#setWorkspace
  * @methodOf Models.Workspace
  * @description Sets this workspace
  *
  * @param {Object} workspace The workspace to set to
  */
	setWorkspace: function setWorkspace(workspace) {
		this.workspace = workspace;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#addValidationRules
  * @methodOf Models.Workspace
  * @description Add the validations rules to each field containing validators
  *
  * @param {Object} fieldObj The object which validationRules objects are added to
  *
  * @return {Object} promise that resolves when fetching is done or a fake promise in-case field has not validators
  */
	addValidationRules: function addValidationRules(fieldObj) {
		if (fieldObj.fieldMetadata.validators) {
			return this.RESTWrapperService.get(fieldObj.fieldMetadata.validators.substring(1), null, null, {}).then(function (validationRules) {
				fieldObj.fieldMetadata.validationRules = {};

				validationRules.forEach(function (rule) {
					fieldObj.fieldMetadata.validationRules[rule.validatorName] = rule;
				});
			});
		} else {
			return this.$q.when('');
		}
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getSections
  * @methodOf Models.Workspace
  * @description Returns the sections of this workspace meta
  *
  * @param {Boolean} isEdit Flag indicating whether we're currently in edit mode
  *
  * @returns {Object} A promise that resolves after fetchings are done
  */
	getSectionsMeta: function getSectionsMeta(isEdit) {
		if (angular.isDefined(this.json.sectionsMeta)) {
			return this.$q.when('');
		}

		var that = this;
		var deferred = this.$q.defer();

		this.RESTWrapperService.get(this.json.sections.substring(1), null, null, {}, { Accept: that.WORKSPACE_HTTP_META_VALUES.BULK_SECTION }).then(function (payload) {
			var promises = []; // Holds the promises for each section
			that.json.sectionsMeta = [];

			that._.each(payload, function (section) {
				// backward compatibility
				section = {
					link: section.__self__,
					title: section.name,
					urn: section.urn,
					definition: section
				};
				that.json.sectionsMeta.push(section);

				var localDeferred = that.$q.defer();
				promises.push(localDeferred.promise);

				that.RESTWrapperService.get(that.fieldsDefs.link, null, null, {}).then(function (fieldsDefsPayload) {
					var sectionFieldsPromises = []; // Holds the promises for all fields in this section

					that._.each(section.definition.fields, function (field) {
						var sectionFieldsDeferred = that.$q.defer();
						sectionFieldsPromises.push(sectionFieldsDeferred.promise); // Add a promise for each field in inside the section to the array

						if (field.type === 'MATRIX') {
							that.RESTWrapperService.get(field.link.substring(1), null, null, {}).then(function (matrixPayload) {
								var matrixFieldsPromises = []; // Holds the promises for the fields inside this matrix
								field.definition = matrixPayload;

								// Fetches metadata for the fields in the matrix
								that._.each(field.definition.fields, function (row) {
									that._.each(row, function (col) {
										// Pushes a promise to the array for each field in this matrix
										var matrixFieldsDeferred = that.$q.defer();
										matrixFieldsPromises.push(matrixFieldsDeferred.promise);

										// Cells that are empty (i.e. don't have fields in them) are nulls
										if (col !== null) {
											col.fieldMetadata = _.find(fieldsDefsPayload.fields, function (fieldMeta) {
												return col.link === fieldMeta.__self__;
											});

											that.addValidationRules(col).then(function () {
												if (col.fieldMetadata.picklist !== 'null' && col.fieldMetadata.picklist !== null) {
													that.setPicklistHook(col).then(function () {
														matrixFieldsDeferred.resolve();
													});
												} else {
													// Resolve the promise for this field of type FIELD
													matrixFieldsDeferred.resolve();
												}
											});
										} else {
											matrixFieldsDeferred.resolve(); // Empty cell in the matrix, resolve the promise immediately
										}
									});
								});

								// Once the metadata for all fields inside the matrix has been retrieved, this "field" (which is actually a matrix)
								// has been completed, so now resolve the field promise
								that.$q.all(matrixFieldsPromises).then(function () {
									sectionFieldsDeferred.resolve();
								});
							});
						} else {
							field.fieldMetadata = _.find(fieldsDefsPayload.fields, function (fieldMeta) {
								return field.link === fieldMeta.__self__;
							});

							that.addValidationRules(field).then(function () {
								if (field.fieldMetadata.picklist !== 'null' && field.fieldMetadata.picklist !== null) {
									that.setPicklistHook(field).then(function () {
										sectionFieldsDeferred.resolve();
									});
								} else {
									// Resolve the promise for this field of type FIELD
									sectionFieldsDeferred.resolve();
								}
							});
						}
					});

					// All promises for the fields in this section have been resolved, resolve the section promise
					// Note: this will also resolve if the section is empty, because no promises will be added to this array
					that.$q.all(sectionFieldsPromises).then(function () {
						localDeferred.resolve();
					});
				});
			});

			// All promises for all sections have been resolved
			that.$q.all(promises).then(function () {
				deferred.resolve();
			});
		});

		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#setPicklistHook
  * @methodOf Models.Workspace
  * @description Sets the correct hooks for loading options of picklists, augmenting the original field object
  *
  * @params {Object} field The field object containing all necessary metadata and other info
  *
  * @returns {Promise} The promise will resolved when the data for the picklist has been loaded
  *
  */
	setPicklistHook: function setPicklistHook(field) {
		var that = this;
		var deferred = that.$q.defer();
		var picklistEndpoint = field.fieldMetadata.picklist.substring(1).replace('picklists', 'lookups');
		var fieldType = parseInt(field.fieldMetadata.type.link.substring(field.fieldMetadata.type.link.lastIndexOf('/') + 1));

		// NOTE: This is temporary until we migrate all picklist types
		// Checks for which picklists should use the new widget, therefore not needing to fetch the
		// first page of options by default (since the first page is going to be loaded upon clicking the PL)
		var enabledPls = [that.FieldTypes.UOM, that.FieldTypes.PICKLIST, that.FieldTypes.PICKLIST_DEFAULT, that.FieldTypes.PICKLIST_DEFAULT_LINKED, that.FieldTypes.PICKLIST_LATEST, that.FieldTypes.PICKLIST_LINKED, that.FieldTypes.PICKLIST_LRL, that.FieldTypes.PICKLIST_WITH_FILTER, that.FieldTypes.PICKLIST_FILTER_LINKED];
		var isEnabledPl = _.find(enabledPls, function (val) {
			return val === fieldType;
		});

		if (angular.isDefined(isEnabledPl)) {
			// Method that performs a fetch containing a query string to retrieve results that match it (by "contains")
			field.fieldMetadata.picklistLoaderWithFiltering = function (query) {
				return that.getPicklistValuesWithFiltering(picklistEndpoint, query);
			};
			field.fieldMetadata.picklistPivotLoader = function (itemLink) {
				var itemId = null;

				if (angular.isDefined(itemLink)) {
					itemId = itemLink.substring(itemLink.lastIndexOf('/') + 1);
				}

				return that.getPicklistPivotValues(field.fieldMetadata.pivotLink, itemId);
			};

			deferred.resolve();
		} else {
			// All other picklists, load first batch of values
			that.getPicklistValues(picklistEndpoint, field).then(function (ret) {
				deferred.resolve();
			});
		}

		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getPicklistValues
  * @methodOf Models.Workspace
  * @description Lazy-loads the first chunk of values of picklists on page load
  *
  * @params {String} picklistEndpoint The endpoint to hit
  * @params {Object} field The field object
  *
  * @returns {Promise} The promise will resolved when the data for the picklist has been loaded
  *
  */
	getPicklistValues: function getPicklistValues(picklistEndpoint, field) {
		var that = this;
		var deferred = that.$q.defer();

		// Note that the UI cache will always be skipped when fetching picklist data
		that.RESTWrapperService.get(picklistEndpoint, null, null, {
			skipCache: true
		}).then(function (picklistPayload) {
			if (picklistPayload.totalCount > 10) {
				var fieldType = parseInt(field.fieldMetadata.type.link.substring(field.fieldMetadata.type.link.lastIndexOf('/') + 1));
				field.fieldMetadata.picklistPayload = picklistPayload;

				// if radio button picklists
				if (fieldType === that.FieldTypes.RADIO || fieldType === that.FieldTypes.RADIO_LINKED) {
					that.getPicklistValuesRecursively(picklistEndpoint).then(function (allItems) {
						// TODO: If allItems is returned empty this should be shown to the user
						// as an error in the field
						field.fieldMetadata.picklistPayload.items = allItems;
						deferred.resolve(field);
					});
					// otherwise
				} else {
						field.fieldMetadata.picklistLoader = function (callback) {
							that.getPicklistValuesRecursively(picklistEndpoint).then(function (allItems) {
								callback(allItems);
							}, function () {
								callback([]);
							});
						};
						deferred.resolve(field);
					}
			} else {
				field.fieldMetadata.picklistPayload = picklistPayload;
				// Resolve the promise for this field of type FIELD
				deferred.resolve(field);
			}
		}, function () {
			// Resolve the promise for this field of type FIELD
			deferred.resolve(field);
		});
		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getPicklistValuesWithFiltering
  * @methodOf Models.Workspace
  * @description Make a call to the backend containing a query, limited by a certain amount
  *
  * @params {String} picklistEndpoint	The endpoint to hit
  * @params {String} query 					The string to query for
  *
  * @returns {Promise} The promise will resolved when all calls finish or any of them returns without proper data
  *
  */
	getPicklistValuesWithFiltering: function getPicklistValuesWithFiltering(picklistEndpoint, query) {
		var that = this;
		var deferred = that.$q.defer();
		var items = [];

		that.RESTWrapperService.get(picklistEndpoint, null, {
			limit: 25, // Move to global settings
			filter: query
		}, {
			skipCache: true
		}).then(function (payload) {
			if (angular.isDefined(payload.items)) {
				deferred.resolve(payload);
			} else {
				// This handles 204s - when no results are found (should be handled more gracefully, though)
				deferred.resolve({
					items: [],
					totalCount: 0
				});
			}
		}, function () {
			// Treat errors more gracefully so the picklist can display something
			deferred.resolve({
				items: [],
				totalCount: 0
			});
		});

		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getPicklistPivotValues
  * @methodOf Models.Workspace
  * @description Fetch values for the derived fields based on the selection in the pivot
  *
  * @params {String} pivotLink	The endpoint to retrieve the values for the derived fields
  * @params {String} itemId		The id for the item selected in the pivot
  *
  * @returns {Promise} The promise will be resolved when all the calls finish or any of them returns without proper data
  *
  */
	getPicklistPivotValues: function getPicklistPivotValues(pivotLink, itemId) {
		var that = this;
		var deferred = that.$q.defer();
		var queryParams = null;

		if (angular.isDefined(itemId)) {
			queryParams = { pivotItemId: itemId };
		}

		that.RESTWrapperService.get(pivotLink, null, queryParams, {
			skipCache: true
		}).then(function (payload) {
			if (angular.isDefined(payload)) {
				deferred.resolve(payload);
			} else {
				// This handles 204s - when no results are found (should be handled more gracefully, though)
				deferred.resolve();
			}
		}, function () {
			// Treat errors more gracefully so the picklist can display something
			deferred.resolve();
		});

		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getPicklistValuesRecursively
  * @methodOf Models.Workspace
  * @description Make all necessary calls to retrieve the entire values list
  *
  * @params {String} The endpoint to hit
  *
  * @returns {Promise} The promise will resolved when all calls finish or any of them returns without proper data
  */
	getPicklistValuesRecursively: function getPicklistValuesRecursively(picklistEndpoint) {
		var that = this;
		var deferred = that.$q.defer();
		var items = [];

		/**
   * The recursion is made by chaining one request with the next one,
   * using the link retrieved by the previous one. This can be done
   * differently by using several promises and waiting for all to resolve,
   * using the totalCount value and requesting all pages until reaching
   * the items total.
   */
		var recursiveHit = function recursiveHit() {
			that.RESTWrapperService.get(picklistEndpoint, null, null, {
				skipCache: true
			}).then(function (payload) {
				if (payload && payload.items) {
					items = items.concat(payload.items);
					if (payload.next && payload.next.link) {
						picklistEndpoint = payload.next.link.substring(1);
						recursiveHit();
					} else {
						deferred.resolve(_.uniq(items));
					}
				} else {
					// At this moment this is failing because the endpoint
					// fails when offset > 12. So return whatever that has
					// been fetched to be coherent with the approach
					deferred.resolve(_.uniq(items));
				}
			}, function () {
				// TODO Handle the empty array when any request fail
				deferred.resolve([]);
			});
		};

		recursiveHit();
		return deferred.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getSectionsMetadata
  * @methodOf Models.Workspace
  * @description Returns this sections of this workspace
  *
  * @returns {Object} The sections object
  */
	getSectionsMetadata: function getSectionsMetadata() {
		return this.json.sectionsMeta;
	},

	/**
  * @ngdoc method
  * @ngdoc method
  * @name Models.Workspace#getSection
  * @methodOf Models.Workspace
  * @description Returns this section
  *
  * @returns {Object} The section object
  */
	getSection: function getSection() {
		return angular.copy(this.section);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#setSection
  * @methodOf Models.Workspace
  * @description Sets this section
  *
  * @param {Object} section The section to set to
  */
	setSection: function setSection(section) {
		this.section = section;
		// Just remove the workspace array from the section to avoid confusion
		delete this.section.workspaces;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getDisplayName
  * @methodOf Models.Workspace
  * @description Returns the display name of this workspace
  *
  * @returns {String} The display name of the workspace
  */
	getDisplayName: function getDisplayName() {
		return angular.isDefined(this.json) ? this.json.name : '';
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getId
  * @methodOf Models.Workspace
  * @description Returns the id of this workspace
  *
  * @returns {String} The id of the workspace
  */
	getId: function getId() {
		return angular.isDefined(this.json) ? this.json.id : '';
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getTypeId
  * @methodOf Models.Workspace
  * @description Returns the type id of this workspace
  *
  * @returns {String} The type id of the workspace
  */
	getTypeId: function getTypeId() {
		return this.json.type.substring(this.json.type.lastIndexOf('/') + 1);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getViewsLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the workspace views
  *
  * @returns {String} The string representation of the REST link
  */
	getViewsLink: function getViewsLink() {
		return this.views.link;
	},

	/**
 * @ngdoc method
 * @name Models.Workspace#getViewsLink
 * @methodOf Models.Workspace
 * @description Returns the REST api link for the workspace views
 *
 * @returns {String} The string representation of the REST link
 */
	getViewDefsLink: function getViewDefsLink() {
		return this.viewDefs.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getTabsLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the workspace tabs
  *
  * @returns {String} The string representation of the REST link
  */
	getTabsLink: function getTabsLink() {
		return this.tabs.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getUserPermissionsLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the user permissions given the id
  *
  * @param {Number} userId The ID of the user whose permissions to be retrieved
  *
  * @returns {String} The string representation of the REST link
  */
	getUserPermissionsLink: function getUserPermissionsLink(userId) {
		return this.userPermissions.link.replace('[userId]', userId);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getItemLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the item given the id
  *
  * @param {Number} dmsId The ID of the item to be retrieved
  *
  * @returns {String} The string representation of the REST link
  */
	getItemLink: function getItemLink(dmsId) {
		return this.item.link.replace('[dmsId]', dmsId);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getItemsLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the workspace items given the id
  *
  * @param {Object} viewsObj The object model for views where the link is defined
  * @param {Number} viewId The view ID whose items to be retrieved
  *
  * @returns {String} The string representation of the REST link
  */
	getItemsLink: function getItemsLink(viewsObj, viewId) {
		return viewsObj.getViewLink(viewId).replace('[workspaceId]', this.json.id);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getAffectedItemRelatedWorkspacesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the affected items related workspaces
  *
  * @returns {String} The string representation of the REST link
  */
	getAffectedItemRelatedWorkspacesLink: function getAffectedItemRelatedWorkspacesLink() {
		return this.affectedItemRelatedWorkspaces.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getRelationshipRelatedWorkspacesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the relationships items related workspaces
  *
  * @returns {String} The string representation of the REST link
  */
	getRelationshipRelatedWorkspacesLink: function getRelationshipRelatedWorkspacesLink() {
		return this.relationshipRelatedWorkspaces.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getBomRelatedWorkspacesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the bom items related workspaces
  *
  * @returns {String} The string representation of the REST link
  */
	getBomRelatedWorkspacesLink: function getBomRelatedWorkspacesLink() {
		return this.bomRelatedWorkspaces.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getRelationshipRelatedWorkspacesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the relationships items related workspaces
 	 * @param {String} namedRelationshipId The id of the named relationship
  *
  * @returns {String} The string representation of the REST link
  */
	getNamedRelationshipRelatedWorkspacesLink: function getNamedRelationshipRelatedWorkspacesLink(namedRelationshipId) {
		return this.namedRelationshipRelatedWorkspaces.link.replace('[namedRelationshipId]', namedRelationshipId);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getLinkedToWorkspacesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the linked-to workspaces
  * for an affected item
  *
  * @returns {String} The string representation of the REST link
  *
  */
	getLinkedToWorkspacesLink: function getLinkedToWorkspacesLink() {
		return this.affectedItemLinkedToWorkspaces.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getWorkflowStatesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the workflow states
  *
  * @returns {String} The string representation of the REST link
  */
	getWorkflowStatesLink: function getWorkflowStatesLink() {
		return this.workflowStates.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getWorkflowTransitionsLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the workflow transitions
  *
  * @returns {String} The string representation of the REST link
  */
	getWorkflowTransitionsLink: function getWorkflowTransitionsLink() {
		return this.workflowTransitions.link;
	},

	/**
 	 * @ngdoc method
  * @name Models.Workspace#getLifecycleWorkflowStatesLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the lifecycle workflow states
  *
  * @returns {String} The string representation of the REST link
  */
	getLifecycleWorkflowStatesLink: function getLifecycleWorkflowStatesLink() {
		return this.lifecycleWorkflowStates.link;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getLifecycleWorkflowStateLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the lifecycle workflow state
  *
  * @param {String} stateId the id of the state
  *
  * @returns {String} The string representation of the REST link
  */
	getLifecycleWorkflowStateLink: function getLifecycleWorkflowStateLink(stateId) {
		return this.lifecycleWorkflowState.link.replace('[stateId]', stateId);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getLifecycleWorkflowStateTransitionsLink
  * @methodOf Models.Workspace
  * @description Returns the REST api link for the lifecycle workflow state's transitions
  *
  * @param {String} stateId the id of the state
  *
  * @returns {String} The string representation of the REST link
  */
	getLifecycleWorkflowStateTransitionsLink: function getLifecycleWorkflowStateTransitionsLink(stateId) {
		return this.lifecycleWorkflowStateTransitions.link.replace('[stateId]', stateId);
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getViewDetailsFieldsData
  * @methodOf Models.Workspace
  * @description This method can be used to fetch the field details in item
  * details view. This method traverses all the sections of the workspace and
  * then each field of the section to fetch the necessary metadata, and
  * validation information.
  *
  * @param {Function} filter An optional filter function that can be used to
  * filter the list of fields. This can be useful in case of quick create.
  *
  * @returns {Array} A promise, and when resolved, an array containing the
  * sections and, inside each one of them, the field types and their values
  *
  */
	getViewDetailsFieldsData: function getViewDetailsFieldsData(filter) {
		var that = this;
		var itemDetailsFieldValuesArr = []; // The array to return
		var deferredObj = this.$q.defer();
		var fieldMetaDataPromises = [];
		var fieldTypeOrValidatorPromises = [];
		var matrixMetaDataPromises = [];

		/**
   * Helper function to get field meta data.
   * @param {Object} field Object representing the field
   * @param {Array} fieldMetaDataPromises The list of promises for field meta data
   * @param {Array} fieldTypeOrValidatorPromises The list of promises for field type and validators meta data
   *
   * @private
   */
		var getFieldMetaData = function getFieldMetaData(field, fieldMetaDataPromises, fieldTypeOrValidatorPromises) {
			fieldMetaDataPromises.push(that.RESTWrapperService.get(field.link.substring(1), null, null, null, {
				ACCEPT: 'application/vnd.autodesk.plm.meta+json'
			}).then(function (payload) {
				that._.extend(field, payload);

				if (!angular.isDefined(field.metadata)) {
					fieldTypeOrValidatorPromises.push(that.RESTWrapperService.get(field.type.link.substring(1), null, null, {}).then(function (metadata) {
						field.metadata = metadata;
					}));
				}

				if (field.validators && !angular.isDefined(field.validatorsMeta)) {
					fieldTypeOrValidatorPromises.push(that.RESTWrapperService.get(field.validators.substring(1), null, null, {}).then(function (validatorsMeta) {
						// TODO Change name. Hate it.
						field.validatorsMeta = validatorsMeta;
					}));
				}
			}));
		};

		/**
   * Helper function to get matrix meta data.
   * @param {Object} field Object representing the field
   * @param {Array} matrixMetaDataPromises The list of promises for matrix meta data
   * @param {Array} fieldMetaDataPromises The list of promises for field meta data
   * @param {Array} fieldTypeOrValidatorPromises The list of promises for field type and validators meta data
   *
   * @private
   */
		var getMatrixMetaData = function getMatrixMetaData(field, matrixMetaDataPromises, fieldMetaDataPromises, fieldTypeOrValidatorPromises) {
			matrixMetaDataPromises.push(that.RESTWrapperService.get(field.link.substring(1), null, null, null, {
				ACCEPT: 'application/vnd.autodesk.plm.meta+json'
			}).then(function (payload) {
				that._.extend(field, payload);

				that._.times(field.height, function (rowIndex) {
					that._.times(field.width, function (colIndex) {
						if (field.fields[rowIndex][colIndex]) {
							field.fields[rowIndex][colIndex].fieldType = field.fields[rowIndex][colIndex].type;

							if (field.fields[rowIndex][colIndex].fieldType === 'MATRIX') {
								getMatrixMetaData(field.fields[rowIndex][colIndex], matrixMetaDataPromises, fieldMetaDataPromises, fieldTypeOrValidatorPromises);
							} else {
								getFieldMetaData(field.fields[rowIndex][colIndex], fieldMetaDataPromises, fieldTypeOrValidatorPromises);
							}
						}
					});
				});
			}));
		};

		/**
   * Helper function to get classification fields
   *
   * @return {Promise} THe promise of classification fields Object
   * @private
   */
		var getClassificationFields = function getClassificationFields(urn) {
			var deferred = that.$q.defer();
			that.ClassificationService.getClassificationFields(urn, urn, null, true).then(function (response) {
				deferred.resolve(response);
			});
			return deferred.promise;
		};

		var cwsPromises = [];
		this.getSectionsMeta().then(function () {
			that._.each(that.getSectionsMetadata(), function (section) {
				if (section.definition.type === that.SECTION_TYPES.CLASSIFICATION) {
					cwsPromises.push(getClassificationFields(that.getWorkspaceUrn()));
				}
				that._.each(section.definition.fields, function (field) {
					if (angular.isUndefined(field.fieldType)) {
						// Keep reference of the type field, as it will be
						// replaced with the type link when field payload is loaded.
						field.fieldType = field.type;

						if (field.fieldType === 'MATRIX') {
							getMatrixMetaData(field, matrixMetaDataPromises, fieldMetaDataPromises, fieldTypeOrValidatorPromises);
						} else {
							getFieldMetaData(field, fieldMetaDataPromises, fieldTypeOrValidatorPromises);
						}
					}
				});
			});

			that.$q.all(matrixMetaDataPromises).then(function () {
				that.$q.all(fieldMetaDataPromises).then(function () {
					that.$q.all(fieldTypeOrValidatorPromises).then(function () {
						that.$q.all(cwsPromises).then(function (cwsResult) {

							that._.each(that.getSectionsMetadata(), function (section) {
								var sectionObj = {};
								sectionObj.id = section.link;
								sectionObj.displayName = section.definition.name;
								sectionObj.description = section.definition.description;
								sectionObj.collapsable = section.definition.collapsable;
								sectionObj.type = section.definition.type;
								sectionObj.sectionLocked = section.definition.sectionLocked;
								sectionObj.fields = []; // Initializes the array

								that._.each(section.definition.fields, function (field) {
									// Adds the field to the section, if it's not null
									// (will be null in cases where it shouldn't be visible)
									if (field.fieldType === 'FIELD') {
										if (!filter || filter && filter(field)) {
											sectionObj.fields.push(field);
										}
									} else if (field.fieldType === 'MATRIX') {
										// If filter is there, just add all matrix fields
										if (filter) {
											that._.times(field.height, function (rowIndex) {
												that._.times(field.width, function (colIndex) {
													if (field.definition.fields[rowIndex][colIndex] && filter(field.definition.fields[rowIndex][colIndex])) {
														sectionObj.fields.push(field.definition.fields[rowIndex][colIndex]);
													}
												});
											});
										} else {
											sectionObj.fields.push(field);
										}
									}
								});

								if (sectionObj.type === that.SECTION_TYPES.CLASSIFICATION) {
									var cwsResolved = cwsResult.shift();
									if (cwsResolved.classificationId) {
										sectionObj.fields = cwsResolved.properties;
										sectionObj.initialClassificationId = cwsResolved.classificationId;
									}
								}

								// Adds the section with the fields to the array
								// that's going to be returned
								itemDetailsFieldValuesArr.push(sectionObj);
							});

							deferredObj.resolve(itemDetailsFieldValuesArr);
						}, function () {
							deferredObj.reject();
						});
					}, function () {
						deferredObj.reject();
					});
				}, function () {
					deferredObj.reject();
				});
			}, function () {
				deferredObj.reject();
			});
		}, function () {
			deferredObj.reject();
		});

		return deferredObj.promise;
	},

	/**
  * @ngdoc method
  * @name Models.Workspace#getWorkspaceUrn
  * @methodOf Models.Workspace
  * @description Returns the urn of the current workspace
  *
  * @returns {String} The string representation of the urn
  */
	getWorkspaceUrn: function getWorkspaceUrn() {
		return this.json.urn;
	}
};

angular.module('plm360.models').factory('Workspace', ['RESTWrapperService', 'EventService', 'FieldTypes', '$q', '_', 'SECTION_TYPES', 'ClassificationUtil', 'ClassificationService', 'WORKSPACE_HTTP_META_VALUES', function (RESTWrapperService, EventService, FieldTypes, $q, _, SECTION_TYPES, ClassificationUtil, ClassificationService, WORKSPACE_HTTP_META_VALUES) {
	var models = {};
	Workspace.prototype.RESTWrapperService = RESTWrapperService;
	Workspace.prototype.FieldTypes = FieldTypes;
	Workspace.prototype.$q = $q;
	Workspace.prototype._ = _;
	Workspace.prototype.SECTION_TYPES = SECTION_TYPES;
	Workspace.prototype.ClassificationUtil = ClassificationUtil;
	Workspace.prototype.ClassificationService = ClassificationService;
	Workspace.prototype.WORKSPACE_HTTP_META_VALUES = WORKSPACE_HTTP_META_VALUES;

	EventService.listen('workspaceInstance:*:get', function (event, params, workspaceId, workspacesObj) {
		var model = models[params] || new Workspace();
		models[params] = model;
		model.fetch(params, workspaceId, workspacesObj).then(function (obj) {
			EventService.send('workspaceInstance:' + event.split(':')[1] + ':done', obj);
		});
	});
	return Workspace;
}])
// Constants for Workspace Types
.constant('WorkspaceTypes', {
	BASIC_WORKSPACE: 1,
	BASIC_WORKSPACE_WITH_WORKFLOW: 2,
	SUPPLIER: 3,
	REVISION_CONTROLLED_WORKSPACE: 6,
	REVISIONING_WORKSPACE: 7,
	SUPPLIER_WITH_WORKFLOW: 8
}).constant('SECTION_TYPES', { FIELD_CONTAINER: 'FIELDCONTAINER', CLASSIFICATION: 'CLASSIFICATION' }).constant('WORKSPACE_HTTP_META_VALUES', {
	BULK_SECTION: 'application/vnd.autodesk.plm.sections.bulk+json'
});
//# sourceMappingURL=Workspace.js.map
