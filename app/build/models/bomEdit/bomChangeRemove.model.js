System.registerModule("com/autodesk/models/bomEdit/bomChangeRemove.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangeRemove.model.js";
  var BomChangeTypes = System.get("com/autodesk/models/bomEdit/bomChangeTypes.js").default;
  var AbstractChange = System.get("com/autodesk/models/editTracker/abstractChange.model.js").default;
  var BomChangeRemove = function($__super) {
    function BomChangeRemove(args) {
      $traceurRuntime.superConstructor(BomChangeRemove).call(this, args);
      this.changeType = BomChangeTypes.REMOVEITEM;
      this.edgeId = args.edgeId;
    }
    return ($traceurRuntime.createClass)(BomChangeRemove, {}, {}, $__super);
  }(AbstractChange);
  var $__default = BomChangeRemove;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangeRemove.model.js
