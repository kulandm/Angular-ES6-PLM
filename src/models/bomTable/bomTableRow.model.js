import BomPath from './bomPath.model.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Models.BomTableRow
 * @description Class defining the interface for bom table rows
 */
class BomTableRow {

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#constructor
	 * @methodOf Models.BomTableRow
	 * @description initializes the Bom Table Row properties
	 */
	constructor(args = {}) {

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#isExpandable
		 * @propertyOf Models.BomTableRow
		 * @description boolean to determine if the row is expandable
		 */
		this.isExpandable = (typeof args.isExpandable === 'undefined') ? true : args.isExpandable;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#isCollapsed
		 * @propertyOf Models.BomTableRow
		 * @description boolean to determine if the row is collapsed or not
		 */
		this.isCollapsed = (typeof args.isCollapsed === 'undefined') ? true : args.isCollapsed;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#hasFetchedChildren
		 * @propertyOf Models.BomTableRow
		 * @description boolean to determine if the row's children have been fetched
		 */
		this.hasFetchedChildren = (typeof args.hasFetchedChildren === 'undefined') ? false : args.hasFetchedChildren;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#path
		 * @propertyOf Models.BomTableRow
		 * @description The array of edges that leads to the row,
		 *	starting with the root as null
		 */
		this.path = (typeof args.path === 'undefined') ? BomPath.EmptyPath() : args.path;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#depth
		 * @propertyOf Models.BomTableRow
		 * @description The depth of the row
		 */
		this.depth = this.path.edges.length;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#$$treeLevel
		 * @propertyOf Models.BomTableRow
		 * @description The depth of the row
		 */
		this.$$treeLevel = this.path.edges.length;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#item
		 * @propertyOf Models.BomTableRow
		 * @description item information for this row
		 */
		this.item = (typeof args.item === 'undefined') ? null : args.item;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#itemNumber
		 * @propertyOf Models.BomTableRow
		 * @description Item number in relation to siblings
		 */
		this.itemNumber = (typeof args.itemNumber === 'undefined') ? 0 : args.itemNumber;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#displayProperties
		 * @propertyOf Models.BomTableRow
		 * @description Properties we are going to display in the table
		 *	NOTE: Although UI-Grid purports to support arbitrary angular expressions for cell lookup,
		 *		It doesn't appear to like anything but plain object property accessing,
		 *		So display properties have to be stored as keys of an object, instead of entries in a Map
		 */
		this.displayProperties = (typeof args.displayProperties === 'undefined') ? {} : args.displayProperties;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#edgeId
		 * @propertyOf Models.BomTableRow
		 * @description Id of the edge that was used to populate this row
		 */
		this.edgeId = (typeof args.edgeId === 'undefined') ? null : args.edgeId;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#nodeId
		 * @propertyOf Models.BomTableRow
		 * @description Id of the node that was used to populate this row
		 */
		this.nodeId = (typeof args.nodeId === 'undefined') ? null : args.nodeId;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#rowId
		 * @propertyOf Models.BomTableRow
		 * @description id that identifes this row in a table
		 */
		this.rowId = `${this.depth}.${this.itemNumber}`;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#clickHandler
		 * @propertyOf Models.BomTableRow
		 * @description handler function triggered on click
		 */
		this.clickHandler = (typeof args.clickHandler === 'undefined') ? null : args.clickHandler;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#isChecked
		 * @propertyOf Models.BomTableRow
		 * @description boolean to determine if the row is checked
		 */
		this.isChecked = (typeof args.isChecked === 'undefined') ? false : args.isChecked;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#isCheckable
		 * @propertyOf Models.BomTableRow
		 * @description boolean to determine if the row should be checkable
		 */
		this.isCheckable = this.depth === 1;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#isNewlyAdded
		 * @propertyOf Models.BomTableRow
		 * @description boolean to determine if the row was newly added
		 *	and does not yet have a bomId on the server
		 */
		this.isNewlyAdded = (typeof args.isNewlyAdded === 'undefined') ? false : args.isNewlyAdded;

		/**
		 * @name Models.BomTableRow#addOrder
		 * @propertyOf Models.BomTableRow
		 * @description This will be used to keep track of the order in which new
		 * rows get added to the bom.
		 */
		this.addOrder = (typeof args.addOrder === 'undefined') ? null : args.addOrder;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#rowErrors
		 * @propertyOf Models.BomTableRow
		 * @description list of errors associated with the row
		 */
		this.rowErrors = (typeof args.rowErrors === 'undefined') ? [] : args.rowErrors;

		/**
		 * @ngdoc property
		 * @name Models.BomTableRow#hasFieldErrors
		 * @propertyOf Models.BomTableRow
		 * @description Cache of fields that currently have errors associated with them
		 *	Cached because hasErrors is called every digest cycle for every visible row,
		 *		and traversing all the fields is relatively expensive.
		 */
		this.fieldsWithErrors = new Set();
		this.processFields();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#getFields
	 * @methodOf Models.BomTableRow
	 * @description Returns an array of the row's fields
	 *	NOTE: This is relatively slow, because we call Object.keys to enumerate the display properties
	 *
	 * @returns {Array} An array of BomFieldData instances in the row
	 */
	getFields() {
		return Object.keys(this.displayProperties).map((key) => {
			return this.displayProperties[key];
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#processFields
	 * @methodOf Models.BomTableRow
	 * @description Updates the row's properties by analyzing its fields
	 *	Currently used to keep a cached list of fields with errors, so that we don't need to reenumerate every time
	 */
	processFields() {
		this.getFields().forEach((field) => {
			if (field.serverError) {
				this.fieldsWithErrors.add(field);
			} else {
				this.fieldsWithErrors.delete(field);
			}
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#clearRowErrors
	 * @methodOf Models.BomTableRow
	 * @description Removes any row level errors
	 */
	clearRowErrors() {
		this.rowErrors = [];
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#addRowErrors
	 * @methodOf Models.BomTableRow
	 * @description Updates the row with errors
	 * @param {Array} errors An array of row level errors
	 */
	addRowErrors(errors) {
		this.rowErrors = this.rowErrors.concat(errors);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#hasErrors
	 * @methodOf Models.BomTableRow
	 * @description Determines if the row contains errors or not
	 *
	 * @returns {Boolean} True if there are errors associated with the row or its fields
	 */
	hasErrors() {
		return (this.rowErrors.length > 0) || (this.fieldsWithErrors.size > 0);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#getFieldWithSemantics
	 * @methodOf Models.BomTableRow
	 * @description Returns the field that has the given semantics
	 *	Currently we assume that only one field will exist with the given semantics.
	 *		This will need to be changed if we get multiple fields with the same semantics
	 * @param {BomUIFieldSemantics} semantics The semantics of the field
	 *
	 * @returns {BomFIeldData} the data corresponding to the revision field, or null if the field is not found
	 */
	getFieldWithSemantics(semantics) {
		let found = this.getFields().filter((field) => {
			return field.getFieldSemantics() === semantics;
		});

		if (found.length > 0) {
			return found[0];
		}

		return null;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#hasLoadedRevisions
	 * @methodOf Models.BomTableRow
	 * @description Returns true if the row has a revision field that has loaded options
	 *	Revision.options may be undefined (if it were never set)
	 *	or it may be null if it were initialized and not set during the construction of the field
	 *		Otherwise, it will be an array, which is coerced to true
	 *
	 * @returns {Boolean} true if there is a revision field and it has some revisions associated with it
	 */
	hasLoadedRevisions() {
		let revisionField = this.getFieldWithSemantics(BomUIFieldSemantics.REVISION);

		return (revisionField !== null) && Boolean(revisionField.options);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTableRow#updateRevisionField
	 * @methodOf Models.BomTableRow
	 * @description Adds the needed revision as options
	 *	for the revisions column (if it is available)
	 * @param {Array} versions A list of revisions
	 */
	updateRevisionField(versions) {
		let revisionField = this.getFieldWithSemantics(BomUIFieldSemantics.REVISION);
		if (revisionField) {
			revisionField.options = versions.map((version) => {
				let option = {
					title: version.version,
					version: version
				};

				// Update the value with the correct revision information
				if (option.title === revisionField.value.title) {
					revisionField.value = option;
				}

				return option;
			});
		}
	}
}

export default BomTableRow;
