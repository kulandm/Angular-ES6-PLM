System.registerModule("com/autodesk/models/bomTable/bomTableColumn.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomTableColumn.model.js";
  var BomTableColumn = function() {
    function BomTableColumn() {
      var args = arguments[0] !== (void 0) ? arguments[0] : {};
      this.fieldId = (typeof args.fieldId === 'undefined') ? null : args.fieldId;
      this.displayName = (typeof args.displayName === 'undefined') ? null : args.displayName;
      this.field = (typeof args.field === 'undefined') ? ("displayProperties['" + this.fieldId + "']") : args.field;
      this.enableSorting = (typeof args.enableSorting === 'undefined') ? false : args.enableSorting;
      this.suppressRemoveSort = (typeof args.suppressRemoveSort === 'undefined') ? true : args.suppressRemoveSort;
      this.cellTemplate = (typeof args.cellTemplate === 'undefined') ? 'bomDefaultTemplate' : args.cellTemplate;
      this.width = (typeof args.width === 'undefined') ? '10%' : args.width;
      this.headerCellTemplate = (typeof args.headerCellTemplate === 'undefined') ? null : args.headerCellTemplate;
      this.enableColumnResizing = (typeof args.enableColumnResizing === 'undefined') ? true : args.enableColumnResizing;
      this.columnSemantics = (typeof args.columnSemantics === 'undefined') ? null : args.columnSemantics;
    }
    return ($traceurRuntime.createClass)(BomTableColumn, {}, {});
  }();
  var $__default = BomTableColumn;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomTable/bomTableColumn.model.js
