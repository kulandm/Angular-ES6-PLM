System.registerModule("com/autodesk/flyout.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/flyout.directive.js";
  var FlyoutWindow = function() {
    function FlyoutWindow($timeout, FlyoutService, FlyoutWindowConstants, $q, _) {
      this.$timeout = $timeout;
      this.FlyoutService = FlyoutService;
      this.FlyoutWindowConstants = FlyoutWindowConstants;
      this.$q = $q;
      this._ = _;
      this.restrict = 'EA';
      this.replace = true;
      this.transclude = true;
      this.scope = {
        anchorEl: '=',
        placement: '@',
        showArrow: '@',
        flyoutId: '@',
        flyoutOrder: '@',
        backdropOption: '@',
        baseClass: '@',
        flyoutClass: '@',
        disableDefaultZIndexAllocation: '@',
        flyoutRendered: '&'
      };
      this.templateUrl = 'flyout.html';
    }
    return ($traceurRuntime.createClass)(FlyoutWindow, {
      link: function(scope, element, attrs) {
        var that = FlyoutWindow.instance;
        if (!scope.anchorEl) {
          throw new Error('anchorEl is required.');
        }
        if (!scope.placement) {
          throw new Error('placement is required.');
        }
        if (!scope.flyoutId) {
          throw new Error('flyout id is required.');
        }
        if (scope.disableDefaultZIndexAllocation !== 'true') {
          scope.flyoutDefaultStyle = {'z-index': scope.flyoutOrder + '10'};
          scope.backDropDefaultStyle = {'z-index': scope.flyoutOrder + '00'};
        }
        scope.backdropOption = scope.$eval(attrs.backdropOption);
        var flyoutDialog = element.children().eq(0);
        var anchorPositionInfo;
        var flyoutDialogWidth = 0;
        var flyoutDialogHeight = 0;
        var flyoutClass = scope.baseClass || that.FlyoutWindowConstants.DEFAULT_BASE_CLASS;
        element.addClass((flyoutClass + "-window"));
        element.children().eq(0).addClass(flyoutClass);
        element.children().eq(0).addClass(scope.flyoutClass || '');
        element.children().eq(0).children().eq(0).addClass((flyoutClass + "-arrow"));
        element.children().eq(0).children().eq(1).addClass((flyoutClass + "-content"));
        element.children().eq(1).addClass((flyoutClass + "-backdrop"));
        var flyoutRenderDeferObj = that.$q.defer();
        attrs.$observe('flyoutRender', function(value) {
          if (value.toString() === 'true') {
            flyoutRenderDeferObj.resolve();
          }
        });
        flyoutRenderDeferObj.promise.then(function() {
          positionFlyout();
          scope.flyoutRendered({flyoutId: scope.flyoutId});
        });
        var anchorEl = angular.element(scope.anchorEl);
        scope.$watch(function() {
          var anchorRectObj = anchorEl[0].getBoundingClientRect();
          return {
            width: anchorEl.prop('offsetWidth'),
            height: anchorEl.prop('offsetHeight'),
            top: anchorRectObj.top,
            left: anchorRectObj.left
          };
        }, function(newValue, oldValue) {
          if (!that._.isEqual(newValue, oldValue) || !anchorPositionInfo) {
            anchorPositionInfo = newValue;
            positionFlyout();
          }
        }, true);
        scope.$watch(function() {
          return {
            width: flyoutDialog.prop('offsetWidth'),
            height: flyoutDialog.prop('offsetHeight')
          };
        }, function(newValue, oldValue) {
          if (newValue.width !== oldValue.width || newValue.height !== oldValue.height) {
            flyoutDialogWidth = newValue.width;
            flyoutDialogHeight = newValue.height;
            positionFlyout();
          }
        }, true);
        scope.close = function(event) {
          if (parseInt(scope.backdropOption) !== 0 && event.target === event.currentTarget) {
            event.preventDefault();
            event.stopPropagation();
            if (parseInt(scope.backdropOption) === 1) {
              that.FlyoutService.cancel(scope.flyoutId, 'click outside the dialog.');
            }
          }
        };
        var positionFlyout = function() {
          var placementInfo = scope.placement.split('-');
          scope.primaryPlacement = placementInfo[0];
          var secondaryPlacement = placementInfo[1] || 'center';
          flyoutDialogWidth = flyoutDialog.prop('offsetWidth');
          flyoutDialogHeight = flyoutDialog.prop('offsetHeight');
          var anchorPosition;
          var marginDiff;
          switch (scope.primaryPlacement) {
            case 'top':
              that.removePositionClasses(element.children().eq(0));
              element.children().eq(0).addClass('top');
              anchorPosition = that.anchorToTop(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);
              marginDiff = (anchorPositionInfo.left + anchorPositionInfo.width / 2) - anchorPosition.x;
              scope.arrowStyle = {'margin-left': (marginDiff + "px")};
              break;
            case 'left':
              that.removePositionClasses(element.children().eq(0));
              element.children().eq(0).addClass('left');
              anchorPosition = that.anchorToLeft(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);
              marginDiff = (anchorPositionInfo.top + anchorPositionInfo.height / 2) - anchorPosition.y;
              scope.arrowStyle = {'margin-top': (marginDiff + "px")};
              break;
            case 'right':
              throw new Error('no support for right placement, yet');
            default:
              var pageHeight = document.body.offsetHeight;
              if (parseInt(pageHeight - angular.element(scope.anchorEl)[0].getBoundingClientRect().top) < parseInt(flyoutDialogHeight)) {
                that.removePositionClasses(element.children().eq(0));
                element.children().eq(0).addClass('top');
                anchorPosition = that.anchorToTop(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);
                marginDiff = (anchorPositionInfo.left + anchorPositionInfo.width / 2) - anchorPosition.x;
                scope.arrowStyle = {'margin-left': (marginDiff + "px")};
              } else {
                that.removePositionClasses(element.children().eq(0));
                element.children().eq(0).addClass('bottom');
                anchorPosition = that.anchorToBottom(flyoutDialogWidth, flyoutDialogHeight, anchorPositionInfo, secondaryPlacement);
                marginDiff = (anchorPositionInfo.left + anchorPositionInfo.width / 2) - anchorPosition.x;
                scope.arrowStyle = {'margin-left': (marginDiff + "px")};
              }
              break;
          }
          flyoutDialog.css({
            left: (anchorPosition.x + "px"),
            top: (anchorPosition.y + "px"),
            display: 'block'
          });
        };
        scope.$isRendered = true;
      },
      removePositionClasses: function(element) {
        element.removeClass('top');
        element.removeClass('bottom');
      },
      anchorToTop: function(targetElWidth, targetElHeight, hostSizeInfo, secondaryPlacement) {
        var anchorPositionX;
        var anchorPositionY;
        var pageWidth = document.body.offsetWidth;
        switch (secondaryPlacement) {
          case 'left':
            anchorPositionX = hostSizeInfo.left;
            if ((hostSizeInfo.left + targetElWidth) > pageWidth) {
              anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
            }
            break;
          case 'right':
            anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
            break;
          default:
            anchorPositionX = hostSizeInfo.left + (hostSizeInfo.width / 2) - (targetElWidth / 2);
            if ((hostSizeInfo.left + hostSizeInfo.width / 2) + (targetElWidth / 2) > pageWidth) {
              anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
            }
            break;
        }
        anchorPositionY = hostSizeInfo.top - targetElHeight;
        return {
          x: anchorPositionX,
          y: anchorPositionY
        };
      },
      anchorToBottom: function(targetElWidth, targetElHeight, hostSizeInfo, secondaryPlacement) {
        var anchorPositionX;
        var anchorPositionY;
        var pageWidth = document.body.offsetWidth;
        switch (secondaryPlacement) {
          case 'left':
            anchorPositionX = hostSizeInfo.left;
            if ((hostSizeInfo.left + targetElWidth) > pageWidth) {
              anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
            }
            break;
          case 'right':
            throw new Error('no support for right secondary placement, yet');
          default:
            anchorPositionX = hostSizeInfo.left + (hostSizeInfo.width / 2) - (targetElWidth / 2);
            if ((hostSizeInfo.left + hostSizeInfo.width / 2) + (targetElWidth / 2) > pageWidth) {
              anchorPositionX = (hostSizeInfo.left + hostSizeInfo.width) - targetElWidth;
            }
            break;
        }
        anchorPositionY = hostSizeInfo.top + hostSizeInfo.height;
        return {
          x: anchorPositionX,
          y: anchorPositionY
        };
      },
      anchorToLeft: function(targetElWidth, targetElHeight, hostSizeInfo, secondaryPlacement) {
        var anchorPositionX;
        var anchorPositionY;
        switch (secondaryPlacement) {
          case 'top':
            anchorPositionY = hostSizeInfo.top;
            throw new Error('no support for top secondary placement, yet');
          case 'bottom':
            throw new Error('no support for bottom secondary placement, yet');
          default:
            anchorPositionY = hostSizeInfo.top + (hostSizeInfo.height / 2) - (targetElHeight / 2);
            break;
        }
        anchorPositionX = hostSizeInfo.left - targetElWidth;
        return {
          x: anchorPositionX,
          y: anchorPositionY
        };
      }
    }, {directiveFactory: function($timeout, FlyoutService, FlyoutWindowConstants, $q, _) {
        FlyoutWindow.instance = new FlyoutWindow($timeout, FlyoutService, FlyoutWindowConstants, $q, _);
        return FlyoutWindow.instance;
      }});
  }();
  FlyoutWindow.directiveFactory.$inject = ['$timeout', 'FlyoutService', 'FlyoutWindowConstants', '$q', '_'];
  var $__default = FlyoutWindow;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/flyout.directive.js
;

System.registerModule("com/autodesk/flyout.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/flyout.js";
  var RESTWrapperService = System.get("com/autodesk/RESTWrapperService.js").default;
  var EventService = System.get("com/autodesk/EventService.js").default;
  var FlyoutService = System.get("com/autodesk/flyout.service.js").default;
  var FlyoutDirective = System.get("com/autodesk/flyout.directive.js").default;
  angular.module(__moduleName, ['com/autodesk/RESTWrapperService.js', 'com/autodesk/EventService.js']).provider('FlyoutService', function() {
    this.$get = ['$injector', '$document', '$compile', '$rootScope', '$q', '$http', '$templateCache', '$controller', 'EventService', 'RESTWrapperService', function($injector, $document, $compile, $rootScope, $q, $http, $templateCache, $controller, EventService, RESTWrapperService) {
      return new FlyoutService($injector, $document, $compile, $rootScope, $q, $http, $templateCache, $controller, EventService, RESTWrapperService);
    }];
  }).directive('flyoutWindow', FlyoutDirective.directiveFactory).directive('flyoutTransclude', function() {
    return {link: function($scope, $element, $attrs, controller, $transclude) {
        $transclude($scope.$parent, function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }};
  }).constant('FlyoutWindowConstants', {DEFAULT_BASE_CLASS: 'flyout'});
  return {};
});
//# sourceURL=com/autodesk/flyout.js
;

System.registerModule("com/autodesk/flyout.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/flyout.service.js";
  var flyoutId = 0;
  var openedFlyoutCount = 0;
  var getId = function() {
    return ++flyoutId;
  };
  var activeFlyoutMap = {};
  var FlyoutService = function() {
    function FlyoutService($injector, $document, $compile, $rootScope, $q, $http, $templateCache, $controller, EventService, RESTWrapperService) {
      this.$injector = $injector;
      this.$document = $document;
      this.$compile = $compile;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.$http = $http;
      this.$templateCache = $templateCache;
      this.$controller = $controller;
      this.EventService = EventService;
      this.RESTWrapperService = RESTWrapperService;
    }
    return ($traceurRuntime.createClass)(FlyoutService, {
      getTemplatePromise: function(options) {
        return options.template ? this.$q.when(options.template) : this.$http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl, {cache: this.$templateCache}).then(function(result) {
          return result.data;
        });
      },
      openFlyout: function(flyoutWindowConfig) {
        var body = this.$document.find('body').eq(0);
        flyoutWindowConfig.scope.anchorEl = flyoutWindowConfig.anchorEl;
        var angularDomEl = angular.element('<div flyout-window></div>');
        angularDomEl.attr({
          'anchor-el': 'anchorEl',
          placement: flyoutWindowConfig.placement,
          'flyout-class': flyoutWindowConfig.flyoutClass,
          'show-arrow': flyoutWindowConfig.showArrow,
          'flyout-id': flyoutWindowConfig.flyoutId,
          'flyout-order': ++openedFlyoutCount,
          'backdrop-option': flyoutWindowConfig.backdropOption,
          'base-class': flyoutWindowConfig.baseClass,
          'disable-default-z-index-allocation': flyoutWindowConfig.disableDefaultZIndexAllocation,
          'flyout-rendered': 'flyoutRendered(flyoutId)'
        }).html(flyoutWindowConfig.content);
        var flyoutWindowEl = this.$compile(angularDomEl)(flyoutWindowConfig.scope);
        body.append(flyoutWindowEl);
        activeFlyoutMap[flyoutWindowConfig.flyoutId] = {
          element: flyoutWindowEl,
          config: flyoutWindowConfig
        };
      },
      removeFlyout: function(flyoutId) {
        if (activeFlyoutMap[flyoutId]) {
          activeFlyoutMap[flyoutId].element.remove();
          activeFlyoutMap[flyoutId].config.scope.$destroy();
          delete activeFlyoutMap[flyoutId];
          openedFlyoutCount--;
        }
      },
      getResolvePromises: function(resolves) {
        var $__2 = this;
        var promisesArr = [];
        angular.forEach(resolves, function(value) {
          if (angular.isFunction(value) || angular.isArray(value)) {
            promisesArr.push($__2.$q.when($__2.$injector.invoke(value)));
          }
        });
        return promisesArr;
      },
      open: function(config) {
        var $__2 = this;
        var flyoutClosedDeferred = this.$q.defer();
        var flyoutOpenedDeferred = this.$q.defer();
        var flyoutId = getId();
        var flyoutInstance = {
          id: flyoutId,
          closed: flyoutClosedDeferred.promise,
          opened: flyoutOpenedDeferred.promise,
          cancel: function(message) {
            $__2.cancel(flyoutId, message);
          },
          close: function(result) {
            $__2.close(flyoutId, result);
          },
          hide: function() {
            $__2.hide(flyoutId);
          },
          show: function() {
            $__2.show(flyoutId);
          },
          isHidden: function() {
            return $__2.isHidden(flyoutId);
          },
          isActive: function() {
            return $__2.isActive(flyoutId);
          }
        };
        if (!config.anchorEl) {
          throw new Error('anchorEl is required.');
        }
        if (!config.template && !config.templateUrl) {
          throw new Error('One of template or templateUrl options is required.');
        }
        this.getTemplatePromise(config).then(function(tpl) {
          $__2.RESTWrapperService.allSettled($__2.getResolvePromises(config.resolve)).then(function(resolveResults) {
            var flyoutScope = (config.scope || $__2.$rootScope).$new();
            flyoutScope.$close = flyoutInstance.close;
            flyoutScope.$cancel = flyoutInstance.cancel;
            var ctrlLocals = {};
            var resolveIter = 0;
            if (config.controller) {
              ctrlLocals.$scope = flyoutScope;
              ctrlLocals.$flyoutInstance = flyoutInstance;
              angular.forEach(config.resolve, function(value, key) {
                ctrlLocals[key] = resolveResults[resolveIter++].value;
              });
              flyoutScope[config.controllerAs] = $__2.$controller(config.controller, ctrlLocals);
            }
            flyoutScope.flyoutRendered = function(flyoutId) {
              flyoutOpenedDeferred.resolve(activeFlyoutMap[flyoutId].element);
            };
            $__2.openFlyout({
              scope: flyoutScope,
              deferred: flyoutClosedDeferred,
              content: tpl,
              placement: config.placement || 'bottom',
              flyoutClass: config.flyoutClass,
              showArrow: config.showArrow,
              backdropOption: angular.isNumber(config.backdropOption) ? config.backdropOption : 1,
              baseClass: config.baseClass,
              disableDefaultZIndexAllocation: config.disableDefaultZIndexAllocation,
              flyoutId: flyoutId,
              anchorEl: config.anchorEl
            });
            activeFlyoutMap[flyoutId].instance = flyoutInstance;
          });
        }, function(error) {
          flyoutOpenedDeferred.reject(error);
        });
        return flyoutInstance;
      },
      cancel: function(flyoutId, message) {
        if (activeFlyoutMap[flyoutId]) {
          activeFlyoutMap[flyoutId].config.deferred.reject(message);
          this.removeFlyout(flyoutId);
        }
      },
      close: function(flyoutId, result) {
        if (activeFlyoutMap[flyoutId]) {
          activeFlyoutMap[flyoutId].config.deferred.resolve(result);
          this.removeFlyout(flyoutId);
        }
      },
      hide: function(flyoutId) {
        if (activeFlyoutMap[flyoutId]) {
          activeFlyoutMap[flyoutId].element.addClass('hidden');
          this.EventService.send(("flyout:" + flyoutId + ":hide"));
        }
      },
      show: function(flyoutId) {
        if (activeFlyoutMap[flyoutId]) {
          activeFlyoutMap[flyoutId].element.removeClass('hidden');
          this.EventService.send(("flyout:" + flyoutId + ":show"));
        }
      },
      isHidden: function(flyoutId) {
        if (activeFlyoutMap[flyoutId]) {
          return activeFlyoutMap[flyoutId].element.hasClass('hidden');
        }
        throw new Error('no flyout found for id', flyoutId);
      },
      isActive: function(flyoutId) {
        return !!activeFlyoutMap[flyoutId];
      },
      get: function(flyoutId) {
        return activeFlyoutMap[flyoutId] ? activeFlyoutMap[flyoutId].instance : null;
      }
    }, {});
  }();
  var $__default = FlyoutService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/flyout.service.js
;

System.get("com/autodesk/flyout.js");angular.module("com/autodesk/flyout.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('flyout.html',
    "<div flyout-render=\"{{$isRendered}}\"><!-- We have to use insanely high z-index value to ensure that flyout appears above footer (but i will also make it to appear header as well) --><div tabindex=\"-1\" id=\"flyout-{{flyoutId}}\" ng-style=\"flyoutDefaultStyle\"><div ng-show=\"showArrow === 'true'\" ng-style=\"arrowStyle\"></div><div flyout-transclude></div></div><div ng-show=\"backdropOption !== '0'\" ng-click=\"close($event)\" ng-style=\"backDropDefaultStyle\"></div></div>"
  );
}]);