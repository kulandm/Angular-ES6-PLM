'use strict';

/**
 * @ngdoc object
 * @name Controllers.ManagedItemController
 *
 * @description The controller for managed item view within the in contextual create dialog.
 *
 * ##Dependencies
 *
 */

class ManagedItemController {

	/*
	 * @ngdoc method
	 * @name Controllers.ManagedItemController#constructor
	 * @methodOf Controllers.ManagedItemController
	 * @description The class constructor
	 */
	constructor() { }

	/**
	 * @ngdoc method
	 * @name Controllers.ManagedItemController#requiredFieldsFilter
	 * @methodOf Controllers.ManagedItemController
	 * @description return true if a given field is a required field
	 *
	 * TODO Un-editable required field is not considered a required field.
	 *
	 * @param {Object} fieldDefinition The object of the created item
	 *
	 * @returns {Boolean} True, if field is required
	 */
	isRequiredField(fieldDefinition) {
		return !!_.find(fieldDefinition.validatorsMeta, validation =>
			validation.validatorName.toUpperCase() === 'REQUIRED' ||
			validation.validatorName.toUpperCase() === 'DROPDOWNSELECTION');
	}
}

export default ManagedItemController;

