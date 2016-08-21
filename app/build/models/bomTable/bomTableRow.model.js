System.registerModule("com/autodesk/models/bomTable/bomTableRow.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomTableRow.model.js";
  var BomPath = System.get("com/autodesk/models/bomTable/bomPath.model.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomTableRow = function() {
    function BomTableRow() {
      var args = arguments[0] !== (void 0) ? arguments[0] : {};
      this.isExpandable = (typeof args.isExpandable === 'undefined') ? true : args.isExpandable;
      this.isCollapsed = (typeof args.isCollapsed === 'undefined') ? true : args.isCollapsed;
      this.hasFetchedChildren = (typeof args.hasFetchedChildren === 'undefined') ? false : args.hasFetchedChildren;
      this.path = (typeof args.path === 'undefined') ? BomPath.EmptyPath() : args.path;
      this.depth = this.path.edges.length;
      this.$$treeLevel = this.path.edges.length;
      this.item = (typeof args.item === 'undefined') ? null : args.item;
      this.itemNumber = (typeof args.itemNumber === 'undefined') ? 0 : args.itemNumber;
      this.displayProperties = (typeof args.displayProperties === 'undefined') ? {} : args.displayProperties;
      this.edgeId = (typeof args.edgeId === 'undefined') ? null : args.edgeId;
      this.nodeId = (typeof args.nodeId === 'undefined') ? null : args.nodeId;
      this.rowId = (this.depth + "." + this.itemNumber);
      this.clickHandler = (typeof args.clickHandler === 'undefined') ? null : args.clickHandler;
      this.isChecked = (typeof args.isChecked === 'undefined') ? false : args.isChecked;
      this.isCheckable = this.depth === 1;
      this.isNewlyAdded = (typeof args.isNewlyAdded === 'undefined') ? false : args.isNewlyAdded;
      this.addOrder = (typeof args.addOrder === 'undefined') ? null : args.addOrder;
      this.rowErrors = (typeof args.rowErrors === 'undefined') ? [] : args.rowErrors;
      this.fieldsWithErrors = new Set();
      this.processFields();
    }
    return ($traceurRuntime.createClass)(BomTableRow, {
      getFields: function() {
        var $__4 = this;
        return Object.keys(this.displayProperties).map(function(key) {
          return $__4.displayProperties[key];
        });
      },
      processFields: function() {
        var $__4 = this;
        this.getFields().forEach(function(field) {
          if (field.serverError) {
            $__4.fieldsWithErrors.add(field);
          } else {
            $__4.fieldsWithErrors.delete(field);
          }
        });
      },
      clearRowErrors: function() {
        this.rowErrors = [];
      },
      addRowErrors: function(errors) {
        this.rowErrors = this.rowErrors.concat(errors);
      },
      hasErrors: function() {
        return (this.rowErrors.length > 0) || (this.fieldsWithErrors.size > 0);
      },
      getFieldWithSemantics: function(semantics) {
        var found = this.getFields().filter(function(field) {
          return field.getFieldSemantics() === semantics;
        });
        if (found.length > 0) {
          return found[0];
        }
        return null;
      },
      hasLoadedRevisions: function() {
        var revisionField = this.getFieldWithSemantics(BomUIFieldSemantics.REVISION);
        return (revisionField !== null) && Boolean(revisionField.options);
      },
      updateRevisionField: function(versions) {
        var revisionField = this.getFieldWithSemantics(BomUIFieldSemantics.REVISION);
        if (revisionField) {
          revisionField.options = versions.map(function(version) {
            var option = {
              title: version.version,
              version: version
            };
            if (option.title === revisionField.value.title) {
              revisionField.value = option;
            }
            return option;
          });
        }
      }
    }, {});
  }();
  var $__default = BomTableRow;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomTable/bomTableRow.model.js
