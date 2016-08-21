System.registerModule("com/autodesk/models/bomGraph/bomGraph.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/models/bomGraph/bomGraph.js";
  var BomFieldFactory = System.get("com/autodesk/models/bomGraph/bomField.model.js").default;
  var BomGraphBuilder = System.get("com/autodesk/models/bomGraph/bomGraphBuilder.service.js").default;
  angular.module(__moduleName, []).factory('BomField', BomFieldFactory).service('BomGraphBuilder', BomGraphBuilder);
  return {};
});
//# sourceURL=com/autodesk/models/bomGraph/bomGraph.js
