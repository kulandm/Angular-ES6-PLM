/**
 * @ngdoc object
 * @name Services.ClassificationService
 *
 * @description Classification service to access several resources from PLM side
 *
 */
class ClassificationService {

	/*
	 * @ngdoc method
	 * @name Services.ClassificationService#constructor
	 * @methodOf Services.ClassificationService
	 * @description The class constructor
	 * @param  {RESTWrapperService} RESTWrapperService Rest client
	 * @param  {ClassificationUtil} ClassificationUtil Util class
	 * @param  {$q} $q                 defer
	 */
	constructor(RESTWrapperService, ClassificationUtil, $q, CLASSIFICATION_FIELD_TYPES, PAGE_SIZE, API_V2_PREFIX) {
		this.RESTWrapperService = RESTWrapperService;
		this.ClassificationUtil = ClassificationUtil;
		this.$q = $q;
		this.CLASSIFICATION_FIELD_TYPES = CLASSIFICATION_FIELD_TYPES;
		this.PAGE_SIZE = PAGE_SIZE;
		this.API_V2_PREFIX = API_V2_PREFIX;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getPartFromUrn
	 * @methodOf Services.ClassificationService
	 * @description Retrieve the part associated to an URN
	 *
	 * @param {String} urn description
	 * @param {Number} page description
	 *
	 * @returns {Array}  parts
	 */
	getPartFromUrn(urn, page) {

		page = (page === undefined) ? 1 : page;

		let deferred = this.$q.defer();
		let that = this;
		that.RESTWrapperService.get(this.API_V2_PREFIX + 'parts?referenceUrn=' + urn + '&page=' + page + '&size=' + this.PAGE_SIZE, null, null, {skipCache: true}).then( response => {
			if (response && (response.size === this.PAGE_SIZE)) {
				that.getPartFromUrn(urn, page + 1).then( parts => {
					deferred.resolve((parts && (parts.length > 0)) ? response.parts.concat(parts) : response.parts);
				}, error => {
					deferred.reject(error);
				});
			} else if (response && response.parts) {
				deferred.resolve(response.parts);
			} else {
				deferred.resolve([]);
			}
		}, error => {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getPart
	 * @methodOf Services.ClassificationService
	 *
	 * @description Given an link, retrieves the part associated
	 * @param  {String} link The/given/link/to/resource
	 *
	 * @return {Object}      The Object been pulled
	 */
	getPart(link) {
		let deferred = this.$q.defer();
		this.RESTWrapperService.get(this.API_V2_PREFIX + link, null, null, {skipCache: true}).then( response => {
			deferred.resolve(response);
		}, error => {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc
	 * @name Services.ClassificationService#getClassificationParent
	 * @methodOf Services.ClassificationService
	 * @description Calls to the parent element of a class
	 *
	 * @param  {Number} classificationId THe id of the class
	 * @return {RESTWrapperService}      THe RESTWrapperService resource of the parent classification call
	 */
	getClassificationParent(classificationId) {
		return this.RESTWrapperService.get(this.API_V2_PREFIX + 'classifications/' + classificationId + '/parents', null, null, {skipCache: true});
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getClassification
	 * @methodOf Services.ClassificationService
	 * @description Retrieves a classification by its id
	 *
	 * @param {Number} classificationId The class ID
	 *
	 * @returns {Promise} classification
	 */
	getClassification(classificationId) {
		return this.RESTWrapperService.get(this.API_V2_PREFIX + 'classifications/' + classificationId, null, null, {skipCache: true});
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getFullPath
	 * @methodOf Services.ClassificationService
	 * @description Given two classifications of the same sub tree, it retrieves the full path between them
	 *
	 * @param {Number} from class id
	 * @param {Number} to class id
	 *
	 * @returns {Promise}  Array of classifications
	 */
	getFullPath(from, to) {
		let deferred = this.$q.defer();
		let that = this;
		if (from === to) {
			that.getClassification(to).then( classification => {
				deferred.resolve([classification]);
			}, error => {
				deferred.reject(error);
			});
		} else {
			that.getClassificationParent(to).then( parent => {
				parent = (parent.classifications) ? parent.classifications.shift() : null;
				that.getClassification(to).then( classification => {
					if (parent) {
						that.getFullPath(from, parent.id).then( partialPath => {
							partialPath.push(classification);
							deferred.resolve(partialPath);
						}, error => {
							deferred.reject(error);
						});
					} else {
						deferred.resolve([classification]);
					}
				}, error => {
					deferred.reject(error);
				});
			}, error => {
				deferred.reject(error);
			});
		}
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getPropertyInstances
	 * @methodOf Services.ClassificationService
	 * @description Given the class ID retrieve the property instances associated
	 *
	 * @param {Number} The classificatin ID
	 * @param {Number} Current page
	 * @returns {Promise}  Array of property instances objects
	 */
	getPropertyInstances(classificationId, page) {
		page = (page === undefined) ? 1 : page;

		let deferred = this.$q.defer();
		let url = this.API_V2_PREFIX + 'classifications/' + classificationId + '/property-instances?cascade=true&page=' + page + '&size=' + this.PAGE_SIZE;
		let that = this;

		that.RESTWrapperService.get(url, null, null, {skipCache: true}).then( response => {
			if (response) {
				if (response.size === this.PAGE_SIZE) {
					that.getPropertyInstances(classificationId, page + 1).then( instances => {
						deferred.resolve((instances && (instances.length > 0)) ? response.propertyInstances.concat(instances) : response.propertyInstances);
					}, error => {
						deferred.reject(error);
					});
				} else {
					deferred.resolve(response.propertyInstances);
				}
			} else {
				deferred.resolve([]);
			}
		}, error => {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getClassificationFieldsParts
	 * @methodOf Services.ClassificationService
	 * @description get the classification field parts
	 * @param {string} workspaceUrn urn of the workspace
	 * @param {string} itemUrn urn of the item
	 * @param {number} shownAsClassId id of the classification that should be used to get values
	 * @returns {object} Promise object that if it is resolved, will provide an {classificationPromises, itemUserValues} object
	**/
	getClassificationFieldsParts(workspaceUrn, itemUrn, shownAsClassId) {
		return this.getUniformedPartsFromUrn(workspaceUrn, itemUrn).then(parts => {
			let workspacePart = parts.shift();
			let itemPart = parts.shift();
			let classificationPromises = [];
			let itemUserValues;

			// ----- we decide which classification to use -----
			if (workspacePart && workspacePart.classifications) {
				// workspaces have always a part (if there is a classification section)
				// {id, schema}
				classificationPromises.push(this.getSchemaOfPart(workspacePart.classifications.link));
			}
			if (itemPart && itemPart.classifications) {
				itemUserValues = itemPart.data;

				if (shownAsClassId !== null) {
					// re-classify the item
					// {id, schema}
					classificationPromises.push(this.getPartByClassificationId(itemPart.id, shownAsClassId));
				} else {
					// Use stored configuration
					// {id, schema}
					classificationPromises.push(this.getSchemaOfPart(itemPart.classifications.link));
				}
			} else if (shownAsClassId !== null) {
				// Item doesn't have a part and we're re classifying
				// {id, schema}
				classificationPromises.push(this.getReClassificationSchema(shownAsClassId));
			}
			// ----- end decition flow -----

			return {
				classificationPromises: classificationPromises,
				itemUserValues: itemUserValues
			};

		});
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#createPropertyInstanceBaseOnOther
	 * @methodOf Services.ClassificationService
	 * @description Create new propertyInstance using the values of the base object and applying the business rules
	 * @param {object} basePropertyInstance the new propertyInstance will be create be on this propertyInstance
	 * @param {object} newPropertyInstanceValues expected {workspaceDefault, itemDefault} object
	 * @returns {string} return new propertyInstance
	**/
	createPropertyInstanceBaseOnOther(basePropertyInstance, newPropertyInstanceValues) {
		let newInstance = _.extend(basePropertyInstance, newPropertyInstanceValues);

		if (newInstance.readOnly) {
			newInstance.itemDefault = newInstance.defaultValue;
		}

		return newInstance;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#mergeClassificationFieldParts
	 * @methodOf Services.ClassificationService
	 * @description Merge the classification workspace and the user values
	 * @param {array} classifications array of {id, schema} objects
	 * @param {object} itemUserValues should contain the user value for the classification
	 * @returns {object} promise object that if it is resolve, will return an {properties, classificationId} object
	**/
	mergeClassificationFieldParts(classifications, itemUserValues) {
		let deferred = this.$q.defer();
		let that = this;
		let workspaceClassification = classifications.shift();
		let itemClassification = (classifications && (classifications.length === 1)) ? classifications.shift() : null;
		let properties = {};
		let propInstancePromise = [];

		// If itemClassification !== null, the item has a part or we're re classifying
		// if itemClassification === null, there is no info related with the item, then we will display workspace defaults
		let usedClass = itemClassification || workspaceClassification;

		// itemUserValues === undefined, user has no part
		itemUserValues = angular.isDefined(itemUserValues) ? itemUserValues : null;

		propInstancePromise.push(that.getPropertyInstances(usedClass.id));

		_.each(_.keys(usedClass.schema), propertyId => {
			properties[propertyId] = {
				workspaceDefault: itemUserValues === null ? workspaceClassification.schema[propertyId] : null,
				itemDefault: itemUserValues !== null && angular.isDefined(itemUserValues[propertyId]) ? itemUserValues[propertyId] : usedClass.schema[propertyId]
			};
		});

		// finally, read other fields of the selected classification (item|workspace)
		that.$q.all(propInstancePromise).then(propertyInstances => {
			// add the configuration of the field
			propertyInstances = (propertyInstances && propertyInstances.length === 1) ? propertyInstances.shift() : null;
			if (_.isArray(propertyInstances)) {
				_.each(propertyInstances, property => {
					// copy attributes from properties[id] into the property definition
					// and override properties[id] with the result
					properties[property.name] = this.createPropertyInstanceBaseOnOther(property, properties[property.name]);
				});
			}
			this.getEnumsFromProperties(properties).then(expandedProperties => {
				deferred.resolve({
					properties: expandedProperties,
					classificationId: usedClass.id
				});
			});
		});

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getClassificationFields
	 * @methodOf Services.ClassificationService
	 * @description Given the class ID retrieve the property instances associated
	 *
	 * @param {String} workspaceUrn The workspace urn resource
	 * @param {String} itemUrn The item urn resource
	 * @param {Number} shownAsClassId The class id when re-classify
	 *
	 * @returns {Promise}  Returns an object containing on it key the id of each field and as content the configuration ( { property_ID: configuration } ).
	 * On this configuration you can see 2 attributes called workspaceDefault (default value for the workspace) and itemDefault (user input values)
	 */
	getClassificationFields(workspaceUrn, itemUrn, shownAsClassId, isCreate) {
		let deferred = this.$q.defer();
		let itemUserValues = null;
		let usedClassId = null;

		shownAsClassId = (shownAsClassId > 0) ? shownAsClassId : null;
		isCreate = (isCreate === true) ? true : false;

		// transform plm urn to array param
		workspaceUrn = this.ClassificationUtil.getUniformedParametersFromUrn(workspaceUrn);
		itemUrn = this.ClassificationUtil.getUniformedParametersFromUrn(itemUrn);

		// transform array param to cws urn syntax
		workspaceUrn = this.ClassificationUtil.getUrnBasedOnParams(workspaceUrn, true);
		itemUrn = this.ClassificationUtil.getUrnBasedOnParams(itemUrn, false);

		this.getClassificationFieldsParts(workspaceUrn, itemUrn, shownAsClassId).then(partsPromises => {

			// classificationPromises has 2 promises ALWAYS that resolves as { id: classificationID, schema: effectiveSchema}
			this.$q.all(partsPromises.classificationPromises).then(classifications => {

				this.mergeClassificationFieldParts(classifications, partsPromises.itemUserValues).then(classificationFields => {
					// apply decorate
					classificationFields.properties = this.ClassificationUtil.decorateFields(classificationFields.properties, isCreate);

					deferred.resolve(classificationFields);
				});

			}, this.ClassificationUtil.getRejectDeferredFunction(deferred));

		}, this.ClassificationUtil.getRejectDeferredFunction(deferred));

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getPartByClassificationId
	 * @methodOf Services.ClassificationService
	 * @description You use this method when you want to see the schema of the item part
	 *
	 * @param {Number} partId id of the item part
	 * @param {Number} classificationId id for the selected classification
	 * @returns {Promise}  The schema associated.
	 */
	getPartByClassificationId(partId, classificationId) {
		let rootPartUrl = this.API_V2_PREFIX + 'parts/' + partId + (classificationId ? ('?classification=' + classificationId) : '');
		let deferred = this.$q.defer();
		let that = this;
		that.RESTWrapperService.get(rootPartUrl, null, null, {skipCache: true}).then( part => {
			let response = {id: classificationId, schema: part.data};
			deferred.resolve(response);
		}, error => {
			deferred.reject(error);
		});

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getUniformedPartsFromUrn
	 * @methodOf Services.ClassificationService
	 * @description Used as auxiliar function to separate logic
	 *
	 * @param {String} workspaceUrn urn of the workspace
	 * @param {String} itemUrn urn of the item
	 * @returns {Promise} Array containing workspace and item parts
	 */
	getUniformedPartsFromUrn(workspaceUrn, itemUrn) {
		let deferred = this.$q.defer();
		let promises = [];

		promises.push(this.getPartFromUrn(workspaceUrn));
		if (workspaceUrn !== itemUrn) {
			// create mode will pass the same urn for both,
			// no need to pull it again
			promises.push(this.getPartFromUrn(itemUrn));
		}

		this.$q.all(promises).then( parts => {
			let workspacePart = parts.shift();
			let itemPart = (parts && (parts.length === 1)) ? parts.shift() : null;

			workspacePart = (workspacePart && (workspacePart.length === 1)) ? workspacePart.shift() : null;
			itemPart = (itemPart && (itemPart.length === 1)) ? itemPart.shift() : null;

			deferred.resolve([workspacePart, itemPart]);
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getSchemaOfPart
	 * @methodOf Services.ClassificationService
	 * @description Auxiliar function to normalize data requests
	 *
	 * @param  {String} link the link of the resource
	 * @return {Promise} We return the classification id and the schema associated
	 */
	getSchemaOfPart(link) {
		let deferred = this.$q.defer();
		let that = this;
		that.getPart(link).then( response => {
			let classification = response.classifications;
			classification = (classification && classification.length === 1) ? classification.shift() : null;
			if (classification !== null) {
				classification = {id: classification.id, schema: classification.effectiveSchema};
			}
			deferred.resolve(classification);
		}, error => {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getReClassificationSchema
	 * @methodOf Services.ClassificationService
	 * @description Auxiliar function to normalize data request when we need to see the part as if we're classifying with classificationID
	 *
	 * @param  {Number} classificationId THe given class ID
	 * @return {Promise} Object
	 */
	getReClassificationSchema(classificationId) {
		let deferred = this.$q.defer();
		let that = this;
		that.getClassification(classificationId).then( response => {
			deferred.resolve({id: response.id, schema: response.effectiveSchema});
		}, error => {
			deferred.reject(error);
		});
		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#buildSchemaObject
	 * @methodOf Services.ClassificationService
	 * @description Creates a new object that contains all field name / value
	 *
	 * @param  {Array} rawFields        array of fields
	 * @return {Object}                 Schema of field (fieldName/value)
	 */
	buildSchemaObject(rawFields) {
		let schema = {};

		_.each(rawFields, field => {
			if (field.type === this.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
				let selected = _.isArray(field.options) ? field.options.filter(option => option.selected).shift() : null;
				schema[field.name] = selected ? selected.value : null;

			} else {
				schema[field.name] = field.internalValue !== null && field.internalValue !== undefined ? field.internalValue : field.valueToShow;
			}
		});

		return schema;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#saveRawFields
	 * @methodOf Services.ClassificationService
	 * @description middle function to convert raw fields into schema object and decide the operation to made
	 *
	 * @param  {Number} classificationId The current classification ID
	 * @param  {String} urn the urn of the item
	 * @param  {Array} rawFields array of fields
	 * @param  {Number} dmsId the new item id for the item just created
	 * @return {Promise} resolution for when the work is done.
	 */
	saveRawFields(classificationId, urn, rawFields, dmsId) {
		let deferred = this.$q.defer();
		this.getClassification(classificationId).then( classification => {
			// prevent to use an phantom class
			if (classification.ext['abstract'] === true) { // eslint-disable-line
				deferred.reject({phantomRestriction: 'bundle.classifications.section.warning.phantom_class'});
			} else {
				// pre process rawFields to look like a schema object
				let schema = this.buildSchemaObject(rawFields);
				let urnParts = this.ClassificationUtil.getUniformedParametersFromUrn(urn);
				if ((urnParts.item === null) && angular.isDefined(dmsId)){
					// we're in create mode after item was created.
					urnParts.item = dmsId;
				}
				urn = this.ClassificationUtil.getUrnBasedOnParams(urnParts);
				if (urnParts.item === null){
					// item creation scenario.
					this.saveOrUpdate(classificationId, schema, {referenceUrn: null})
						.then(response => deferred.resolve(response), error => deferred.reject(error));
				} else {
					// item update | item create but now we have an item ID
					this.getPartFromUrn(urn).then( parts => {
						let part = parts.length === 0 ? {referenceUrn: urn} : parts.shift();
						// TODO - check if class is a marked as abstract (phantom), if not, continue with editing
						this.saveOrUpdate(classificationId, schema, part)
							.then(response => deferred.resolve(response), error => deferred.reject(error));

					}, error => deferred.reject(error));
				}
			}
		}, error => deferred.reject(error));

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#createPart
	 * @methodOf Services.ClassificationService
	 * @description it calls to create a part
	 *
	 * @param {Object} partPayload The payload for creation of part
	 * @returns {Promise} result
	*/
	createPart(partPayload) {
		let sortedPayload = {referenceUrn: partPayload.referenceUrn, classifications: partPayload.classifications, data: partPayload.data};
		return this.RESTWrapperService.post(sortedPayload, this.API_V2_PREFIX + 'parts/');
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#updatePart
	 * @methodOf Services.ClassificationService
	 * @description calls to part update
	 *
	 * @param  {Object} partPayload the part payload
	 * @param  {Number} partId      part ID
	 * @return {Promise}             description
	 */
	updatePart(partPayload, partId) {
		let sortedPayload = {id: partPayload.id, referenceUrn: partPayload.referenceUrn, classifications: partPayload.classifications, data: partPayload.data};
		return this.RESTWrapperService.put(sortedPayload, this.API_V2_PREFIX + 'parts/' + partId);
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#saveOrUpdate
	 * @methodOf Services.ClassificationService
	 * @description It decides what actio to take based on parameter
	 *
	 * @param  {Number} classificationId THe class associated
	 * @param  {Object} schema           Schema Object containing field (key) value (value)
	 * @param  {Object} part             the part object
	 * @return {Promise} result
	 */
	saveOrUpdate(classificationId, schema, part) {
		let partPayload = {referenceUrn: part.referenceUrn, data: schema};
		partPayload.classifications = [{
			description: 'next PLM ',
			link: 'classifications/' + classificationId
		}];
		if (part && part.id) {
			// run update
			partPayload.id = part.id;
			partPayload.classifications[0].description += ' updated'; // fancy non user message
			return this.updatePart(partPayload, part.id);
		} else {
			// run creation
			partPayload.classifications[0].description += ' created';
			return this.createPart(partPayload);
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getAllConstraintEnumerations
	 * @methodOf Services.ClassificationService
	 * @description It returns all enumerations
	 *
	 * @param  {String} enumerationsLink Link to enumerations collection
	 * @param  {Number} pageNumber      Index of the first set of enumeration to be retrieved, default value 1
	 * @param  {Number} pageSize        Max number of enumerations to be retrieved in a request, default value PAGE_SIZE
	 * @return {Promise}                Enumerations arrays
	 */
	getAllConstraintEnumerations(enumerationsLink, pageNumber = 1, pageSize = this.PAGE_SIZE) {

		let that = this;
		let deferred = that.$q.defer();
		let link = this.API_V2_PREFIX + enumerationsLink;

		that.RESTWrapperService.get(link, null, {page:pageNumber, size: pageSize, sort: 'rank'}, {skipCache: true}).then((response) => {

			if (response && response.size === pageSize) {

				this.getAllConstraintEnumerations(enumerationsLink, pageNumber + 1, pageSize).then( enumerationsRest => {
					deferred.resolve(response.enumerations.concat(enumerationsRest));

				}, this.ClassificationUtil.getRejectDeferredFunction(deferred));

			} else if (response && response.enumerations) {
				deferred.resolve(response.enumerations);
			} else {
				deferred.resolve([]);
			}

		}, that.ClassificationUtil.getRejectDeferredFunction(deferred));

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getPropertyEnums
	 * @methodOf Services.ClassificationService
	 * @description description
	 *
	 * @param  {String} link of the resource
	 * @return {Promise} Enumerations arrays ordered by rank
	 */
	getPropertyEnums(link) {
		let that = this;
		let deferred = that.$q.defer();

		that.RESTWrapperService.get(this.API_V2_PREFIX + link, null, null, {skipCache: true}).then( property => {
			if (_.isArray(property.properties)) {
				property = property.properties.shift();
				that.RESTWrapperService.get(this.API_V2_PREFIX + property.constraints.link, null, null, {skipCache: true}).then( constraint => {

					constraint = constraint.constraints.shift();
					let enumeration = constraint.enumerations;

					that.getAllConstraintEnumerations(enumeration.link).then( enumerations => {
						deferred.resolve(enumerations);

					}, that.ClassificationUtil.getRejectDeferredFunction(deferred));

				}, that.ClassificationUtil.getRejectDeferredFunction(deferred));
			} else {
				deferred.resolve([]);
			}
		}, that.ClassificationUtil.getRejectDeferredFunction(deferred));

		return deferred.promise;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationService#getEnumsFromProperties
	 * @methodOf Services.ClassificationService
	 * @description description
	 *
	 * @param  {Array} arrayProperties each property to look for enums
	 * @return {Promise} array of enums
	 */
	getEnumsFromProperties(arrayProperties) {
		let that = this;
		let deferred = this.$q.defer();
		let enumPromises = [];
		_.each(arrayProperties, property => {
			if (property.type === this.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
				enumPromises.push(that.getPropertyEnums(property.properties.link));
			}
		});
		that.$q.all(enumPromises).then( enumResponses => {
			_.each(arrayProperties, property => {
				if (property.type === this.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
					property.options = enumResponses.shift();
				}
			});
			deferred.resolve(arrayProperties);
		});
		return deferred.promise;
	}

}

export default ClassificationService;
