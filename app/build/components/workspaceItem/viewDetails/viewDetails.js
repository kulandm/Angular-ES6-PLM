System.registerModule("com/autodesk/components/workspaceItem/viewDetails/viewDetails.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewDetails/viewDetails.js";
  var ViewDetailsController = System.get("com/autodesk/components/workspaceItem/viewDetails/viewDetails.controller.js").default;
  angular.module(__moduleName, []).controller('ViewDetailsController', ViewDetailsController).constant('SECTION_TYPES', {
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
//# sourceURL=com/autodesk/components/workspaceItem/viewDetails/viewDetails.js
