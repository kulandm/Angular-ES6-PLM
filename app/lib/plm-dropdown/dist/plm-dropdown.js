System.registerModule("com/autodesk/dropdown.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dropdown.controller.js";
  System.get('com/autodesk/UnderscoreService.js');
  var dropdownUID = 0;
  var DropdownWidgetController = function() {
    function DropdownWidgetController($scope, $timeout, _) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this._ = _;
      ++dropdownUID;
      this.dropdownUID = dropdownUID;
      this.isOpen = false;
      this.anchorElement;
      this.element;
      this.eventNamespace = ("dropdown_" + this.dropdownUID);
    }
    return ($traceurRuntime.createClass)(DropdownWidgetController, {
      init: function(element) {
        var $__2 = this;
        this.element = $(element);
        this.$scope.$applyAsync(function() {
          $__2.anchorElement = document.querySelector($__2.$scope.anchor);
          $($__2.anchorElement).on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var wasOpen = $__2.isOpen;
            $(document).trigger('dropdownClose', [$__2.element.get(0)]);
            if (!wasOpen) {
              $__2.openDropdown(event);
            }
          });
        });
      },
      openDropdown: function(openEvent) {
        var $__2 = this;
        this.isOpen = true;
        this.setDropdownHorizontalPosition();
        angular.element(this.anchorElement).addClass('rotateCaretVertical');
        this.element.on(("click." + this.eventNamespace), function(clickEvent) {
          if ($__2.shouldStopClickEventPropagation()) {
            clickEvent.stopPropagation();
            if ($__2.isClickOnCloseWith(clickEvent.target)) {
              $(document).trigger("dropdownClose", [$__2.element.get(0)]);
            }
          } else {
            $(document).trigger("dropdownClose", [$__2.element.get(0)]);
          }
        });
        $(document).on(("click." + this.eventNamespace), function(clickEvent) {
          $(document).trigger("dropdownClose");
        });
        $(document).on(("dropdownClose." + this.eventNamespace), function(event, openingDropdown) {
          if (openingDropdown && $.contains($__2.element.get(0), openingDropdown)) {
            return;
          }
          $__2.closeDropdown();
        });
        this.$scope.$digest();
      },
      closeDropdown: function() {
        $(this.element).off(("." + this.eventNamespace));
        $(document).off(("." + this.eventNamespace));
        angular.element(this.anchorElement).removeClass('rotateCaretVertical');
        this.isOpen = false;
        this.$scope.$digest();
      },
      shouldStopClickEventPropagation: function() {
        return this.$scope.stopEventPropagation === 'true';
      },
      isClickOnCloseWith: function(clickedElement) {
        var closeWithElements = $(this.$scope.closeWith.toString());
        return this._.some(closeWithElements, function(el) {
          return (el === clickedElement || $.contains(el, clickedElement));
        });
      },
      setDropdownHorizontalPosition: function() {
        var $__2 = this;
        this.$timeout(function() {
          var dropdownWidgetWrapper = $__2.element.get(0).children[0];
          var dropdownWidgetWidth = parseInt($(dropdownWidgetWrapper).innerWidth(), 10);
          switch ($__2.$scope.hPos) {
            case 'left':
              angular.element(dropdownWidgetWrapper).css({left: -(dropdownWidgetWidth - $__2.anchorElement.offsetWidth) + 'px'});
              break;
            case 'right':
              angular.element(dropdownWidgetWrapper).css({left: '0px'});
              break;
            case 'center':
            default:
              angular.element(dropdownWidgetWrapper).css({left: -(dropdownWidgetWidth / 2 - $__2.anchorElement.offsetWidth / 2) + 'px'});
              break;
          }
        }, 0);
      }
    }, {});
  }();
  var $__default = DropdownWidgetController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/dropdown.controller.js
;

System.registerModule("com/autodesk/dropdown.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dropdown.directive.js";
  var DropdownWidget = function() {
    function DropdownWidget() {
      this.restrict = 'E';
      this.replace = true;
      this.transclude = true;
      this.controller = 'DropdownWidgetController';
      this.controllerAs = 'dropdownWidgetCtrl';
      this.templateUrl = 'dropdown.html';
      this.scope = {
        anchor: '@',
        hPos: '@',
        closeWith: '@',
        stopEventPropagation: '@'
      };
    }
    return ($traceurRuntime.createClass)(DropdownWidget, {link: function(scope, element, attrs, dropdownWidgetCtrl) {
        dropdownWidgetCtrl.init(element);
      }}, {directiveFactory: function() {
        DropdownWidget.instance = new DropdownWidget();
        return DropdownWidget.instance;
      }});
  }();
  DropdownWidget.directiveFactory.$inject = [];
  var $__default = DropdownWidget;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/dropdown.directive.js
;

System.registerModule("com/autodesk/dropdown.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/dropdown.js";
  var DropdownWidgetController = System.get("com/autodesk/dropdown.controller.js").default;
  var DropdownDirective = System.get("com/autodesk/dropdown.directive.js").default;
  angular.module(__moduleName, []).controller('DropdownWidgetController', DropdownWidgetController).directive('dropdownWidget', DropdownDirective.directiveFactory);
  return {};
});
//# sourceURL=com/autodesk/dropdown.js
;

System.get("com/autodesk/dropdown.js");angular.module("com/autodesk/dropdown.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('dropdown.html',
    "<div class=\"dropdown-widget\" ng-hide=\"!dropdownWidgetCtrl.isOpen\"><div class=\"dropdown-widget-wrapper enter-fadeIn exit-fadeOut speed-300\" ng-transclude ng-hide=\"!dropdownWidgetCtrl.isOpen\"></div></div>"
  );
}]);