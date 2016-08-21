System.registerModule("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.js";
  var WorkspaceTableauFlyoutController = System.get("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.controller.js").default;
  var WorkspaceTableauFlyoutDirective = System.get("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.directive.js").default;
  var WorkspaceTableauFlyoutBox = System.get("com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyoutBox.controller.js").default;
  var TableauPayloadBuilder = System.get("com/autodesk/components/workspaceTableauFlyout/TableauPayloadBuilder.js").default;
  angular.module(__moduleName, []).value('TableauPayloadBuilder', TableauPayloadBuilder).controller('WorkspaceTableauFlyoutController', WorkspaceTableauFlyoutController).controller('WorkspaceTableauFlyoutBox', WorkspaceTableauFlyoutBox).directive('workspaceTableauFlyout', WorkspaceTableauFlyoutDirective);
  return {};
});
//# sourceURL=com/autodesk/components/workspaceTableauFlyout/workspaceTableauFlyout.js
