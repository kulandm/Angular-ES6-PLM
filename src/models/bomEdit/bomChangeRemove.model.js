import BomChangeTypes from 'com/autodesk/models/bomEdit/bomChangeTypes.js';
import AbstractChange from 'com/autodesk/models/editTracker/abstractChange.model.js';

/**
 * @ngdoc object
 * @name Models.BomChangeRemove
 * @description A change that removes an item to the bom
 *	Currently unimplemented
 */
class BomChangeRemove extends AbstractChange {

	/**
	 * @ngdoc method
	 * @name Models.BomChangeRemove#constructor
	 * @methodOf Models.BomChangeRemove
	 * @description Instance constructor
	 */
	constructor(args) {
		super(args);

		this.changeType = BomChangeTypes.REMOVEITEM;

		/**
		 * @ngdoc method
		 * @name Models.BomChangeRemove#edgeId
		 * @methodOf Models.BomChangeRemove
		 * @description The id of the edge to remove
		 */
		this.edgeId = args.edgeId;
	}
}

export default BomChangeRemove;
