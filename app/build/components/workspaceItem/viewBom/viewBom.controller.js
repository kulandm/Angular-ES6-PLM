System.registerModule("com/autodesk/components/workspaceItem/viewBom/viewBom.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/workspaceItem/viewBom/viewBom.controller.js";
  var BomPath = System.get("com/autodesk/models/bomTable/bomPath.model.js").default;
  var BomChangeListTypes = System.get("com/autodesk/models/bomEdit/bomChangeListTypes.js").default;
  var BomUIFieldSemantics = System.get("com/autodesk/models/bomFields/BomUIFieldSemantics.service.js").default;
  var ViewBomController = function() {
    function ViewBomController($q, $rootScope, $scope, $templateCache, $compile, $state, $stateParams, $timeout, $filter, $mdMenu, $location, _, FieldTypes, RESTWrapperService, FlyoutService, PLMPermissions, ModelsManager, EventService, BiasService, BomMessageService, moment, RelatedWorkspaces, ValidationUtil, NotificationService, NotificationTypes, BomDataController, BomExporter, LocalUserStorageService) {
      var $__5 = this;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$compile = $compile;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$filter = $filter;
      this.$location = $location;
      this.$stateParams = $stateParams;
      this.FieldTypes = FieldTypes;
      this._ = _;
      this.RESTWrapperService = RESTWrapperService;
      this.FlyoutService = FlyoutService;
      this.PLMPermissions = PLMPermissions;
      this.ModelsManager = ModelsManager;
      this.EventService = EventService;
      this.BiasService = BiasService;
      this.BomMessageService = BomMessageService;
      this.moment = moment;
      this.RelatedWorkspaces = RelatedWorkspaces;
      this.$templateCache = $templateCache;
      this.NotificationService = NotificationService;
      this.NotificationTypes = NotificationTypes;
      this.ValidationUtil = ValidationUtil;
      this.BomDataController = BomDataController;
      this.BomExporter = BomExporter;
      this.LocalUserStorageService = LocalUserStorageService;
      this.tableDataApi = null;
      this.bundle = $rootScope.bundle;
      this.itemId = $location.search().itemId;
      this.viewPermission = PLMPermissions.VIEW_BOM;
      this.bomApiDateFormat = 'YYYY-MM-DD';
      this.userDefinedDateFormat = 'MM/DD/YYYY';
      this.uiPermissions = this.buildBomUIPermissions();
      this.isEditBomButtonVisible = false;
      this.isEditBomButtonDisabled = false;
      this.isAddBomButtonVisible = false;
      this.isAddBomButtonDisabled = false;
      this.initComplete = false;
      this.$scope.linkableItemsOptions = {itemsType: 'bomItems'};
      this.currentMode = this.$location.search().mode;
      this.viewState = 'bom';
      this.userPermissionsObj = null;
      this.addFlyout = null;
      this.viewAttachedItemsFlyout = null;
      this.isWipAttachmentEnabled = false;
      this.bomDataController = null;
      this.gridApiListener = this.$scope.$watch(function(scope) {
        return ($__5.tableDataApi);
      }, function(oldVal, newVal) {
        if (oldVal !== newVal && $__5.tableDataApi !== null) {
          $__5.setTableEventHandlers();
          $__5.gridApiListener();
        }
      });
      this.$scope.$on('$destroy', function() {
        $__5.gridApiListener();
        if ($__5.addFlyout) {
          $__5.addFlyout.cancel();
        }
        if ($__5.viewAttachedItemsFlyout) {
          $__5.viewAttachedItemsFlyout.cancel();
        }
      });
      this.init();
    }
    return ($traceurRuntime.createClass)(ViewBomController, {
      init: function() {
        var $__5 = this;
        var workspaceId = this.$stateParams.workspaceId;
        this.loadUser();
        this.loadUserPermissions(workspaceId);
        this.populateRelatedWorkspaces(workspaceId);
        this.loadEnabledFeatures();
        this.bomDataController = new this.BomDataController(this.itemId);
        this.bomDataController.init().then(function(changedRootId) {
          $__5.respondToBomLoad(changedRootId);
        });
      },
      loadEnabledFeatures: function() {
        var $__5 = this;
        var enabledFeaturesListenerId = this.EventService.listen('enabledFeatures:*:done', function(event, EnabledFeatures) {
          $__5.EventService.unlisten(enabledFeaturesListenerId);
          $__5.isWipAttachmentEnabled = $__5._.find(EnabledFeatures.getDisplayableData().data, function(item) {
            return item.title === 'wip.attachment';
          }) ? true : false;
        });
        this.ModelsManager.getEnabledFeatures();
      },
      loadUser: function() {
        var $__5 = this;
        var userListenerId = this.EventService.listen('currentUser:currentUser:done', function(event, UserObj) {
          $__5.EventService.unlisten(userListenerId);
          $__5.userDefinedDateFormat = UserObj.getDateFormat().toUpperCase();
        });
        this.ModelsManager.getCurrentUser();
      },
      loadUserPermissions: function(workspaceId) {
        var $__5 = this;
        var userPermissionsListenerId = this.EventService.listen(("userPermissions:" + workspaceId + "~*:done"), function(event, userPermissionsObj) {
          $__5.EventService.unlisten(userPermissionsListenerId);
          $__5.userPermissionsObj = userPermissionsObj;
          if (!(userPermissionsObj.hasPermission($__5.viewPermission))) {
            $__5.$state.go('details', {
              tab: 'details',
              view: $__5.$location.search().view,
              mode: 'view',
              itemId: $__5.$location.search().itemId
            });
          }
          $__5.uiPermissions = $__5.buildBomUIPermissions(userPermissionsObj, $__5.itemObj);
        });
      },
      buildBomUIPermissions: function(userPermissions, itemObj) {
        var uiPermissions = {
          addButtonVisibile: true,
          editButtonVisibile: true,
          removeButtonVisibile: true,
          editDisabled: false
        };
        if (userPermissions && itemObj) {
          var hasAddBomPermission = userPermissions.hasPermission(this.PLMPermissions.ADD_BOM);
          var hasEditBomPermission = userPermissions.hasPermission(this.PLMPermissions.EDIT_BOM);
          var hasDeleteBomPermission = userPermissions.hasPermission(this.PLMPermissions.DELETE_BOM);
          var hasOverrideLockPermission = userPermissions.hasPermission(this.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS);
          var hasOverrideRevisionPermission = userPermissions.hasPermission(this.PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS);
          var isItemLocked = itemObj.isLocked();
          var isItemReleased = itemObj.isReleased();
          uiPermissions.addButtonVisibile = hasAddBomPermission;
          uiPermissions.editButtonVisibile = hasAddBomPermission || hasEditBomPermission || hasDeleteBomPermission;
          uiPermissions.removeButtonVisibile = hasDeleteBomPermission;
          if (hasOverrideRevisionPermission) {
            uiPermissions.editDisabled = false;
          } else {
            uiPermissions.editDisabled = isItemReleased || (isItemLocked && !hasOverrideLockPermission);
          }
        }
        return uiPermissions;
      },
      getGraph: function() {
        return this.bomDataController.getGraph();
      },
      getTable: function() {
        return this.bomDataController.getTable();
      },
      getConfigurationStateMachine: function() {
        return this.bomDataController.getConfigurationStateMachine();
      },
      getViewDefs: function() {
        return this.bomDataController.getViewDefs();
      },
      getCurrentViewDef: function() {
        return this.bomDataController.getCurrentViewDef();
      },
      loadBom: function() {
        var $__5 = this;
        this.initComplete = false;
        this.bomDataController.initBom().then(function(rootChanged) {
          $__5.respondToBomLoad(rootChanged);
        });
      },
      respondToBomLoad: function(changedRootId) {
        if (changedRootId) {
          this.EventService.send('itemViewer:setNewItem', changedRootId);
        }
        this.uiPermissions = this.buildBomUIPermissions(this.userPermissionsObj, this.bomDataController.getItemObj());
      },
      reloadCurrentBom: function() {
        this.getConfigurationStateMachine().shouldRefresh();
        this.loadBom();
      },
      formatDate: function(date, newFormat, currentFormat) {
        return this.moment(date, currentFormat).format(newFormat);
      },
      setTableEventHandlers: function() {
        var $__5 = this;
        this.tableDataApi.core.on.rowsRendered(this.$scope, function(gridObj) {
          $__5.expandToplineOnInit();
        }, this);
      },
      expandToplineOnInit: function() {
        var $__5 = this;
        if (this.initComplete === false && this.tableDataApi.grid.renderContainers.body.visibleRowCache.length > 0) {
          this.initComplete = true;
          this.expandRow(this.tableDataApi.grid.renderContainers.body.visibleRowCache[0]).then(function() {
            $__5.EventService.send($__5.BomMessageService.getTopLineExpandedMessage($__5.initComplete), $__5.itemId);
          });
        }
      },
      expandRow: function(row) {
        var deferred = this.$q.defer();
        row.grid.api.treeBase.expandRow(row);
        row.entity.isCollapsed = false;
        if (!this.bomDataController.shouldUseBulkLoader()) {
          if (!row.entity.hasFetchedChildren) {
            row.entity.hasFetchedChildren = true;
            this.bomDataController.populateChildrenAndOutputToTable(row.entity).then(function() {
              deferred.resolve();
            });
          } else {
            deferred.resolve();
          }
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      },
      collapseRow: function(row) {
        row.grid.api.treeBase.collapseRow(row);
        row.entity.isCollapsed = true;
      },
      changeView: function(view) {
        if (view.id !== this.getConfigurationStateMachine().viewDefId) {
          this.getConfigurationStateMachine().viewChanged(view.id);
          if (this.LocalUserStorageService.canUseLocalStorage()) {
            this.LocalUserStorageService.set(this.getViewDefs().buildViewStorageKey(this.$stateParams.workspaceId.toString()), view.id);
          }
          this.loadBom();
        }
      },
      changeBomConfiguration: function(config) {
        var effectiveDate = this.formatDate(config.effectiveDate, this.bomApiDateFormat);
        if (effectiveDate !== this.getConfigurationStateMachine().getEffectiveDate() || config.bias !== this.getConfigurationStateMachine().revisionBias) {
          this.getConfigurationStateMachine().configurationChanged(effectiveDate, config.bias);
          this.loadBom();
        }
      },
      getViewTitle: function() {
        return (this.getCurrentViewDef()) ? this.getCurrentViewDef().getTitle() : '';
      },
      getViewDate: function() {
        var date = this.getConfigurationStateMachine().effectiveDate;
        if (date !== null) {
          var isToday = date.isSame(this.moment(), 'day');
          if (isToday) {
            return this.bundle.bom.header.today;
          } else {
            return this.formatDate(date, this.userDefinedDateFormat);
          }
        }
      },
      getViewBias: function() {
        if (this.getConfigurationStateMachine().revisionBias !== null) {
          return this.BiasService.getBiasName(this.getConfigurationStateMachine().revisionBias);
        }
      },
      getTooltipText: function() {
        return (this.getViewTitle() + " as of " + this.getViewDate() + " using the " + this.getViewBias() + " configuration");
      },
      populateRelatedWorkspaces: function(workspaceId) {
        var $__5 = this;
        var relatedWorkspacesListenerId = this.EventService.listen(("relatedWorkspaces:" + workspaceId + ":done"), function(event, relatedWorkspacesObj) {
          $__5.EventService.unlisten(relatedWorkspacesListenerId);
          var relatedWorkspaces = relatedWorkspacesObj.getFullList();
          $__5.permittedWSPromises = $__5._.map(relatedWorkspaces.workspaces, function(workspace) {
            return new Promise(function(resolve, reject) {
              var relatedWSId = workspace.link.substring(workspace.link.lastIndexOf('/') + 1);
              var workspaceListenerId;
              var workspacePermissionErrorListenerId;
              workspaceListenerId = $__5.EventService.listen(("workspaceInstance:" + relatedWSId + ":done"), function(event, workspaceObj) {
                $__5.EventService.unlisten(workspaceListenerId);
                $__5.EventService.unlisten(workspacePermissionErrorListenerId);
                var userPermissionsListenerId = $__5.EventService.listen(("userPermissions:" + relatedWSId + "~*:done"), function(event, userPermissionsObj, workspaceId) {
                  $__5.EventService.unlisten(userPermissionsListenerId);
                  if (userPermissionsObj.hasPermission($__5.PLMPermissions.ADD_ITEMS) || userPermissionsObj.hasPermission($__5.PLMPermissions.VIEW_ITEMS)) {
                    resolve({
                      workspaceObj: workspaceObj,
                      canAdd: userPermissionsObj.hasPermission($__5.PLMPermissions.ADD_ITEMS),
                      canView: userPermissionsObj.hasPermission($__5.PLMPermissions.VIEW_ITEMS)
                    });
                  } else {
                    reject();
                  }
                });
              });
              workspacePermissionErrorListenerId = $__5.EventService.listen(("workspaceInstance:" + relatedWSId + ":permissionError"), function(event) {
                $__5.EventService.unlisten(workspaceListenerId);
                $__5.EventService.unlisten(workspacePermissionErrorListenerId);
                reject();
              });
              $__5.ModelsManager.getWorkspace(relatedWSId);
            });
          });
        });
        this.ModelsManager.getBomRelatedWorkspaces(workspaceId);
      },
      enterEditMode: function() {
        if (this.currentMode !== 'edit') {
          this.currentMode = 'edit';
          this.$scope.$emit('activateNavigationGuard', this);
        }
      },
      loadEditableItemRevisions: function(row) {
        this.bomDataController.loadItemRevisions(row, ['UNRELEASED', 'WORKING']);
      },
      enterViewMode: function() {
        if (this.currentMode !== 'view') {
          this.currentMode = 'view';
          this.$state.go('bom', {
            tab: this.$location.search().tab,
            view: this.$location.search().view,
            mode: this.currentMode,
            itemId: this.$location.search().itemId
          });
        }
        this.reloadCurrentBom();
      },
      triggerAdd: function(event) {
        var $__5 = this;
        var target = event.currentTarget;
        this.RESTWrapperService.allSettled(this.permittedWSPromises).then(function(promises) {
          var succeededPromises = $__5._.filter(promises, function(promise) {
            return promise.success;
          });
          var allowViewWorkspaces = $__5._.filter($__5._.map(succeededPromises, function(promise) {
            return promise.value.canView ? promise.value.workspaceObj : null;
          }));
          $__5.addFlyout = $__5.FlyoutService.open({
            templateUrl: 'build/components/workspaceItem/addLinkableItems/addLinkableItems.html',
            anchorEl: angular.element(target),
            flyoutClass: 'add-item-flyout',
            placement: 'bottom-left',
            showArrow: true,
            backdropOption: 2,
            controller: 'AddLinkableItemsController',
            controllerAs: 'addLinkableItemsCtrl',
            disableDefaultZIndexAllocation: true,
            scope: $__5.$scope,
            resolve: {relatedWorkspaces: function() {
                return allowViewWorkspaces;
              }}
          });
          $__5.listenForAdds();
        });
      },
      viewAttachments: function(event, fieldObj) {
        var target = event.currentTarget;
        this.viewAttachedItemsFlyout = this.FlyoutService.open({
          templateUrl: 'build/components/workspaceItem/viewAttachedItems/viewAttachedItems.html',
          anchorEl: angular.element(target),
          flyoutClass: 'view-attached-items-flyout',
          showArrow: true,
          backdropOption: 1,
          controller: 'ViewAttachedItemsController',
          controllerAs: 'viewAttachedItemsCtrl',
          disableDefaultZIndexAllocation: false,
          scope: this.$scope,
          resolve: {attachmentsObj: function() {
              return fieldObj;
            }}
        });
      },
      listenForAdds: function() {
        var $__5 = this;
        var addedItemsListenerId = this.EventService.listen('linkableItems:added', function(event) {
          for (var addedItems = [],
              $__6 = 1; $__6 < arguments.length; $__6++)
            addedItems[$__6 - 1] = arguments[$__6];
          $__5.EventService.unlisten(addedItemsListenerId);
          $__5.enterEditMode();
          $__5.getTable().queueAdds(addedItems, $__5.getCurrentViewDef());
        });
      },
      triggerRemove: function() {
        this.enterEditMode();
        this.getTable().queueSelectedRowsForRemoval();
      },
      saveChanges: function() {
        var $__5 = this;
        var changes = this.prepareChanges();
        if (changes.length > 0) {
          this.listenForChangeResponses(changes);
          this.listenForSaveCompletion();
          changes.forEach(function(change) {
            $__5.persistChange(change);
          });
        }
      },
      prepareChanges: function() {
        var $__5 = this;
        var changeMap = this.getTable().changeTracker.getMinimalLists();
        var changes = [];
        changeMap.forEach(function(change, edgeId) {
          if (change.changeType === BomChangeListTypes.EDIT) {
            var edge = $__5.getGraph().getEdge(edgeId);
            change.payload.__self__ = edge.link;
            changes.push(change);
          } else if (change.changeType === BomChangeListTypes.REMOVE) {
            var edge$__11 = $__5.getGraph().getEdge(edgeId);
            change.payload.__self__ = edge$__11.link;
            changes.push(change);
          } else {
            changes.push(change);
          }
        });
        return changes;
      },
      listenForChangeResponses: function(changes) {
        var $__5 = this;
        var successfulChanges = [];
        var failedChanges = [];
        changes.forEach(function(change) {
          var successMessage = $__5.BomMessageService.getBomChangeSuccessMessage(change.changeType, change.edgeId);
          var failureMessage = $__5.BomMessageService.getBomChangeFailureMessage(change.changeType, change.edgeId);
          var saveCompletedMessage = $__5.BomMessageService.getBomSaveCompletedMessage();
          var messageReturned = function() {
            $__5.EventService.unlisten(changeSuccessListenerId);
            $__5.EventService.unlisten(changeFailureListenerId);
            checkAllSaveResponsesCompleted();
          };
          var checkAllSaveResponsesCompleted = function() {
            if (successfulChanges.length + failedChanges.length === changes.length) {
              var changes$__12 = {
                successes: successfulChanges,
                failures: failedChanges
              };
              $__5.EventService.send(saveCompletedMessage, changes$__12);
            }
          };
          var changeSuccessListenerId = $__5.EventService.listen(successMessage, function(event) {
            $__5.addChangeNotification(change, $__5.NotificationTypes.SUCCESS);
            successfulChanges.push(change);
            messageReturned();
          });
          var changeFailureListenerId = $__5.EventService.listen(failureMessage, function(event, errorResponse) {
            change.addErrors(errorResponse);
            $__5.addChangeNotification(change, $__5.NotificationTypes.ERROR);
            failedChanges.push(change);
            messageReturned();
          });
        });
      },
      listenForSaveCompletion: function() {
        var $__5 = this;
        var saveCompletedMessage = this.BomMessageService.getBomSaveCompletedMessage();
        var saveCompletedMessageId = this.EventService.listen(saveCompletedMessage, function(event, changes) {
          $__5.EventService.unlisten(saveCompletedMessageId);
          $__5.NotificationService.showNotifications();
          if (changes.failures.length > 0) {
            changes.failures.forEach(function(change) {
              if (change.changeType === BomChangeListTypes.EDIT || change.changeType === BomChangeListTypes.REMOVE) {
                $__5.handleFailedChangeToRowOnLoad(change);
              }
              if (change.changeType === BomChangeListTypes.ADD) {
                $__5.handleFailedAdd(change);
              }
            });
            $__5.reloadCurrentBom();
          } else {
            $__5.enterViewMode();
          }
        });
      },
      handleFailedChangeToRowOnLoad: function(change) {
        var $__5 = this;
        var rowAddedMessage = this.BomMessageService.getBomRowAddedMessage(BomPath.EmptyPath().WithSucceedingEdge(change.edgeId));
        var appliedListenerId = this.EventService.listen(rowAddedMessage, function(event) {
          $__5.EventService.unlisten(appliedListenerId);
          $__5.getTable().reapplyChange(change);
          $__5.getTable().consumeErrors($__5.getCurrentViewDef(), change.edgeId, change.getErrors());
        });
      },
      handleFailedAdd: function(change) {
        var $__5 = this;
        var bomInitCompleteListenerId = this.EventService.listen(this.BomMessageService.getTopLineExpandedMessage(true), function(event) {
          $__5.EventService.unlisten(bomInitCompleteListenerId);
          $__5.getTable().reapplyChange(change);
          $__5.getTable().consumeErrors($__5.getCurrentViewDef(), change.edgeId, change.getErrors());
        });
      },
      persistChange: function(change) {
        var $__10;
        var changeMessage = this.BomMessageService.getBomChangeSendMessage(change.changeType, change.edgeId);
        var args = [];
        if (change.changeType === BomChangeListTypes.EDIT) {
          args = [change.payload];
        } else if (change.changeType === BomChangeListTypes.ADD) {
          var configuration = this.getConfigurationStateMachine().getFullConfiguration();
          configuration.rootItem = this.bomDataController.getItemObj().getId();
          args = [this.bomDataController.getItemObj().getBomNestedLink(), change.payload, configuration];
        } else if (change.changeType === BomChangeListTypes.REMOVE) {
          args = [change.payload];
        }
        ($__10 = this.EventService).send.apply($__10, $traceurRuntime.spread([changeMessage], args));
      },
      triggerCancel: function() {
        this.enterViewMode();
      },
      triggerSave: function() {
        this.saveChanges();
      },
      isViewState: function() {
        return (this.currentMode === 'view');
      },
      isEditState: function() {
        return (this.currentMode === 'edit');
      },
      shouldBomRowBeDisabled: function(itemDepth) {
        return (itemDepth !== 1);
      },
      isCellEditable: function(tableRow, cellData) {
        if (tableRow.depth !== 1 || this.isRowMarkedForRemoval(tableRow)) {
          return false;
        }
        if (cellData.getFieldId() === BomUIFieldSemantics.BOM_ITEM_NUMBER) {
          return true;
        }
        if (cellData.typeId === this.FieldTypes.PICKLIST_FILTERED) {
          return false;
        }
        var field = this.getCurrentViewDef().getField(cellData.getFieldId());
        if (tableRow.isNewlyAdded) {
          return field.isEditableOnCreate();
        } else {
          return field.isAlwaysEditable();
        }
      },
      openMenu: function($mdOpenMenu, ev, edgeId, COL_FIELD) {
        var $__5 = this;
        $mdOpenMenu(ev);
        this.$timeout(function() {
          var menuBackdrop = angular.element(document.querySelector('.md-menu-backdrop'));
          menuBackdrop[0].addEventListener('click', function() {
            $__5.getTable().handleEdit(edgeId, COL_FIELD);
          });
        }, 1000);
      },
      addChangeNotification: function(change, notificationType) {
        var changedItemTitle;
        if (change.changeType === BomChangeListTypes.ADD) {
          changedItemTitle = change.payload.item.title;
        } else {
          var node = this.getGraph().getNodeForEdge(change.edgeId);
          changedItemTitle = node.item.title;
        }
        var key = (notificationType === this.NotificationTypes.ERROR) ? 'failed' : notificationType;
        if (change.changeType === BomChangeListTypes.ADD) {
          var notificationContent = this.bundle.notification.singleAdd[key];
        } else if (change.changeType === BomChangeListTypes.EDIT) {
          var notificationContent = this.bundle.notification.singleEdit[key];
        } else if (change.changeType === BomChangeListTypes.REMOVE) {
          var notificationContent = this.bundle.notification.singleRemove[key];
        } else {
          var notificationContent = 'unknown';
        }
        var notificationMessage = ("" + changedItemTitle + notificationContent);
        this.NotificationService.addNotification(notificationType, notificationMessage);
      },
      isDirty: function() {
        var hasPendingChange = this.getTable().changeTracker.hasPendingChanges();
        return this.isEditState() && hasPendingChange;
      },
      isRowMarkedForRemoval: function(tableRow) {
        var isBeingRemoved = this.getTable().getRowEditState(tableRow).changeType === BomChangeListTypes.REMOVE;
        return isBeingRemoved;
      },
      isNewlyAddedRow: function(tableRow) {
        return tableRow.isNewlyAdded;
      },
      exportBom: function() {
        var configuration = {
          viewTitle: this.getCurrentViewDef().getTitle(),
          date: this.getConfigurationStateMachine().getEffectiveDate(),
          bias: this.getConfigurationStateMachine().getRevisionBias()
        };
        this.BomExporter.exportBom(this.getTable(), this.bomDataController.getItemObj(), configuration);
      }
    }, {});
  }();
  var $__default = ViewBomController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/workspaceItem/viewBom/viewBom.controller.js
