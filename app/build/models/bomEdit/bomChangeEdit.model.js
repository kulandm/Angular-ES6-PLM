System.registerModule("com/autodesk/models/bomEdit/bomChangeEdit.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangeEdit.model.js";
  var BomChangeTypes = System.get("com/autodesk/models/bomEdit/bomChangeTypes.js").default;
  var AbstractChange = System.get("com/autodesk/models/editTracker/abstractChange.model.js").default;
  var BomChangeEdit = function($__super) {
    function BomChangeEdit(args) {
      $traceurRuntime.superConstructor(BomChangeEdit).call(this, args);
      this.changeType = BomChangeTypes.FIELDEDIT;
      this.edgeId = args.edgeId;
      this.targetFieldData = args.targetFieldData;
      this.currentValue = args.currentValue;
    }
    return ($traceurRuntime.createClass)(BomChangeEdit, {
      targetsSameField: function(change) {
        return (change.edgeId === this.edgeId) && (change.targetFieldData.getFieldId() === this.targetFieldData.getFieldId());
      },
      isRevertingChange: function() {
        return !this.targetFieldData.isConsequentialChange(this.targetFieldData.originalValue, this.currentValue);
      },
      payloadForm: function() {
        return {
          metaData: this.targetFieldData.getViewDefFieldInfo(),
          value: this.currentValue
        };
      }
    }, {}, $__super);
  }(AbstractChange);
  var $__default = BomChangeEdit;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangeEdit.model.js
