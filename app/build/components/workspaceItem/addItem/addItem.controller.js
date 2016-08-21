System.registerModule("com/autodesk/components/workspaceItem/addItem/addItem.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/addItem/addItem.controller.js";
  var AddItemController = function() {
    function AddItemController($scope, $rootScope, $state, $stateParams, $location, $mdDialog, EventService, ModelsManager, NotificationService, NotificationTypes, UrnParser, ValidationUtil, ClassificationService, ClassificationUtil, SECTION_TYPES, _) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$mdDialog = $mdDialog;
      this.$location = $location;
      this.EventService = EventService;
      this.ModelsManager = ModelsManager;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.UrnParser = UrnParser;
      this.ValidationUtil = ValidationUtil;
      this.ClassificationService = ClassificationService;
      this.ClassificationUtil = ClassificationUtil;
      this.SECTION_TYPES = SECTION_TYPES;
      this._ = _;
      var that = this;
      this.workspaceId = this.$stateParams.workspaceId;
      this.isSavingData = false;
      this.unsupportedFields = {hasUnsupported: false};
      this.createType = 2;
      this.formFields = [];
      this.workspaceUrn = null;
      this.classificationId = null;
      this.saveItemListenerId = null;
      this.saveCwsListenerId = null;
    }
    return ($traceurRuntime.createClass)(AddItemController, {
      isViewState: function() {
        return false;
      },
      isAddState: function() {
        return true;
      },
      getFields: function() {
        return this._.flatten(this._.pluck(this.formFields, 'fields'));
      },
      triggerSave: function() {
        var $__2 = this;
        this.isSavingData = true;
        this.saveItemListenerId = this.EventService.listen('itemInstance:newItem:saveDone', function(event, response, flag) {
          var $__4,
              $__5;
          $__2.EventService.unlisten($__2.saveItemListenerId);
          $__2.ValidationUtil.clearValidationErrors($__2.getFields());
          if (flag) {
            var createItemAbsUrl = response.location;
            var $__3 = createItemAbsUrl.match(/workspaces\/(\S*)\/items\/(\S*)/),
                relativeUrl = ($__4 = $__3[Symbol.iterator](), ($__5 = $__4.next()).done ? void 0 : $__5.value),
                workspaceId = ($__5 = $__4.next()).done ? void 0 : $__5.value,
                dmsId = ($__5 = $__4.next()).done ? void 0 : $__5.value;
            var resourceId = (workspaceId + "@" + dmsId);
            $__2.triggerClassificationSave(dmsId);
            var itemListenerId = $__2.EventService.listen(("itemInstance:" + resourceId + ":done"), function(event, itemObj) {
              $__2.EventService.unlisten(itemListenerId);
              $__2.createdItemObj = itemObj;
              $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + $__2.createdItemObj.getItemTitle() + $__2.$rootScope.bundle.notification.singleCreate.success));
              var href = $__2.$state.href('details', {
                workspaceId: $__2.workspaceId,
                tab: 'details',
                view: 'full',
                mode: 'view',
                itemId: $__2.UrnParser.encode($__2.createdItemObj.getUrn()),
                cached: false
              });
              href = href.substring(4);
              $__2.$location.url(href);
              $__2.NotificationService.showNotifications();
            });
            $__2.ModelsManager.getItem(resourceId);
          } else {
            $__2.isSavingData = false;
            $__2.ValidationUtil.mapValidationErrors($__2.getFields(), response.data);
            $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + response.data.length + (response.data.length > 1 ? $__2.$rootScope.bundle.notification.create.errors : $__2.$rootScope.bundle.notification.create.error)));
            $__2.NotificationService.showNotifications();
          }
        });
        var formFieldsFlat = [];
        _.each(this.formFields, function(section) {
          var sectionClone = {};
          _.extend(sectionClone, section);
          var normalFields = _.chain(sectionClone.fields).filter(function(field) {
            return (field.type !== 'MATRIX');
          }).value();
          var flatMatrixFields = _.chain(sectionClone.fields).filter(function(field) {
            return field.type === 'MATRIX';
          }).map(function(matrix) {
            return _.flatten(matrix.definition.fields, true);
          }).flatten(_.map(function(flatMatrix) {
            return flatMatrix;
          })).filter(function(flatMatrixIndex) {
            return flatMatrixIndex !== null;
          }).value();
          sectionClone.fields = normalFields.concat(flatMatrixFields);
          formFieldsFlat.push(sectionClone);
        });
        this.saveCwsListenerId = this.EventService.listen('itemInstance:newItem:saveCwsDone', function(event, flag) {
          $__2.EventService.unlisten($__2.saveCwsListenerId);
          $__2.EventService.send('itemInstance:newItem:save', [null, $__2.workspaceId, formFieldsFlat]);
        });
        this.triggerClassificationSave();
      },
      triggerClassificationSave: function() {
        var dmsId = arguments[0];
        var $__2 = this;
        var cwsRawFields = [];
        var initialClassificationId = null;
        var cwsSectionExist = false;
        cwsSectionExist = _.some(this.formFields, function(section) {
          if ($__2.isClassificationSection(section)) {
            initialClassificationId = section.initialClassificationId;
            cwsRawFields = $__2._.map(section.fields, function(cwsFieldAdapterInstance) {
              return cwsFieldAdapterInstance.getOriginData();
            });
            return true;
          }
          return false;
        });
        if (!cwsSectionExist) {
          this.EventService.send('itemInstance:newItem:saveCwsDone', [true]);
        } else {
          this.classificationId = (this.classificationId === null) ? initialClassificationId : this.classificationId;
          this.ClassificationService.saveRawFields(this.classificationId, this.workspaceUrn, cwsRawFields, dmsId).then(function(response) {
            $__2.EventService.send('itemInstance:newItem:saveCwsDone', [true]);
          }, function(errors) {
            $__2.isSavingData = false;
            $__2.EventService.unlisten($__2.saveItemListenerId);
            $__2.EventService.unlisten($__2.saveCwsListenerId);
            if (angular.isDefined(errors.phantomRestriction)) {
              $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, $__2.$rootScope.bundle.classifications.section.warning.phantom_class);
            } else {
              $__2._.each($__2.ClassificationUtil.errorMessageHandler(errors), function(error) {
                $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, error);
              });
            }
            $__2.NotificationService.showNotifications();
          });
        }
      },
      triggerCancel: function() {
        var $__2 = this;
        this.$mdDialog.show({
          controller: 'ConfirmationDialogController',
          controllerAs: 'confirmationDialogCtrl',
          templateUrl: 'build/components/confirmationDialog/confirmationDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        }).then(function() {
          $__2.triggerCancelConfirm();
        }, function() {});
      },
      triggerCancelConfirm: function() {
        this.$state.go('workspace-items-list', {
          workspaceId: this.workspaceId,
          itemId: null
        });
      },
      isClassificationSection: function(section) {
        return (section.type === this.SECTION_TYPES.CLASSIFICATION);
      }
    }, {});
  }();
  var $__default = AddItemController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/addItem/addItem.controller.js
