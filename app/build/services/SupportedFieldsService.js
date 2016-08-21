System.registerModule("com/autodesk/services/SupportedFieldsService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/services/SupportedFieldsService.js";
  var underscoreModule = System.get("com/autodesk/UnderscoreService.js").default;
  var eventServiceModule = System.get("com/autodesk/EventService.js").default;
  var SupportedFieldsService = function() {
    function SupportedFieldsService(FieldTypes) {
      this.unsupportedFields = [FieldTypes.IMAGE, FieldTypes.FLASH, FieldTypes.PICKLIST_FILTERED, FieldTypes.DERIVED];
    }
    return ($traceurRuntime.createClass)(SupportedFieldsService, {isFieldUnsupported: function(dataTypeId) {
        return _.contains(this.unsupportedFields, parseInt(dataTypeId));
      }}, {});
  }();
  var $__default = angular.module(__moduleName, [underscoreModule.name, eventServiceModule.name]).factory('SupportedFieldsService', ['FieldTypes', function(FieldTypes) {
    return new SupportedFieldsService(FieldTypes);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/services/SupportedFieldsService.js
