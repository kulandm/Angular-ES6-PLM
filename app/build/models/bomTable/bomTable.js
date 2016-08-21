System.registerModule("com/autodesk/models/bomTable/bomTable.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomTable/bomTable.js";
  System.get('com/autodesk/models/bomTable/bomTableColumnBuilder.service.js');
  System.get('com/autodesk/models/bomTable/bomTable.model.js');
  System.get('com/autodesk/models/bomTable/bomFieldData.js');
  System.get('com/autodesk/models/bomTable/bomTableRowBuilder.service.js');
  angular.module(__moduleName, ['com/autodesk/models/bomTable/bomTableColumnBuilder.service.js', 'com/autodesk/models/bomTable/bomTable.model.js', 'com/autodesk/models/bomTable/bomFieldData.js', 'com/autodesk/models/bomTable/bomTableRowBuilder.service.js']);
  return {};
});
//# sourceURL=com/autodesk/models/bomTable/bomTable.js
