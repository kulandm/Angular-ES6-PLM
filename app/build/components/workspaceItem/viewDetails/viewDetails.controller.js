System.registerModule("com/autodesk/components/workspaceItem/viewDetails/viewDetails.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewDetails/viewDetails.controller.js";
  var ViewDetailsController = function() {
    function ViewDetailsController($scope, $rootScope, $state, $stateParams, $location, $timeout, $filter, ModelsManager, EventService, FlyoutService, PLMPermissions, PermissionService, ClassificationService, SECTION_TYPES, FieldTypes, ClassificationUtil, NotificationService, NotificationTypes, OWNER_TYPE, _, $mdDialog) {
      var $__3 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$location = $location;
      this.$timeout = $timeout;
      this.$filter = $filter;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.PLMPermissions = PLMPermissions;
      this.PermissionService = PermissionService;
      this._ = _;
      this.ClassificationService = ClassificationService;
      this.SECTION_TYPES = SECTION_TYPES;
      this.ClassificationUtil = ClassificationUtil;
      this.FieldTypes = FieldTypes;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.$mdDialog = $mdDialog;
      var that = this;
      this.workspaceId = this.$stateParams.workspaceId;
      this.itemId = this.$location.search().itemId;
      this.cached = angular.isDefined(this.$location.search().cached) && this.$location.search().cached === 'false' ? false : true;
      this.editPermission = this.PLMPermissions.EDIT_ITEMS;
      this.isEditable = false;
      this.dateFormat = 'yyyy';
      this.dateAndHourFormat = 'yyyy hh:mm a';
      this.isSavingData = false;
      this.itemDetailsData = {};
      this.itemDetailsFieldsData = {};
      this.ItemObj = null;
      this.ownershipData = null;
      this.primaryUser = OWNER_TYPE.PRIMARY;
      this.additionalUser = OWNER_TYPE.ADDITIONAL_USER;
      this.additionalGroup = OWNER_TYPE.ADDITIONAL_GROUP;
      this.classificationState = {classification: {id: null}};
      this.ownershipListenerId = EventService.listen(("ownership:" + this.itemId + ":done"), function(event, ownershipObj) {
        EventService.unlisten($__3.ownershipListenerId);
        $__3.ownershipObj = ownershipObj;
        $__3.ownershipData = ownershipObj.getFullList();
        $__3.parseOwnersDetails();
      });
      this.itemListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, itemObj) {
        $__3.EventService.unlisten($__3.itemListenerId);
        PermissionService.checkPermissionByItem(itemObj, $__3.PLMPermissions.VIEW_OWNER_CHANGE_SUMMARY).then(function(hasPermission) {
          return hasPermission && ModelsManager.getOwnershipByLink($__3.itemId, itemObj.getOwnershipLink());
        });
        $__3.ItemObj = itemObj;
        $__3.isEditable = !$__3._.every(itemObj.getSections(), function(item) {
          return item.sectionLocked === true;
        });
        $__3.itemDetailsData = $__3.ItemObj.getFullList();
        $__3.itemDetailsFieldsData = $__3.ItemObj.getSections();
        $__3.ItemObj.workspaceObj.getSectionsMeta().then(function() {
          $__3.itemDetailsMeta = $__3.ItemObj.workspaceObj.getSectionsMetadata();
          $__3.itemDetailsViewModeData = $__3._.filter($__3.itemDetailsMeta, function(section) {
            if (!$__3.isClassificationSection(section)) {
              $__3._.each(section.definition.fields, function(field) {
                if (field.type === 'FIELD') {
                  var foundField = $__3.findValue(section.link, field.link);
                  field.mainItemId = $__3.itemId;
                  buildMetaField(field, foundField);
                } else {
                  $__3._.each(field.definition.fields, function(matrixRow) {
                    $__3._.each(matrixRow, function(matrixColField) {
                      if (matrixColField !== null) {
                        var foundField = $__3.findValue(section.link, matrixColField.link);
                        matrixColField.mainItemId = $__3.itemId;
                        buildMetaField(matrixColField, foundField);
                      }
                    });
                  });
                }
              });
            } else {
              section.definition.fields = [];
              var urn = $__3.getPartUrn(section);
              $__3.ClassificationService.getClassificationFields(urn, urn, null, false).then(function(response) {
                section.definition.fields = response.properties;
                $__3.classificationState.classification = {id: response.classificationId};
              });
              $__3.classificationChangeListenerId = EventService.listen('classification:update', function(event, newClassification) {
                var itemClass = newClassification.selected;
                $__3.classificationState.classification = itemClass;
                section.definition.fields = [];
                $__3.ClassificationService.getClassificationFields(urn, urn, itemClass.id, false).then(function(response) {
                  section.definition.fields = response.properties;
                });
              });
            }
            var sectionToReturn = $__3._.find($__3.itemDetailsFieldsData, function(foundSection) {
              return (foundSection.link.substring(foundSection.link.lastIndexOf('/') + 1) === (section.link.substring(section.link.lastIndexOf('/') + 1)));
            });
            return angular.isDefined(sectionToReturn);
          });
        });
        var buildMetaField = function(field, foundField) {
          field.fieldMetadata.readOnly = field.fieldMetadata.editability !== 'ALWAYS';
          if (angular.isDefined(foundField)) {
            field.value = (foundField.metadata.dataTypeId === $__3.FieldTypes.PARAGRAPH) ? $__3.$filter('lineBreakFilter')(foundField.value) : foundField.value;
            field.metadata = foundField.metadata;
            if (angular.isDefined(field.fieldMetadata)) {
              field.options = field.fieldMetadata.picklistPayload;
            }
          } else {
            if (angular.isDefined(field.fieldMetadata)) {
              field.options = field.fieldMetadata.picklistPayload;
            }
            field.metadata = field.fieldMetadata;
            field.metadata.dataTypeId = field.metadata.type.link.substring(field.metadata.type.link.lastIndexOf('/') + 1);
            field.value = '';
          }
        };
        try {
          $__3.$scope.$digest();
        } catch (e) {}
      });
      if (this.itemId) {
        this.ModelsManager.getItem(this.itemId, !this.isViewState(), this.cached);
      }
      this.userListenerId = this.EventService.listen('currentUser:currentUser:done', function(event, userObj) {
        $__3.EventService.unlisten(that.userListenerId);
        $__3.dateFormat = userObj.getDateFormat();
        $__3.dateAndHourFormat = (userObj.getDateFormat() + " hh:mm a");
      });
      this.$scope.$on('$destroy', function() {
        $__3.EventService.unlisten($__3.itemListenerId);
        $__3.EventService.unlisten($__3.userListenerId);
        $__3.EventService.unlisten($__3.ownershipListenerId);
        if ($__3.classificationChangeListenerId) {
          $__3.EventService.unlisten($__3.classificationChangeListenerId);
        }
      });
    }
    return ($traceurRuntime.createClass)(ViewDetailsController, {
      findSection: function(sectionLink) {
        return this._.find(this.itemDetailsData.sections, function(sectionElement) {
          return (sectionElement.link.substring(sectionElement.link.lastIndexOf('/') + 1) === sectionLink.substring(sectionLink.lastIndexOf('/') + 1));
        });
      },
      findValue: function(sectionLink, fieldId) {
        var foundSection = this.findSection(sectionLink);
        var foundField;
        if (angular.isDefined(foundSection)) {
          foundField = this._.find(foundSection.fields, function(fieldElement) {
            return (fieldElement.__self__.substring(fieldElement.__self__.lastIndexOf('/') + 1) === fieldId.substring(fieldId.lastIndexOf('/') + 1));
          });
        }
        return foundField;
      },
      updateChanges: function(fieldId, newVal) {},
      isSectionEditable: function(sectionLink) {
        var section = this.findSection(sectionLink);
        return !section.sectionLocked;
      },
      getFieldIdFromUrn: function(urn) {
        return urn && urn.substring && urn.lastIndexOf && urn.substring(urn.lastIndexOf('.') + 1);
      },
      getValueFromMetadataFields: function(fieldId, metadataFields) {
        var value = null;
        var that = this;
        if (!fieldId || !metadataFields) {
          return null;
        }
        this._.each(metadataFields, function(metadataField) {
          if (value === null) {
            if (metadataField.type !== 'MATRIX') {
              var metadataFieldId = that.getFieldIdFromUrn(metadataField.urn);
              if (metadataFieldId === fieldId) {
                value = metadataField.value;
              }
            } else {
              value = that.getValueFromMatrixMetadataFields(fieldId, metadataField.definition.fields);
            }
          }
        });
        return value;
      },
      getValueFromMatrixMetadataFields: function(fieldId, matrixMetadataFields) {
        var value = null;
        var that = this;
        if (!fieldId || !matrixMetadataFields) {
          return null;
        }
        that._.chain(matrixMetadataFields).flatten(_.map(function(flatMatrix) {
          return flatMatrix;
        })).filter(function(field) {
          return field !== null;
        }).each(function(field) {
          var metadataFieldId = that.getFieldIdFromUrn(field.urn);
          if (metadataFieldId === fieldId) {
            value = field.value;
          }
        });
        return value;
      },
      triggerSave: function() {
        var $__3 = this;
        var that = this;
        var classificationFields = null;
        var classificationSection = null;
        this.isSavingData = true;
        this.$scope.isSavingData = true;
        this._.each(this.itemDetailsViewModeData, function(metadataSection) {
          if ($__3.isClassificationSection(metadataSection) && $__3.isSectionEditable(metadataSection.link)) {
            classificationSection = metadataSection;
            classificationFields = angular.copy(metadataSection.definition.fields);
          }
        });
        this._.each(this.itemDetailsFieldsData, function(section) {
          $__3._.each(section.fields, function(field) {
            var fieldId = that.getFieldIdFromUrn(field.urn);
            $__3._.each($__3.itemDetailsViewModeData, function(metadataSection) {
              if (!$__3.isClassificationSection(metadataSection) && (section.link.substr(section.link.lastIndexOf('/')) === metadataSection.link.substr(metadataSection.link.lastIndexOf('/')))) {
                var value = that.getValueFromMetadataFields(fieldId, metadataSection.definition.fields);
                field.value = value;
              }
            });
          });
        });
        var saveCwsListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":saveCwsDone"), function(event, flag) {
          $__3.EventService.unlisten(saveCwsListenerId);
          var saveListenerId = $__3.EventService.listen(("itemInstance:" + $__3.itemId + ":saveDone"), function(event, flag) {
            $__3.EventService.unlisten(saveListenerId);
            if (flag) {
              $__3.NotificationService.addNotification($__3.NotificationTypes.SUCCESS, ("" + $__3.ItemObj.getItemTitle() + $__3.$rootScope.bundle.notification.singleEdit.success));
              $__3.$state.go('details', {
                tab: $__3.$location.search().tab,
                view: $__3.$location.search().view,
                mode: 'view',
                itemId: $__3.$location.search().itemId,
                cached: false
              });
            } else {
              $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, ("" + $__3.ItemObj.getItemTitle() + $__3.$rootScope.bundle.notification.singleEdit.failed));
              $__3.isSavingData = false;
              $__3.$scope.isSavingData = false;
            }
            $__3.NotificationService.showNotifications();
          });
          $__3.EventService.send(("itemInstance:" + $__3.itemId + ":saveItem"), [$__3.ItemObj, $__3.itemDetailsFieldsData]);
        });
        if (classificationSection !== null) {
          this.triggerClassificationSave(classificationFields);
        } else {
          this.EventService.send(("itemInstance:" + this.itemId + ":saveCwsDone"), [true]);
        }
      },
      triggerCancel: function() {
        this.$state.go('details', {
          tab: this.$location.search().tab,
          view: this.$location.search().view,
          mode: 'view',
          itemId: this.$location.search().itemId,
          cached: false
        });
      },
      triggerClassificationSave: function(rawFields) {
        var $__3 = this;
        var newRawFields = [];
        this._.each(rawFields, function(cwsFieldAdapter) {
          newRawFields.push(cwsFieldAdapter.getOriginData());
        });
        this.ClassificationService.saveRawFields(this.classificationState.classification.id, this.ItemObj.getUrn(), newRawFields).then(function(response) {
          $__3.EventService.send(("itemInstance:" + $__3.itemId + ":saveCwsDone"), [true]);
        }, function(errors) {
          if (angular.isDefined(errors.phantomRestriction)) {
            $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, $__3.$rootScope.bundle.classifications.section.warning.phantom_class);
          } else {
            $__3._.each($__3.ClassificationUtil.errorMessageHandler(errors), function(error) {
              $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, error);
            });
          }
        });
      },
      goToEdit: function() {
        this.$state.go('details', {
          tab: this.$location.search().tab,
          view: this.$location.search().view,
          mode: 'edit',
          itemId: this.$location.search().itemId
        });
      },
      isViewState: function() {
        return (this.$location.search().mode === 'view');
      },
      tooltipFlyout: function(event, displayName, description) {
        var tooltip = this.FlyoutService.open({
          templateUrl: 'partials/workspaceItemTooltip.html',
          scope: this.$scope,
          anchorEl: angular.element(event.target),
          placement: 'left',
          showArrow: true,
          flyoutClass: 'item-tooltip-flyout',
          controller: function($scope, $flyoutInstance) {
            $scope.displayName = displayName;
            $scope.description = description;
            $scope.closeFlyout = function() {
              $flyoutInstance.close();
            };
          }
        });
      },
      getPartUrn: function(section) {
        if (this.isClassificationSection(section)) {
          return this.ItemObj.getUrn();
        }
        return undefined;
      },
      isClassificationSection: function(section) {
        return (section.definition.type === this.SECTION_TYPES.CLASSIFICATION);
      },
      isRequiredField: function(validationRules) {
        if (!angular.isDefined(validationRules)) {
          return false;
        }
        return angular.isDefined(validationRules.required) || angular.isDefined(validationRules.dropDownSelection);
      },
      toggleOwnershipFlyoutDisplay: function(event, userId) {
        this.FlyoutService.open({
          flyoutClass: 'user-profile-flyout',
          scope: this.$scope,
          anchorEl: event.target,
          template: ("<user-profile-summary user-id=\"" + userId + "\"></user-profile-summary>")
        });
      },
      parseOwnersDetails: function() {
        var $__3 = this;
        _.each(this.ownershipData.ownership.owners, function(owner) {
          owner.id = owner.detailsLink.substr(owner.detailsLink.lastIndexOf('/') + 1);
          owner.type = owner.ownerType === $__3.additionalGroup ? $__3.$rootScope.bundle.details.group : $__3.$rootScope.bundle.details.user;
        });
      },
      triggerChangeOwnerDialog: function() {
        var $__3 = this;
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/changeOwner/changeOwner.html',
          controller: 'ChangeOwnerController as changeOwnerCtrl',
          locals: {ownershipObj: this.ownershipObj}
        }).then(function() {
          $__3.$state.reload('details');
        });
      },
      triggerEditAdditionalOwnersDialog: function() {
        var $__3 = this;
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/changeOwner/editAdditionalOwners.html',
          controller: 'EditAdditionalOwnersController as editAdditionalOwnersCtrl',
          locals: {ownershipObj: this.ownershipObj}
        }).then(function() {
          $__3.$state.reload('details');
        });
      }
    }, {});
  }();
  var $__default = ViewDetailsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewDetails/viewDetails.controller.js
