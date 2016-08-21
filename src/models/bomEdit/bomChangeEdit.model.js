import BomChangeTypes from 'com/autodesk/models/bomEdit/bomChangeTypes.js';
import AbstractChange from 'com/autodesk/models/editTracker/abstractChange.model.js';

/**
 * @ngdoc object
 * @name Models.BomChangeEdit
 * @description A change that edit a field of an item in the bom
 */
class BomChangeEdit extends AbstractChange {

	/**
	 * @ngdoc property
	 * @name Models.BomChangeEdit#constructor
	 * @propertyOf Models.BomChangeEdit
	 * @description Initializes the edit
	 */
	constructor(args) {
		super(args);

		/**
		 * @ngdoc property
		 * @name Models.BomChangeEdit#changeType
		 * @propertyOf Models.BomChangeEdit
		 * @description The type of the change
		 */
		this.changeType = BomChangeTypes.FIELDEDIT;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeEdit#edgeId
		 * @propertyOf Models.BomChangeEdit
		 * @description The edge which this change targets
		 */
		this.edgeId = args.edgeId;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeEdit#targetFieldData
		 * @propertyOf Models.BomChangeEdit
		 * @description The BomFieldData instance which this change targets
		 *	Because this is a live reference to the BomFieldData instance associated with a field,
		 *		it should be considered constant and should NOT be modified from here.
		 *	Additionally, only constant properties of the field should be referenced,
		 *		since the instance may be updated from elsewhere after the change occurs.
		 */
		this.targetFieldData = args.targetFieldData;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeEdit#currentValue
		 * @propertyOf Models.BomChangeEdit
		 * @description The value of the field after the change occured
		 */
		this.currentValue = args.currentValue;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeEdit#targetsSameField
	 * @methodOf Models.BomChangeEdit
	 * @description Checks if the provided change targets the same field on the same edge as this change
	 * @param {BomChangeEdit} change The change to test
	 *
	 * @returns {Boolean} True if the change targets the same field on the same edge as this change
	 */
	targetsSameField(change) {
		return (change.edgeId === this.edgeId) &&
			(change.targetFieldData.getFieldId() === this.targetFieldData.getFieldId());
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeEdit#isRevertingChange
	 * @methodOf Models.BomChangeEdit
	 * @description Checks if this change sets the value of the field
	 *		to a value that is not fundamentally different from the field's original value
	 *	If so, the change is a NOOP or undoes any previous changes to the field.
	 * @returns {Boolean} True if this change is not consequential
	 *	when compared to the original value of the field
	 */
	isRevertingChange() {
		return !this.targetFieldData.isConsequentialChange(this.targetFieldData.originalValue, this.currentValue);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeEdit#payloadForm
	 * @methodOf Models.BomChangeEdit
	 * @description Returns an object with the edit's data in a form suitable for use in a payload
	 */
	payloadForm() {
		return {
			metaData: this.targetFieldData.getViewDefFieldInfo(),
			value: this.currentValue
		};
	}

}

export default BomChangeEdit;
