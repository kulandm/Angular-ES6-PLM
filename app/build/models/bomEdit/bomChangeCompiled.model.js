System.registerModule("com/autodesk/models/bomEdit/bomChangeCompiled.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangeCompiled.model.js";
  var BomChangeListTypes = System.get("com/autodesk/models/bomEdit/bomChangeListTypes.js").default;
  var BomChangePayloadBuilder = System.get("com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js").default;
  var BomChangeError = System.get("com/autodesk/models/bomEdit/bomChangeError.model.js").default;
  var BomChangeCompiled = function() {
    function BomChangeCompiled(changeType, edgeId, drivingChanges) {
      this.changeType = changeType;
      this.edgeId = edgeId;
      this.drivingChanges = drivingChanges;
      this.payload = this.generatePayload(this.changeType, this.drivingChanges);
      this.errors = [];
    }
    return ($traceurRuntime.createClass)(BomChangeCompiled, {
      generatePayload: function(changeType, drivingChanges) {
        if (changeType === BomChangeListTypes.EDIT) {
          return BomChangePayloadBuilder.convertChangesToEditPayload(drivingChanges);
        } else if (changeType === BomChangeListTypes.ADD) {
          return BomChangePayloadBuilder.convertChangesToAddPayload(drivingChanges);
        } else {
          return {};
        }
      },
      addErrors: function(errorResponse) {
        var errors = BomChangeError.convertToBomChangeErrors(errorResponse);
        this.errors = this.errors.concat(errors);
      },
      getErrors: function() {
        return this.errors;
      },
      isInvalid: function() {
        return this.errors.length > 0;
      }
    }, {});
  }();
  var $__default = BomChangeCompiled;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangeCompiled.model.js
