System.registerModule("com/autodesk/sectionWrapper.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/sectionWrapper.directive.js";
  var LOG = new WeakMap();
  var TIMEOUT = new WeakMap();
  var UNDERSCORE = new WeakMap();
  var SectionWrapper = function() {
    function SectionWrapper($timeout, $log, _) {
      this.replace = true;
      this.restrict = 'E';
      this.scope = {
        headerTitle: '@',
        headerNormal: '=',
        headerTooltip: '@',
        collapsible: '=',
        collapsed: '@',
        actionIcons: '=',
        actionHandler: '&',
        classificationPartUrn: '@',
        classificationIsEdition: '='
      };
      this.templateUrl = 'sectionWrapper.html';
      this.transclude = true;
      LOG.set(this, $log);
      TIMEOUT.set(this, $timeout);
      UNDERSCORE.set(this, _);
    }
    return ($traceurRuntime.createClass)(SectionWrapper, {link: function(scope, element, attrs) {
        scope.classificationPartUrn = angular.isDefined(attrs.classificationPartUrn) ? attrs.classificationPartUrn : null;
        scope.isHeaderNormal = angular.isDefined(attrs.headerNormal);
        scope.isCollapsible = angular.isDefined(attrs.collapsible);
        scope.isCollapsed = true;
        var panelHeight = 0;
        var transcludedWrapper;
        var animationFinishedListener = function() {
          angular.element(transcludedWrapper).removeClass('animation');
          if (!scope.isCollapsed) {
            addInlineHeight('auto');
            angular.element(transcludedWrapper).addClass('expanded');
          } else {
            angular.element(transcludedWrapper).addClass('collapsed');
          }
        };
        var addInlineHeight = function(newH) {
          angular.element(transcludedWrapper).css({height: newH});
        };
        TIMEOUT.get(SectionWrapper.instance)(function() {
          transcludedWrapper = element[0].querySelector('.transcluded-content-wrapper');
          transcludedWrapper.addEventListener('transitionend', animationFinishedListener);
          panelHeight = transcludedWrapper.scrollHeight;
          angular.element(transcludedWrapper).addClass('static-dynamic-expandCollapse');
          scope.isCollapsed = (scope.collapsed === 'true');
          if (scope.isCollapsed) {
            addInlineHeight(0);
            angular.element(transcludedWrapper).addClass('collapsed');
          } else {
            addInlineHeight('auto');
            angular.element(transcludedWrapper).addClass('expanded');
          }
        }, 500);
        scope.togglePanel = function(evt) {
          if (scope.isCollapsible) {
            if (scope.wasCwsTagClicked(evt)) {
              return;
            }
            if (!scope.isCollapsed) {
              panelHeight = transcludedWrapper.scrollHeight;
              addInlineHeight(panelHeight + 'px');
            }
            TIMEOUT.get(SectionWrapper.instance)(function() {
              angular.element(transcludedWrapper).removeClass('collapsed').removeClass('expanded').addClass('animation');
            }, 25);
            if (scope.isCollapsed) {
              TIMEOUT.get(SectionWrapper.instance)(function() {
                addInlineHeight(panelHeight + 'px');
              }, 50);
            } else {
              TIMEOUT.get(SectionWrapper.instance)(function() {
                addInlineHeight(0);
              }, 50);
            }
            scope.isCollapsed = !scope.isCollapsed;
          }
        };
        scope.wasCwsTagClicked = function(evt) {
          return evt.target.className === 'cwsTreeIframe ng-binding';
        };
        scope.triggerAction = function(event, actionName) {
          event.stopPropagation();
          scope.actionHandler()(actionName);
        };
      }}, {directiveFactory: function($timeout, $log, _) {
        SectionWrapper.instance = new SectionWrapper($timeout, $log, _);
        return SectionWrapper.instance;
      }});
  }();
  SectionWrapper.directiveFactory.$inject = ['$timeout', '$log', '_'];
  var $__default = SectionWrapper;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/sectionWrapper.directive.js
;

System.registerModule("com/autodesk/sectionWrapper.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/sectionWrapper.js";
  var UnderscoreService = System.get("com/autodesk/UnderscoreService.js").default;
  var SectionWrapperDirective = System.get("com/autodesk/sectionWrapper.directive.js").default;
  angular.module(__moduleName, ['com/autodesk/UnderscoreService.js']).directive('sectionWrapper', SectionWrapperDirective.directiveFactory);
  return {};
});
//# sourceURL=com/autodesk/sectionWrapper.js
;

System.get("com/autodesk/sectionWrapper.js");angular.module("com/autodesk/sectionWrapper.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('sectionWrapper.html',
    "<div class=\"section-wrapper\"><div ng-click=\"togglePanel($event)\" class=\"header\"><h4 ng-bind-html=\"headerTitle\" ng-class=\"{'section-header-normal':isHeaderNormal}\" ng-if=\"!classificationPartUrn\" title=\"{{headerTooltip}}\"></h4><h4 ng-class=\"{'section-header-normal':isHeaderNormal}\" ng-if=\"classificationPartUrn\"><classification-section header-text=\"headerTitle\" part-urn=\"classificationPartUrn\" is-edition=\"classificationIsEdition\" ng-if=\"classificationPartUrn\"></classification-section></h4><ul ng-if=\"actionIcons\" class=\"buttons\"><li ng-repeat=\"(actionName, icon) in actionIcons\"><span class=\"md {{icon}}\" ng-click=\"triggerAction($event, actionName)\"></span></li></ul><span ng-if=\"isCollapsible\" class=\"caret-flex up static-rotateCaretVertical\" ng-class=\"{'rotate': (isCollapsed)}\"></span></div><div class=\"transcluded-content-wrapper\"><div class=\"transcluded-content\" ng-transclude></div></div></div>"
  );
}]);