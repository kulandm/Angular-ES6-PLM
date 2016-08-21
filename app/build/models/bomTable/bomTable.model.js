System.registerModule("com/autodesk/models/bomTable/bomTable.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomTable.model.js";
  var BomChangeListTypes = System.get("com/autodesk/models/bomEdit/bomChangeListTypes.js").default;
  var BomChangeTypes = System.get("com/autodesk/models/bomEdit/bomChangeTypes.js").default;
  var BomChangeList = System.get("com/autodesk/models/bomEdit/bomChangeList.model.js").default;
  var ChangeListHolder = System.get("com/autodesk/models/editTracker/changeListHolder.model.js").default;
  var BomChangeAdd = System.get("com/autodesk/models/bomEdit/bomChangeAdd.model.js").default;
  var BomChangeEdit = System.get("com/autodesk/models/bomEdit/bomChangeEdit.model.js").default;
  var BomChangePinningEdit = System.get("com/autodesk/models/bomEdit/bomChangePinningEdit.model.js").default;
  var BomChangeRemove = System.get("com/autodesk/models/bomEdit/bomChangeRemove.model.js").default;
  var BomTableRow = System.get("com/autodesk/models/bomTable/bomTableRow.model.js").default;
  var BomPath = System.get("com/autodesk/models/bomTable/bomPath.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomTable = function() {
    function BomTable() {
      var args = arguments[0] !== (void 0) ? arguments[0] : {};
      this.columns = [];
      this.initColumns((angular.isUndefined(args.columns)) ? [] : args.columns);
      this.rows = (angular.isUndefined(args.rows)) ? [] : args.rows;
      this.rowsInTable = (angular.isUndefined(args.rowsInTable)) ? new Set() : args.rowsInTable;
      this.changeTracker = new ChangeListHolder(BomChangeList);
      this.maxFirstLevelItemNumber = (angular.isDefined(args.maxFirstLevelItemNumber)) ? args.maxFirstLevelItemNumber : null;
      this.edgesToItemNumbers = (angular.isUndefined(args.edgesToItemNumbers)) ? new Map() : args.edgesToItemNumbers;
      this.edgesToFirstLevelItemNumbers = (angular.isUndefined(args.edgesToFirstLevelItemNumbers)) ? new Map() : args.edgesToFirstLevelItemNumbers;
      this.currentAddOrder = (angular.isUndefined(args.currentAddOrder)) ? 0 : args.currentAddOrder;
    }
    return ($traceurRuntime.createClass)(BomTable, {
      initColumns: function(columns) {
        this.columns = [BomTable.BomTableColumnBuilder.buildEditIndicatorColumn(), BomTable.BomTableColumnBuilder.buildRowSelectorColumn(), BomTable.BomTableColumnBuilder.buildRowIdColumn()];
        if (columns.length > 0) {
          this.columns = this.columns.concat(columns);
        }
      },
      clear: function() {
        this.columns.splice(0, this.columns.length);
        this.initColumns([]);
        this.rows.splice(0, this.rows.length);
        this.rowsInTable.clear();
        this.edgesToItemNumbers.clear();
        this.changeTracker.clear();
        this.maxFirstLevelItemNumber = null;
        this.edgesToFirstLevelItemNumbers.clear();
        this.currentAddOrder = 0;
      },
      addBomRow: function(bomTableRow) {
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
      },
      rowExists: function(path) {
        return this.rowsInTable.has(path.asString());
      },
      getRowForPath: function(path) {
        for (var i = 0; i < this.rows.length; ++i) {
          if (this.rows[i].path.equals(path)) {
            return this.rows[i];
          }
        }
        return null;
      },
      addColumn: function(column) {
        this.columns.push(column);
      },
      addColumnsForViewDefinition: function(viewDef) {
        var viewDefColumns = viewDef.getFields().map(function(viewDefField) {
          return BomTable.BomTableColumnBuilder.buildColumnForViewDefField(viewDefField);
        });
        this.initColumns(viewDefColumns);
      },
      bomRowCompare: function(thisRow, thatRow) {
        var thisRowPath = thisRow.path;
        var thatRowPath = thatRow.path;
        var shortestPath = (thisRowPath.edges.length < thatRowPath.edges.length) ? thisRowPath : thatRowPath;
        var shortestPathLength = shortestPath.edges.length;
        for (var i = 0; i < shortestPathLength; ++i) {
          var thisEdge = thisRowPath.edges[i];
          var thatEdge = thatRowPath.edges[i];
          if (thisEdge === thatEdge) {
            continue;
          }
          if (thisRow.isNewlyAdded) {
            if (thatRow.isNewlyAdded) {
              return thisRow.addOrder - thatRow.addOrder;
            } else {
              return 1;
            }
          } else {
            if (thatRow.isNewlyAdded) {
              return -1;
            } else {
              var thisEdgeItemNumber = this.edgesToItemNumbers.get(thisEdge);
              var thatEdgeItemNumber = this.edgesToItemNumbers.get(thatEdge);
              if (thisEdgeItemNumber === thatEdgeItemNumber) {
                return (thisEdge < thatEdge) ? -1 : 1;
              } else {
                return thisEdgeItemNumber - thatEdgeItemNumber;
              }
            }
          }
        }
        return thisRowPath.edges.length - thatRowPath.edges.length;
      },
      handleEdit: function(editedEdge, editedField) {
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
      },
      handleStandardEdit: function(editedEdge, editedField) {
        var newChange = new BomChangeEdit({
          edgeId: editedEdge,
          targetFieldData: editedField,
          currentValue: editedField.getValue(),
          serverError: editedField.serverError
        });
        this.changeTracker.tryAddChange(editedEdge, newChange);
      },
      handlePinningEdit: function(editedEdge, editedField) {
        var editedRow = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(editedEdge));
        if (editedRow.hasLoadedRevisions() || editedRow.item) {
          var newChange;
          if (editedRow.hasLoadedRevisions()) {
            var revisionField = editedRow.getFieldWithSemantics(BomUIFieldSemantics.REVISION);
            if (editedField.getValue() === 'false') {
              var latestRevision = revisionField.options.concat().sort(function(a, b) {
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
      },
      handleRevisionEdit: function(editedEdge, editedField) {
        var editedRow = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(editedEdge));
        var pinningField = editedRow.getFieldWithSemantics(BomUIFieldSemantics.PINNING);
        if (pinningField) {
          if (editedField.isDirty()) {
            pinningField.updateValue('true');
          }
          var newChange = new BomChangePinningEdit({
            edgeId: editedEdge,
            targetFieldData: pinningField,
            currentValue: pinningField.getValue(),
            serverError: editedField.serverError,
            revisionField: editedField,
            currentRevision: editedField.getValue()
          });
          this.changeTracker.tryAddChange(editedEdge, newChange);
        }
      },
      handleRemove: function(edgeId) {
        if (this.changeTracker.hasChangeList(edgeId)) {
          this.revertChange(edgeId);
        }
        if (this.rowExists(BomPath.EmptyPath().WithSucceedingEdge(edgeId))) {
          var newChange = new BomChangeRemove({edgeId: edgeId});
          if (this.changeTracker.tryAddChange(edgeId, newChange)) {
            var itemNumber = this.edgesToFirstLevelItemNumbers.get(edgeId);
            this.recalculateMaxItemNumber(edgeId, itemNumber, BomChangeListTypes.REMOVE);
          }
        }
      },
      queueSelectedRowsForRemoval: function() {
        var $__13 = this;
        this.getCheckedRows().forEach(function(row) {
          $__13.handleRemove(row.edgeId);
          row.isChecked = false;
        });
      },
      buildDisplayProperties: function(viewDef, change) {
        var displayProperties = {};
        viewDef.getFields().forEach(function(viewDefField) {
          var bomField = BomTable.BomField.FromViewDefField(viewDefField);
          if (bomField.getFieldSemantics() === BomUIFieldSemantics.DESCRIPTOR) {
            bomField.value = (change.itemJSON.item.title + " " + change.itemJSON.item.version);
          }
          var fieldData = BomTable.BomFieldData.fromField(bomField);
          displayProperties[fieldData.getFieldId()] = fieldData;
        });
        return displayProperties;
      },
      buildRow: function(viewDef, change) {
        var bomTableRow = {};
        bomTableRow.item = change.itemJSON.item;
        bomTableRow.displayProperties = this.buildDisplayProperties(viewDef, change);
        bomTableRow.edgeId = change.getEdgeId();
        bomTableRow.isNewlyAdded = true;
        bomTableRow.itemNumber = this.getItemNumberForNewRow();
        bomTableRow.isExpandable = false;
        bomTableRow.addOrder = this.currentAddOrder;
        bomTableRow.path = new BomPath({edges: [bomTableRow.edgeId]});
        var itemNumberField = BomTable.BomField.ItemNumberField();
        itemNumberField.value = {
          depth: bomTableRow.path.edges.length,
          itemNumber: bomTableRow.itemNumber
        };
        var itemNumberFieldData = BomTable.BomFieldData.fromField(itemNumberField);
        bomTableRow.displayProperties[itemNumberFieldData.getFieldId()] = itemNumberFieldData;
        return new BomTableRow(bomTableRow);
      },
      queueAdds: function(addedItems, viewDef) {
        var $__13 = this;
        addedItems.forEach(function(item) {
          var change = new BomChangeAdd(item);
          $__13.queueSingleAdd(change, viewDef);
        });
      },
      queueSingleAdd: function(change, viewDef) {
        if (!this.changeTracker.hasChangeList(change.getEdgeId())) {
          var newRow = this.buildRow(viewDef, change);
          change.correspondingRow = newRow;
          this.addAndShow(change, newRow);
        }
      },
      addAndShow: function(bomChangeAdd, bomTableRow) {
        if (this.changeTracker.tryAddChange(bomChangeAdd.getEdgeId(), bomChangeAdd)) {
          this.addBomRow(bomTableRow);
        }
      },
      reapplyChange: function(compiledChange) {
        if (compiledChange.changeType === BomChangeListTypes.EDIT) {
          this.reapplyEdit(compiledChange);
        } else if (compiledChange.changeType === BomChangeListTypes.ADD) {
          this.reapplyAdd(compiledChange);
        } else if (compiledChange.changeType === BomChangeListTypes.REMOVE) {
          this.reapplyRemove(compiledChange);
        }
      },
      reapplyRemove: function(compiledChange) {
        var row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(compiledChange.edgeId));
        if (row !== null) {
          this.handleRemove(compiledChange.edgeId);
        }
      },
      reapplyEdit: function(compiledChange) {
        var $__13 = this;
        var row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(compiledChange.edgeId));
        if (row !== null) {
          compiledChange.drivingChanges.get(BomChangeTypes.FIELDEDIT).forEach(function(change) {
            $__13.reapplyFieldEdit(row, change);
          });
        }
      },
      reapplyAdd: function(compiledChange) {
        var $__13 = this;
        var actualChange = compiledChange.drivingChanges.get(BomChangeTypes.ADDITEM)[0];
        this.addAndShow(actualChange, actualChange.correspondingRow);
        if (compiledChange.drivingChanges.get(BomChangeTypes.FIELDEDIT)) {
          compiledChange.drivingChanges.get(BomChangeTypes.FIELDEDIT).forEach(function(editedField) {
            $__13.reapplyFieldEdit(actualChange.correspondingRow, editedField);
          });
        }
      },
      reapplyFieldEdit: function(row, fieldEdit) {
        var id = fieldEdit.targetFieldData.getFieldId();
        row.displayProperties[id].updateValue(fieldEdit.currentValue);
        row.displayProperties[id].serverError = fieldEdit.serverError;
        if (fieldEdit.targetFieldData.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
          var revisionField = row.displayProperties[fieldEdit.revisionField.getFieldId()];
          if (revisionField) {
            revisionField.updateValue(fieldEdit.currentRevision);
          }
        }
        this.handleEdit(row.edgeId, row.displayProperties[id]);
      },
      consumeErrors: function(viewDef, edgeId, errors) {
        var row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(edgeId));
        var fields = row.getFields();
        row.clearRowErrors();
        BomTable.ValidationUtil.clearValidationErrors(fields, 'serverError');
        var unconsumedErrors = BomTable.ValidationUtil.mapValidationErrors(fields, errors, {
          fieldProperty: 'serverError',
          predicate: function(field, error) {
            if (error && error.getErrorFieldId()) {
              var viewDefField = viewDef.getField(field.getFieldId());
              if (viewDefField) {
                return viewDefField.getFieldId() === error.getErrorFieldId();
              }
            }
            return false;
          }
        });
        row.addRowErrors(unconsumedErrors);
        row.processFields();
      },
      getRowEditState: function(tableRow) {
        if (this.changeTracker.hasChangeList(tableRow.edgeId)) {
          return this.changeTracker.getChangeList(tableRow.edgeId).getEditState();
        } else {
          return {
            changeType: null,
            isInvalid: false
          };
        }
      },
      isRowInvalid: function(tableRow) {
        return tableRow.hasErrors();
      },
      isRowDirty: function(tableRow) {
        var editState = this.getRowEditState(tableRow);
        return (!editState.isInvalid) && (editState.changeType !== null) && (editState.changeType !== BomChangeListTypes.NOCHANGE);
      },
      getItemNumberForNewRow: function() {
        var defaultItemNumber = 1;
        if (!this.maxFirstLevelItemNumber) {
          return defaultItemNumber;
        } else {
          return this.maxFirstLevelItemNumber + 1;
        }
      },
      getCheckedRows: function() {
        return this.rows.filter(function(row) {
          return row.isChecked;
        });
      },
      storeItemNumber: function(edgeId, itemNumber, depth) {
        var parsedItemNumber = parseInt(itemNumber);
        this.edgesToItemNumbers.set(edgeId, parsedItemNumber);
        if (depth === 1) {
          this.edgesToFirstLevelItemNumbers.set(edgeId, parsedItemNumber);
        }
      },
      revertChange: function(edgeId) {
        var changeList = this.changeTracker.getChangeList(edgeId);
        if (changeList.changes.has(BomChangeTypes.ADDITEM)) {
          var addChanges = changeList.changes.get(BomChangeTypes.ADDITEM);
          if (addChanges && addChanges.length > 0) {
            this.revertAdd(edgeId);
            return;
          }
        } else if (changeList.changes.has(BomChangeTypes.FIELDEDIT)) {
          var editChanges = changeList.changes.get(BomChangeTypes.FIELDEDIT);
          if (editChanges && editChanges.length > 0) {
            this.revertFieldEdits(edgeId, editChanges);
            changeList.deleteChanges(BomChangeTypes.FIELDEDIT);
          }
        }
      },
      revertAdd: function(edgeId) {
        var itemNumberOfRemovedRow = this.edgesToFirstLevelItemNumbers.get(edgeId);
        this.removeRowFromTable(edgeId, 1);
        this.changeTracker.deleteChangeList(edgeId);
        if (this.maxFirstLevelItemNumber === itemNumberOfRemovedRow) {
          this.maxFirstLevelItemNumber = this.getMaxFirstLevelItemNumber();
        }
      },
      revertFieldEdits: function(edgeId, editChanges) {
        var row = this.getRowForPath(BomPath.EmptyPath().WithSucceedingEdge(edgeId));
        editChanges.forEach(function(change) {
          var id = change.targetFieldData.getFieldId();
          var field = row.displayProperties[id];
          field.updateValue(field.originalValue);
          if (change.targetFieldData.getFieldSemantics() === BomUIFieldSemantics.PINNING) {
            var revisionField = row.displayProperties[change.revisionField.getFieldId()];
            if (revisionField) {
              revisionField.updateValue(revisionField.originalValue);
            }
          }
        });
      },
      getMaxFirstLevelItemNumber: function() {
        if (this.edgesToFirstLevelItemNumbers.size) {
          var iterator = this.edgesToFirstLevelItemNumbers.values();
          var next = iterator.next();
          var max = next.value;
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
      },
      recalculateMaxItemNumber: function(editedEdge, itemNumber, changeType) {
        var parsedNumber = parseInt(itemNumber);
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
      },
      removeRowFromTable: function(edgeId, depth) {
        var size = this.rows.length;
        for (var index = size - 1; index >= 0; --index) {
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
    }, {});
  }();
  var BomTableFactory = function(BomField, BomFieldData, FieldTypes, BomTableColumnBuilder, ValidationUtil) {
    BomTable.BomField = BomField;
    BomTable.BomFieldData = BomFieldData;
    BomTable.FieldTypes = FieldTypes;
    BomTable.BomTableColumnBuilder = BomTableColumnBuilder;
    BomTable.ValidationUtil = ValidationUtil;
    return BomTable;
  };
  angular.module(__moduleName, []).factory('BomTable', ['BomField', 'BomFieldData', 'FieldTypes', 'BomTableColumnBuilder', 'ValidationUtil', BomTableFactory]);
  return {};
});
//# sourceURL=com/autodesk/models/bomTable/bomTable.model.js
