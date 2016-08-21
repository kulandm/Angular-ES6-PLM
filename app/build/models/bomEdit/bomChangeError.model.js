System.registerModule("com/autodesk/models/bomEdit/bomChangeError.model.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomEdit/bomChangeError.model.js";
  var BomChangeError = function() {
    function BomChangeError(args) {
      this.message = args.message;
      this.code = args.code;
      this.arguments = args.arguments;
      this.editedField = args.field;
      this.editedFieldId = (typeof args.field === 'undefined') ? null : args.field.urn.split('.').pop();
    }
    return ($traceurRuntime.createClass)(BomChangeError, {getErrorFieldId: function() {
        return this.editedFieldId;
      }}, {convertToBomChangeErrors: function(errorPayload) {
        return errorPayload.data.map(function(error) {
          return new BomChangeError(error);
        });
      }});
  }();
  var $__default = BomChangeError;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/models/bomEdit/bomChangeError.model.js
