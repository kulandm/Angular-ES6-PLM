class ClassificationUtil {

	/**
	* @ngdoc object
	* @name Services.ClassificationUtil
	*
	* @description
	*/
	constructor(CLASSIFICATION_FIELD_TYPES, DATA_SOURCE_TYPES, FieldSelectorFactory, $rootScope) {
		this.CLASSIFICATION_FIELD_TYPES = CLASSIFICATION_FIELD_TYPES;
		this.FieldSelectorFactory = FieldSelectorFactory;
		this.DATA_SOURCE_TYPES = DATA_SOURCE_TYPES;
		this.$rootScope = $rootScope;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationUtil#getUniformedParametersFromUrn
	 * @methodOf Services.ClassificationUtil
	 * @description Given a urn, retrieve  {tenant, workspace, item} parameters
	 *
	 * @param  {String} urn A given urn
	 * @return {Object}     Object containing {tenant, workspace, item} ids
	 */
	getUniformedParametersFromUrn(urn) {
		let parameters = {item: null, workspace: null, tenant: null};
		let parts = (urn.replace(/\./g, '/').replace(/:/g, '/')).split('/');
		let decrease = 1;
		if (urn.indexOf('item') > -1) {
			parameters.item = parts[parts.length - decrease];
			decrease++;
		}
		if (urn.indexOf('workspace') > -1) {
			parameters.workspace = parts[parts.length - decrease];
			decrease++;
		}
		if (urn.indexOf('tenant') > -1) {
			parameters.tenant = parts[parts.length - decrease];
		}
		return parameters;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationUtil#getUrnBasedOnParams
	 * @methodOf Services.ClassificationUtil
	 * @description Given an array of urn params it builds the urn 
	 *
	 * @param  {Array} params array of the urn (it could contain tenant, workspace and item)
	 * @param  {boolean} excludeItem if you don't need to build an urn that includes the item part.
	 * @return {String} The urn in cws syntax
	 */
	getUrnBasedOnParams(params, excludeItem) {
		excludeItem = (excludeItem === true) ? true : false;
		let baseUrn = 'urn:adsk.plm:';
		let baseUrnValues = '';
		if (params.tenant !== null) {
			baseUrn += 'tenant';
			baseUrnValues = params.tenant;
		}
		if (params.workspace !== null) {
			baseUrn += '.workspace';
			baseUrnValues += '/' + params.workspace;
		}
		if (!excludeItem && (params.item !== null)) {
			baseUrn += '.item';
			baseUrnValues += '/' + params.item;
		}
		return baseUrn + ':' + baseUrnValues;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationUtil#errorMessageHandler
	 * @methodOf Services.ClassificationUtil
	 * @description given the error response it parses the error messages
	 *
	 * @param  {Array} errors Service reponse error object
	 * @return {type}        description
	 */
	errorMessageHandler(errors) {
		let line = '';
		let output = [];
		let keyWord = ['Entity', 'Field', 'Value'];
		let i;

		if (errors.data && errors.data.errors) {
			_.each(errors.data.errors, oneError => {
				line = oneError.message;
				if (oneError.params) {
					line += ' : ';
					i = 0;
					_.each(oneError.params, param => {
						line += keyWord[i] + ' ' + param + ' ';
						i++;
					});
				}
				output.push(line);
			});
		}
		return output;
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationUtil#getRejectDeferredFunction
	 * @methodOf Services.ClassificationUtil
	 * @description given the error response it parses the error messages
	 *
	 * @param  {Object} deferred 	Deferred object
	 * @return {Function}     	Returns reject function for the deferred object
	 */
	getRejectDeferredFunction(deferred) {
		return error => {
			deffered.reject(error);
		};
	}

	/**
	 * @ngdoc method
	 * @name Services.ClassificationUtil#decorateFields
	 * @methodOf Services.ClassificationUtil
	 * @description Converts classification fields and append it to the instance of the given section.
	 * 
	 * 
	 * @param  {Object} fields  [An object containing all the fields applied for the current classification]
	 * @param  {boolean} isCreate  When you're in create mode, we decorate with more info.
	 */
	decorateFields(fields, isCreate) {
		let fieldsParsed = [];
		let newField;

		let fillValueToShow = field => {
			field.valueToShow = null;
			if (field.itemDefault === null) {
				field.valueToShow = (field.workspaceDefault === null) ? '' : field.workspaceDefault;
			} else if (field.itemDefault === '') {
				field.valueToShow = '';
			} else {
				field.valueToShow = field.itemDefault;
			}
		};

		let setPicklistValueToShow = field => {
			// i need to identify if the value was deleted from the list of picklist values
			if (typeof field.valueToShow === 'string') {
				field.valueToShow = {displayValue: field.valueToShow, value: field.valueToShow};
			} else {
				if (field.valueToShow.displayValue === null) {
					field.valueToShow.displayValue = field.valueToShow.value;
				}
			}
			// PLM-9673 - show deleted values
			let isDeleted = ! _.some(field.options, option => {
				option.selected = option.value === field.valueToShow.value;
				return option.selected;
			});
			if (isDeleted) {
				if (angular.isDefined(field.valueToShow.value) && field.valueToShow.value){
					field.valueToShow.deleted = true;
					field.valueToShow.selected = true;
					field.options.push(field.valueToShow);
				}
			}
			if (!field.required && !field.readOnly) {
				field.options = ([{value: undefined, displayValue: this.$rootScope.bundle.classifications.fields.picklist.placeholder, selected: false}]).concat(field.options);
			}
		};
		
		_.each(fields, field => {

			fillValueToShow(field);
			if (field.type === this.CLASSIFICATION_FIELD_TYPES.PICKLIST) {
				setPicklistValueToShow(field);
			}
			newField = new this.FieldSelectorFactory(field, this.DATA_SOURCE_TYPES.cws);
			
			if (isCreate) {
				// TODO - determine how to not use this here.
				newField.isClassificationField = true;
				newField.dataTypeId = newField.metadata.dataTypeId;
				newField.urn = Math.floor(Math.random() * 1000);
				newField.name = field.displayName;
				// -----------------
			}

			fieldsParsed.push(newField);
		});
		return fieldsParsed;
	}

}

export default ClassificationUtil;
