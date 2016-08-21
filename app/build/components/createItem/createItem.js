System.registerModule("com/autodesk/components/createItem/createItem.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/createItem.js";
  var CreateItemDialogController = System.get("com/autodesk/components/createItem/createItemDialog.controller.js").default;
  var CreateItemController = System.get("com/autodesk/components/createItem/createItem.controller.js").default;
  var CreateItemPayloadBuilder = System.get("com/autodesk/components/createItem/CreateItemPayloadBuilder.js").default;
  var ManagedItemController = System.get("com/autodesk/components/createItem/managedItem.controller.js").default;
  var CreateItemDirective = System.get("com/autodesk/components/createItem/createItem.directive.js").default;
  var ManagedItemDirective = System.get("com/autodesk/components/createItem/managedItem.directive.js").default;
  angular.module(__moduleName, []).value('CreateItemPayloadBuilder', CreateItemPayloadBuilder).controller('CreateItemDialogController', CreateItemDialogController).controller('CreateItemController', CreateItemController).controller('ManagedItemController', ManagedItemController).directive('createItem', CreateItemDirective).directive('managedItem', ManagedItemDirective).constant('CreateTypes', {
    CONTEXTUAL: 1,
    FULL: 2,
    QUICK: 3
  }).constant('SECTION_TYPES', {
    FIELD_CONTAINER: 'FIELDCONTAINER',
    CLASSIFICATION: 'CLASSIFICATION'
  }).constant('CLASSIFICATION_FIELD_TYPES', {
    TEXT: 'text',
    NUMBER: 'number',
    PICKLIST: 'picklist'
  }).constant('DATA_SOURCE_TYPES', {
    cws: 'CWS',
    plm: 'PLM'
  });
  return {};
});
//# sourceURL=com/autodesk/components/createItem/createItem.js
