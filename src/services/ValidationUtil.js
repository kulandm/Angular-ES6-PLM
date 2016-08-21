import underscoreModule from 'com/autodesk/UnderscoreService.js';

/**
 * @ngdoc object
 * @name Services.ValidationUtil
 *
 * @description A utility service that contain help methods to map server validation error messages to the fields and clear them.
 *
 * ##Dependencies
 *
 */
class ValidationUtil {

	/**
	 * @ngdoc method
	 * @name Services.ValidationUtil#constructor
	 * @methodOf Services.ValidationUtil
	 * @description The class constructor
	 */
	constructor($rootScope, _) {
		this._ = _;
		this.$rootScope = $rootScope;
	}

	/**
	 * @ngdoc method
	 * @name Services.ValidationUtil#clearValidationErrors
	 * @methodOf Services.ValidationUtil
	 * @description This is a method to clear validation error information from the fields.
	 *
	 * @param {Array} fields the list of fields.
	 * @param {String} fieldProperty a property of the field to set validation error message to. This is an optional parameter, if
	 * not provided then default 'serverError' property will be used. Note: Nested properties not supported.
	 */
	clearValidationErrors(fields, fieldProperty) {
		let fieldErrorProperty = fieldProperty || 'serverError';
		this._.each(fields, (field) => {
			field[fieldErrorProperty] = null;
		});
	}

	/**
	 * @ngdoc method
	 * @name Services.ValidationUtil#mapValidationErrors
	 * @methodOf Services.ValidationUtil
	 * @description This is a method to map validation errors and set validation error message on the field data.
	 *
	 * @param {Array} fields the list of fields. Field can have any structure, but if you want to use the default comparator, then
	 * field should have a 'urn' property.
	 * @param {Array} list of validation messages. Validation (as of now) should have a property called 'code' and if you want to use
	 * the default comparator, then should have a 'field' with a 'urn' property in it.
	 * @param {Object} options the customization options that can be used while mapping validation errors. It may contain the
	 * following properties
	 *      predicate   {Function} a function, if provided will be used to compare field and validation meta data.
	 *      fieldProperty   {String} a property of the field to set validation error message to. If not provided then default
	 *                      'serverError' property will be used. Note: Nested properties not supported.
	 *      validationProperty  {String} a property of the validation object to get error message. If not provided then default
     *                          'message' property will be used. Note: Nested properties not supported.
	 *      localizedError  {Boolean} true, to perform client side localization of the error. Note: Only supporting limited
	 *                      PLM error code localization. This is an optional parameter.
	 * @returns {Array} a list of validations that could not be mapped to fields
	 */
	mapValidationErrors(fields, validations, options) {
		let unhandledValidations = [];
		let fieldErrorProperty = (options && options.fieldProperty) || 'serverError';
		let validationErrorProperty = (options && options.validationProperty) || 'message';
		this._.each(validations, (validation) => {
			let field = this._.find(fields, (field) => {
				return (options && options.predicate) ? options.predicate(field, validation) : field.urn === validation.field.urn;
			});
			// Adding an extra condition to handle a scenario in which validation message is not associated with any field.
			if (field) {
				field[fieldErrorProperty] = (options && options.localizedError === true) ? this.localizeString(validation[validationErrorProperty], validation.arguments) : this.format(validation[validationErrorProperty], validation.arguments);
			} else {
				unhandledValidations.push(validation);
			}
		});

		return unhandledValidations;
	}

	/**
	 * @ngdoc method
	 * @name Services.ValidationUtil#localizeString
	 * @methodOf Services.ValidationUtil
	 * @description This method will try to localize the given string.
	 *
	 * @param {String} unLocalizedString the string to be localized.
	 * @param {Array} params the list of parameters that can be used while localization (String.format).
	 *
	 * @return {String} localized string or unlocalized string in case the mapping is not available.
	 */
	localizeString(unLocalizedString, params) {
		let localizedStr = this.getNestedPropertyValue(this.$rootScope.bundle, unLocalizedString);
		return localizedStr ? this.format(localizedStr, params) : unLocalizedString;
	}

	/**
	 * @ngdoc method
	 * @name Services.ValidationUtil#byString
	 * @methodOf Services.ValidationUtil
	 * @description get nested property of an object from dot notation string.
	 *
	 * @param {Object} obj the object to be searched.
	 * @param {String} str the dot notation string that contains the detail of the nested property. Like 'error.required'.
	 *
	 * @return {String} the value of the property
	 *
	 * Note: This logic is taken from {@link https://github.com/capaj/object-resolve-path}.
	 */
	getNestedPropertyValue(obj, str) {
		str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		str = str.replace(/^\./, '');           // strip a leading dot
		let properties = str.split('.');
		for (let i = 0, n = properties.length; i < n; ++i) {
			let k = properties[i];
			if (k in obj) {
				obj = obj[k];
			} else {
				return;
			}
		}
		return obj;
	}

	/**
	 * @ngdoc method
	 * @name Services.ValidationUtil#format
	 * @methodOf Services.ValidationUtil
	 * @description A C# or Java style string format function that can work with {0} {1} arguments. This is mainly created
	 * to address the client side localization of PLM message codes.
	 *
	 * @param {String} str string to format
	 * @param {Array} params the list of parameters for formatting.
	 *
	 * @return {String} formatted string
	 */
	format(str, params) {
		if (params) {
			return str.replace(/{(\d+)}/g, (match, number) => {
				return angular.isDefined(params[number]) ? params[number] : match;
			});
		}

		return str;
	}
}

export default angular.module(__moduleName, [
	underscoreModule.name
]).factory('ValidationUtil', [
	'$rootScope',
	'_',
	($rootScope, _) => new ValidationUtil($rootScope, _)
]);
