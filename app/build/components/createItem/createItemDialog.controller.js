System.registerModule("com/autodesk/components/createItem/createItemDialog.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/createItem/createItemDialog.controller.js";
  var CreateItemDialogController = function() {
    function CreateItemDialogController($rootScope, $scope, $state, $mdDialog, $q, _, EventService, NotificationService, NotificationTypes, ModelsManager, PLMPermissions, UrnParser, CurrentItem, CurrentWorkspace, AddWorkspaceList, FieldTypes, CreateTypes, createType, ValidationUtil, Workspace) {
      var $__2 = this;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$mdDialog = $mdDialog;
      this.$q = $q;
      this.EventService = EventService;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.ModelsManager = ModelsManager;
      this.UrnParser = UrnParser;
      this.FieldTypes = FieldTypes;
      this.ValidationUtil = ValidationUtil;
      this._ = _;
      this.Workspace = new Workspace();
      this.currentItem = CurrentItem;
      this.currentWorkspace = CurrentWorkspace;
      this.workspacesList = AddWorkspaceList;
      this.createType = createType;
      this.isContextualCreate = createType === CreateTypes.CONTEXTUAL;
      this.isQuickCreate = createType === CreateTypes.QUICK;
      this.selectedWorkspace;
      this.selectedSaveType;
      this.dialogElement;
      this.isSavingData = false;
      this.formFields = [];
      this.unsupportedFields = {hasUnsupported: false};
      this.managedItemObj = null;
      this.managedItemFormObj = null;
      this.filterToApply;
      this.isManagedView = false;
      this.createdItemObj = null;
      this.managedViewHeading = null;
      this.viewPermission = PLMPermissions.VIEW_ITEMS;
      if (this.isQuickCreate) {
        this.filterToApply = this.quickCreateFilter;
      } else if (this.isContextualCreate) {
        this.filterToApply = this.requiredFieldsFilter;
      }
      if (this.isQuickCreate && this.currentWorkspace) {
        this.selectedWorkspace = this._.find(this.workspacesList, function(workspace) {
          return workspace.getId() === $__2.currentWorkspace.getId();
        });
      } else if (this.isContextualCreate && this.workspacesList.length === 1) {
        this.selectedWorkspace = this.workspacesList[0];
      }
    }
    return ($traceurRuntime.createClass)(CreateItemDialogController, {
      getFields: function() {
        return this._.flatten(this._.pluck(this.formFields, 'fields'));
      },
      isFormFilled: function() {
        var $__2 = this;
        if (!this.getFields().length) {
          return false;
        }
        var filteredFields = this._.reject(this.getFields(), function(field) {
          var dataTypeId = parseInt(field.metadata.dataTypeId);
          return dataTypeId === $__2.FieldTypes.AUTONUM || dataTypeId === $__2.FieldTypes.AUTOTEXT;
        });
        return this._.every(this._.pluck(filteredFields, 'value'));
      },
      isSaveDisabled: function() {
        if (this.isManagedView) {
          return !this.canSaveManagedItem();
        } else {
          return !!this.getFields().length && !this.isFormFilled();
        }
      },
      requiredFieldsFilter: function(fieldDefinition) {
        var requiredValidation = false;
        if (fieldDefinition && fieldDefinition.validatorsMeta && fieldDefinition.validatorsMeta.length) {
          requiredValidation = _.find(fieldDefinition.validatorsMeta, function(validation) {
            return validation.validatorName.toUpperCase() === 'REQUIRED' || validation.validatorName.toUpperCase() === 'DROPDOWNSELECTION';
          });
        }
        return requiredValidation;
      },
      quickCreateFilter: function(fieldDefinition) {
        return this.requiredFieldsFilter(fieldDefinition) || fieldDefinition.visibleOnPreview;
      },
      clearFields: function() {
        this._.each(this.getFields(), function(field) {
          return field.value = field.defaultValue;
        });
      },
      close: function() {
        this.$mdDialog.hide(this.isManagedView);
      },
      onSaveChange: function() {
        this.dialogElement = document.querySelector('.create-item-dialog');
        switch (this.selectedSaveType) {
          case this.$rootScope.bundle.create.save:
            if (this.isManagedView) {
              this.manageAndClose();
            } else {
              this.saveAndClose();
            }
            break;
          case this.$rootScope.bundle.create.saveCopy:
            this.saveAndCopy();
            break;
          case this.$rootScope.bundle.create.saveManage:
            this.saveAndManage();
            break;
          case this.$rootScope.bundle.create.saveNew:
            this.saveAndNew();
            break;
          case this.$rootScope.bundle.create.saveView:
            this.saveAndView();
            break;
          default:
            this.save();
        }
        this.selectedSaveType = null;
      },
      saveAndClose: function() {
        var $__2 = this;
        this.save().then(function() {
          $__2.close();
          $__2.NotificationService.showNotifications();
        }, function() {
          $__2.NotificationService.showNotifications($__2.dialogElement);
        });
      },
      saveAndCopy: function() {
        this.save();
      },
      saveAndManage: function() {
        var $__2 = this;
        return this.save().then(function(saveData) {
          return $__2.addItem().then(function() {
            $__2.clearFields();
            $__2.NotificationService.showNotifications($__2.dialogElement);
            $__2.EventService.send('itemAddedToECO:done');
            return $__2.createManagedItemFormObj().then(function(managedItemFormObj) {
              $__2.isManagedView = true;
              $__2.managedViewHeading = saveData.getFullList().title;
              $__2.managedItemFormObj = managedItemFormObj;
            });
          });
        }, function() {
          return $__2.NotificationService.showNotifications($__2.dialogElement);
        });
      },
      saveAndNew: function() {
        var $__2 = this;
        this.save().then(function() {
          $__2.clearFields();
          $__2.NotificationService.showNotifications($__2.dialogElement);
        }, function() {
          $__2.close();
          $__2.NotificationService.showNotifications();
        });
      },
      saveAndView: function() {
        var $__2 = this;
        this.save().then(function(itemObj) {
          $__2.$state.go('details', {
            workspaceId: itemObj.getWorkspaceObj().getId(),
            tab: 'details',
            view: 'full',
            mode: 'view',
            itemId: ("" + $__2.UrnParser.encode(itemObj.getFullList().urn))
          });
          $__2.NotificationService.showNotifications();
        }, function(errorInfo) {
          $__2.NotificationService.showNotifications($__2.dialogElement);
        }).finally(this.close);
      },
      save: function() {
        var $__2 = this;
        var deferred = this.$q.defer();
        var selectedWorkspaceId = this.selectedWorkspace.getId();
        this.isSavingData = true;
        var saveItemListenerId = this.EventService.listen('itemInstance:newItem:saveDone', function(event, response, flag) {
          var $__4,
              $__5;
          $__2.EventService.unlisten(saveItemListenerId);
          $__2.ValidationUtil.clearValidationErrors($__2.getFields());
          if (flag) {
            var createItemAbsUrl = response.location;
            var $__3 = createItemAbsUrl.match(/workspaces\/(\S*)\/items\/(\S*)/),
                relativeUrl = ($__4 = $__3[Symbol.iterator](), ($__5 = $__4.next()).done ? void 0 : $__5.value),
                workspaceId = ($__5 = $__4.next()).done ? void 0 : $__5.value,
                dmsId = ($__5 = $__4.next()).done ? void 0 : $__5.value;
            var resourceId = (workspaceId + "@" + dmsId);
            var itemListenerId = $__2.EventService.listen(("itemInstance:" + resourceId + ":done"), function(event, itemObj) {
              $__2.EventService.unlisten(itemListenerId);
              $__2.createdItemObj = itemObj;
              $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + $__2.createdItemObj.getItemTitle() + $__2.$rootScope.bundle.notification.singleCreate.success));
              deferred.resolve(itemObj);
            });
            $__2.ModelsManager.getItem(resourceId);
          } else {
            $__2.ValidationUtil.mapValidationErrors($__2.getFields(), response.data);
            $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + response.data.length + (response.data.length > 1 ? $__2.$rootScope.bundle.notification.create.errors : $__2.$rootScope.bundle.notification.create.error)));
            deferred.reject(response);
          }
          $__2.isSavingData = false;
        });
        this.EventService.send('itemInstance:newItem:save', [null, selectedWorkspaceId, this.formFields]);
        return deferred.promise;
      },
      addItem: function() {
        var deferred = this.$q.defer();
        this.EventService.send(("itemInstance:" + this.currentItem.getId() + ":associateAffectedItem"), [this.createdItemObj, this.currentItem.getFullList().__self__, this.currentItem.getFullList().title]);
        this.EventService.listen(("itemInstance:" + this.currentItem.getId() + ":associationDone"), function(event, isAdded) {
          if (isAdded) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        });
        return deferred.promise;
      },
      createManagedItemFormObj: function() {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          $__2.customFields = [];
          var revisioningItemEncodedURN = $__2.UrnParser.encode($__2.createdItemObj.getFullList().urn);
          var managedItemsMetaListenerId = $__2.EventService.listen(("affectedItemsMeta:" + revisioningItemEncodedURN + ":done"), function(event, managedItemsMetaObj) {
            $__2.EventService.unlisten(managedItemsMetaListenerId);
            var managedItemsMeta = managedItemsMetaObj.getFullList();
            var customFieldPromises = $__2._.map(managedItemsMeta, function(field) {
              return $__2.$q(function(resolve) {
                var customCol = {
                  displayName: field.name,
                  fieldMetadata: field,
                  field: managedItemsMetaObj.getFieldId(field),
                  dataType: managedItemsMetaObj.getDataTypeId(field),
                  edit: field.editability === 'ALWAYS',
                  isPicklist: angular.isDefined(field.picklist) && field.picklist !== null
                };
                if (customCol.isPicklist) {
                  $__2.Workspace.setPicklistHook(customCol).then(function() {
                    $__2.customFields.push(customCol);
                    resolve();
                  });
                } else {
                  $__2.customFields.push(customCol);
                  resolve();
                }
              });
            });
            $__2.$q.all(customFieldPromises).then(function() {
              $__2.ModelsManager.getAffectedItemsByLink(revisioningItemEncodedURN, $__2.createdItemObj.getAffectedItemsLink());
            });
          });
          var managedItemsListenerId = $__2.EventService.listen(("affectedItems:" + revisioningItemEncodedURN + ":done"), function(event, managedItemsObj) {
            $__2.EventService.unlisten(managedItemsListenerId);
            $__2.managedItemObj = managedItemsObj.getFullList()[0];
            var formObj = $__2.getManagedItemFields();
            $__2.getAvailableTransitions($__2.managedItemObj.getId(), formObj, $__2.managedItemObj.getObject().availableTransitions).then(function() {
              formObj.lifecycle.lifecycleChanged();
              resolve(formObj);
            });
          });
          $__2.ModelsManager.getAffectedItemsMetaByLink(revisioningItemEncodedURN, $__2.createdItemObj.getAffectedItemsMetaLink());
        });
      },
      getManagedItemFields: function() {
        var $__2 = this;
        var formObj = {};
        var managedItemObjData = this.managedItemObj.getObject();
        var itemTitle = managedItemObjData.item.version ? (managedItemObjData.item.title + " " + managedItemObjData.item.version) : ("" + managedItemObjData.item.title);
        var effectivityDate = managedItemObjData.effectivityDate ? new Date(managedItemObjData.effectivityDate) : null;
        formObj.item = {
          value: itemTitle,
          originalValue: itemTitle,
          metadata: {dataTypeId: this.FieldTypes.SINGLE_LINE_TEXT},
          edit: false
        };
        formObj.lifecycle = {
          value: {title: ''},
          originalValue: {title: ''},
          metadata: {dataTypeId: this.FieldTypes.PICKLIST},
          lifecycleChanged: function() {
            if (formObj.lifecycle.value.link) {
              formObj.lifecycle.value = $__2._.clone($__2._.find(formObj.lifecycle.options.items, function(option) {
                return option.title === formObj.lifecycle.value.title;
              }));
              if ((!formObj.effectivity.value && formObj.lifecycle.value && formObj.lifecycle.value.effectivityWritable) || (formObj.lifecycle.value && formObj.lifecycle.value.effectivityWritable === false)) {
                formObj.effectivity.value = formObj.effectivity.originalValue;
              }
            } else {
              formObj.lifecycle.value = $__2._.clone(formObj.lifecycle.options.items[0]);
            }
            var overrideTargetRevision = formObj.lifecycle.value.overrideTargetRevision;
            var increaseRelease = formObj.lifecycle.value.incrementRelease;
            var isToEditable = (overrideTargetRevision === 'MANUAL') && increaseRelease;
            formObj.to.edit = isToEditable;
          }
        };
        formObj.effectivity = {
          value: effectivityDate,
          originalValue: effectivityDate,
          metadata: {
            dataTypeId: this.FieldTypes.DATE,
            datePickerMinDate: new Date()
          },
          placeholder: this.$rootScope.bundle.affectedItems.onRelease
        };
        formObj.from = managedItemObjData.fromRelease !== '0' ? managedItemObjData.fromRelease : '';
        formObj.to = {
          value: managedItemObjData.toRelease,
          originalValue: managedItemObjData.toRelease,
          fieldTypeId: 'SINGLE_LINE',
          metadata: {
            dataTypeId: this.FieldTypes.SINGLE_LINE_TEXT,
            fieldLength: 5
          },
          edit: false
        };
        formObj.customFields = this.getManagedItemCustomFields();
        return formObj;
      },
      getManagedItemCustomFields: function() {
        var $__2 = this;
        var managedItemObjData = this.managedItemObj.getObject();
        var customFormFields = [];
        this._.each(this.customFields, function(customField) {
          if (customField.isPicklist) {
            customFormFields.push({
              link: customField.fieldMetadata.__self__,
              title: customField.displayName,
              value: '',
              originalValue: '',
              fieldTypeId: customField.field,
              metadata: $__2._.extend(customField.fieldMetadata, {dataTypeId: parseInt(customField.dataType)}),
              options: customField.fieldMetadata.picklistPayload,
              urn: managedItemObjData.urn,
              ref: customField
            });
          } else if (!customField.isPicklist) {
            customFormFields.push({
              title: customField.displayName,
              value: '',
              originalValue: '',
              fieldTypeId: customField.field,
              metadata: $__2._.extend(customField.fieldMetadata, {dataTypeId: parseInt(customField.dataType)}),
              ref: customField
            });
          }
        });
        return customFormFields;
      },
      getAvailableTransitions: function(itemId, itemRecord, availTransitLink) {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          var managedItemsTransitionsListenerId = $__2.EventService.listen(("affectedItemTransitions:" + itemId + ":done"), function(event, data) {
            $__2.EventService.unlisten(managedItemsTransitionsListenerId);
            itemRecord.lifecycle.options = {items: $__2._.map(data.json, function(transition) {
                transition.title = transition.name;
                transition.link = transition.__self__;
                return transition;
              })};
            itemRecord.lifecycle.options.items.unshift({title: $__2.$rootScope.bundle.affectedItems.pleaseSelect});
            itemRecord.lifecycle.value = $__2._.clone(itemRecord.lifecycle.options.items[0]);
            resolve();
          });
          $__2.ModelsManager.getAffectedItemsTransitions(itemId, availTransitLink.substring(1));
        });
      },
      canSaveManagedItem: function() {
        var $__2 = this;
        var propertyList = [];
        var requiredCustomFields = this._.filter(this.managedItemFormObj.customFields, function(field) {
          var dataTypeId = parseInt(field.metadata.dataTypeId);
          return $__2.requiredFieldsFilter(field.metadata) && !(dataTypeId === $__2.FieldTypes.AUTONUM || dataTypeId === $__2.FieldTypes.AUTOTEXT);
        });
        if (this._.every(this._.pluck(requiredCustomFields, 'value')) === false || (this.managedItemFormObj.to.edit && !this.managedItemFormObj.to.value)) {
          return false;
        }
        if (this.managedItemFormObj.to.edit) {
          propertyList.push(this.managedItemFormObj.to);
        }
        if (this.managedItemFormObj.lifecycle.value.link) {
          propertyList.push({
            originalValue: this.managedItemFormObj.lifecycle.originalValue ? this.managedItemFormObj.lifecycle.originalValue.link : null,
            value: this.managedItemFormObj.lifecycle.value ? this.managedItemFormObj.lifecycle.value.link : null
          });
        }
        propertyList.push(this.managedItemFormObj.effectivity);
        return this._.some(propertyList, function(property) {
          return !$__2._.isEqual(property.originalValue, property.value);
        });
      },
      updateManagedItemObject: function() {
        var $__2 = this;
        if (angular.isDefined(this.managedItemFormObj.to.edit)) {
          this.managedItemObj.setTo(this.managedItemFormObj.to.value);
        }
        if (angular.isDefined(this.managedItemFormObj.lifecycle.value.link)) {
          this.managedItemObj.setLifecycle(this.managedItemFormObj.lifecycle.value);
        }
        this.managedItemObj.setEffectivity(this.managedItemFormObj.effectivity.value ? new Date(this.managedItemFormObj.effectivity.value) : null);
        this._.each(this.managedItemFormObj.customFields, function(customField) {
          var oldVal = customField.originalValue;
          var curVal = customField.value;
          if ((customField.ref.isPicklist && (curVal.title !== oldVal.title || curVal.link !== oldVal.link)) || (!customField.ref.isPicklist && (curVal !== oldVal))) {
            if (customField.ref.fieldTypeId === 'DATE') {
              curVal = new Date(curVal);
            }
            $__2.managedItemObj.setCustomColumnData(customField.ref.field, customField, customField.ref);
          }
        });
      },
      manageAndClose: function() {
        var $__2 = this;
        this.manage().then(function() {
          $__2.close();
          $__2.NotificationService.showNotifications();
        }, function() {
          $__2.close();
          $__2.NotificationService.showNotifications($__2.dialogElement);
        });
      },
      manageAndView: function() {
        var $__2 = this;
        this.manage().then(function() {
          $__2.$state.go('affected-items', {
            workspaceId: $__2.createdItemObj.getWorkspaceObj().getId(),
            tab: 'affected-items',
            view: 'full',
            mode: 'view',
            itemId: $__2.UrnParser.encode($__2.createdItemObj.getFullList().urn)
          });
          $__2.NotificationService.showNotifications();
        }, function(errorInfo) {
          $__2.NotificationService.showNotifications($__2.dialogElement);
        }).finally(this.close);
      },
      manage: function() {
        var $__2 = this;
        var deferred = this.$q.defer();
        if (this.canSaveManagedItem()) {
          this.updateManagedItemObject();
          var managedItemSaveListenerId = this.EventService.listen(("affectedItem:" + this.managedItemObj.getId() + ":saveDone"), function(event, flag, errorInfo) {
            $__2.EventService.unlisten(managedItemSaveListenerId);
            $__2.EventService.unlisten(managedItemSaveConflictListenerId);
            $__2.ValidationUtil.clearValidationErrors($__2.managedItemFormObj.customFields);
            if (flag) {
              $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + $__2.managedItemObj.getItemTitle() + $__2.$rootScope.bundle.notification.singleSave.success));
              deferred.resolve();
            } else {
              $__2.ValidationUtil.mapValidationErrors($__2.managedItemFormObj.customFields, errorInfo.data, {predicate: function(field, validation) {
                  return validation.field.__self__ ? field.metadata.__self__ === validation.field.__self__ : false;
                }});
              $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + errorInfo.data.length + (errorInfo.data.length > 1 ? $__2.$rootScope.bundle.notification.create.errors : $__2.$rootScope.bundle.notification.create.error)));
              deferred.reject(errorInfo);
            }
          });
          var managedItemSaveConflictListenerId = this.EventService.listen(("affectedItem:" + this.managedItemObj.getId() + ":saveConflict"), function(event) {
            $__2.EventService.unlisten(managedItemSaveListenerId);
            $__2.EventService.unlisten(managedItemSaveConflictListenerId);
            deferred.reject();
          });
          this.EventService.send(("affectedItem:" + this.managedItemObj.getId() + ":saveItem"), this.managedItemObj);
        }
        return deferred.promise;
      }
    }, {});
  }();
  var $__default = CreateItemDialogController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/createItem/createItemDialog.controller.js
