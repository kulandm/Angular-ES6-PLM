System.registerModule("com/autodesk/models/bomEdit/bomChangePinningEdit.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangePinningEdit.model.js";
  var BomChangeEdit = System.get("com/autodesk/models/bomEdit/bomChangeEdit.model.js").default;
  var BomChangePinningEdit = function($__super) {
    function BomChangePinningEdit(args) {
      $traceurRuntime.superConstructor(BomChangePinningEdit).call(this, args);
      this.revisionField = args.revisionField;
      this.currentRevision = args.currentRevision;
      this.targetItem = args.targetItem;
    }
    return ($traceurRuntime.createClass)(BomChangePinningEdit, {isRevertingChange: function() {
        if (!$traceurRuntime.superGet(this, BomChangePinningEdit.prototype, "isRevertingChange").call(this)) {
          return false;
        }
        if (this.revisionField) {
          return !this.revisionField.isConsequentialChange(this.currentRevision, this.revisionField.originalValue);
        }
        return true;
      }}, {}, $__super);
  }(BomChangeEdit);
  var $__default = BomChangePinningEdit;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangePinningEdit.model.js
