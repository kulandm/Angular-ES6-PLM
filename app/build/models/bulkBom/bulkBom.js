System.registerModule("com/autodesk/models/bulkBom/bulkBom.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bulkBom/bulkBom.js";
  System.get('com/autodesk/models/bulkBom/bulkBom.model.js');
  System.get('com/autodesk/models/bulkBom/bulkBomListeners.service.js');
  System.get('com/autodesk/models/bulkBom/bulkBomLoader.service.js');
  angular.module(__moduleName, ['com/autodesk/models/bulkBom/bulkBom.model.js', 'com/autodesk/models/bulkBom/bulkBomListeners.service.js', 'com/autodesk/models/bulkBom/bulkBomLoader.service.js']);
  return {};
});
//# sourceURL=com/autodesk/models/bulkBom/bulkBom.js
