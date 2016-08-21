System.registerModule("com/autodesk/components/featureToggle/featureToggle.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/featureToggle/featureToggle.directive.js";
  var MODELS_MANAGER = new WeakMap();
  var EVENT_SERVICE = new WeakMap();
  var FeatureToggle = function() {
    function FeatureToggle(ModelsManager, EventService) {
      this.restrict = 'A';
      this.scope = {featureToggle: '@'};
      MODELS_MANAGER.set(this, ModelsManager);
      EVENT_SERVICE.set(this, EventService);
    }
    return ($traceurRuntime.createClass)(FeatureToggle, {link: function(scope, element) {
        element.css('visibility', 'hidden');
        var listenerId = EVENT_SERVICE.get(FeatureToggle.instance).listen('enabledFeatures:tenant:done', function(event, obj) {
          var enabled = false;
          var features = obj.getDisplayableData();
          if (features && features.data && scope.featureToggle) {
            angular.forEach(features.data, function(feature) {
              if (feature && feature.title && feature.title === scope.featureToggle) {
                enabled = true;
              }
            });
          }
          if (!enabled) {
            element.remove();
          } else {
            element.css('visibility', 'visible');
          }
          EVENT_SERVICE.get(FeatureToggle.instance).unlisten(listenerId);
        });
        MODELS_MANAGER.get(FeatureToggle.instance).getEnabledFeatures();
      }}, {directiveFactory: function(ModelsManager, EventService) {
        FeatureToggle.instance = new FeatureToggle(ModelsManager, EventService);
        return FeatureToggle.instance;
      }});
  }();
  FeatureToggle.directiveFactory.$inject = ['ModelsManager', 'EventService'];
  var $__default = FeatureToggle;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/featureToggle/featureToggle.directive.js
