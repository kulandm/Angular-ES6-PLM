System.registerModule("com/autodesk/notification.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/notification.js";
  var underscoreModule = System.get("com/autodesk/UnderscoreService.js").default;
  var eventServiceModule = System.get("com/autodesk/EventService.js").default;
  var NotificationService = System.get("com/autodesk/notification.service.js").default;
  angular.module(__moduleName, [underscoreModule.name, eventServiceModule.name, 'ngAnimate', 'ngMaterial', 'ngAria']).provider('NotificationService', function() {
    var pathToTemplates = '';
    this.setPathToTemplates = function(value) {
      pathToTemplates = value || '';
    };
    this.$get = ['$rootScope', '$interval', '$mdDialog', '$mdToast', '_', 'EventService', 'NotificationTypes', function($rootScope, $interval, $mdDialog, $mdToast, _, EventService, NotificationTypes) {
      return new NotificationService($rootScope, $interval, $mdDialog, $mdToast, _, EventService, NotificationTypes, pathToTemplates);
    }];
  }).constant('NotificationTypes', {
    SUCCESS: 'success',
    ERROR: 'error',
    PERMISSION: 'permissionError'
  });
  return {};
});
//# sourceURL=com/autodesk/notification.js
;

System.registerModule("com/autodesk/notification.service.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/notification.service.js";
  var NotificationService = function() {
    function NotificationService($rootScope, $interval, $mdDialog, $mdToast, _, EventService, NotificationTypes, pathToTemplates) {
      var $__3 = this;
      this.$rootScope = $rootScope;
      this.$interval = $interval;
      this.$mdDialog = $mdDialog;
      this.$mdToast = $mdToast;
      this._ = _;
      this.NotificationTypes = NotificationTypes;
      this.pathToTemplates = pathToTemplates;
      this.notifications = [];
      this.isAgreementShown = false;
      this.isNotificationsShown = false;
      this.notificationInterval;
      EventService.listen('**:permissionDenied', function() {
        $__3.addNotification(NotificationTypes.PERMISSION, $rootScope.bundle.notification.permissionDenied.noPermission);
        $__3.showNotifications();
      });
      var agreementAcceptanceListener = EventService.listen('forbiddenAccess:notAcceptedAgreement', function() {
        if (!$__3.isAgreementShown) {
          $__3.isAgreementShown = true;
          $mdDialog.show({
            escapeToClose: false,
            clickOutsideToClose: false,
            templateUrl: 'notAcceptedAgreement.html',
            onComplete: function afterShowAnimation(scope, element) {
              element.addClass('over-everything');
            },
            controller: function($scope, $state, $mdDialog, RESTWrapperService, ModelsManager, AuthenticationService) {
              $scope.acceptTerms = function() {
                RESTWrapperService.get('api/v2/users/profile', null, null).then(function(userObj) {
                  return RESTWrapperService.patch(null, ("api/v3/users/" + userObj.id + "/"), null, {acceptedTerms: true});
                }).then(function() {
                  EventService.unlisten(agreementAcceptanceListener);
                  $mdDialog.hide();
                  $state.reload();
                });
              };
              $scope.declineTerms = function() {
                RESTWrapperService.get('api/v2/users/profile', null, null).then(function(userObj) {
                  return '/api/v3/users/' + userObj.id + '/authorizations';
                }).then(function(logoutUrl) {
                  setTimeout(function() {
                    $scope.$apply($scope.declineTermsAction = logoutUrl);
                    AuthenticationService.requestLogout();
                    document.querySelector('#declineTermsForm').submit();
                  });
                });
              };
            }
          }).finally(function() {
            $__3.isAgreementShown = false;
          });
        }
      });
    }
    return ($traceurRuntime.createClass)(NotificationService, {
      showNotifications: function(parentElement, bulkOperationMessage) {
        var $__3 = this;
        if (!this.notifications.length) {
          return;
        }
        var $scope = this.$rootScope.$new();
        $scope.notifications = this.notifications;
        $scope.hasErrorNotification = this.hasErrorNotification();
        $scope.close = this.$mdToast.hide;
        if (this.notifications.length > 1) {
          $scope.$mdDialog = this.$mdDialog;
          $scope.bulkNotification = bulkOperationMessage || (this.hasErrorNotification() ? this.$rootScope.bundle.notification.bulk.failed : this.getBulkSuccessNotificationMessage());
          $scope.bulkSuccessMessage = this.getBulkSuccessNotificationMessage();
          $scope.showDetails = function() {
            $scope.$mdDialog.show({
              templateUrl: 'notificationDetails.html',
              clickOutsideToClose: false,
              locals: {
                notifications: $scope.notifications,
                bulkSuccessMessage: $scope.bulkSuccessMessage
              },
              controller: function($scope, $rootScope, $mdDialog, notifications, bulkSuccessMessage, _) {
                $scope.notifications = notifications;
                $scope.bulkSuccessMessage = bulkSuccessMessage;
                $scope.closeDialog = $mdDialog.hide;
                $scope.isContentShown = true;
                $scope.trimmedNotifications = _.map($scope.notifications, function(notification) {
                  notification.content = notification.content.replace($rootScope.bundle.notification.singleAdd.success, '').replace($rootScope.bundle.notification.singleEdit.success, '').replace($rootScope.bundle.notification.singleRemove.success, '').replace($rootScope.bundle.notification.checkedIn.success, '').replace($rootScope.bundle.notification.checkedOut.success, '').replace($rootScope.bundle.notification.upload.success, '').replace($rootScope.bundle.notification.failed, '');
                  return notification;
                });
                $scope.groupedNotifications = _.groupBy($scope.trimmedNotifications, function(notification) {
                  return notification.type;
                });
                if ($scope.groupedNotifications.error) {
                  $scope.errorCountMessage = $scope.groupedNotifications.error.length > 1 ? (" - " + $scope.groupedNotifications.error.length + " " + $rootScope.bundle.text.items) : (" - " + $scope.groupedNotifications.error.length + " " + $rootScope.bundle.text.item);
                }
                if ($scope.groupedNotifications.success) {
                  $scope.successCountMessage = $scope.groupedNotifications.success.length > 1 ? (" - " + $scope.groupedNotifications.success.length + " " + $rootScope.bundle.text.items) : (" - " + $scope.groupedNotifications.success.length + " " + $rootScope.bundle.text.item);
                }
              }
            });
          };
        }
        this.isNotificationsShown = true;
        this.$mdToast.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: 'notification.html',
          hideDelay: 0,
          position: 'top left',
          parent: parentElement,
          controller: function($interval, $mdToast) {
            $__3.notificationInterval = $interval(function() {
              $mdToast.hide();
            }, 5000, 1);
          }
        }).finally(function() {
          $scope.$destroy();
          $__3.clearAllNotifications();
        });
      },
      addNotification: function(type, message) {
        if (this.isNotificationsShown) {
          this.clearAllNotifications();
        }
        this.notifications.push({
          type: type,
          content: message
        });
      },
      clearAllNotifications: function() {
        this.notifications = [];
        this.isNotificationsShown = false;
        this.$interval.cancel(this.notificationInterval);
      },
      hasErrorNotification: function() {
        var $__3 = this;
        return !!this._.find(this.notifications, function(notification) {
          return notification.type !== $__3.NotificationTypes.SUCCESS;
        });
      },
      getBulkSuccessNotificationMessage: function() {
        var $__3 = this;
        var notificationMessage = this._.find(this.notifications, function(notification) {
          return notification.type === $__3.NotificationTypes.SUCCESS;
        });
        if (notificationMessage) {
          notificationMessage = notificationMessage.content;
          if (notificationMessage.indexOf(this.$rootScope.bundle.notification.singleEdit.success) !== -1) {
            return this.$rootScope.bundle.notification.bulk.edit;
          } else if (notificationMessage.indexOf(this.$rootScope.bundle.notification.singleAdd.success) !== -1) {
            return this.$rootScope.bundle.notification.bulk.add;
          } else if (notificationMessage.indexOf(this.$rootScope.bundle.notification.singleRemove.success) !== -1) {
            return this.$rootScope.bundle.notification.bulk.remove;
          }
        }
      }
    }, {});
  }();
  var $__default = NotificationService;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/notification.service.js
;

System.get("com/autodesk/notification.js");angular.module("com/autodesk/notification.js").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('notAcceptedAgreement.html',
    "<md-dialog class=\"agreement-acceptance-dialog\" aria-label=\"{{$root.bundle.agreement.notAccepted}}\"><md-content layout=\"column\" class=\"agreement-acceptance-dialog-wrapper\"><div class=\"agreement-acceptance-dialog-content\"><div class=\"fusion-lifecycle-logo\"><img src=\"images/Fusion_Lifecycle_2017_stacked.svg\" alt=\"{{$root.bundle.text.appName}}\"></div><h2 class=\"title\">{{$root.bundle.agreement.title}}</h2><p>{{$root.bundle.agreement.firstParagraph}}</p><p>{{$root.bundle.agreement.secondParagraph}}</p><p>{{$root.bundle.agreement.thirdParagraph}}</p><section class=\"accepted\"><input type=\"checkbox\" id=\"accepted-checkbox\" ng-model=\"acceptedAgreement\"><label>{{$root.bundle.agreement.accept}} <a href=\"http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services\">{{$root.bundle.agreement.fusionLifecycleTermsOfService}}</a></label></section></div><div class=\"agreement-acceptance-dialog-actions\"><form name=\"declineTermsForm\" id=\"declineTermsForm\" action=\"{{declineTermsAction}}\" method=\"POST\"><input type=\"hidden\" name=\"holder\" value=\"holderValue\"></form><md-button ng-click=\"declineTerms()\">{{$root.bundle.button.noThanks}}</md-button><md-button class=\"md-primary\" ng-click=\"acceptTerms()\" ng-disabled=\"!acceptedAgreement\">{{$root.bundle.button.ok}}</md-button></div></md-content></md-dialog>"
  );


  $templateCache.put('notification.html',
    "<md-toast layout=\"row\" layout-align=\"space-between center\" class=\"notification-toast\" ng-class=\"{success: !hasErrorNotification, error: hasErrorNotification}\"><div class=\"notification-content\" flex><span ng-if=\"notifications.length === 1\">{{notifications[0].content}}</span> <span ng-if=\"notifications.length > 1\">{{bulkNotification}} - <a href=\"#\" class=\"notification-link\" ng-click=\"showDetails()\">{{$root.bundle.notification.viewDetails}}</a></span></div><div><a href=\"#\" ng-click=\"close()\"><i class=\"zmdi zmdi-close\"></i></a></div></md-toast>"
  );


  $templateCache.put('notificationDetails.html',
    "<md-dialog aria-label=\"notificationDetails\" class=\"notification-details\"><md-toolbar><div class=\"md-toolbar-tools\"><h2 class=\"notification-header\">{{$root.bundle.notification.details}}</h2><span flex></span> <a href=\"#\" ng-click=\"closeDialog()\"><i class=\"zmdi zmdi-close\"></i></a></div></md-toolbar><md-divider></md-divider><md-dialog-content><div class=\"md-dialog-content\"><!-- Section for failed notifications --><div ng-if=\"groupedNotifications.error\" class=\"section\"><div class=\"section-header\" ng-click=\"groupedNotifications.success ?\r" +
    "\n" +
    "\t\t\t\t\tisContentShown = !isContentShown : null\" ng-class=\"{'unclickable': !groupedNotifications.success}\" layout=\"row\" layout-align=\"space-between center\" layout-wrap><div><span class=\"items-error\">{{$root.bundle.notification.bulk.failed}}</span> <span class=\"items-count\">{{errorCountMessage}}</span></div><div class=\"section-caret\" ng-show=\"groupedNotifications.success\" ng-class=\"{'rotate-up': isContentShown,\r" +
    "\n" +
    "\t\t\t\t\t\t'rotate-down': !isContentShown,\r" +
    "\n" +
    "\t\t\t\t\t\t'fade': !groupedNotifications.success}\"><i class=\"zmdi zmdi-chevron-up\"></i></div></div><md-divider></md-divider><div class=\"notification-item\" ng-show=\"isContentShown\" ng-repeat=\"item in groupedNotifications.error\">{{item.content}}</div></div><!-- Section for success notification --><div ng-if=\"groupedNotifications.success\" class=\"section\"><div class=\"section-header\" ng-click=\"groupedNotifications.error ?\r" +
    "\n" +
    "\t\t\t\t\tisContentShown = !isContentShown : null\" ng-class=\"{'unclickable': !groupedNotifications.error}\" layout=\"row\" layout-align=\"space-between center\" layout-wrap><div><span class=\"items-success\">{{bulkSuccessMessage}}</span> <span class=\"items-count\">{{successCountMessage}}</span></div><div class=\"section-caret\" ng-show=\"groupedNotifications.error\" ng-class=\"{'rotate-up': isContentShown,\r" +
    "\n" +
    "\t\t\t\t\t\t'rotate-down': !isContentShown,\r" +
    "\n" +
    "\t\t\t\t\t\t'fade': !groupedNotifications.error}\"><i class=\"zmdi zmdi-chevron-up\"></i></div></div><md-divider></md-divider><div class=\"notification-item\" ng-show=\"isContentShown\" ng-repeat=\"item in groupedNotifications.success\">{{item.content}}</div></div></div></md-dialog-content><md-dialog-actions layout=\"row\" layout-align=\"end center\"><md-button class=\"md-primary\" aria-label=\"{{$root.bundle.button.close}}\" ng-click=\"closeDialog()\">{{$root.bundle.button.close}}</md-button></md-dialog-actions></md-dialog>"
  );
}]);