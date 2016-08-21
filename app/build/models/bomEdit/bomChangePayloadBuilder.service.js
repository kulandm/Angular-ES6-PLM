System.registerModule("com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js";
  var BomChangeTypes = System.get("com/autodesk/models/bomEdit/bomChangeTypes.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var BomChangePayloadBuilder = function() {
    function BomChangePayloadBuilder() {}
    return ($traceurRuntime.createClass)(BomChangePayloadBuilder, {}, {
      attachFieldEditToPayload: function(payload, edit) {
        var fieldSemantics = edit.targetFieldData.getFieldSemantics();
        if (fieldSemantics === BomUIFieldSemantics.QUANTITY) {
          payload.quantity = edit.currentValue;
        } else if (fieldSemantics === BomUIFieldSemantics.PINNING) {
          payload.isPinned = (edit.currentValue === 'true' ? true : false);
          if (edit.currentRevision) {
            payload.item = edit.currentRevision.version.item;
          } else {
            payload.item = edit.targetItem;
          }
        } else if (fieldSemantics === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
          payload.itemNumber = edit.currentValue.itemNumber;
        } else {
          payload.fields.push(edit.payloadForm());
        }
      },
      attachFieldEditsToPayload: function(changes, payload) {
        var $__4 = this;
        var edits = changes.get(BomChangeTypes.FIELDEDIT);
        payload.fields = [];
        edits.forEach(function(edit) {
          $__4.attachFieldEditToPayload(payload, edit);
        });
      },
      convertChangesToEditPayload: function(changes) {
        var payload = {};
        this.attachFieldEditsToPayload(changes, payload);
        return payload;
      },
      convertChangesToAddPayload: function(changes) {
        var addChange = changes.get(BomChangeTypes.ADDITEM)[0];
        var payload = addChange.itemJSON;
        payload.itemNumber = addChange.correspondingRow.itemNumber;
        if (changes.has(BomChangeTypes.FIELDEDIT) && changes.get(BomChangeTypes.FIELDEDIT).length > 0) {
          this.attachFieldEditsToPayload(changes, payload);
        }
        return payload;
      }
    });
  }();
  var $__default = BomChangePayloadBuilder;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangePayloadBuilder.service.js
