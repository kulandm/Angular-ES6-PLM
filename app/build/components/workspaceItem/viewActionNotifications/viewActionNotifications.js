System.registerModule("com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.js";
  var ViewActionNotificationsController = System.get("com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.controller.js").default;
  var AddActionNotificationsController = System.get("com/autodesk/components/workspaceItem/viewActionNotifications/addActionNotifications.controller.js").default;
  angular.module(__moduleName, []).controller('ViewActionNotificationsController', ViewActionNotificationsController).controller('AddActionNotificationsController', AddActionNotificationsController);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewActionNotifications/viewActionNotifications.js
