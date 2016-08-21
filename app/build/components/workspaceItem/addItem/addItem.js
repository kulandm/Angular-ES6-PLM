System.registerModule("com/autodesk/components/workspaceItem/addItem/addItem.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/addItem/addItem.js";
  var AddItemController = System.get("com/autodesk/components/workspaceItem/addItem/addItem.controller.js").default;
  angular.module(__moduleName, []).controller('AddItemController', AddItemController).constant('SECTION_TYPES', {
    FIELD_CONTAINER: 'FIELDCONTAINER',
    CLASSIFICATION: 'CLASSIFICATION'
  });
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/addItem/addItem.js
