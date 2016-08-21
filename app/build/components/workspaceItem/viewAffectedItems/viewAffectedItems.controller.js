System.registerModule("com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.controller.js";
  var ViewAffectedItemsController = function() {
    function ViewAffectedItemsController($scope, $rootScope, $state, $stateParams, $filter, $timeout, $mdDialog, $log, $q, _, ModelsManager, WorkspaceTypes, EventService, FlyoutService, PLMPermissions, uiGridConstants, RESTWrapperService, UrnParser, PermissionService, FieldTypes, SupportedFieldsService, NotificationService, NotificationTypes, ValidationUtil, ManagedItemColumnIndex, FieldData, Workspace) {
      var $__3 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$filter = $filter;
      this.$timeout = $timeout;
      this.$mdDialog = $mdDialog;
      this.$log = $log;
      this.$q = $q;
      this._ = _;
      this.ModelsManager = ModelsManager;
      this.WorkspaceTypes = WorkspaceTypes;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.RESTWrapperService = RESTWrapperService;
      this.PermissionService = PermissionService;
      this.PLMPermissions = PLMPermissions;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.UrnParser = UrnParser;
      this.ValidationUtil = ValidationUtil;
      this.ManagedItemColumnIndex = ManagedItemColumnIndex;
      this.FieldTypes = FieldTypes;
      this.FieldData = FieldData;
      this.Workspace = new Workspace();
      this.itemListenerId;
      this.affectedItemsListenerId;
      this.affectedItemsMetaListenerId;
      this.linkableItemSaveListenerId;
      this.stateChangeListenerId;
      this.isCurrentlySaving = false;
      this.workspaceId;
      this.itemLink = UrnParser.encode($stateParams.itemId);
      $scope.linkableItemsOptions = {itemsType: 'affectedItems'};
      this.viewPermission = PLMPermissions.VIEW_WORKFLOW_ITEMS;
      this.addPermission = PLMPermissions.ADD_WORKFLOW_ITEMS;
      this.editPermission = PLMPermissions.EDIT_WORKFLOW_ITEMS;
      this.deletePermission = PLMPermissions.DELETE_WORKFLOW_ITEMS;
      this.ItemObj = null;
      this.AffectedItemsObj = null;
      this.AffectedItemsMetaObj = null;
      this.selectedItems = [];
      this.isBulkEditEnabled = false;
      this.tableColumns = [{
        field: 'indicator',
        displayName: '',
        cellTemplate: 'indicatorTemplate',
        enableColumnResizing: false,
        width: '5',
        enableSorting: false
      }, {
        field: 'selection',
        headerCellTemplate: 'checkboxHeaderTemplate',
        cellTemplate: 'checkboxTemplate',
        enableColumnResizing: false,
        width: '50'
      }, {
        displayName: '#',
        field: 'rowId',
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        enableColumnResizing: false,
        type: 'number',
        width: '50'
      }, {
        displayName: $rootScope.bundle.affectedItems.item,
        field: 'item',
        cellTemplate: 'linkTemplate',
        type: 'object'
      }, {
        cellTemplate: 'editLifecycleCellTemplate',
        displayName: $rootScope.bundle.affectedItems.lifecycle,
        dataType: FieldTypes.PICKLIST,
        field: 'lifecycle',
        type: 'object',
        visible: false
      }, {
        cellTemplate: 'editEffectivityCellTemplate',
        displayName: $rootScope.bundle.affectedItems.effectivity,
        dataType: FieldTypes.DATE,
        fieldMeta: {datePickerMinDate: new Date()},
        enableSorting: false,
        field: 'effectivity',
        visible: false
      }, {
        displayName: $rootScope.bundle.affectedItems.from,
        field: 'from',
        visible: false,
        enableSorting: false
      }, {
        displayName: $rootScope.bundle.affectedItems.to,
        dataType: FieldTypes.SINGLE_LINE_TEXT,
        fieldMeta: {fieldLength: 5},
        field: 'to',
        cellTemplate: 'editToCellTemplate',
        visible: false,
        enableSorting: false
      }];
      this.customColumns = [];
      this.tableData = [];
      this.gridApiInterface;
      this.flyoutInstance;
      this.disableSelection = false;
      this.hasAddPermission = false;
      this.hasActionPermission = false;
      this.revisionControlledItems = null;
      this.isRevisioningWorkspace = false;
      this.isMetaDataLoaded = false;
      this.itemListenerId = EventService.listen(("itemInstance:" + this.itemLink + ":done"), function(event, itemObj) {
        $__3.ItemObj = itemObj;
        $__3.workspaceObj = $__3.ItemObj.workspaceObj;
        $__3.workspaceId = $__3.ItemObj.workspaceObj.getId();
        var workspaceTypeId = parseInt(itemObj.workspaceObj.getTypeId());
        $__3.isRevisioningWorkspace = workspaceTypeId === $__3.WorkspaceTypes.REVISIONING_WORKSPACE;
        $__3.$q.all([PermissionService.checkPermissionByItem(itemObj, $__3.deletePermission, true, true), PermissionService.checkPermissionByItem(itemObj, $__3.addPermission, true, true), PermissionService.checkPermissionByItem(itemObj, $__3.editPermission, true, true)]).then(function(permissions) {
          $__3.hasAddPermission = permissions[1];
          $__3.hasActionPermission = permissions[0] || permissions[1] || permissions[2];
          $__3.disableSelection = !(permissions[0] || permissions[2]);
        });
        if ($__3.isMetaDataLoaded === false) {
          PermissionService.checkPermissionByItem(itemObj, $__3.viewPermission).then(function(hasViewPermission) {
            if (!hasViewPermission) {
              ModelsManager.getAffectedItemsByLink($__3.itemLink, itemObj.getAffectedItemsLink());
              $state.go('details', {
                tab: 'details',
                view: $stateParams.view,
                mode: 'view',
                itemId: UrnParser.encode($stateParams.itemId)
              });
            }
          });
          $__3.parseRevisioningColumns($__3.workspaceObj);
          $__3.getRelatedWorkspaces($__3.workspaceId);
          ModelsManager.getAffectedItemsMetaByLink($__3.itemLink, $__3.ItemObj.getAffectedItemsMetaLink());
        } else {
          if ($__3.isViewState()) {
            $__3.getAffectedItemsData();
          }
        }
        $__3.isMetaDataLoaded = true;
      });
      this.affectedItemsMetaListenerId = EventService.listen(("affectedItemsMeta:" + this.itemLink + ":done"), function(event, affectedItemsMetaObj) {
        EventService.unlisten($__3.affectedItemsMetaListenerId);
        $__3.AffectedItemsMetaObj = affectedItemsMetaObj;
        var affectedItemsMeta = $__3.AffectedItemsMetaObj.getFullList();
        var customColumnPromises = _.map(affectedItemsMeta, function(field) {
          return $__3.$q(function(resolve) {
            var dataTypeId = parseInt($__3.AffectedItemsMetaObj.getDataTypeId(field));
            field.previewEnabled = dataTypeId === $__3.FieldTypes.PARAGRAPH;
            var customCol = {
              displayName: field.name,
              fieldMetadata: _.extend(field, {allowPlaceholderChange: true}),
              field: $__3.AffectedItemsMetaObj.getFieldId(field),
              dataType: $__3.AffectedItemsMetaObj.getDataTypeId(field),
              isPicklist: angular.isDefined(field.picklist) && field.picklist !== null,
              enableSorting: false,
              cellTemplate: dataTypeId === $__3.FieldTypes.PARAGRAPH ? 'editRTFTemplate' : 'editCustomColCellTemplate',
              headerCellTemplate: 'editCustomColHeaderTemplate',
              multiline: dataTypeId === $__3.FieldTypes.PARAGRAPH_WITHOUT_LINE_BREAKS || dataTypeId === $__3.FieldTypes.PARAGRAPH,
              isFieldUnsupported: SupportedFieldsService.isFieldUnsupported($__3.AffectedItemsMetaObj.getDataTypeId(field))
            };
            $__3.tableColumns.push(customCol);
            $__3.customColumns.push(customCol);
            if (customCol.isPicklist) {
              $__3.Workspace.setPicklistHook(customCol).then(function() {
                resolve();
              });
            } else {
              resolve();
            }
          });
        });
        $__3.$q.all(customColumnPromises).then(function() {
          $__3.getAffectedItemsData().then(function() {
            if (!$__3.isViewState() && $stateParams.updatedItems && $stateParams.updatedItems.length) {
              _.each($stateParams.updatedItems, function(updatedAffectedItem) {
                var tableRow = _.find($__3.tableData, function(row) {
                  return row.id === updatedAffectedItem.getId();
                });
                if (tableRow) {
                  tableRow.lifecycle.value = updatedAffectedItem.getLifecycle();
                  tableRow.effectivity.value = updatedAffectedItem.getEffectivity();
                }
              });
            }
            if (!$__3.isViewState()) {
              $__3.$scope.$emit('activateNavigationGuard', $__3);
            }
          });
        });
      });
      this.addLinkableItemsListenerId = EventService.listen('linkableItems:added', function(event) {
        for (var addedItems = [],
            $__4 = 1; $__4 < arguments.length; $__4++)
          addedItems[$__4 - 1] = arguments[$__4];
        $__3.associateAddedItems(addedItems).then(function(results) {
          if (_.every(results)) {
            EventService.send(("itemInstance:" + $__3.itemLink + ":associationComplete"));
            $__3.flyoutInstance.close();
          } else {
            $__3.flyoutInstance.cancel();
          }
          NotificationService.showNotifications();
        });
      });
      this.addRelatedBomItemsListenerId = EventService.listen('relatedBomItems:added', function(event) {
        for (var addedItems = [],
            $__5 = 1; $__5 < arguments.length; $__5++)
          addedItems[$__5 - 1] = arguments[$__5];
        $__3.associateAddedItems(addedItems).then(function(results) {
          $mdDialog.hide();
          NotificationService.showNotifications();
          EventService.send(("itemInstance:" + $__3.itemLink + ":associationComplete"));
        });
      });
      this.linkableItemSaveListenerId = EventService.listen(("itemInstance:" + this.itemLink + ":associationComplete"), function() {
        $__3.getAffectedItemsData();
      }, true);
      ModelsManager.getItem(this.itemLink, !this.isViewState());
      $scope.$on('$destroy', function() {
        if ($__3.flyoutInstance) {
          $__3.flyoutInstance.cancel();
        }
        EventService.unlisten($__3.itemListenerId);
        EventService.unlisten($__3.affectedItemsListenerId);
        EventService.unlisten($__3.affectedItemsMetaListenerId);
        EventService.unlisten($__3.linkableItemSaveListenerId);
        EventService.unlisten($__3.addLinkableItemsListenerId);
        EventService.unlisten($__3.addRelatedBomItemsListenerId);
      });
    }
    return ($traceurRuntime.createClass)(ViewAffectedItemsController, {
      getDirtyRows: function() {
        var $__3 = this;
        return this._.filter(this.tableData, function(row) {
          return $__3.isTableRowDirty(row);
        });
      },
      isDirty: function() {
        return (!!this.getDirtyRows().length && !this.isCurrentlySaving);
      },
      getAffectedItemsData: function() {
        var $__3 = this;
        return this.$q(function(resolve) {
          $__3.affectedItemsListenerId = $__3.EventService.listen(("affectedItems:" + $__3.itemLink + ":done"), function(event, affectedItemsObj) {
            $__3.EventService.unlisten($__3.affectedItemsListenerId);
            $__3.AffectedItemsObj = affectedItemsObj;
            var affectedItems = $__3.AffectedItemsObj.getFullList();
            if (angular.isUndefined(affectedItems) || affectedItems.length === 0) {
              $__3.$timeout(function() {
                window.dispatchEvent(new Event('resize'));
              }, 2000);
              return;
            }
            $__3.tableData = $__3._.map(affectedItems, function(affectedItem, index) {
              var row = $__3.createRowFromAffectedItemObj(affectedItem);
              row.rowId = index + 1;
              return row;
            });
            $__3.$timeout(function() {
              window.dispatchEvent(new Event('resize'));
            }, 2000);
            resolve();
          });
          $__3.ModelsManager.getAffectedItemsByLink($__3.itemLink, $__3.ItemObj.getAffectedItemsLink());
        });
      },
      toggleAllSelection: function() {
        this.gridApiInterface.selection.selectAll = !this.gridApiInterface.selection.selectAll;
        if (this.gridApiInterface.selection.selectAll) {
          this.gridApiInterface.selection.selectAllRows();
        } else {
          this.gridApiInterface.selection.clearSelectedRows();
        }
      },
      parseRevisioningColumns: function(itemWSObj) {
        if (itemWSObj.getTypeId() === this.WorkspaceTypes.REVISIONING_WORKSPACE.toString()) {
          this.tableColumns[this.ManagedItemColumnIndex.LIFECYCLE].visible = true;
          this.tableColumns[this.ManagedItemColumnIndex.EFFECTIVITY].visible = true;
          this.tableColumns[this.ManagedItemColumnIndex.FROM].visible = true;
          this.tableColumns[this.ManagedItemColumnIndex.TO].visible = true;
        } else {
          this.tableColumns[this.ManagedItemColumnIndex.LIFECYCLE].visible = false;
          this.tableColumns[this.ManagedItemColumnIndex.EFFECTIVITY].visible = false;
          this.tableColumns[this.ManagedItemColumnIndex.FROM].visible = false;
          this.tableColumns[this.ManagedItemColumnIndex.TO].visible = false;
        }
      },
      buildLifecycleField: function(affectedItem) {
        return this.FieldData.fromFieldData(this.FieldTypes.SELECTION, {
          urn: affectedItem.urn,
          metadata: {dataTypeId: this.FieldTypes.SELECTION},
          options: {},
          value: {
            link: affectedItem.targetTransition && affectedItem.targetTransition.link || null,
            title: affectedItem.targetTransition && affectedItem.targetTransition.title || this.$rootScope.bundle.affectedItems.pleaseSelect
          }
        });
      },
      createRowFromAffectedItemObj: function(affectedItemObj) {
        var $__3 = this;
        var affectedItemObjData = affectedItemObj.getObject();
        var tableRow = {};
        var itemUrn = affectedItemObjData.item.urn;
        var workspaceId = affectedItemObj.getWorkspaceId();
        var itemTitle = affectedItemObjData.item.version ? (affectedItemObjData.item.title + " " + affectedItemObjData.item.version) : ("" + affectedItemObjData.item.title);
        tableRow.selection = {
          inlineMenu: false,
          urn: affectedItemObjData.item.urn,
          title: affectedItemObjData.item.title
        };
        tableRow.id = affectedItemObj.getId();
        tableRow.affectedItemObj = affectedItemObj;
        tableRow.chkBox = {
          isSelected: false,
          chkBoxId: itemUrn
        };
        tableRow.item = {
          value: itemTitle,
          originalValue: itemTitle,
          href: this.$state.href('details', {
            workspaceId: workspaceId,
            tab: 'details',
            view: 'full',
            mode: 'view',
            itemId: this.UrnParser.encode(itemUrn)
          })
        };
        if (affectedItemObjData.type === 'REVISION_CONTROLLED') {
          tableRow.isRevisionControlled = true;
          if (this.workspaceObj.getTypeId() === this.WorkspaceTypes.REVISIONING_WORKSPACE.toString() && this.hasAddPermission) {
            this.PermissionService.hasPermissions([this.PLMPermissions.VIEW_ITEMS, this.PLMPermissions.VIEW_BOM], workspaceId).then(function(hasViewPermission) {
              if ((!tableRow.lifecycle.value.title) || (tableRow.lifecycle.value.title === $__3.$rootScope.bundle.affectedItems.pleaseSelect)) {
                tableRow.selection.inlineMenu = false;
              } else {
                tableRow.selection.inlineMenu = hasViewPermission;
                tableRow.selection.urn = $__3.UrnParser.encode(affectedItemObjData.item.urn);
              }
            });
          }
          var itemId = affectedItemObj.getId();
          tableRow.lifecycle = this.buildLifecycleField(affectedItemObjData, itemId);
          tableRow.lifecycle.lifecycleChanged = function() {
            if (tableRow.lifecycle.value.link) {
              tableRow.lifecycle.value = $__3._.clone($__3._.find(tableRow.lifecycle.options.items, function(option) {
                return option.title === tableRow.lifecycle.value.title;
              })) || tableRow.lifecycle.value;
              if (!tableRow.effectivity.value && tableRow.lifecycle.value.effectivityWritable) {
                tableRow.effectivity.value = tableRow.effectivity.originalValue;
              } else if (tableRow.lifecycle.value.effectivityWritable === false) {
                tableRow.effectivity.value = null;
              }
            } else {
              tableRow.lifecycle.value = $__3._.clone(tableRow.lifecycle.options.items[0]);
            }
            var overrideTargetRevision = tableRow.lifecycle.value.overrideTargetRevision;
            var increaseRelease = tableRow.lifecycle.value.incrementRelease;
            var isToEditable = (overrideTargetRevision === 'MANUAL') && increaseRelease;
            if (overrideTargetRevision === 'MANUAL' && isToEditable === false && tableRow.to.value) {
              tableRow.to.value = null;
            }
            if (isToEditable !== tableRow.to.editable) {
              tableRow.to.editable = isToEditable;
              tableRow.to.fieldMetadata.validatorsMeta = [];
              if (tableRow.to.editable) {
                tableRow.to.fieldMetadata.validatorsMeta.push({validatorName: 'required'});
                tableRow.to.fieldMetadata.validatorsMeta.push({
                  validatorName: 'maxlength',
                  variables: {maxlength: '5'}
                });
              }
            }
          };
          var affectedItemsTransitionsListenerId = this.EventService.listen(("affectedItemTransitions:" + itemId + ":done"), function(event, data) {
            $__3.EventService.unlisten(affectedItemsTransitionsListenerId);
            var options = [];
            if (_.isArray(data.json)) {
              options = $__3._.map(data.json, function(transition) {
                transition.title = transition.name;
                transition.link = transition.__self__;
                return transition;
              });
            } else if (tableRow.lifecycle.value.link) {
              options = [{
                title: tableRow.lifecycle.value.title,
                link: tableRow.lifecycle.value.link
              }];
            }
            if (!affectedItemObjData.targetTransition) {
              options.unshift({title: $__3.$rootScope.bundle.affectedItems.pleaseSelect});
            }
            tableRow.lifecycle.options.items = options;
            tableRow.lifecycle.lifecycleChanged();
          });
          this.ModelsManager.getAffectedItemsTransitions(itemId, affectedItemObjData.availableTransitions.substring(1));
          tableRow.effectivity = this.FieldData.fromFieldData(this.FieldTypes.DATE, {
            urn: affectedItemObjData.urn,
            metadata: {dataTypeId: this.FieldTypes.DATE},
            value: affectedItemObjData.effectivityDate || null
          });
          tableRow.effectivity.placeholder = this.$rootScope.bundle.affectedItems.onRelease;
          tableRow.from = affectedItemObjData.fromRelease;
          tableRow.to = this.FieldData.fromFieldData(this.FieldTypes.SINGLE_LINE_TEXT, {
            value: affectedItemObjData.toRelease || '',
            metadata: {dataTypeId: this.FieldTypes.SINGLE_LINE_TEXT},
            fieldMetadata: _.extend(_.clone(this.tableColumns[this.ManagedItemColumnIndex.TO].fieldMeta), {
              validatorsMeta: [],
              allowPlaceholderChange: true
            })
          });
        } else {
          tableRow.to = {};
          tableRow.lifecycle = {};
          tableRow.effectivity = {};
        }
        var linkedFields = affectedItemObjData.linkedFields;
        if (angular.isArray(linkedFields) && !this._.isEmpty(linkedFields)) {
          this._.each(linkedFields, function(linkedField) {
            var fieldId = affectedItemObj.getLinkedFieldId(linkedField);
            var dataTypeId = parseInt(affectedItemObj.getLinkedFieldDataTypeId(linkedField));
            var currentField = $__3._.find($__3.customColumns, function(col) {
              return fieldId === col.field;
            });
            if (fieldId && $__3._.isObject(linkedField.value)) {
              tableRow[fieldId] = $__3.FieldData.fromFieldData(dataTypeId, {
                link: affectedItemObj.getLinkedFieldLink(linkedField),
                metadata: {dataTypeId: dataTypeId},
                urn: affectedItemObj.getLinkedFieldUrn(linkedField),
                value: {
                  link: linkedField.value.link || '',
                  title: linkedField.value.title || ''
                },
                fieldMetadata: _.clone(currentField.fieldMetadata)
              });
              tableRow[fieldId].fieldMetadata.isRadioButtonInGrid = dataTypeId === $__3.FieldTypes.RADIO || dataTypeId === $__3.FieldTypes.RADIO_LINKED;
              tableRow[fieldId].options = $__3._.clone(currentField.fieldMetadata.picklistPayload);
            } else if (fieldId) {
              var fieldVal = linkedField.value || '';
              var fieldPrecision;
              if (dataTypeId === $__3.FieldTypes.FLOAT || dataTypeId === $__3.FieldTypes.MONEY_EXTENDED) {
                fieldPrecision = currentField.fieldMetadata.fieldPrecision;
              }
              var fieldLength;
              if (!(dataTypeId === $__3.FieldTypes.DATE || dataTypeId === $__3.FieldTypes.PARAGRAPH || dataTypeId === $__3.FieldTypes.CHECKBOX)) {
                fieldLength = currentField.fieldMetadata.fieldLength;
              }
              if (dataTypeId === $__3.FieldTypes.PARAGRAPH) {
                fieldVal = $__3.$filter('lineBreakFilter')(fieldVal);
              }
              tableRow[fieldId] = $__3.FieldData.fromFieldData(dataTypeId, {
                metadata: {
                  dataTypeId: dataTypeId,
                  fieldPrecision: fieldPrecision,
                  fieldLength: fieldLength
                },
                value: fieldVal,
                fieldMetadata: _.clone(currentField.fieldMetadata)
              });
            }
          });
        }
        this._.each(this.customColumns, function(col) {
          var dataTypeId = parseInt(col.dataType);
          if (!tableRow[col.field] && col.isPicklist) {
            tableRow[col.field] = $__3.FieldData.fromFieldData(dataTypeId, {
              link: affectedItemObj.getLinkedFieldLink(col.fieldMetadata),
              metadata: {dataTypeId: dataTypeId},
              urn: '',
              value: '',
              fieldMetadata: _.clone(col.fieldMetadata)
            });
            tableRow[col.field].fieldMetadata.isRadioButtonInGrid = dataTypeId === $__3.FieldTypes.RADIO || dataTypeId === $__3.FieldTypes.RADIO_LINKED;
            tableRow[col.field].options = $__3._.clone(col.fieldMetadata.picklistPayload);
          } else if (!tableRow[col.field] && !col.isPicklist) {
            tableRow[col.field] = $__3.FieldData.fromFieldData(dataTypeId, {
              metadata: {dataTypeId: dataTypeId},
              value: '',
              fieldMetadata: _.clone(col.fieldMetadata)
            });
            tableRow[col.field].fieldTypeId = col.field;
          }
        });
        return tableRow;
      },
      selectRow: function(row) {
        var selfLink = row.entity.affectedItemObj.json.__self__;
        if (row.isSelected && !this._.contains(this.selectedItems, selfLink)) {
          this.selectedItems.push({
            link: selfLink,
            inlineMenu: row.entity.selection.inlineMenu,
            urn: row.entity.selection.urn,
            title: row.entity.selection.title,
            type: row.entity.affectedItemObj.json.type,
            affectedItemObj: row.entity.affectedItemObj
          });
        } else {
          this.selectedItems = this._.filter(this.selectedItems, function(obj) {
            return obj.link !== selfLink;
          });
        }
        this.revisionControlledItems = this._.filter(this.selectedItems, function(obj) {
          return obj.type === 'REVISION_CONTROLLED';
        });
        this.isBulkEditEnabled = this.revisionControlledItems.length > 1;
        return this.selectedItems.length;
      },
      triggerBulkEdit: function() {
        var $__3 = this;
        var selectedAffectedItems = this._.map(this.revisionControlledItems, function(selectedRow) {
          return selectedRow.affectedItemObj;
        });
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/viewAffectedItems/bulkEdit.html',
          controller: 'BulkEditController',
          controllerAs: 'bulkEditCtrl',
          locals: {
            workspaceObj: this.workspaceObj,
            selectedItems: selectedAffectedItems
          }
        }).then(function(updatedAffectedItems) {
          if (updatedAffectedItems && updatedAffectedItems.length > 0) {
            $__3.$state.go('affected-items', {
              tab: $__3.$stateParams.tab,
              view: $__3.$stateParams.view,
              mode: 'edit',
              itemId: $__3.$stateParams.itemId,
              updatedItems: updatedAffectedItems
            });
          }
        });
      },
      triggerAddRelatedBomItems: function(urn) {
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/viewAffectedItems/addRelatedBom.html',
          controller: 'AddRelatedBomController',
          controllerAs: 'addRelatedBomCtrl',
          locals: {urn: urn}
        });
      },
      updateAffectedItemRow: function(tableRow, affectedItemObj) {
        if (tableRow.to.editable || (angular.isDefined(tableRow.to.isDirty) && tableRow.to.isDirty())) {
          affectedItemObj.setTo(tableRow.to.value);
        }
        if (angular.isDefined(tableRow.lifecycle) && angular.isDefined(tableRow.lifecycle.value)) {
          affectedItemObj.setLifecycle(tableRow.lifecycle.value);
        }
        if (angular.isDefined(tableRow.effectivity) && angular.isDefined(tableRow.effectivity.value)) {
          affectedItemObj.setEffectivity(tableRow.effectivity.value || null);
        }
        this._.each(this.customColumns, function(col) {
          var field = tableRow[col.field];
          if (angular.isDefined(field) && field.isDirty()) {
            affectedItemObj.setCustomColumnData(col.field, field, col);
          }
        });
        return affectedItemObj;
      },
      isTableRowDirty: function(tableRow) {
        if (this._.some(this.customColumns, function(col) {
          return angular.isDefined(tableRow[col.field]) && angular.isDefined(tableRow[col.field].value) && tableRow[col.field].isDirty();
        })) {
          return true;
        }
        return (tableRow.to.editable && tableRow.to.isDirty()) || (angular.isDefined(tableRow.lifecycle) && angular.isDefined(tableRow.lifecycle.value) && tableRow.lifecycle.isDirty()) || (angular.isDefined(tableRow.effectivity) && angular.isDefined(tableRow.effectivity.value) && tableRow.effectivity.isDirty());
      },
      isTableRowInvalid: function(tableRow) {
        return !this.isViewState() && (this.hasValidationErrors(tableRow) || this._.some(this.customColumns, function(col) {
          return angular.isDefined(tableRow[col.field]) && (tableRow[col.field].serverError);
        }));
      },
      removeSelectedItems: function() {
        var $__3 = this;
        var promises = this._.map(this.selectedItems, function(selfLink) {
          return $__3.$q(function(resolve, reject) {
            var affectedItemRemoveListenerId = $__3.EventService.listen(("affectedItem:" + selfLink.link.substring(selfLink.link.lastIndexOf('/') + 1) + ":deleteDone"), function(event, flag) {
              $__3.EventService.unlisten(affectedItemRemoveListenerId);
              if (flag) {
                $__3.tableData = $__3._.filter($__3.tableData, function(row) {
                  return row.__self__ === selfLink.link;
                });
                $__3.NotificationService.addNotification($__3.NotificationTypes.SUCCESS, ("" + selfLink.title + $__3.$rootScope.bundle.notification.singleRemove.success));
              } else {
                $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, ("" + selfLink.title + $__3.$rootScope.bundle.notification.failed));
              }
              resolve();
            });
            $__3.EventService.send(("affectedItem:" + selfLink.link.substring(selfLink.link.lastIndexOf('/') + 1) + ":deleteItem"), selfLink.link);
          });
        });
        this.$q.all(promises).then(function() {
          $__3.NotificationService.showNotifications();
          $__3.getAffectedItemsData();
          $__3.selectedItems = [];
        });
      },
      triggerDelete: function() {
        var $__3 = this;
        this.$mdDialog.show({
          templateUrl: 'build/components/workspaceItem/removeItemConfirmation/removeItemConfirmation.html',
          controller: 'RemoveItemConfirmationController',
          controllerAs: 'removeItemCtrl',
          locals: {itemCount: this.selectedItems.length}
        }).then(function() {
          $__3.removeSelectedItems();
          $__3.isBulkEditEnabled = false;
        });
      },
      getAllFields: function() {
        var $__3 = this;
        var fields = [];
        this._.each(this.tableData, function(row) {
          fields = fields.concat($__3.getFields(row));
        });
        return fields;
      },
      getFields: function(row) {
        return this.customColumns.map(function(col) {
          return row[col.field];
        });
      },
      pristineTableRow: function(row) {
        if (row) {
          row.lifecycle.originalValue = row.lifecycle.value;
          row.effectivity.originalValue = row.effectivity.value;
          row.to.originalValue = row.to.value;
          this._.each(this.customColumns, function(customColumn) {
            row[customColumn.field].originalValue = row[customColumn.field].value;
          });
        }
      },
      hasInvalidItems: function() {
        var $__3 = this;
        var invalidItems = false;
        this._.each(this.tableData, function(tableRow) {
          invalidItems |= $__3.hasValidationErrors(tableRow);
        });
        return !!invalidItems;
      },
      hasValidationErrors: function(tableRow) {
        var hasValidationErrors = false;
        if (angular.isDefined(tableRow.to.fieldMetadata)) {
          tableRow.to.hasClientSideErrors = !!(tableRow.to.fieldMetadata.validationErrors && tableRow.to.fieldMetadata.validationErrors.length);
        }
        hasValidationErrors |= tableRow.to.hasClientSideErrors;
        this._.each(this.customColumns, function(col) {
          tableRow[col.field].hasClientSideErrors = !!(tableRow[col.field].fieldMetadata.validationErrors && tableRow[col.field].fieldMetadata.validationErrors.length);
          hasValidationErrors |= tableRow[col.field].hasClientSideErrors;
        });
        return !!hasValidationErrors;
      },
      triggerSave: function() {
        var $__3 = this;
        this.isCurrentlySaving = true;
        var saveCount = 0;
        var saveAttempts = 0;
        var modifiedItems = [];
        if (this.hasInvalidItems()) {
          this.NotificationService.addNotification(this.NotificationTypes.ERROR, 'Unable to save data due to validation errors');
          this.NotificationService.showNotifications();
          return;
        }
        this._.each(this.tableData, function(row) {
          if ($__3.isTableRowDirty(row)) {
            modifiedItems.push($__3.updateAffectedItemRow(row, row.affectedItemObj));
          }
        });
        if (modifiedItems.length === 0) {
          this.triggerCancel();
        } else {
          this.ValidationUtil.clearValidationErrors(this.getAllFields());
          this.$q.all(this._.map(modifiedItems, function(item) {
            $__3.EventService.send(("affectedItem:" + item.getId() + ":saveItem"), item);
            return new $__3.$q(function(resolve) {
              var affectedItemSaveListenerId = $__3.EventService.listen(("affectedItem:" + item.getId() + ":saveDone"), function(event, flag, errorInfo) {
                $__3.isCurrentlySaving = false;
                $__3.EventService.unlisten(affectedItemSaveListenerId);
                $__3.EventService.unlisten(affectedItemSaveConflictListenerId);
                saveAttempts++;
                var tableRow = $__3._.find($__3.tableData, function(row) {
                  return row.id === item.getId();
                });
                if (flag) {
                  saveCount++;
                  $__3.NotificationService.addNotification($__3.NotificationTypes.SUCCESS, ("" + item.getItemTitle() + $__3.$rootScope.bundle.notification.singleEdit.success));
                  $__3.pristineTableRow(tableRow);
                } else {
                  $__3.isCurrentlySaving = false;
                  $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, ("" + item.getItemTitle() + $__3.$rootScope.bundle.notification.singleEdit.failed));
                  if (tableRow) {
                    $__3.ValidationUtil.mapValidationErrors($__3.getFields(tableRow), errorInfo.data, {predicate: function(field, validation) {
                        return validation.field.urn ? field.fieldTypeId === validation.field.urn.split('.').pop() : false;
                      }});
                  }
                }
                resolve();
              });
              var affectedItemSaveConflictListenerId = $__3.EventService.listen(("affectedItem:" + item.getId() + ":saveConflict"), function(event) {
                $__3.EventService.unlisten(affectedItemSaveListenerId);
                $__3.EventService.unlisten(affectedItemSaveConflictListenerId);
                saveAttempts++;
                var affectedItemListenerId = $__3.EventService.listen(("affectedItem:" + item.getId() + ":done"), function(event, affectedItemObj) {
                  $__3.EventService.unlisten(affectedItemListenerId);
                  var tableRowToUpdate = $__3._.find($__3.tableData, function(row) {
                    return row.id === affectedItemObj.getId();
                  });
                  if (tableRowToUpdate) {
                    var tableRowToUpdateIndex = $__3._.indexOf($__3.tableData, tableRowToUpdate);
                    var updatedTableRow = $__3.createRowFromAffectedItemObj(affectedItemObj);
                    updatedTableRow.rowId = tableRowToUpdate.rowId;
                    $__3.tableData[tableRowToUpdateIndex] = updatedTableRow;
                  } else {
                    $__3.$log.error('Unable to find an affected item record to update.');
                  }
                  resolve();
                });
                $__3.ModelsManager.getAffectedItem($__3.AffectedItemsObj, item.getId());
              });
            }).then(function() {
              if (saveAttempts === $__3._.size(modifiedItems)) {
                var bulkNotificationMessage = '';
                if (saveAttempts === saveCount) {
                  bulkNotificationMessage = $__3.$rootScope.bundle.notification.bulk.updateAllPassed;
                  $__3.$state.go('affected-items', {
                    tab: $__3.$stateParams.tab,
                    view: $__3.$stateParams.view,
                    mode: 'view',
                    itemId: $__3.$stateParams.itemId
                  });
                } else {
                  bulkNotificationMessage = saveCount === 0 ? $__3.$rootScope.bundle.notification.bulk.updateAllFailed : $__3.$rootScope.bundle.notification.bulk.updateSomePassed;
                }
                $__3.NotificationService.showNotifications(null, bulkNotificationMessage);
              }
            });
          }));
        }
      },
      triggerCancel: function() {
        this.$state.go('affected-items', {
          tab: this.$stateParams.tab,
          view: this.$stateParams.view,
          mode: 'view',
          itemId: this.$stateParams.itemId,
          updatedItems: []
        });
      },
      triggerEdit: function() {
        this.$state.go('affected-items', {
          tab: this.$stateParams.tab,
          view: this.$stateParams.view,
          mode: 'edit',
          itemId: this.$stateParams.itemId,
          updatedItems: []
        });
      },
      hasActiveFlyout: function() {
        return this.flyoutInstance && this.flyoutInstance.isActive() === true;
      },
      triggerAdd: function(event) {
        var $__3 = this;
        var target = event.currentTarget;
        this.RESTWrapperService.allSettled(this.permittedWSPromises).then(function(results) {
          var succeededPromises = $__3._.filter(results, function(result) {
            return result.success === true;
          });
          var allowAddWorkspaces = $__3._.without($__3._.map(succeededPromises, function(successPromise) {
            return successPromise.value.canAdd ? successPromise.value.workspaceObj : null;
          }), null);
          var allowViewWorkspaces = $__3._.without($__3._.map(succeededPromises, function(successPromise) {
            return successPromise.value.canView ? successPromise.value.workspaceObj : null;
          }), null);
          $__3.flyoutInstance = $__3.FlyoutService.open({
            templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
            scope: $__3.$scope,
            anchorEl: angular.element(target),
            flyoutClass: 'add-item-flyout',
            placement: 'bottom-left',
            showArrow: true,
            backdropOption: 2,
            controller: 'AddLinkableItemsController',
            controllerAs: 'addLinkableItemsCtrl',
            disableDefaultZIndexAllocation: true,
            resolve: {relatedWorkspaces: function() {
                return allowViewWorkspaces;
              }}
          });
          $__3.flyoutInstance.closed.then(function(result) {
            if (result && result.createItem === true) {
              var dialogScope = $__3.$scope.$new();
              dialogScope.ctrl = $__3;
              $__3.$mdDialog.show({
                scope: dialogScope,
                controller: 'CreateItemDialogController',
                controllerAs: 'createItemDialogCtrl',
                templateUrl: 'build/components/createItem/createItemDialog.html',
                resolve: {
                  CurrentWorkspaceObj: function() {
                    return $__3.workspaceObj;
                  },
                  AddWorkspaceList: function() {
                    return allowAddWorkspaces;
                  }
                }
              });
            }
          });
        });
      },
      getRelatedWorkspaces: function(workspaceId) {
        var $__3 = this;
        var relatedWorkspacesListenerId = this.EventService.listen(("relatedWorkspaces:" + workspaceId + ":done"), function(event, RelatedWorkspacesObj) {
          $__3.EventService.unlisten(relatedWorkspacesListenerId);
          var relatedWorkspaces = RelatedWorkspacesObj.getFullList();
          $__3.permittedWSPromises = $__3._.map(relatedWorkspaces.workspaces, function(workspace) {
            var deferred = $__3.$q.defer();
            var relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
            var workspaceListenerId = $__3.EventService.listen(("workspaceInstance:" + relatedWSId + ":done"), function(event, workspaceObj) {
              $__3.EventService.unlisten(workspaceListenerId);
              $__3.EventService.unlisten(workspacePermissionErrorListenerId);
              var userPermissionsListenerId = $__3.EventService.listen(("userPermissions:" + relatedWSId + "~*:done"), function(event, userPermissionsObj, workspaceId) {
                $__3.EventService.unlisten(userPermissionsListenerId);
                if (userPermissionsObj.hasPermission($__3.PLMPermissions.ADD_ITEMS) || userPermissionsObj.hasPermission($__3.PLMPermissions.VIEW_ITEMS)) {
                  deferred.resolve({
                    workspaceObj: workspaceObj,
                    canAdd: userPermissionsObj.hasPermission($__3.PLMPermissions.ADD_ITEMS),
                    canView: userPermissionsObj.hasPermission($__3.PLMPermissions.VIEW_ITEMS)
                  });
                } else {
                  deferred.reject();
                }
              });
            });
            var workspacePermissionErrorListenerId = $__3.EventService.listen(("workspaceInstance:" + relatedWSId + ":permissionError"), function(event) {
              $__3.EventService.unlisten(workspaceListenerId);
              $__3.EventService.unlisten(workspacePermissionErrorListenerId);
              deferred.reject();
            });
            $__3.ModelsManager.getWorkspace(relatedWSId);
            return deferred.promise;
          });
        });
        this.ModelsManager.getAffectedItemRelatedWorkspaces(workspaceId);
      },
      save: function(createItem) {
        var $__3 = this;
        var linkableItemListenerId = this.EventService.listen(("itemInstance:" + this.UrnParser.encode(createItem.json.urn) + ":associationDone"), function(event, flag) {
          $__3.EventService.unlisten(linkableItemListenerId);
          if (flag) {
            $__3.EventService.send(("itemInstance:" + $__3.itemLink + ":associationComplete"));
          }
        });
        this.EventService.send(("itemInstance:" + this.UrnParser.encode(createItem.json.urn) + ":associateAffectedItem"), [this.ItemObj, createItem.json.__self__]);
      },
      associateAddedItems: function(items) {
        var $__3 = this;
        return this.$q.all(this._.map(items, function(item) {
          var selectedItem = item.ref;
          $__3.EventService.send(("itemInstance:" + selectedItem.getItemId() + ":associateAffectedItem"), [$__3.ItemObj, selectedItem.getItemLink(), selectedItem.getItemTitle()]);
          return $__3.$q(function(resolve) {
            var associateItemsListener = $__3.EventService.listen(("itemInstance:" + selectedItem.getItemId() + ":associationDone"), function(event, isSaved) {
              $__3.EventService.unlisten(associateItemsListener);
              if (isSaved) {
                $__3.NotificationService.addNotification($__3.NotificationTypes.SUCCESS, ("" + selectedItem.getItemTitle() + $__3.$rootScope.bundle.notification.singleAdd.success));
              } else {
                $__3.NotificationService.addNotification($__3.NotificationTypes.ERROR, ("" + selectedItem.getItemTitle() + $__3.$rootScope.bundle.notification.failed));
              }
              resolve(isSaved);
            });
          });
        }));
      },
      isViewState: function() {
        return (this.$stateParams.mode === 'view');
      }
    }, {});
  }();
  var $__default = ViewAffectedItemsController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewAffectedItems/viewAffectedItems.controller.js
