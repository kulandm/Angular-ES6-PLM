System.registerModule("com/autodesk/components/featureToggle/featureToggle.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/featureToggle/featureToggle.js";
  var FeatureToggle = System.get("com/autodesk/components/featureToggle/featureToggle.directive.js").default;
  angular.module(__moduleName, []).directive('featureToggle', FeatureToggle.directiveFactory);
  return {};
});
//# sourceURL=com/autodesk/components/featureToggle/featureToggle.js
