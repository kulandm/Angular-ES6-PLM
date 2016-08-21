import BomChangeTypes from 'com/autodesk/models/bomEdit/bomChangeTypes.js';
import AbstractChange from 'com/autodesk/models/editTracker/abstractChange.model.js';

/**
 * @ngdoc object
 * @name Models.BomChangeAdd
 * @description A change that adds an item to the bom
 *	Currently unimplemented
 */
class BomChangeAdd extends AbstractChange {

	/**
	 * @ngdoc method
	 * @name Models.BomChangeAdd#constructor
	 * @methodOf Models.BomChangeAdd
	 * @description Contructor
	 * @param {Object} args Arguments for the change
	 *		ref: The reference to the item
	 */
	constructor(args) {
		super(args);
		this.changeType = BomChangeTypes.ADDITEM;
		this.edgeId = `Temp${args.ref.getItemId()}`;
		this.itemJSON = args.ref.json;
		this.correspondingRow = {};
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeAdd#targetSameItemAddition
	 * @methodOf Models.BomChangeAdd
	 * @description checks to see if we are trying to add the same item again
	 * @return {Boolean} true if the change is already in the queue
	 */
	targetsSameItemAddition(change) {
		return this.itemJSON.urn === change.itemJSON.urn;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeAdd#getTempEdgeID
	 * @methodOf Models.BomChangeAdd
	 * @description returns the temporary edge ID of the add
	 * @return {String} representing a temporary edgeID of the add object
	 */
	getEdgeId(change) {
		return this.edgeId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeAdd#getItemJson
	 * @methodOf Models.BomChangeAdd
	 * @description returns the temporary edge ID of the add
	 * @return {Obj} returns an object respresenting the ChangeAdd Object
	 */
	getItemJson() {
		return this.itemJSON;
	}
}

export default BomChangeAdd;
