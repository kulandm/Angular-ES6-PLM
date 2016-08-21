import underscoreModule from 'com/autodesk/UnderscoreService.js';
import eventServiceModule from 'com/autodesk/EventService.js';

/**
 * @ngdoc object
 * @name Services.SupportedFieldsService
 *
 * @description A utility service that contains permission related methods.
 *
 * ##Dependencies
 * - Requires {@link Services.TokenService}
 *
 */
class SupportedFieldsService {

	/**
	 * @ngdoc method
	 * @name Services.SupportedFieldsService#constructor
	 * @methodOf Services.SupportedFieldsService
	 * @description The class constructor
	 */
	constructor(FieldTypes) {
		/**
		 * @ngdoc property
		 * @name Services.SupportedFieldsService#unsupportedFields
		 * @methodOf Services.SupportedFieldsService
		 * @description Array containing the unsupported fields
		 */
		this.unsupportedFields = [
			FieldTypes.IMAGE,
			FieldTypes.FLASH,
			FieldTypes.PICKLIST_FILTERED,
			FieldTypes.DERIVED
		];
	}

	/**
	 * @ngdoc method
	 * @name Services.SupportedFieldsService#isFieldUnsupported
	 * @methodOf Services.SupportedFieldsService
	 * @description Checks if the given field is supported or not
	 *
	 * @param {Number} dataTypeId The field data type id
	 *
	 * @return {Boolean} True if the field is unsupported
	 */
	isFieldUnsupported(dataTypeId) {
		return _.contains(this.unsupportedFields, parseInt(dataTypeId));
	}
}

export default angular.module(__moduleName, [
	underscoreModule.name,
	eventServiceModule.name
]).factory('SupportedFieldsService', [
	'FieldTypes',
	FieldTypes => new SupportedFieldsService(FieldTypes)
]);
