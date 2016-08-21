'use strict';

/**
 * @ngdoc object
 * @name Models.Item
 *
 * @description This class wraps an item payload into an object
 *
 * ##Dependencies
 *
 */

// Define the constructor
var Item = function Item() {
	var that = this;

	/**
  * @ngdoc method
  * @name Models.Item#fetch
  * @methodOf Models.Item
  * @description Make a call to fetch raw data
  *
  * @param {String} link The URL to use for fetching the data
  * @param {Object} workspaceObj The workspace object
  * @param {Boolean} isEdit The flag for edit mode
  *
  * @returns {Object} An object representation of the formatted data
  */
	this.fetch = function (link, isEdit) {
		var that = this;
		var deferred = this.$q.defer();

		var parsedLink = link;

		if (link.indexOf('`') !== -1) {
			parsedLink = this.UrnParser.decode(link);
		} else if (link.indexOf('@') !== -1) {
			var ids = link.split('@');
			parsedLink = 'workspaces/' + ids[0] + '/items/' + ids[1];
		}

		this.RESTWrapperService.get('api/v3/' + parsedLink, null, null, {}).then(function (payload) {
			var promises = [];
			that._.each(payload.sections, function (section) {
				that._.each(section.fields, function (field) {

					// Set data type id
					field.metadata = { dataTypeId: parseInt(field.type.link.substring(field.type.link.lastIndexOf('/') + 1)) };
					if (that._.isArray(field.value)) {
						that._.each(field.value, function (value) {
							if (angular.isDefined(value.item)) {
								var localDeferred = that.$q.defer();
								promises.push(localDeferred.promise);
								that.RESTWrapperService.get(value.item.substring(1), null, null, { hideError: true }).then(function (itemPayload) {
									value.id = itemPayload.id;
									value.workspaceId = itemPayload.workspaceId;
									localDeferred.resolve();
								}, function () {
									localDeferred.resolve();
								});
							}
							if (that._.isObject(value) && angular.isDefined(value.link) && value.link.indexOf('/items/') > -1) {
								var localDeferred = that.$q.defer();
								promises.push(localDeferred.promise);
								that.RESTWrapperService.get(value.link.substring(1), null, null, { hideError: true }).then(function (itemPayload) {
									value.resourceId = that.UrnParser.encode(itemPayload.urn);
									// Note: the generic picklist widget is not using these deleted/revision attributes
									if (angular.isDefined(itemPayload.deleted)) {
										value.deleted = itemPayload.deleted;
									}
									if (angular.isDefined(itemPayload.version)) {
										that.RESTWrapperService.get('api/v3/configurations/preVersionDescriptorText', null, null, {}).then(function (preTextPayload) {
											that.RESTWrapperService.get('api/v3/configurations/postVersionDescriptorText', null, null, {}).then(function (postTextPayload) {
												value.revision = itemPayload.workingVersion ? '(' + itemPayload.version + ')' : preTextPayload.value + itemPayload.version + postTextPayload.value;
											});
										});
									}
									localDeferred.resolve();
								}, function () {
									localDeferred.resolve();
								});
							}
						});
					} else if (that._.isObject(field.value)) {
						// TODO: workaround for waiting for implementation of endpoint
						if (angular.isDefined(field.value.link) && field.value.link.indexOf('/items/') > -1) {

							// Except FLASH and IMAGE field types - the link is actually not a link to a payload,
							// but to a data stream (despite being a link to /api/v2/...)
							if (field.metadata.dataTypeId !== 21 && field.metadata.dataTypeId !== 15) {
								var localDeferred = that.$q.defer();
								promises.push(localDeferred.promise);
								that.RESTWrapperService.get(field.value.link.substring(1), null, null, { hideError: true }).then(function (itemPayload) {
									field.value.resourceId = that.UrnParser.encode(itemPayload.urn);
									if (angular.isDefined(itemPayload.deleted)) {
										field.value.deleted = itemPayload.deleted;
									}
									if (angular.isDefined(itemPayload.version)) {
										that.RESTWrapperService.get('api/v3/configurations/preVersionDescriptorText', null, null, {}).then(function (preTextPayload) {
											that.RESTWrapperService.get('api/v3/configurations/postVersionDescriptorText', null, null, {}).then(function (postTextPayload) {
												field.value.revision = itemPayload.workingVersion ? '(' + itemPayload.version + ')' : preTextPayload.value + itemPayload.version + postTextPayload.value;
											});
										});
									}
									localDeferred.resolve();
								}, function () {
									localDeferred.resolve();
								});
							}
						}
					}
				});
			});

			that.$q.all(promises).then(function () {
				that.json = payload;

				that.json.id = payload.__self__.substring(payload.__self__.lastIndexOf('/') + 1);

				that.transitions = {
					// TODO: the workflow id is default to '1' but in future to support muliple workflows, we need to revisit this link.
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/workflows/1/transitions'
				};

				that.revisions = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/versions'
				};

				that.changelog = {
					link: 'api/v2/workspaces/[workspaceId]/items/' + that.json.id + '/logs'
				};

				that.workflow = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/2'
				};

				that.gridmeta = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/13/fields'
				};

				that.affectedmeta = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/11/fields'
				};

				that.grid = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/13/rows'
				};

				that.affectedItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/11'
				};

				that.affectedItemsAssociation = {
					link: '/workspaces/[workspaceId]/items/[itemId]'
				};

				that.affectedItemLinkableItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/11/linkable-items'
				};

				that.projectItemLinkableItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/16/linkable-items'
				};

				that.relationshipItemLinkableItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/10/linkable-items'
				};

				that.bomItemLinkableItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/5/linkable-items'
				};

				that.namedRelationshipLinkableItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/relationships/[namedRelationshipId]/range'
				};

				that.relatedItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/10'
				};

				that.relatedBomItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/bom-items?limit=999&revisionBias=working'
				};

				that.namedRelationships = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/relationships/[namedRelationshipsKey]'
				};

				that.whereUsed = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/where-used?limit=999&revisionBias=working'
				};

				that.projectItems = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/16'
				};

				that.milestones = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/17'
				};

				that.actionNotifications = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/4/notifications'
				};

				that.ownership = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id
				};

				that.sourcings = {
					link: 'api/v3/workspaces/[workspaceId]/items/' + that.json.id + '/views/8/sourcings'
				};

				// that.workspaceObj = workspaceObj;

				deferred.resolve(that);
			});
		}, function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getFullList
  * @methodOf Models.Item
  * @description Returns the full list of data
  *
  * @returns {Array} The full list of data
  *
  */
	this.getFullList = function () {
		return this.json;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getRootId
  * @methodOf Models.Item
  * @description Returns root id of the item
  *
  * @returns {Number} The root id of the item
  */
	this.getRootId = function () {
		return this.json.rootId;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getId
  * @methodOf Models.Item
  * @description Returns dms id of the item
  *
  * @returns {Number} The dms id of the item
  *
  */
	this.getId = function () {
		return this.json ? this.json.id : 0;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getSections
  * @methodOf Models.Item
  * @description Returns sections of this item
  *
  * @returns {Array} The sections of this item
  */
	this.getSections = function () {
		return this.json.sections;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getItemDescriptor
  * @methodOf Models.Item
  * @description Returns the descriptor of the item
  *
  * @returns {String} The descriptor of the item
  */
	this.getItemDescriptor = function () {
		return this.json.itemDescriptor;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getItemTitle
  * @methodOf Models.Item
  * @description Returns the descriptor of the item
  *
  * @returns {String} The descriptor of the item
  */
	this.getItemTitle = function () {
		return this.json.title;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getItemVersion
  * @methodOf Models.Item
  * @description Returns the version of the item
  *
  * @returns {String} The version of the item
  */
	this.getItemVersion = function () {
		return this.json.version;
	};

	/**
  * @ngdoc method
  * @name Models.Item#setQ
  * @methodOf Models.Item
  * @description Sets q object
  *
  * @param {Object} q The q object
  */
	this.setQ = function (q) {
		this.q = q;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getOwnershipLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the ownership info for the item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getOwnershipLink = function () {
		return this.ownership.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getTransitionsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the transitions for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getTransitionsLink = function () {
		return this.transitions.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getChangeLogLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the changelog for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getChangeLogLink = function () {
		return this.changelog.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getWorkflowLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the workflow for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getWorkflowLink = function () {
		return this.workflow.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getActionNotificationsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the actionnotifications for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getActionNotificationsLink = function () {
		return this.actionNotifications.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#setActionNotifications
  * @methodOf Models.Item
  * @description Attaches the actionnotifications object to the tree
  *
  * @param {Object} obj The actionnotifications object
  */
	this.setActionNotifications = function (obj) {
		this.actionNotifications.obj = obj;
	};

	/**
  * @name Models.Item#getGridLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the grid for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getGridLink = function () {
		return this.grid.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @name Models.Item#getBomNestedLink
  * @methodOf Models.Item
  * @description Returns the REST api link bom meta details for the item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getBomNestedLink = function () {
		return this.json.nestedBom !== null ? this.json.nestedBom.link.replace(/^\//, '') : null;
	};

	/**
  * @name Models.Item#getBomRootLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the bom root item details
  *
  * @returns {String} The string representation of the REST link
  */
	this.getBomRootLink = function () {
		return this.json.bom !== null ? this.json.bom.link.replace(/^\//, '') : null;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getAffectedItemsMetaLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the gridmeta for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getAffectedItemsMetaLink = function () {
		return this.affectedmeta.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getGridMetaLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the gridmeta for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getGridMetaLink = function () {
		return this.gridmeta.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getLinkedItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the affected items for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getAffectedItemsLink = function () {
		return this.affectedItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getAffectedItemTransitionsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the affected items for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getAffectedItemTransitionsLink = function (itemId) {
		return this.affectedItems.link.replace('[workspaceId]', this.workspaceObj.getId()) + '/affected-items/' + itemId + '/transitions';
	};

	/**
  * @ngdoc method
  * @name Models.Item#getRelatedItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the related items for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getRelatedItemsLink = function () {
		return this.relatedItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getRelatedBomItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the related BOM items for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getRelatedBomItemsLink = function () {
		return this.relatedBomItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getNamedRelationshipsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the named relationships for item
  *
  * @param {String} namedRelationshipsKey: the key to differentiate the different namedRelationships
  *
  * @returns {String} The string representation of the REST link
  */
	this.getNamedRelationshipsLink = function (namedRelationshipsKey) {
		return this.namedRelationships.link.replace('[workspaceId]', this.workspaceObj.getId()).replace('[namedRelationshipsKey]', namedRelationshipsKey);
	};

	/**
  * @ngdoc method
  * @name Models.Item#getWhereUsedLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the where-used for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getWhereUsedLink = function () {
		return this.whereUsed.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getSourcingsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for retrieving the sourcings of an item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getSourcingsLink = function () {
		return this.sourcings.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getRevisionsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the transitions for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getRevisionsLink = function () {
		return this.revisions.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#setWorkspaceObj
  * @methodOf Models.Item
  * @description Sets workspace object
  *
  * @param {Object} workspaceObj The workspace object
  */
	this.setWorkspaceObj = function (workspaceObj) {
		this.workspaceObj = workspaceObj;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getWorkspaceObj
  * @methodOf Models.Item
  * @description Returns the workspaceObj from this item
  *
  * @return {Object} workspaceObj The workspace object
  */
	this.getWorkspaceObj = function (workspaceObj) {
		return angular.copy(this.workspaceObj);
	};

	/**
  * @ngdoc method
  * @name Models.Item#getItemDetailsOptionsData
  * @methodOf Models.Item
  * @description Returns the options values for field
  *
  * @param 	{String} 		fieldType	 	The field type that needs info to be retrieved from
  *
  * @returns {Object} 				A promise, and when resolved, the GET response
  */
	this.getItemDetailsOptionsData = function (fieldType) {
		return this.RESTWrapperService.get('api/v2', [{
			workspaces: this.workspaceObj.getId(),
			'item-fields': fieldType
		}, 'values']);
	};

	/**
  * @ngdoc method
  * @name Models.Item#setBookmark
  * @methodOf Models.Item
  * @description Adds/remove a bookmarked item to the list
  *
  * @param 	{Boolean} 	flag		If the item should be added (true) or removed (false)
  *
  * @returns {Object} 				A promise, and when resolved, the PUT/DELETE response
  */
	this.setBookmark = function (flag) {
		if (flag) {
			return this.RESTWrapperService.put(' ', 'api/rest/v1/users/current_user', [{
				bookmarks: this.json.id
			}], null, {
				'Content-Type': 'application/json'
			}, {});
		} else {
			return this.RESTWrapperService['delete']('api/rest/v1/users/current_user', [{
				bookmarks: this.json.id
			}], null, {
				'Content-Type': 'application/json'
			}, {});
		}
	};

	/**
  * @ngdoc method
  * @name Models.Item#setArchive
  * @methodOf Models.Item
  * @description Archirve/Unarchive item to the list
  *
  * @param 	{Boolean} 	flag		If the item should be added (true) or removed (false)
  *
  * @returns {Object} 				A promise, and when resolved, the PUT/DELETE response
  */
	this.setArchive = function (flag) {
		if (flag) {
			return this.RESTWrapperService.patch('', 'api/v3', [{
				workspaces: this.workspaceObj.getId(),
				items: this.json.id
			}], {
				deleted: true
			}, {
				'Content-Type': 'application/json'
			}, {});
		} else {
			return this.RESTWrapperService.patch('', 'api/v3', [{
				workspaces: this.workspaceObj.getId(),
				items: this.json.id
			}], {
				deleted: false
			}, {
				'Content-Type': 'application/json'
			}, {});
		}
		this.json.deleted = flag;
	};

	/**
  * @ngdoc method
  * @name Models.Item#performTransition
  * @methodOf Models.Item
  * @description Performs the transition given transition ID
  *
  * @param 	{Object} 		transitionObj	The object representing the transition to be performed.
  * @param 	{String}		comments		Comments of the transition step. This can be optional depending upon the configuration.
  * @param   {Object}        selectedUserImpersonation   The object represent the user with which the transition is performed. This is an optional parameter.
  *
  * @returns {Object} 		A promise of the POST request
  *
  * TODO support for password
  */
	this.performTransition = function (transitionObj, comments, selectedUserImpersonation) {
		var data = {
			comment: comments || ''
		};

		if (selectedUserImpersonation) {
			data.impersonation = {
				link: selectedUserImpersonation.link
			};
		}

		return this.RESTWrapperService.post(data, 'api/v3', [{
			workspaces: this.workspaceObj.getId(),
			items: this.json.id,
			workflows: 1
		}, 'transitions'], null, {
			Accept: 'application/json',
			'Content-Location': transitionObj.__self__
		}, {});
	};

	/*
  * Helper function to parse the field and prepare it for the endpoint, modifying 'dataToPut'
  */
	this.prepareFieldForEndpoint = function (field) {
		var fieldValue;
		switch (field.metadata.dataTypeId) {
			// JUST ASSIGNING THE EXISTING VALUES FOR NOW, SINCE WE DON'T HAVE THE EDIT OF THIS TYPE
			case 10: // radio
			case 25: // radio linked
			case 6: // picklist first default
			case 7: // picklist linked first default
			case 13: // multi select
			case 20: // picklist
			case 22: // picklist latest version
			case 23: // picklist linked
			case 24: // picklist lrl
			case 26: // PLF
			case 27: // multi select linked
			case 28: // uom
			case 29:
				// FPL
				// case 'SELECT_LIST':
				// case 'MULTI_SELECT':
				// case 'PICK_LIST_FILTER':
				// case 'PICK_LIST_RADIO' :
				// case 'PICK_LIST_FIRST_VALUE_DEFAULT':
				// case 'PICK_LIST_MULTI_SELECT':
				// case 'PICK_LIST_SEARCH_FILTER':
				// case 'PICK_LIST':
				// case 'BOM_UNITS_PICK_LIST':

				// breaks off in case data is inconsistent
				// if (!angular.isArray(field.value)) {
				// 	that.$log.error('Despite being a picklist, value is NOT an array! Cannot proceed!')
				// 	break;
				// }

				// resets the array (in case no value has been selected, it will be left as empty, which is the expected format from the endpoint)
				fieldValue = field.value;

				break;
			case 9:
				// booleans have to be converted properly to something that the endpoint accepts
				fieldValue = field.value === 'true' || field.value === true ? 'true' : 'false';
				break;
			case 3:
				// dates have to be formatted in a way so that they're accepted by the endpoint
				// Strip out the timezone information, because we're not saving this info in the backend
				if (field.value !== '' && field.value !== null) {
					if (field.value.constructor === Date) {
						// Parse the date, to make it endpoint-friendly
						fieldValue = that.$filter('date')(Date.parse(field.value), 'yyyy-MM-dd');
					} else {
						fieldValue = field.value; // We assign anyway the existent value, as in the rest of data
					}
				} else {
						// handle empty date fields, setting them as null so the endpoint accepts them (same logic as below)
						fieldValue = null;
					}
				break;
			// DISABLED FOR NOW, SINCE WE DON'T HAVE THE EDIT OF THIS TYPE
			// case 'IMAGE': // images should be the URL, but might change in the future with CPDM
			// break;
			default:
				// everything else
				fieldValue = field.value === '' ? null : field.value; // empty values are not accepted by the endpoint, they should be null

				break;
		}

		return fieldValue;
	};

	/**
  * @ngdoc method
  * @name Models.Item#saveNew
  * @methodOf Models.Item
  * @description Creates a new workspace item
  *
  * @param 	{String} workspaceId    The workspace id for which a new item will be created.
  * @param 	{Array} newItemData		An array of sections of the workspace.
  *
  * @returns {Object} A promise holding the POST request
  *
  * TODO: does it make sense to move this to workspace model ?
  */
	this.saveNew = function (workspaceId, newItemData) {
		var that = this;

		var payloadBuilder = new this.CreateItemPayloadBuilder(newItemData, _);
		_.chain(newItemData).pluck('fields').flatten(true).filter(function (field) {
			return angular.isDefined(field) && field !== null;
		}).each(function (field) {
			return payloadBuilder.addFieldValue(field.__self__, that.prepareFieldForEndpoint(field));
		});

		var dataToPost = payloadBuilder.getPayload();

		return this.RESTWrapperService.post(dataToPost, 'api/v3', [{
			workspaces: workspaceId
		}, 'items'], null, {
			'Content-Type': 'application/json'
		}, {});
	};

	/**
  * @ngdoc method
  * @name Models.Item#save
  * @methodOf Models.Item
  * @description Saves the data containing the workspace item details information
  *
  * @param 	{Object}			modifiedData 				The data that needs to be PUT
  *
  * @returns {Object} 		A promise of the PUT request
  */
	this.save = function (modifiedData) {
		var that = this;

		// copies the returned data to a new object, that's going to be modified
		var dataToPut = {};
		Object.assign(dataToPut, this.getFullList().originalElement);

		// retrieved data successfully, now modify it according to the supplied data (which is structured differently
		// than what's expected by the endpoint - refer to 'getItemDetailsFields'

		// first loop, through each section present in the object
		_.each(modifiedData, function (section, sectionIndex) {

			// second loop, through all the elements
			_.each(section.fields, function (field, fieldIndex) {
				if (angular.isDefined(field) && field !== null) {
					var payloadField = dataToPut.sections[sectionIndex].fields[fieldIndex];
					payloadField.value = that.prepareFieldForEndpoint(field);
				}
			});
		});

		// PUTs the content, returns the promise to the chain
		return this.RESTWrapperService.put(dataToPut, 'api/v3', [{
			workspaces: this.workspaceObj.getId(),
			items: this.json.id
		}], null, {
			// TODO: This should not be necessary since Restangular says that it works with etags out-of-the-box
			// Something happens between retrieving the resource with its correct etag and the update, that breaks the link
			// and the If-Match header is not sent automatically.
			'If-Match': this.json.restangularEtag
		}, {}).then(function (res) {
			// update the local copy of the json with the response, because the this.json above doesn't have the latest data
			that.json = res;
		});
	};

	/**
  * @ngdoc method
  * @name Models.Item#getAffectedItemLinkableItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the linkable items for an affected item
  *
  * @returns {String} The string representation of the REST link
  *
  */
	this.getAffectedItemLinkableItemsLink = function () {
		return this.affectedItemLinkableItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getProjectItemLinkableItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the linkable items for a project item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getProjectItemLinkableItemsLink = function () {
		return this.projectItemLinkableItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getRelationshipItemLinkableItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the linkable items for a relationship item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getRelationshipItemLinkableItemsLink = function () {
		return this.relationshipItemLinkableItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getBomItemLinkableItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the linkable items for a bom item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getBomItemLinkableItemsLink = function () {
		return this.bomItemLinkableItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getNamedRelationshipItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the linkable items for a named relationship item
  *
  * @param {String} namedRelationshipId The id for the named relationship
  *
  * @returns {String} The string representation of the REST link
  */
	this.getNamedRelationshipItemsLink = function (namedRelationshipId) {
		return this.namedRelationshipLinkableItems.link.replace('[workspaceId]', this.workspaceObj.getId()).replace('[namedRelationshipId]', namedRelationshipId);
	};

	/**
  * @ngdoc method
  * @name Models.Item#associateAffectedItem
  * @methodOf Models.Item
  * @description Associates an affected item with this item
  *
  * @param {String} locationUrl: the url of the new item. Note: This is necessary to link the items.
  * @param {String} itemDescription: the item description that will be displayed on the save event.
  *
  * @return {Object} A promise of the POST request.
  */
	this.associateAffectedItem = function (locationUrl, itemDescriptor) {
		var that = this;
		return this.RESTWrapperService.post(null, 'api/v3', [{
			workspaces: that.workspaceObj.getId()
		}, {
			items: that.json.id
		}, 'affected-items'], null, {
			Accept: 'application/json',
			'Content-Location': locationUrl
		}, {});
	};

	/**
  * @ngdoc method
  * @name Models.Item#associateProjectItem
  * @methodOf Models.Item
  * @description Associates a project item with this item
  *
  * @param {String} locationUrl: the url of the new item. Note: This is necessary to link the items.
  * @param {String} itemDescription: the item description that will be displayed on the save event.
  *
  * @return {Object} A promise of the POST request.
  */
	this.associateProjectItem = function (locationUrl, itemDescriptor) {
		var that = this;

		var data = null;
		var base = 'api/v3';
		var path = [{
			workspaces: that.workspaceObj.getId()
		}, {
			items: that.json.id
		}, 'views/16'];
		var params = null;
		var headers = {
			'Content-Location': locationUrl
		};
		var options = {};

		return this.RESTWrapperService.post(data, base, path, params, headers, options);
	};

	/**
  * @ngdoc method
  * @name Models.Item#associateRelationshipItem
  * @methodOf Models.Item
  * @description Associates a relationship item with this item
  *
  * @param {String} locationUrl: the url of the new item. Note: This is necessary to link the items.
  * @param {String} itemDescription: the item description that will be displayed on the save event.
  *
  * @return {Object} A promise of the POST request.
  */
	this.associateRelationshipItem = function (locationUrl, itemDescriptor) {
		var that = this;

		// TODO This is hardcoded data - in the future the user will have the
		// ability to provide these values
		var data = {
			direction: {
				type: 'Uni-Directional'
			},
			description: ''
		};
		var base = 'api/v3';
		var path = [{
			workspaces: that.workspaceObj.getId()
		}, {
			items: that.json.id
		}, 'views/10'];
		var params = null;
		var headers = {
			'Content-Location': locationUrl
		};
		var options = {};

		return this.RESTWrapperService.post(data, base, path, params, headers, options);
	};

	/**
  * @ngdoc method
  * @name Models.Item#associateNamedRelationshipItem
  * @methodOf Models.Item
  * @description Associates a named relationship item with this item
  *
  * @param {String} locationUrl the url of the new item. Note: This is necessary to link the items.
  * @param {String} itemDescription the item description that will be displayed on the save event.
  * @param {String} namedRelationshipId The type of named relationship e.g. 'AML'
  *
  * @return {Object} A promise of the POST request.
  */
	this.associateNamedRelationshipItem = function (locationUrl, itemDescriptor, namedRelationshipId) {
		var that = this;

		var data = null;
		var base = 'api/v3';
		var path = [{
			workspaces: that.workspaceObj.getId()
		}, {
			items: that.json.id
		}, 'relationships/' + namedRelationshipId];
		var params = null;
		var headers = {
			'Content-Location': locationUrl
		};
		var options = null;

		return this.RESTWrapperService.post(data, base, path, params, headers, options);
	};

	/**
  * @ngdoc method
  * @name Models.Item#saveActionNotification
  * @methodOf Models.ActionNotification
  * @description saves the action notification
  *
  * @param {Object} itemActionNotification: the action notification object that need to be stored.
  *
  * @return {Object} A promise of the POST request.
  */
	this.saveActionNotification = function (itemActionNotification) {
		var that = this;
		return this.RESTWrapperService.post(itemActionNotification, 'api/v3', [{
			workspaces: that.workspaceObj.getId()
		}, {
			items: that.json.id
		}, 'views/4/notifications'], null, {
			'Content-Type': 'application/json'
		}, {});
	};

	/**
  * @ngdoc method
  * @name Models.Item#createAssociationLink
  * @methodOf Models.Item
  * @description Create link that can be used to associated affected item
  *
  * @param {String} workspaceId workspace id
  * @param {String} itemId id of the item to be associated.
  *
  * @returns {String} association url
  *
  * TODO not really use this is the right place for this link. Association link will be used as a 'content-location' header
  * to add association between the affected item and the workspace item.
  * TODO bit confused about this affected item thing, as logically affected item and linkable item both are just workspace items.
  */
	this.getAffectedItemsAssociationLink = function (workspaceId, itemId) {
		return this.affectedItemsAssociation.link.replace('[workspaceId]', workspaceId).replace('[itemId]', itemId);
	};

	/**
  * @ngdoc method
  * @name Models.Item#getProjectItemsLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the project management tasks for item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getProjectItemsLink = function () {
		return this.projectItems.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getMilestonesLink
  * @methodOf Models.Item
  * @description Returns the REST api link for the milestones for the item
  *
  * @returns {String} The string representation of the REST link
  */
	this.getMilestonesLink = function () {
		return this.milestones.link.replace('[workspaceId]', this.workspaceObj.getId());
	};

	/**
  * @ngdoc method
  * @name Models.Item#getUrn
  * @methodOf Models.Item
  * @description Returns the 'urn' attribute
  *
  *
  * @returns {String} The urn associated to the item
  */
	this.getUrn = function () {
		return that.json.urn;
	};

	/**
  * @ngdoc method
  * @name Models.Item#isLocked
  * @methodOf Models.Item
  * @description Returns if the item is locked by workflow state
  *
  *
  * @returns {Boolean} if the item is locked
  */
	this.isLocked = function () {
		return that.json.itemLocked;
	};

	/**
  * @ngdoc method
  * @name Models.Item#isWorking
  * @methodOf Models.Item
  * @description Returns if the item is the working version
  *
  *
  * @returns {Boolean} if the item is working
  */
	this.isWorking = function () {
		return that.json.workingVersion;
	};

	/**
  * @ngdoc method
  * @name Models.Item#isReleased
  * @methodOf Models.Item
  * @description Returns if the item is the a released version
  *
  *
  * @returns {Boolean} if the item is released
  */
	this.isReleased = function () {
		return !that.json.workingVersion;
	};

	/**
  * @ngdoc method
  * @name Models.Item#getLifecycleState
  * @methodOf Models.Item
  * @description Returns the lifecycle state
  *
  *
  * @returns {Object} The lifecycle object
  */
	this.getLifecycleState = function () {
		return that.json.lifecycle;
	};
};

angular.module('plm360.models').factory('Item', ['RESTWrapperService', 'EventService', 'ModelsManager', 'UrnParser', '$filter', '$q', '$log', '_', 'CreateItemPayloadBuilder', function (RESTWrapperService, EventService, ModelsManager, UrnParser, $filter, $q, $log, _, CreateItemPayloadBuilder) {
	var models = {};
	Item.prototype.RESTWrapperService = RESTWrapperService;
	Item.prototype.ModelsManager = ModelsManager;
	Item.prototype.UrnParser = UrnParser;
	Item.prototype.$filter = $filter;
	Item.prototype.$q = $q;
	Item.prototype.$log = $log;
	Item.prototype._ = _;
	Item.prototype.CreateItemPayloadBuilder = CreateItemPayloadBuilder;

	// get item
	EventService.listen('itemInstance:*:get', function (event, params, isEdit) {
		var model = models[params] || new Item();
		models[params] = model;
		model.fetch(params, isEdit).then(function (obj) {
			EventService.send('itemInstance:' + event.split(':')[1] + ':done', obj);
		});
	});
	EventService.listen('preItemInstance:*:get', function (event, params, isEdit) {
		var model = models[params] || new Item();
		models[params] = model;
		model.fetch(params, isEdit).then(function (obj) {
			EventService.send('preItemInstance:' + event.split(':')[1] + ':done', obj);
		}, function (err) {
			if (err.status === 404) {
				EventService.send('preItemInstance:' + event.split(':')[1] + ':notFound');
			} else {
				EventService.send('preItemInstance:' + event.split(':')[1] + ':rejected', err);
			}
		});
	});

	// set bookmark
	EventService.listen('itemInstance:*:setBookmark', function (event, obj, flag) {
		obj.setBookmark(flag).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':setBookmarkDone');
		});
	});

	// set archive
	EventService.listen('itemInstance:*:setArchive', function (event, obj, flag) {
		obj.setArchive(flag).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':setArchiveDone');
		});
	});

	// perform transition
	EventService.listen('itemInstance:*:performTransition', function (event, obj, transitionObj, comments, selectedUserImpersonation, password) {
		obj.performTransition(transitionObj, comments, selectedUserImpersonation, password).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':performTransitionDone', true);
		}, function (error) {
			if (error.status === 400) {
				// Special handling of bad requests.
				EventService.send('itemInstance:' + event.split(':')[1] + ':performTransitionBadRequest', error.data);
			} else {
				EventService.send('itemInstance:' + event.split(':')[1] + ':performTransitionDone', false);
			}
		});
	});

	// save
	EventService.listen('itemInstance:*:saveItem', function (event, obj, data) {
		obj.save(data).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':saveDone', true);
		}, function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':saveDone', false);
		});
	});

	// save new
	EventService.listen('itemInstance:newItem:save', function (event, params, workspaceId, data) {
		var model = models[params] || new Item();
		models[params] = model;
		model.saveNew(workspaceId, data).then(function (response) {
			EventService.send('itemInstance:newItem:saveDone', response, true);
		}, function (error) {
			EventService.send('itemInstance:newItem:saveDone', error, false);
		});
	});

	// associate affected item
	EventService.listen('itemInstance:*:associateAffectedItem', function (event, obj, locationUrl, itemDescriptor) {
		obj.associateAffectedItem(locationUrl, itemDescriptor).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', true);
		}, function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', false);
		});
	});

	// associate project item
	EventService.listen('itemInstance:*:associateProjectItem', function (event, obj, locationUrl, itemDescriptor) {
		obj.associateProjectItem(locationUrl, itemDescriptor).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', true);
		}, function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', false);
		});
	});

	// associate relationship item
	EventService.listen('itemInstance:*:associateRelationshipItem', function (event, obj, locationUrl, itemDescriptor) {
		obj.associateRelationshipItem(locationUrl, itemDescriptor).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', true);
		}, function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', false);
		});
	});

	// associate named relationship item
	EventService.listen('itemInstance:*:associateNamedRelationshipItem', function (event, obj, locationUrl, itemDescriptor, namedRelationshipId) {
		obj.associateNamedRelationshipItem(locationUrl, itemDescriptor, namedRelationshipId).then(function () {
			ModelsManager.resetModels();
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', true);
		}, function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':associationDone', false);
		});
	});

	// action notification save
	EventService.listen('itemInstance:*:actionNotificationItem', function (event, obj, itemActionNotification) {
		obj.saveActionNotification(itemActionNotification).then(function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':actionNotificationDone', true);
		}, function () {
			EventService.send('itemInstance:' + event.split(':')[1] + ':actionNotificationDone', false);
		});
	});

	return Item;
}]);
//# sourceMappingURL=Item.js.map
