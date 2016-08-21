System.registerModule("com/autodesk/components/workspaceItem/changeOwner/changeOwner.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/changeOwner/changeOwner.js";
  System.get('com/autodesk/usersSelector.js');
  var ChangeOwnerController = System.get("com/autodesk/components/workspaceItem/changeOwner/changeOwner.controller.js").default;
  var EditAdditionalOwnersController = System.get("com/autodesk/components/workspaceItem/changeOwner/editAdditionalOwners.controller.js").default;
  angular.module(__moduleName, ['com/autodesk/usersSelector.js']).controller('ChangeOwnerController', ChangeOwnerController).controller('EditAdditionalOwnersController', EditAdditionalOwnersController).constant('OWNER_TYPE', {
    PRIMARY: 'PRIMARY',
    ADDITIONAL_USER: 'ADDITIONAL_USER',
    ADDITIONAL_GROUP: 'ADDITIONAL_GROUP'
  });
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/changeOwner/changeOwner.js
