System.registerModule("com/autodesk/components/createItem/managedItem.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/managedItem.controller.js";
  var ManagedItemController = function() {
    function ManagedItemController() {}
    return ($traceurRuntime.createClass)(ManagedItemController, {isRequiredField: function(fieldDefinition) {
        return !!_.find(fieldDefinition.validatorsMeta, function(validation) {
          return validation.validatorName.toUpperCase() === 'REQUIRED' || validation.validatorName.toUpperCase() === 'DROPDOWNSELECTION';
        });
      }}, {});
  }();
  var $__default = ManagedItemController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/createItem/managedItem.controller.js
