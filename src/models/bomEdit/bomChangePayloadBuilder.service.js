import BomChangeTypes from 'com/autodesk/models/bomEdit/bomChangeTypes.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Services.BomChangePayloadBuilder
 *
 * @description Class for converting changes to the bom into a format suitable for instantiating a bomNestedItem
 *	Note that the functions provide necessary but not always sufficient information to create a useful object
 *		other fields may need to be added.
 *
 */
class BomChangePayloadBuilder {

	/**
	 * @ngdoc method
	 * @name Services.BomChangePayloadBuilder#attachFieldEditToPayload
	 * @methodOf Services.BomChangePayloadBuilder
	 * @description Changes the payload object based on the content of edit
	 *		CUSTOM_BOM fields are pushed onto the .fields property,
	 *		while quantity, item, pinning, and item number are placed directly on the object
	 *	One or more of the following properties of payload may be changed,
	 *		- quantity
	 *		- isPinned
	 *		- item
	 *		- fields
	 * @param {Object} payload an object on which to place the changes
	 * @param {BomChangeEdit} the edit to attach to the payload
	 */
	static attachFieldEditToPayload(payload, edit) {
		let fieldSemantics = edit.targetFieldData.getFieldSemantics();
		if (fieldSemantics === BomUIFieldSemantics.QUANTITY) {
			payload.quantity = edit.currentValue;
		} else if (fieldSemantics === BomUIFieldSemantics.PINNING) {
			payload.isPinned = (edit.currentValue === 'true' ? true : false);
			if (edit.currentRevision) {
				payload.item = edit.currentRevision.version.item;
			} else {
				payload.item = edit.targetItem;
			}
		} else if (fieldSemantics === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
			payload.itemNumber = edit.currentValue.itemNumber;
		} else {
			payload.fields.push(edit.payloadForm());
		}
	}

	/**
	 * @ngdoc method
	 * @name Services.BomChangePayloadBuilder#attachFieldEditsToPayload
	 * @methodOf Services.BomChangePayloadBuilder
	 * @description Applies any BomFieldEdits in changes to the payload object
	 * @param {Map} changes a map of changestypes to arrays of changes
	 * @param {Object} payload an object on which to place the changes
	 */
	static attachFieldEditsToPayload(changes, payload) {
		let edits = changes.get(BomChangeTypes.FIELDEDIT);

		payload.fields = [];

		edits.forEach((edit) => {
			this.attachFieldEditToPayload(payload, edit);
		});
	}

	/**
	 * @ngdoc method
	 * @name Services.BomChangePayloadBuilder#convertChangesToEditPayload
	 * @methodOf Services.BomChangePayloadBuilder
	 * @description Converts a collection of changes into a form suitable for using in a patch
	 * @param {Map} a map of changestypes to arrays of changes - we assume that there will be at least one change under
	 *	the 'BomFieldEdit' key
	 *
	 * @return {Object} an object suitable for use in a payload
	 */
	static convertChangesToEditPayload(changes) {
		let payload = {};
		this.attachFieldEditsToPayload(changes, payload);

		return payload;
	}

	/**
	 * @ngdoc method
	 * @name Services.BomChangePayloadBuilder#convertChangesToAddPayload
	 * @methodOf Services.BomChangePayloadBuilder
	 * @description Converts a collection of changes into a form suitable for using in a post
	 *	CUSTOM_BOM fields are placed in a fields array,
	 *		while quantity, pinning, and item number are placed directly on the object
	 * @param {Map} a map of changestypes to arrays of changes - we assume that there will be one change under
	 *	the 'BomAddItem' key and potentially multiple changes under the 'BomFieldEdit' key
	 *
	 * @returns {Object} the object with some of the following parameters
	 */
	static convertChangesToAddPayload(changes) {
		let addChange = changes.get(BomChangeTypes.ADDITEM)[0];

		let payload = addChange.itemJSON;

		// Add the generated itemNumber of the correspondingRow,
		//	 since the generated value is not be considered a 'change'
		//		for the purposes of the ui
		// This will be overwritten by attachFieldEditsToPayload if there is a change
		payload.itemNumber = addChange.correspondingRow.itemNumber;

		if (changes.has(BomChangeTypes.FIELDEDIT) && changes.get(BomChangeTypes.FIELDEDIT).length > 0) {
			this.attachFieldEditsToPayload(changes, payload);
		}

		return payload;
	}
}

export default BomChangePayloadBuilder;
