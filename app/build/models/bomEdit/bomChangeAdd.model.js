System.registerModule("com/autodesk/models/bomEdit/bomChangeAdd.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangeAdd.model.js";
  var BomChangeTypes = System.get("com/autodesk/models/bomEdit/bomChangeTypes.js").default;
  var AbstractChange = System.get("com/autodesk/models/editTracker/abstractChange.model.js").default;
  var BomChangeAdd = function($__super) {
    function BomChangeAdd(args) {
      $traceurRuntime.superConstructor(BomChangeAdd).call(this, args);
      this.changeType = BomChangeTypes.ADDITEM;
      this.edgeId = ("Temp" + args.ref.getItemId());
      this.itemJSON = args.ref.json;
      this.correspondingRow = {};
    }
    return ($traceurRuntime.createClass)(BomChangeAdd, {
      targetsSameItemAddition: function(change) {
        return this.itemJSON.urn === change.itemJSON.urn;
      },
      getEdgeId: function(change) {
        return this.edgeId;
      },
      getItemJson: function() {
        return this.itemJSON;
      }
    }, {}, $__super);
  }(AbstractChange);
  var $__default = BomChangeAdd;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangeAdd.model.js
