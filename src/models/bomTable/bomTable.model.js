import BomChangeListTypes from 'com/autodesk/models/bomEdit/bomChangeListTypes.js';
import BomChangeTypes from 'com/autodesk/models/bomEdit/bomChangeTypes.js';
import BomChangeList from 'com/autodesk/models/bomEdit/bomChangeList.model.js';
import ChangeListHolder from 'com/autodesk/models/editTracker/changeListHolder.model.js';
import BomChangeAdd from 'com/autodesk/models/bomEdit/bomChangeAdd.model.js';
import BomChangeEdit from 'com/autodesk/models/bomEdit/bomChangeEdit.model.js';
import BomChangePinningEdit from 'com/autodesk/models/bomEdit/bomChangePinningEdit.model.js';
import BomChangeRemove from 'com/autodesk/models/bomEdit/bomChangeRemove.model.js';
import BomTableRow from 'com/autodesk/models/bomTable/bomTableRow.model.js';
import BomPath from 'com/autodesk/models/bomTable/bomPath.model.js';
import BomUIFieldSemantics from 'com/autodesk/models/bomFields/BomUIFieldSemantics.service.js';

/**
 * @ngdoc object
 * @name Models.BomTable
 * @description Class intended to be displayed on the bom view
 */
class BomTable {

	/**
	 * @ngdoc method
	 * @name Models.BomTable#constructor
	 * @methodOf Models.BomTable
	 * @description Constructor for Bom Table
	 * Ensures Bom Row ID column is set first and handles defaults otherwise
	 * @param {Object} args Object containing the following properties
	 *                      - columns, rows, rowsInTable
	 */
	constructor(args = {}) {

		/**
		 * @ngdoc property
		 * @name Models.BomTable#columns
		 * @propertyOf Models.BomTable
		 * @description Columns Collection to display in the table
		 */
		this.columns = [];
		this.initColumns((angular.isUndefined(args.columns)) ? [] : args.columns);

		/**
		 * @ngdoc property
		 * @name Models.BomTable#rowIdColumn
		 * @propertyOf Models.BomTable
		 * @description Rows Collection to display in the table
		 */
		this.rows = (angular.isUndefined(args.rows)) ? [] : args.rows;

		/**
		 * @ngdoc property
		 * @name Models.BomTable#rowIdColumn
		 * @propertyOf Models.BomTable
		 * @description Set tracking the rows we have created already
		 *	as a set of paths represented as strings (since we can't key on arrays)
		 */
		this.rowsInTable = (angular.isUndefined(args.rowsInTable)) ? new Set() : args.rowsInTable;

		/**
		 * @ngdoc property
		 * @name Models.BomTable#changeTracker
		 * @propertyOf Models.BomTable
		 * @description Tracker to track edits, adds, and removes while in edit mode
		 */
		this.changeTracker = new ChangeListHolder(BomChangeList);

		/**
		 * @ngdoc property
		 * @name Models.BomTable#maxFirstLevelItemNumber
		 * @propertyOf Models.BomTable
		 * @description The maximum item number of the first level rows of Table
		 */
		this.maxFirstLevelItemNumber = (angular.isDefined(args.maxFirstLevelItemNumber)) ? args.maxFirstLevelItemNumber : null;

		/**
		 * @ngdoc property
		 * @name Models.BomTable#edgesToItemNumbers
		 * @propertyOf Models.BomTable
		 * @description Map of edges to their item numbers (as numbers), so we can sort by them
		 *	We need this because although rows store thier itemNumber, they don't store their parents item numbers,
		 *		and we can't order two paths (which may be significantly different) without that
		 */
		this.edgesToItemNumbers = (angular.isUndefined(args.edgesToItemNumbers)) ? new Map() : args.edgesToItemNumbers;

		/**
		 * @ngdoc property
		 * @name Models.BomTable#edgesToFirstLevelItemNumbers
		 * @propertyOf Models.BomTable
		 * @description This will contain all the first level item numbers .At any given
		 * state of the bom this will contain the top level item numbers that are currenly
		 * shown in the table. This will significantly reduce the number of elements we have
		 * to visit in order to update the current maximum item number. Also This will help us
		 * not re-order the bom table when an edit happens to the item number of an existing row.
		 */
		this.edgesToFirstLevelItemNumbers = (angular.isUndefined(args.edgesToFirstLevelItemNumbers)) ? new Map() : args.edgesToFirstLevelItemNumbers;

		/**
		 * @ngdoc property
		 * @name Models.BomTable#currentAddOrder
		 * @propertyOf Models.BomTable
		 * @description The order in which rows gets added to the table. We use this
		 * order in the `bomRowCompare` method to keep the newly added row always at
		 * the end of the table.
		 */
		this.currentAddOrder = (angular.isUndefined(args.currentAddOrder)) ? 0 : args.currentAddOrder;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#initColumns
	 * @methodOf Models.BomTable
	 * @description Initializes the columns array with the default columns
	 */
	initColumns(columns) {
		this.columns = [
			BomTable.BomTableColumnBuilder.buildEditIndicatorColumn(),
			BomTable.BomTableColumnBuilder.buildRowSelectorColumn(),
			BomTable.BomTableColumnBuilder.buildRowIdColumn()
		];

		if (columns.length > 0) {
			this.columns = this.columns.concat(columns);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#clear
	 * @methodOf Models.BomTable
	 * @description Clears the bom table properties in a way that maintains dual bindings
	 */
	clear() {
		this.columns.splice(0, this.columns.length);
		this.initColumns([]);
		this.rows.splice(0, this.rows.length);
		this.rowsInTable.clear();
		this.edgesToItemNumbers.clear();
		this.changeTracker.clear();
		this.maxFirstLevelItemNumber = null;
		this.edgesToFirstLevelItemNumbers.clear();
		this.currentAddOrder = 0;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#addBomRow
	 * @methodOf Models.BomTable
	 * @description Adds a bom row to the table if its not already in the collection of rows (based on Bom Row ID)
	 *
	 * @param {BomTableRow} BomTableRow to add to the table's list of rows
	 */
	addBomRow(bomTableRow) {
		if (!this.rowExists(bomTableRow.path)) {

			if (bomTableRow.depth === 1) {
				this.maxFirstLevelItemNumber = Math.max(this.maxFirstLevelItemNumber, bomTableRow.itemNumber);
			}

			this.rowsInTable.add(bomTableRow.path.asString());
			this.rows.push(bomTableRow);

			if (!this.edgesToItemNumbers.has(bomTableRow.edgeId)) {
				this.storeItemNumber(bomTableRow.edgeId, bomTableRow.itemNumber, bomTableRow.depth);
			}

			if (bomTableRow.isNewlyAdded) {
				this.currentAddOrder = this.currentAddOrder + 1;
			}
			this.rows.sort(this.bomRowCompare.bind(this));
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#rowExists
	 * @methodOf Models.BomTable
	 * @description Returns true if a row with the specified path exists
	 *
	 * @param {BomPath} Path to check
	 */
	rowExists(path) {
		return this.rowsInTable.has(path.asString());
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#getRowForPath
	 * @methodOf Models.BomTable
	 * @description Returns the row corresponding to the provided path
	 *	If the row is not found in the table, returns null
	 *		This can happen if the row has been deleted on the server but there are lingering references to it
	 *			on the client
	 * @param {BomPath} Path to check
	 *
	 * @returns {BomTableRow} the row corresponding to path, or null if the row is not in table
	 */
	getRowForPath(path) {
		for (let i = 0; i < this.rows.length; ++i) {
			if (this.rows[i].path.equals(path)) {
				return this.rows[i];
			}
		}
		return null;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#addColumn
	 * @methodOf Models.BomTable
	 * @description Adds a column to the table's collection of columns
	 * @param {BomTableColumn} BomTableColumn to add to the table's list of columns
	 */
	addColumn(column) {
		this.columns.push(column);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#addColumnsForViewDefinition
	 * @methodOf Models.BomTable
	 * @description Adds all the columns needed for displaying a given view definition
	 * @param {ViewDefinition} viewDef View defintion to provided the columns
	 */
	addColumnsForViewDefinition(viewDef) {
		let viewDefColumns = viewDef.getFields().map((viewDefField) => {
			return BomTable.BomTableColumnBuilder.buildColumnForViewDefField(viewDefField);
		});

		this.initColumns(viewDefColumns);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#bomRowCompare
	 * @methodOf Models.BomTable
	 * @description Comparitor function used for sorting BomRows
	 * NOTE: For the comparison to succeed, all edges in each path must have been
	 * previously added to the table
	 *
	 * @param {object} `thisRow` first row to compare
	 * @param {object} `thatRow` second row to compare against
	 *
	 * @returns {Number} greater than 0 if (thisRow > thatRow), 0 if
	 * (thisRow === thatRow), less than 0 if (thisRow < thatRow).
	 */
	bomRowCompare(thisRow, thatRow) {
		let thisRowPath = thisRow.path;
		let thatRowPath = thatRow.path;
		let shortestPath = (thisRowPath.edges.length < thatRowPath.edges.length) ? thisRowPath : thatRowPath;
		let shortestPathLength = shortestPath.edges.length;

		for (let i = 0; i < shortestPathLength; ++i) {
			let thisEdge = thisRowPath.edges[i];
			let thatEdge = thatRowPath.edges[i];

			if (thisEdge === thatEdge) {
				continue;
			}

			// This will ensure that the newly added rows maintain a consistent order
			// they will always appear at the end of the list.
			if (thisRow.isNewlyAdded) {
				if (thatRow.isNewlyAdded) {
					return thisRow.addOrder - thatRow.addOrder;
				}	else {
					return 1;
				}
			} else {
				if (thatRow.isNewlyAdded) {
					return -1;
				} else {
					let thisEdgeItemNumber = this.edgesToItemNumbers.get(thisEdge);
					let thatEdgeItemNumber = this.edgesToItemNumbers.get(thatEdge);

					// Maintain a consistent order if the item numbers are the same
					//	by comparing the edge id strings
					if (thisEdgeItemNumber === thatEdgeItemNumber) {
						return (thisEdge < thatEdge) ? -1 : 1;
					} else {
						return thisEdgeItemNumber - thatEdgeItemNumber;
					}
				}
				}
			}
			// Paths are equivalent, or one is a subset of the other
			return thisRowPath.edges.length - thatRowPath.edges.length;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#handleEdit
	 * @methodOf Models.BomTable
	 * @description Adds an edit to the change tracker for the specific edge/field
	 *
	 * @param {String} editedEdge the edge which has been edited
	 * @param {BomField} editedField the field definition for the field that has been edited
	 */
	handleEdit(editedEdge, editedField) {
		if (editedField.getFieldSemantics() === BomUIFieldSemantics.REVISION) {
			this.handleRevisionEdit(editedEdge, editedField);
		} else if (editedField.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
			this.handlePinningEdit(editedEdge, editedField);
		} else {
			this.handleStandardEdit(editedEdge, editedField);
			if (editedField.getFieldSemantics() === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
				this.recalculateMaxItemNumber(editedEdge, editedField.value.itemNumber, BomChangeListTypes.EDIT);
			}
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#handleEdit
	 * @methodOf Models.BomTable
	 * @description Adds an edit to the change tracker for the specific edge/field
	 *	Given that that edit needs no extra handling
	 *
	 * @param {String} editedEdge the edge which has been edited
	 * @param {BomField} editedField the field definition for the field that has been edited
	 */
	handleStandardEdit(editedEdge, editedField) {
		let newChange = new BomChangeEdit({
			edgeId: editedEdge,
			targetFieldData: editedField,
			currentValue: editedField.getValue(),
			serverError: editedField.serverError
		});

		this.changeTracker.tryAddChange(editedEdge, newChange);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#handlePinningEdit
	 * @methodOf Models.BomTable
	 * @description Adds an edit to the change tracker for the pinning icon being toggled
	 *	Updates the revision dropdown accordingly
	 *
	 * @param {String} editedEdge the edge which has been edited
	 * @param {BomField} editedField the field definition for the field that has been edited
	 */
	handlePinningEdit(editedEdge, editedField) {
		let editedRow = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(editedEdge));

		// If there is a revision column, use that
		//	Otherwise, use the current item directly if available
		//	Otherwise, do nothing
		if (editedRow.hasLoadedRevisions() || editedRow.item) {
			let newChange;
			if (editedRow.hasLoadedRevisions()) {
				let revisionField = editedRow.getFieldWithSemantics(BomUIFieldSemantics.REVISION);
				// If the change is an unpinning, revert the revision column to the latest revision
				if (editedField.getValue() === 'false') {
					let latestRevision = revisionField.options.concat().sort((a, b) => {
						return a.version.versionNumber - b.version.versionNumber;
					}).pop();
					revisionField.updateValue(latestRevision);
				}

				newChange = new BomChangePinningEdit({
					edgeId: editedEdge,
					targetFieldData: editedField,
					currentValue: editedField.getValue(),
					serverError: editedField.serverError,
					revisionField: revisionField,
					currentRevision: revisionField.getValue()
				});
			} else if (editedRow.item) {
				newChange = new BomChangePinningEdit({
					edgeId: editedEdge,
					targetFieldData: editedField,
					currentValue: editedField.getValue(),
					serverError: editedField.serverError,
					targetItem: editedRow.item
				});
			}

			this.changeTracker.tryAddChange(editedEdge, newChange);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#handleRevisionEdit
	 * @methodOf Models.BomTable
	 * @description Adds an edit to the change tracker for the revision dropdown being changed
	 *	Automatically sets the pinning icon to true if the field has been changed
	 *	The created change actually targets the pinning field,
	 *		with the revision field as added information
	 *
	 * @param {String} editedEdge the edge which has been edited
	 * @param {BomField} editedField the field definition for the field that has been edited
	 */
	handleRevisionEdit(editedEdge, editedField) {
		let editedRow = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(editedEdge));

		// Currently, we do not handle the case where there is no pinning column in the view
		let pinningField = editedRow.getFieldWithSemantics(BomUIFieldSemantics.PINNING);
		if (pinningField) {
			if (editedField.isDirty()) {
				pinningField.updateValue('true');
			}

			let newChange = new BomChangePinningEdit({
				edgeId: editedEdge,
				targetFieldData: pinningField,
				currentValue: pinningField.getValue(),
				serverError: editedField.serverError,
				revisionField: editedField,
				currentRevision: editedField.getValue()
			});

			this.changeTracker.tryAddChange(editedEdge, newChange);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#handleRemove
	 * @methodOf Models.BomTable
	 * @description Adds an remove request to the change tracker for the specific edge
	 * if the row referenced by `edgeId` is a newly added one then removes it from
	 * from the table. If the row has any edits to it then gets rid of them as well.
	 *
	 * @param {String} edgeId the edgeId of the row to remove
	 */
	handleRemove(edgeId) {
	  if (this.changeTracker.hasChangeList(edgeId)) {
	    this.revertChange(edgeId);
	  }

	  if (this.rowExists(BomPath.EmptyPath().WithSucceedingEdge(edgeId))) {
	    let newChange = new BomChangeRemove({
	      edgeId: edgeId
	    });

	    if (this.changeTracker.tryAddChange(edgeId, newChange)) {
	      let itemNumber = this.edgesToFirstLevelItemNumbers.get(edgeId);

	      this.recalculateMaxItemNumber(edgeId, itemNumber, BomChangeListTypes.REMOVE);
	    }
	  }
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#queueSelectedRowsForRemoval
	 * @methodOf Models.BomTable
	 * @description Queue the removal of all rows that have been checked
	 *		Then remove their checked status
	 */
	queueSelectedRowsForRemoval() {
		this.getCheckedRows().forEach((row) => {
			this.handleRemove(row.edgeId);
			row.isChecked = false;
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#buildDisplayProperties
	 * @methodOf Models.BomTable
	 * @description builds a display property from view definition
	 *
	 * @param {Object} `viewDef` Containing all the view definition
	 * @param {Object} `change` Represents a `BomChangeAdd` object
	 *
	 * @returns {Object} representing the display properties for a row.
	 */
	buildDisplayProperties(viewDef, change) {
		let displayProperties = {};
		viewDef.getFields().forEach((viewDefField) => {
			let bomField = BomTable.BomField.FromViewDefField(viewDefField);

			if (bomField.getFieldSemantics() === BomUIFieldSemantics.DESCRIPTOR) {
				bomField.value = `${change.itemJSON.item.title} ${change.itemJSON.item.version}`;
			}

			let fieldData = BomTable.BomFieldData.fromField(bomField);
			displayProperties[fieldData.getFieldId()] = fieldData;
		});

		return displayProperties;
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#buildRow
	 * @methodOf Models.BomTable
	 * @description builds a  `BomTableRow` using the view fields and the
	 * `BomChangeAdd` object
	 *
	 * @param {Object} `viewDef` Containing all the view definition fields.
	 * @param {Object} `change` Represents a `BomChangeAdd` object.
	 *
	 * @returns {Object} a bomTableRow.
	 */
	buildRow(viewDef, change) {
		let bomTableRow = {};

		bomTableRow.item = change.itemJSON.item;
		bomTableRow.displayProperties = this.buildDisplayProperties(viewDef, change);

		bomTableRow.edgeId = change.getEdgeId();
		bomTableRow.isNewlyAdded = true;
		bomTableRow.itemNumber = this.getItemNumberForNewRow();
		bomTableRow.isExpandable = false;
		bomTableRow.addOrder = this.currentAddOrder;
		bomTableRow.path = new BomPath({
			edges: [bomTableRow.edgeId]
		});

		// Create item number field using new item number & path
		let itemNumberField = BomTable.BomField.ItemNumberField();
		itemNumberField.value = {
			depth: bomTableRow.path.edges.length,
			itemNumber: bomTableRow.itemNumber
		};
		let itemNumberFieldData = BomTable.BomFieldData.fromField(itemNumberField);

		bomTableRow.displayProperties[itemNumberFieldData.getFieldId()] = itemNumberFieldData;

		return new BomTableRow(bomTableRow);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#queueAdds
	 * @methodOf Models.BomTable
	 * @description adds the selected item from the flyout to the changeListholder and shows the rows on the table
	 */
	queueAdds(addedItems, viewDef) {
		addedItems.forEach((item) => {
			let change = new BomChangeAdd(item);
			this.queueSingleAdd(change, viewDef);
		});
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#queueSingleAdd
	 * @methodOf Models.BomTable
	 * @description adds a single bom add change to the queue and shows a corresponding row
	 *
	 * @param {Object} change an object of type BomChangeAdd
	 * @param {object} viewDef an object containing all the fields of the current view in bom
	 */
	queueSingleAdd(change, viewDef) {
		if (!this.changeTracker.hasChangeList(change.getEdgeId())) {
			let newRow = this.buildRow(viewDef, change);

			change.correspondingRow = newRow;

			this.addAndShow(change, newRow);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#addAndShow
	 * @methodOf Models.BomTable
	 * @description Adds a row to both bom row and the changeTracker
	 * @param {Object} representing a bomChangeAdd
	 * @param {Object} Bom Table row
	 */
	addAndShow(bomChangeAdd, bomTableRow) {
		if (this.changeTracker.tryAddChange(bomChangeAdd.getEdgeId(), bomChangeAdd)) {
			this.addBomRow(bomTableRow);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#reapplyChange
	 * @methodOf Models.BomTable
	 * @description Reapplies a change provided by BomChangeList
	 * @param {Object} compiledChange The compiled object for the changes provided by BomChangeList
	 */
	reapplyChange(compiledChange) {
		if (compiledChange.changeType === BomChangeListTypes.EDIT) {
			this.reapplyEdit(compiledChange);
		} else if (compiledChange.changeType === BomChangeListTypes.ADD) {
			this.reapplyAdd(compiledChange);
		} else if (compiledChange.changeType === BomChangeListTypes.REMOVE) {
			this.reapplyRemove(compiledChange);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#reapplyRemove
	 * @methodOf Models.BomTable
	 * @description Reapplies the changes that constitute a remove action
	 * @param {Object} compiledChange The compiled object for the changes provided by BomChangeList
	 */
	reapplyRemove(compiledChange) {
		let row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(compiledChange.edgeId));
		if (row !== null) {
			this.handleRemove(compiledChange.edgeId);
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#reapplyEdit
	 * @methodOf Models.BomTable
	 * @description Reapplies the changes that constitute a edit action
	 * @param {Object} compiledChange The compiled object for the changes provided by BomChangeList
	 */
	reapplyEdit(compiledChange) {
		let row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(compiledChange.edgeId));
		if (row !== null) {
			compiledChange.drivingChanges.get(BomChangeTypes.FIELDEDIT).forEach((change) => {
				this.reapplyFieldEdit(row, change);
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#reapplyAdd
	 * @methodOf Models.BomTable
	 * @description Reapplies a change constitute an add action
	 * @param {Object} an object Representing the compiled form of BomChangeAdd
	 */
	reapplyAdd(compiledChange) {
		let actualChange = compiledChange.drivingChanges.get(BomChangeTypes.ADDITEM)[0];

		this.addAndShow(actualChange, actualChange.correspondingRow);

		if (compiledChange.drivingChanges.get(BomChangeTypes.FIELDEDIT)) {
			compiledChange.drivingChanges.get(BomChangeTypes.FIELDEDIT).forEach((editedField) => {
				this.reapplyFieldEdit(actualChange.correspondingRow, editedField);
			});
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#reapplyFieldEdit
	 * @methodOf Models.BomTable
	 * @description Reapplies an edit made to a field of a row
	 * @param {BomTableRow} row the row of the table on which the edit was made
	 * @param {BomChangeEdit} fieldEdit The edit to be reapplied
	 */
	reapplyFieldEdit(row, fieldEdit) {
		let id = fieldEdit.targetFieldData.getFieldId();

		row.displayProperties[id].updateValue(fieldEdit.currentValue);
		row.displayProperties[id].serverError = fieldEdit.serverError;

		if (fieldEdit.targetFieldData.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
			let revisionField = row.displayProperties[fieldEdit.revisionField.getFieldId()];
			if (revisionField) {
				revisionField.updateValue(fieldEdit.currentRevision);
			}
		}

		this.handleEdit(row.edgeId, row.displayProperties[id]);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#consumeErrors
	 * @methodOf Models.BomTable
	 * @description Consumes a list of errors and applies them to the specified row and its fields
	 * @param {ViewDefinition} viewDef The view in which the errors occured
	 * @param {BomChangeEdit} edgeId The edgeId of the row which errored
	 * @param {Array} errors a list of BomChangeError instances
	 */
	consumeErrors(viewDef, edgeId, errors) {
		let row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(edgeId));
		let fields = row.getFields();

		row.clearRowErrors();
		BomTable.ValidationUtil.clearValidationErrors(fields, 'serverError');

		let unconsumedErrors = BomTable.ValidationUtil.mapValidationErrors(fields, errors, {
			fieldProperty: 'serverError',
			predicate: (field, error) => {
				if (error && error.getErrorFieldId()) {
					let viewDefField = viewDef.getField(field.getFieldId());

					if (viewDefField) {
						return viewDefField.getFieldId() === error.getErrorFieldId();
					}
				}

				return false;
			}
		});

		row.addRowErrors(unconsumedErrors);
		row.processFields();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#getRowEditState
	 * @methodOf Models.BomTable
	 * @description Returns the edit state of the row
	 * @param {BomTableRow} tableRow the row of the table
	 *
	 * @returns {String} the string corresponding to the edit state
	 */
	getRowEditState(tableRow) {
		if (this.changeTracker.hasChangeList(tableRow.edgeId)) {
			return this.changeTracker.getChangeList(tableRow.edgeId).getEditState();
		} else {
			return {
				changeType: null,
				isInvalid: false
			};
		}
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#isRowInvalid
	 * @methodOf Models.BomTable
	 * @description Returns true if a change was made to the row that makes it invalid
	 *	for saving
	 * @param {BomTableRow} tableRow the row of the table
	 *
	 * @returns {Boolean} true if the row is invalid
	 */
	isRowInvalid(tableRow) {
		return tableRow.hasErrors();
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#isRowDirty
	 * @methodOf Models.BomTable
	 * @description Returns true if a change was made to the Row
	 *	and that change has not been marked invalid
	 * @param {BomTableRow} tableRow the row of the table
	 *
	 * @returns {Boolean} true if the row has changed and is not invalid
	 */
	isRowDirty(tableRow) {
		let editState = this.getRowEditState(tableRow);
		return (!editState.isInvalid) &&
			(editState.changeType !== null) &&
			(editState.changeType !== BomChangeListTypes.NOCHANGE);
	}

	/**
	 * @ngdoc method
	 * @name Models.BomTable#getItemNumberForNewRow
	 * @methodOf Controllers.workspaceItem.ViewBomController
	 * @description get the maximum item number of all the first level children on the bom
	 *
	 * @return {Number} representing an item number for a new row to be added to the BOM.
	 */
	getItemNumberForNewRow() {
		let defaultItemNumber = 1;
		if (!this.maxFirstLevelItemNumber) {
			return defaultItemNumber;
		} else {
			return this.maxFirstLevelItemNumber + 1;
		}
	}

	/**
	 * @name Models.BomTable#getCheckedRows
	 * @methodOf Models.BomTable
	 * @description Returns a list of all checked rows
	 * @returns {Array} An array of BomTableRow objects that are checked
	 */
	getCheckedRows() {
		return this.rows.filter((row) => {
			return row.isChecked;
		});
	}

	/**
	 * @name Models.BomTable#storeItemNumber
	 * @methodOf Models.BomTable
	 * @description Adds the item number of the added to `this.edgesToItemNumbers`
	 * and also to `this.edgesToFirstLevelItemNumbers` if the row is top level.
	 *
	 * @param {String} `edgeId` of the row being added.
	 * @param {String} `itemNumber` of the row being added.
	 * @param {Number} `depth` of the row being added.
	 */
	storeItemNumber(edgeId, itemNumber, depth) {
	  let parsedItemNumber = parseInt(itemNumber);

	  this.edgesToItemNumbers.set(edgeId, parsedItemNumber);
	  if (depth === 1) {
	    this.edgesToFirstLevelItemNumbers.set(edgeId, parsedItemNumber);
	  }
	}

	/**
	 * @name Models.BomTable#revertAdd
	 * @methodOf Models.BomTable
	 * @description Before removing a row this method will remove any previous
	 * changes that might have been made to it. If we are removing a row that was
	 * newly added then we simply drop it from the change list and bom table and
	 * update the max item number accordingly. Otherwise if we are removing an
	 * exiting row we just get rid any previous edits that might have been made to
	 * it and then mark it for removal.
	 *
	 * @param {String} `edgeId` of the row for which change is being reverted.
	 */
	revertChange(edgeId) {
	  let changeList = this.changeTracker.getChangeList(edgeId);

	  if (changeList.changes.has(BomChangeTypes.ADDITEM)) {
	    let addChanges = changeList.changes.get(BomChangeTypes.ADDITEM);

	    if (addChanges && addChanges.length > 0) {
	      this.revertAdd(edgeId);
	      return;
	    }
	  } else if (changeList.changes.has(BomChangeTypes.FIELDEDIT)) {
	    let editChanges = changeList.changes.get(BomChangeTypes.FIELDEDIT);

	    if (editChanges && editChanges.length > 0) {
	      this.revertFieldEdits(edgeId, editChanges);
	      changeList.deleteChanges(BomChangeTypes.FIELDEDIT);
	    }
	  }
	}

	/**
	 * @name Models.BomTable#revertAdd
	 * @methodOf Models.BomTable
	 * @description This removes the row with the `edgeId` from the table that was
	 * a newly added.Upon the removal of the row the max item number will be
	 * updated if needed.
	 * We only need to update item number when removing a newly added row when
	 * the item number of the row being removed is equal to the current maximum
	 * first level item number .
	 *
	 * @param {String} `edgeId` of the newly added row that is being removed.
	 */
	revertAdd(edgeId) {
	  let itemNumberOfRemovedRow = this.edgesToFirstLevelItemNumbers.get(edgeId);

	  this.removeRowFromTable(edgeId, 1);
	  this.changeTracker.deleteChangeList(edgeId);

	  if (this.maxFirstLevelItemNumber === itemNumberOfRemovedRow) {
	    this.maxFirstLevelItemNumber = this.getMaxFirstLevelItemNumber();
	  }
	}

	/**
	 * @name Models.BomTable#revertFieldEdits
	 * @methodOf Models.BomTable
	 * @description Removes any edits that might have been made to a row
	 * that is now being marked for removal.
	 *
	 * @param {String} `edgeId` of the row for which fied edit is being reverted.
	 * @param {object} `editChanges` list of field edits to revert.
	 */
	revertFieldEdits(edgeId, editChanges) {
	  let row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(edgeId));

	  editChanges.forEach((change) => {
	    let id = change.targetFieldData.getFieldId();
	    let field = row.displayProperties[id];

	    field.updateValue(field.originalValue);

	    if (change.targetFieldData.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
	      let revisionField = row.displayProperties[change.revisionField.getFieldId()];

	      if (revisionField) {
	        revisionField.updateValue(revisionField.originalValue);
	      }
	    }
	  });
	}

	/**
	 * @name Models.BomTable#getMaxFirstLevelItemNumber
	 * @methodOf Models.BomTable
	 * @description gets the maximum item number out of all the current top level
	 * level rows in the bom.
	 *
	 * @returns {Number} representing current max item number , returns null if
	 * the list is empty.
	 */
	getMaxFirstLevelItemNumber() {
	  if (this.edgesToFirstLevelItemNumbers.size) {
	    let iterator = this.edgesToFirstLevelItemNumbers.values();
	    let next = iterator.next();
	    let max = next.value;

	    while (!next.done) {
	      next = iterator.next();
	      if (next.value > max) {
	        max = next.value;
	      }
	    }
	    return max;
	  } else {
	    return null;
	  }
	}

	/**
	 * @name Models.BomTable#recalculateMaxItemNumber
	 * @methodOf Models.BomTable
	 * @description Recalculates `this.maxFirstLevelItemNumber` for changes to the
	 * bom that cause the item numbers of the rows to update .
	 * To recalculate the `this.maxFirstLevelItemNumber`
	 * For Edits:
	 * We traverse `this.edgesToFirstLevelItemNumbers` when the `itemNumber` of
	 * the `editedEdge` is less than the current maximum. Otherwise if the
	 * `itemNumber` is greater or equal to current maximum then we just assign it
	 * to `this.maxFirstLevelItemNumber`.
	 * For Removes:
	 * We traverse `this.edgesToFirstLevelItemNumbers` to get the max item number
	 * only when the `itemNumber` of the `editedEdge` is equal to the
	 * current max.
	 * For Adds:
	 * `this.maxFirstLevelItemNumber` gets updated within the`addBomRow` method.
	 *
	 * @param {String} `editedEdge` edgeId of the row.
	 * @param {String} `itemNumber` item number of `editedEdge`.
	 * @param {String} `changeType` the type of of change thats prompting the
	 * recalculation.
	 */
	recalculateMaxItemNumber(editedEdge, itemNumber, changeType) {
	  let parsedNumber = parseInt(itemNumber);

	  if (changeType === BomChangeListTypes.EDIT) {
	    this.edgesToFirstLevelItemNumbers.set(editedEdge, parsedNumber);
	    if (parsedNumber >= this.maxFirstLevelItemNumber) {
	      this.maxFirstLevelItemNumber = parsedNumber;
	    } else {
	      this.maxFirstLevelItemNumber = this.getMaxFirstLevelItemNumber();
	    }
	  }
	  if (changeType === BomChangeListTypes.REMOVE) {
	    this.edgesToFirstLevelItemNumbers.delete(editedEdge);
	    if (parsedNumber === this.maxFirstLevelItemNumber) {
	      this.maxFirstLevelItemNumber = this.getMaxFirstLevelItemNumber();
	    }
	  }
	}

	/**
	 * @name Models.BomTable#removeRowFromTable
	 * @methodOf Models.BomTable
	 * @description Removes a row from the table and updates all the related
	 * collections to make sure a proper removal of a row.
	 *
	 * @param {String} `edgeId` of the row being removed.
	 * @param {Number} `depth` of the row being removed.
	 */
	removeRowFromTable(edgeId, depth) {
	  let size = this.rows.length;

	  for (let index = size - 1; index >= 0; --index) {
	    if (this.rows[index].edgeId === edgeId) {
	      this.rows.splice(index, 1);
	      break;
	    }
	  }

	  this.edgesToItemNumbers.delete(edgeId);
	  this.rowsInTable.delete(edgeId);
	  if (depth === 1) {
	    this.edgesToFirstLevelItemNumbers.delete(edgeId);
	  }
	}
}

let BomTableFactory = (BomField, BomFieldData, FieldTypes, BomTableColumnBuilder, ValidationUtil) => {
	BomTable.BomField = BomField;
	BomTable.BomFieldData = BomFieldData;
	BomTable.FieldTypes = FieldTypes;
	BomTable.BomTableColumnBuilder = BomTableColumnBuilder;
	BomTable.ValidationUtil = ValidationUtil;

	return BomTable;
};

angular.module(__moduleName, []).factory('BomTable', ['BomField', 'BomFieldData', 'FieldTypes', 'BomTableColumnBuilder', 'ValidationUtil', BomTableFactory]);
