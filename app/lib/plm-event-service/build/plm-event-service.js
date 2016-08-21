System.registerModule("com/autodesk/EventService.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/EventService.js";
  System.get('com/autodesk/UnderscoreService.js');
  var $listeners = [];
  var $callbacks = [];
  var regExpIsEqual = function(regExp1, regExp2) {
    var props = ['global', 'multiline', 'ignoreCase', 'source'];
    if ((regExp1.constructor === RegExp) && (regExp2.constructor === RegExp)) {
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (regExp1[prop] !== regExp2[prop]) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
  var addListener = function(_, eventId) {
    if (eventId.constructor === String) {
      eventId = regExpifyForListening(eventId);
    }
    if (eventId.constructor === RegExp) {
      var duplicateFound = _.find($listeners, function(value, index) {
        return regExpIsEqual(value, eventId);
      });
      if (!duplicateFound) {
        $listeners.push(eventId);
      }
    }
    return eventId;
  };
  var removeListenerEvent = function(_, eventId) {
    if (eventId.constructor === RegExp) {
      $log.error('Invalid, regular expressions not allowed');
    }
    if (eventId.constructor === String) {
      eventId = regExpifyForUnlistening(eventId);
    }
    $listeners = _.reject($listeners, function(listener) {
      var unRegExpifiedListener = unRegExpify(listener);
      if (unRegExpifiedListener.match(eventId) !== null) {
        _.each($callbacks, function(target, key) {
          if (key === listener) {
            delete $callbacks[key];
          }
        });
        return listener;
      }
    });
  };
  var addCallBackFn = function(eventId, callBackFn, override) {
    if (!$callbacks[eventId]) {
      $callbacks[eventId] = {};
    }
    var id = (new Date()).getTime() + '-' + Math.random();
    $callbacks[eventId][id] = callBackFn;
    return id;
  };
  var removeCallBackFn = function(_, listenerId) {
    _.each($listeners, function(listener) {
      _.each($callbacks[listener], function(target, key) {
        if (key === listenerId) {
          delete $callbacks[listener][key];
        }
      });
    });
  };
  var callRegExps = function() {
    var _ = arguments[0];
    var args = _.flatten(arguments, true);
    args.splice(0, 1);
    var eventId = args[0];
    _.each($listeners, function(listener) {
      if (eventId.match(listener)) {
        _.each($callbacks[listener], function(target) {
          if (target) {
            target.apply(target, args);
          }
        });
      }
    });
  };
  var regExpifyForListening = function(watchPattern) {
    if (watchPattern.match(/\*{3,}/)) {
      $log.error('Invalid wildcard pattern "' + watchPattern + '"');
    }
    var matcher = watchPattern.replace(/\*{2}/g, '.*').replace(/\*{1}/g, '[^:/?&;]*').replace(/\./, '.*');
    return new RegExp('^' + matcher + '\\b');
  };
  var regExpifyForUnlistening = function(watchPattern) {
    if (watchPattern.match(/\*{3,}/)) {
      $log.error('Invalid wildcard pattern "' + watchPattern + '"');
    }
    var matcher = watchPattern.replace(/\*/g, '(?:[a-zA-Z0-9:*]*)');
    return new RegExp(matcher);
  };
  var unRegExpify = function(regExp) {
    if (regExp.constructor !== RegExp) {
      $log.error('Invalid argument, should be regular expression');
    }
    var matcher = /[^\\/^.][a-zA-Z0-9:*.]*[^\\:/.?&;]/g;
    regExp = regExp.toString();
    var cleanStr = regExp.replace(/\[\^\:\/\.\?\&\;\]\**/g, '*');
    var regExpAsString = cleanStr.match(matcher);
    return regExpAsString[0];
  };
  var EventService = function() {
    function EventService($log, _) {
      this.$log = $log;
      this._ = _;
    }
    return ($traceurRuntime.createClass)(EventService, {
      listen: function(eventId, callBackFn, override) {
        if (angular.isUndefined(eventId)) {
          this.$log.error('ERROR! You must pass an event name to listen for!', callBackFn);
          return;
        }
        return addCallBackFn(addListener(this._, eventId), callBackFn, override);
      },
      unlisten: function(listenerId) {
        if (angular.isUndefined(listenerId)) {
          this.$log.error('ERROR! You must pass a listener id to unlisten for!');
          return;
        }
        removeCallBackFn(this._, listenerId);
        return this;
      },
      unlistenEvent: function(eventId) {
        if (angular.isUndefined(eventId)) {
          this.$log.error('ERROR! You must pass an event name to unlisten for!');
          return;
        }
        removeListenerEvent(this._, eventId);
        return this;
      },
      send: function() {
        var args = this._.flatten(arguments, true);
        var eventId = args[0];
        if (angular.isUndefined(eventId)) {
          this.$log.error('ERROR! You must pass an event name to send!', args);
          return;
        }
        args.splice(0, 1);
        callRegExps(this._, eventId, args);
        return this;
      }
    }, {});
  }();
  var $__default = angular.module(__moduleName, ['com/autodesk/UnderscoreService.js']).factory('EventService', ['$log', '_', function($log, _) {
    return new EventService($log, _);
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/EventService.js
