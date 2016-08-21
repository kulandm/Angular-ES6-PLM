System.registerModule("com/autodesk/components/fusionHeader/fusionHeader.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/fusionHeader/fusionHeader.controller.js";
  var FusionHeaderController = function() {
    function FusionHeaderController($scope, $templateCache, $location, FlyoutService, $http, App) {
      var $__3 = this;
      this.$scope = $scope;
      this.$templateCache = $templateCache;
      this.$location = $location;
      this.FlyoutService = FlyoutService;
      this.$http = $http;
      var root = new App();
      this.helpFlyout = null;
      this.hubName;
      this.$http.get(root.hubs.link).then(function(response) {
        if (response.items && response.items[0].name) {
          $__3.hubName = response.items[0].name;
        }
      });
      this.addSvgIconsToCache();
      var queryParams = $location.search();
      if (queryParams.query) {
        this.searchQuery = angular.isDefined(queryParams.query) ? queryParams.query : null;
      }
    }
    return ($traceurRuntime.createClass)(FusionHeaderController, {
      addSvgIconsToCache: function() {
        this.$templateCache.put('fusion-header-help-icon-template', '<svg id="icon_help" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 75 75"><path class="stHelp" d="M52.7 31.1c-.3 1.2-.8 2.2-1.4 3-.6.8-1.2 1.6-2 2.3-.7.7-1.5 1.3-2.2 2-.9.7-1.7 1.4-2.4 2.1-.7.7-1.4 1.5-1.9 2.3-.6.8-1 1.8-1.3 3-.2.7-.3 1.6-.4 2.5-.1 1.4-.8 1.7-1.4 1.7h-4.5c-.8 0-1.5-.7-1.4-1.5 0 0 .1-2.2.3-3.6.2-1.4.5-2.6 1-3.7s1-2 1.7-2.8c.7-.8 1.5-1.6 2.4-2.4l2.1-1.8c.7-.6 1.3-1.2 1.8-1.8.5-.7.9-1.4 1.2-2.2.3-.8.4-1.8.4-3 0-1.4-.2-2.6-.7-3.5-.5-1-1.1-1.8-1.8-2.4-.7-.6-1.4-1-2.2-1.3-.8-.3-1.5-.4-2.1-.4-2.8 0-4.9.9-6.3 2.8-1.1 1.5-1.6 3.3-1.9 5.5-.2 1.6-1.2 1.9-1.7 1.9h-4.7c-.8 0-1.4-.7-1.4-1.5 0 0 .3-3.3 1-5.4.8-2.1 1.9-3.8 3.3-5.3s3.2-2.6 5.2-3.4c2-.8 4.3-1.2 6.8-1.2 2.1 0 4.1.3 5.9.9 1.8.6 3.4 1.5 4.7 2.7s2.4 2.6 3.2 4.4c.8 1.7 1.2 3.7 1.2 5.9 0 1.7-.2 3.1-.5 4.2zM41.5 61.4c0 .8-.6 1.4-1.4 1.4h-5.8c-.8 0-1.4-.6-1.4-1.4v-5.2c0-.8.6-1.4 1.4-1.4h5.8c.8 0 1.4.6 1.4 1.4v5.2zM37.5 0C16.8 0 0 16.8 0 37.5S16.8 75 37.5 75 75 58.2 75 37.5C74.9 16.8 58.2 0 37.5 0z"/></svg>');
        this.$templateCache.put('fusion-header-community-icon-template', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="31" height="31" viewBox="0 0 31 31"><image xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAMAAADeQm2wAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABL1BMVEUAAAAHp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98Hp98AAACzm4xsAAAAY3RSTlMACHzc86srCsb2RI/rD/RkKpYpkwXvXYHhCRdZU7LtNFX3PANjwejXkRvkWDYjZ29bMAE1B3HdVBQEJdSDTPLmJBFRSQvR9XIVOkIsbi09w4jg+mD9z6n+HrAyvckNiZDN/IDH1ZCvAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAQhJREFUKM9t0OdWwkAQBeCLoqggggZFxQKIBbsIig0RK6BisHed938H2WQT7znJ/Jq7X+bsTgCrAl3dEuzphV+F+kRV/4AfhsWuyKDXAlGNMuTFmGMS9+KwiyNeNBIOjvo8aExbclylickUP8yYsmx6RoXZdKfLkGbncvMLi0vWXFp9lzd8f8iyfcMKHa2m1tY3Nrf+seDIdrFkn5R2gN2g9bSytr19d085AA6PRCrO4HFEqDqbVk9qp9rKZ2znF8DlVb2RtbHJlr/Gza1qEq2Q2vCOzCygfa/7hypQ58EwGqYbHoEW2dMzXii+4o3SOz5Mip9IUvpCjS/5xg+lJoqMUXBq45ej/AFvFYnK0OWxwQAAAABJRU5ErkJggg==" x="2" y="4" width="28" height="24"/></svg>');
        this.$templateCache.put('fusion-header-admin-email-icon-template', '<svg width="31px" height="31px" viewBox="0 0 31 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>lifesaver_help</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="lifesaver_help-" sketch:type="MSLayerGroup" fill="#02A7DF"><path d="M15.4801045,7.1679403 C17.2258209,7.1679403 18.8489254,7.70835821 20.1902537,8.63002985 L25.1479403,3.67280597 C22.427806,1.43849254 19.0478806,0.223940299 15.4801045,0.223940299 C11.8147015,0.223940299 8.35010448,1.50558209 5.5901791,3.85695522 L10.5316716,8.79844776 C11.9178806,7.77544776 13.6293582,7.1679403 15.4801045,7.1679403 L15.4801045,7.1679403 Z" id="Fill-1" sketch:type="MSShapeGroup"></path><path d="M7.14804478,15.5 C7.14804478,13.5678209 7.80968657,11.7878657 8.91597015,10.3743582 L3.98326866,5.4421194 C1.5398209,8.22702985 0.204044776,11.7605672 0.204044776,15.5 C0.204044776,19.3643582 1.63004478,23.009403 4.23265672,25.8364179 L9.15240299,20.9166716 C7.90361194,19.4582836 7.14804478,17.5658955 7.14804478,15.5 L7.14804478,15.5 Z" id="Fill-2" sketch:type="MSShapeGroup"></path><path d="M15.4801045,23.8320597 C13.7649254,23.8320597 12.1691194,23.3096866 10.842597,22.4185522 L5.87935821,27.381791 C8.58838806,29.581403 11.9428657,30.7760597 15.4801045,30.7760597 C18.9197164,30.7760597 22.1853582,29.6461791 24.8550597,27.5640896 L19.8719254,22.5795672 C18.5958358,23.3730746 17.0907164,23.8320597 15.4801045,23.8320597 L15.4801045,23.8320597 Z" id="Fill-3" sketch:type="MSShapeGroup"></path><path d="M26.7853881,5.22697015 L21.863791,10.1485672 C23.080194,11.5977015 23.8140149,13.4651045 23.8140149,15.5 C23.8140149,17.6690746 22.9807164,19.6479851 21.6162537,21.1318209 L26.5304478,26.0460149 C29.2575224,23.1921642 30.7561642,19.4601343 30.7561642,15.5 C30.7561642,11.6629403 29.3519104,8.0428806 26.7853881,5.22697015 L26.7853881,5.22697015 Z" id="Fill-4" sketch:type="MSShapeGroup"></path></g></g></svg>');
        this.$templateCache.put('fusion-header-vignettes-icon-template', '<svg version="1.1" id="assets" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="28px" viewBox="0 0 26 28" enable-background="new 0 0 26 28" xml:space="preserve"><g><path opacity="0.9" fill="#294769" d="M0,0v28h26V0H0z M4,27H1v-2h3V27z M4,23H1v-2h3V23z M4,19H1v-2h3V19z M4,15H1v-2h3V15z M4,11\r' + '\n' + '		H1V9h3V11z M4,7H1V5h3V7z M4,3H1V1h3V3z M25,27h-3v-2h3V27z M25,23h-3v-2h3V23z M25,19h-3v-2h3V19z M25,15h-3v-2h3V15z M25,11h-3V9\r' + '\n' + '		h3V11z M25,7h-3V5h3V7z M25,3h-3V1h3V3z"/><rect x="5" y="1" fill="#BECBD9" width="16" height="12"/><rect x="5" y="15" fill="#BECBD9" width="16" height="12"/></g></svg>');
        this.$templateCache.put('fusion-header-walkthrough-icon-template', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="31" height="31" viewBox="0 0 31 31"><defs><style>.walk-1, .walk-2, .walk-3 {\r' + '\n' + '        fill: #24b5ed;\r' + '\n' + '      }\r' + '\n' + '\r' + '\n' + '      .walk-1 {\r' + '\n' + '        opacity: 0.3;\r' + '\n' + '      }\r' + '\n' + '\r' + '\n' + '      .walk-2 {\r' + '\n' + '        opacity: 0.5;\r' + '\n' + '      }</style></defs><circle cx="16" cy="16" r="15" class="walk-1"/><circle cx="16" cy="16" r="10" class="walk-2"/><circle cx="16" cy="16" r="5" class="walk-3"/></svg>');
      },
      openHelpFlyout: function(event) {
        var anchor = event.currentTarget;
        this.helpFlyout = this.FlyoutService.open({
          templateUrl: 'build/components/fusionHeader/helpMenu.html',
          anchorEl: angular.element(anchor),
          flyoutClass: 'fusion-header-help-menu-flyout',
          placement: 'bottom-left',
          showArrow: true,
          backdropOption: 2,
          controller: 'HelpMenuController',
          controllerAs: 'helpMenuCtrl',
          disableDefaultZIndexAllocation: true,
          scope: this.$scope,
          resolve: {}
        });
      }
    }, {});
  }();
  FusionHeaderController.$inject = ['$scope', '$templateCache', '$location', 'FlyoutService', 'RESTWrapperService', 'App'];
  var $__default = FusionHeaderController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/fusionHeader/fusionHeader.controller.js
