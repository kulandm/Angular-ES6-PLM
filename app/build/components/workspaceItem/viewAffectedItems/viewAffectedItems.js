System.registerModule("com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.js";
  var ViewAffectedItemsController = System.get("com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.controller.js").default;
  var AddLinkableItemsController = System.get("com/autodesk/components/workspaceItem/addLinkableItems/addLinkableItems.controller.js").default;
  var AddRelatedBomController = System.get("com/autodesk/components/workspaceItem/viewAffectedItems/addRelatedBom.controller.js").default;
  var BulkEditController = System.get("com/autodesk/components/workspaceItem/viewAffectedItems/bulkEdit.controller.js").default;
  angular.module(__moduleName, []).controller('ViewAffectedItemsController', ViewAffectedItemsController).controller('AddLinkableItemsController', AddLinkableItemsController).controller('AddRelatedBomController', AddRelatedBomController).controller('BulkEditController', BulkEditController).constant('ManagedItemColumnIndex', {
    ROW_STATUS: 0,
    SELECTION: 1,
    ROW_ID: 2,
    ITEM_DESCRIPTOR: 3,
    LIFECYCLE: 4,
    EFFECTIVITY: 5,
    FROM: 6,
    TO: 7
  });
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.js
