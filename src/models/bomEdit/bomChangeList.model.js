import BomChangeTypes from 'com/autodesk/models/bomEdit/bomChangeTypes.js';
import BomChangeCompiled from 'com/autodesk/models/bomEdit/bomChangeCompiled.model.js';
import AbstractChangeList from 'com/autodesk/models/editTracker/abstractChangeList.model.js';
import BomChangeListTypes from 'com/autodesk/models/bomEdit/bomChangeListTypes.js';

/**
 * @ngdoc object
 * @name Models.BomChangeList
 * @description A list of changes to the bom
 */
class BomChangeList extends AbstractChangeList {

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#constructor
	 * @methodOf Models.BomChangeList
	 * @description Prepare the list
	 */
	constructor(edgeId) {

		super();

		/**
		 * @ngdoc property
		 * @name Models.BomChangeList#BomChangeListTypes
		 * @propertyOf Models.BomChangeList
		 * @description Enum of possible changelist types
		 */
		this.BomChangeListTypes = BomChangeListTypes;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeList#BomChangeTypes
		 * @propertyOf Models.BomChangeList
		 * @description Enum of possible change types
		 */
		this.BomChangeTypes = BomChangeTypes;

		/**
		 * @ngdoc property
		 * @name Models.BomChangeList#edgeId
		 * @propertyOf Models.BomChangeList
		 * @description The edge to which this changelist corresponds
		 */
		this.edgeId = edgeId;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#acceptanceFunction
	 * @methodOf Models.BomChangeList
	 * @description returns true if the change should be accepted
	 */
	acceptanceFunction(newChange) {
		return super.acceptanceFunction(newChange) && true;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#acceptEditChange
	 * @methodOf Models.BomChangeList
	 * @description remove any previous edits that target the same field
	 *		then, if the new change actually changes the value of the field, keep it
	 * @param {AbstractChange} newChange the change to add
	 */
	acceptEditChange(newChange) {
		let list = this.changes.get(newChange.changeType);

		let filteredList = list.filter((oldChange) => {
			return !newChange.targetsSameField(oldChange);
		});

		if (!newChange.isRevertingChange()) {
			filteredList.push(newChange);
		}

		this.changes.set(newChange.changeType, filteredList);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#acceptRemoveChange
	 * @methodOf Models.BomChangeList
	 * @description Adds a remove change to the list, overwritng any pervious remove changes
	 * @param {AbstractChange} newChange the change to add
	 */
	acceptRemoveChange(newChange) {
		this.changes.set(newChange.changeType, [newChange]);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#acceptChange
	 * @methodOf Models.BomChangeList
	 * @description adds the change to its respective list, which is guarenteed to exist
	 * @param {AbstractChange} newChange the change to add
	 */
	acceptChange(newChange) {
		if (newChange.changeType === this.BomChangeTypes.FIELDEDIT) {
			this.acceptEditChange(newChange);
		} else if (newChange.changeType === this.BomChangeTypes.REMOVEITEM) {
			this.acceptRemoveChange(newChange);
		} else {
			this.changes.get(newChange.changeType).push(newChange);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#getChangeType
	 * @methodOf Models.BomChangeList
	 * @description Returns the changeListType of this changeList represents (see BomChangeListTypes)
	 * @returns {BomChangeListTypes} the state of the change list
	 */
	getChangeType() {
		if (this.changes.has(this.BomChangeTypes.REMOVEITEM) && this.changes.get(this.BomChangeTypes.REMOVEITEM).length > 0) {
			return this.BomChangeListTypes.REMOVE;
		} else if (this.changes.has(this.BomChangeTypes.ADDITEM) && this.changes.get(this.BomChangeTypes.ADDITEM).length > 0) {
			return this.BomChangeListTypes.ADD;
		} else if (this.changes.has(this.BomChangeTypes.FIELDEDIT) && this.changes.get(this.BomChangeTypes.FIELDEDIT).length > 0) {
			return this.BomChangeListTypes.EDIT;
		} else {
			return this.BomChangeListTypes.NOCHANGE;
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#getEditState
	 * @methodOf Models.BomChangeList
	 * @description Returns the state of this changeList as an object with two properties:
	 *	changeType: the type of change this changeList represents  (see BomChangeListTypes)
	 *	isInvalid: boolean indicating whether the change has been marked invalid
	 * @returns {Object} the state of the change list
	 */
	getEditState() {
		let changeType = this.getChangeType();

		let isInvalid = false;
		if (changeType === this.BomChangeListTypes.REMOVE) {
			isInvalid = this.hasInvalidChange(this.changes.get(this.BomChangeTypes.REMOVEITEM));
		} else if (changeType === this.BomChangeListTypes.ADD) {
			isInvalid = this.hasInvalidChange(this.changes.get(this.BomChangeTypes.ADDITEM)) || this.hasInvalidChange(this.changes.get(this.BomChangeTypes.FIELDEDIT));
		} else if (changeType === this.BomChangeListTypes.EDIT) {
			isInvalid = this.hasInvalidChange(this.changes.get(this.BomChangeTypes.FIELDEDIT));
		}

		return {
			changeType: changeType,
			isInvalid: isInvalid
		};
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#hasInvalidChange
	 * @methodOf Models.BomChangeList
	 * @description Determines if any of the provided changes are invalid
	 * @param {Array} changeList an array of changes
	 */
	hasInvalidChange(changeList = []) {
		return _.some(changeList, (change) => {
			return change.isInvalid();
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomChangeList#compilationFunction
	 * @methodOf Models.BomChangeList
	 * @description Compiles the map of changes
	 *
	 * @returns {BomChangeCompiled} the compiled changed
	 */
	compilationFunction() {
		let changeType = this.getChangeType();

		if (changeType !== this.BomChangeListTypes.NOCHANGE) {
			return new BomChangeCompiled(changeType, this.edgeId, this.changes);
		}

		return null;
	}
}

export default BomChangeList;
