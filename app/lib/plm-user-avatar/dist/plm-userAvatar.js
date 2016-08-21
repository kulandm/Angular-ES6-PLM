System.registerModule("com/autodesk/userAvatar.directive.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/userAvatar.directive.js";
  function userAvatar(userAvatarColors) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'userAvatar.html',
      scope: {
        userName: '@',
        userImage: '@'
      },
      link: function(scope) {
        var hashCode = function(s) {
          if (!s) {
            return 0;
          }
          return Math.abs(s.split("").reduce(function(a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0));
        };
        scope.userInitials = null;
        scope.userBackgroundColor = null;
        if (scope.userName) {
          var words = scope.userName.trim().split(' ');
          words.splice(1, words.length - 2);
          if (words.length === 1) {
            words[words.length] = words[0].substring(1);
          }
          scope.userInitials = _.map(words, function(word) {
            return word.charAt(0).toUpperCase();
          }).join('');
          scope.userBackgroundColor = userAvatarColors[hashCode(scope.userName) % userAvatarColors.length];
        }
      }
    };
  }
  var $__default = userAvatar;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/userAvatar.directive.js
;

System.registerModule("com/autodesk/userAvatar.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/userAvatar.js";
  var userAvatar = System.get("com/autodesk/userAvatar.directive.js").default;
  angular.module(__moduleName, []).directive('userAvatar', userAvatar).constant('userAvatarColors', ['#55A559', '#8AB656', '#BFCB49', '#E8CB49', '#E5A819', '#E18919', '#E86238', '#E15348', '#D43269', '#9234A2', '#6A46AA', '#4A59A9', '#3593DE', '#1B9FDB', '#15ABBE', '#0F877B', '#607D8B', '#9E9E9E']);
  return {};
});
//# sourceURL=com/autodesk/userAvatar.js
;

System.get("com/autodesk/userAvatar.js");angular.module("com/autodesk/userAvatar.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('userAvatar.html',
    "<span><img class=\"user-avatar\" ng-if=\"userImage\" ng-src=\"{{userImage}}\" alt=\"{{userName}}\"><div class=\"user-initials\" ng-style=\"{'background-color': userBackgroundColor}\" ng-if=\"!userImage\" alt=\"{{userName}}\">{{userInitials}}</div></span>"
  );
}]);