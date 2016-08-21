System.registerModule("com/autodesk/components/itemHeader/itemHeader.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemHeader/itemHeader.js";
  var ItemHeaderController = System.get("com/autodesk/components/itemHeader/itemHeader.controller.js").default;
  var ItemHeaderDirective = System.get("com/autodesk/components/itemHeader/itemHeader.directive.js").default;
  var WorkflowTransitionController = System.get("com/autodesk/components/itemHeader/workflowTransition.controller.js").default;
  angular.module(__moduleName, ['com/autodesk/UnderscoreService.js', 'com/autodesk/EventService.js']).controller('ItemHeaderController', ItemHeaderController).directive('itemHeader', ItemHeaderDirective).controller('WorkflowTransitionController', WorkflowTransitionController).constant('WorkflowTransitionFormDefaultWidth', '350').constant('MaxCommentsLength', '2000').filter('workflowTransitionPermission', function(_) {
    return function(transitions, userPermissionsObj) {
      if (angular.isDefined(userPermissionsObj) && angular.isDefined(userPermissionsObj.hasPermission)) {
        return _.filter(transitions, function(transition) {
          return true;
        });
      } else {
        return transitions;
      }
    };
  });
  return {};
});
//# sourceURL=com/autodesk/components/itemHeader/itemHeader.js
