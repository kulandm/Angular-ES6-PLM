System.registerModule("com/autodesk/LoadingDataService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/LoadingDataService.js";
  System.get('com/autodesk/EventService.js');
  var LoadingDataService = function() {
    function LoadingDataService(EventService) {
      this.EventService = EventService;
    }
    return ($traceurRuntime.createClass)(LoadingDataService, {
      stateChangeStart: function(event, toState, toParams, fromState, fromParams) {
        this.EventService.send('state:change:start', [toState, toParams, fromState, fromParams]);
      },
      stateChangeSwitch: function(event, toState, toParams, fromState, fromParams) {
        this.EventService.send('state:change:switch', [toState, toParams, fromState, fromParams]);
      },
      stateChangeFinished: function(event, toState, toParams, fromState, fromParams) {
        this.EventService.send('state:change:done', [toState, toParams, fromState, fromParams]);
      },
      stateChangeError: function(event, toState, toParams, fromState, fromParams) {},
      dataRequest: function(params) {
        this.EventService.send('data:request', {
          url: params.url,
          requests: params.requests,
          requestsArr: params.requestsArr
        });
      },
      dataResponse: function(params) {
        this.EventService.send('data:response', {
          url: params.url,
          requests: params.requests,
          requestsArr: params.requestsArr
        });
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, ['com/autodesk/EventService.js']).factory('LoadingDataService', ['EventService', function(EventService) {
    return new LoadingDataService(EventService);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/LoadingDataService.js
