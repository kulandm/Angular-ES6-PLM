System.registerModule("com/autodesk/components/itemViewer/itemViewer.controller.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/components/itemViewer/itemViewer.controller.js";
  var TABMAPPING = {
    itemDetails: {
      icon: 'icon-Info',
      active: 'details',
      link: 'details'
    },
    linkedItems: {
      icon: 'icon-Connect',
      active: 'affected-items',
      link: 'affected-items'
    },
    gridDetails: {
      icon: 'icon-Tabular',
      active: 'grid',
      link: 'grid'
    },
    projectManagement: {
      icon: 'icon-Sheets',
      active: 'project-management',
      link: 'project-management'
    },
    partAttachment: {
      icon: 'icon-Attach',
      active: 'attachments',
      link: 'attachments'
    },
    workflowActions: {
      icon: 'icon-a360-organization',
      active: 'workflow-map',
      link: 'workflow-map'
    },
    bomViewNested: {
      icon: 'icon-Heirarchy2',
      active: 'bom',
      link: 'bom'
    },
    relationship: {
      icon: 'icon-Transfer',
      active: 'relationships',
      link: 'relationships'
    },
    linkedItemsReferences: {
      icon: 'icon-History',
      active: 'workflow',
      link: 'workflow'
    },
    milestonesDetails: {
      icon: 'icon-Tasks',
      active: 'milestones',
      link: 'milestones'
    },
    partHistory: {
      icon: 'icon-TimeActivity',
      active: 'change-log',
      link: 'change-log'
    },
    namedRelationshipsTab: {
      active: 'named-relationships',
      link: 'named-relationships'
    }
  };
  var ItemViewerController = function() {
    function ItemViewerController($scope, $rootScope, $state, $stateParams, $location, $timeout, $compile, $controller, $q, LocalizationService, ModelsManager, EventService, FlyoutService, NotificationService, NotificationTypes, WorkspaceTypes, PLMPermissions, UrnParser, $mdSidenav, $mdComponentRegistry, _, PermissionService, $mdDialog, CreateTypes, TabActionNameTypes, $filter) {
      var $__2 = this;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$location = $location;
      this.$timeout = $timeout;
      this.$compile = $compile;
      this.$mdSidenav = $mdSidenav;
      this.$mdDialog = $mdDialog;
      this.$mdComponentRegistry = $mdComponentRegistry;
      this.$controller = $controller;
      this.$q = $q;
      this.$filter = $filter;
      this._ = _;
      this.LocalizationService = LocalizationService;
      this.PLMPermissions = PLMPermissions;
      this.PermissionService = PermissionService;
      this.EventService = EventService;
      this.FlyoutService = FlyoutService;
      this.NotificationService = NotificationService;
      this.ModelsManager = ModelsManager;
      this.UrnParser = UrnParser;
      this.CreateTypes = CreateTypes;
      this.WorkspaceTypes = WorkspaceTypes;
      this.TabActionNameTypes = TabActionNameTypes;
      this.NotificationTypes = NotificationTypes;
      this.workspaceId = angular.isDefined(this.workspaceId) ? this.workspaceId : this.$stateParams.workspaceId;
      this.viewWorkflowPermission = PLMPermissions.VIEW_WORKFLOW;
      this.hasDeletePermission = false;
      this.isBookmarked = false;
      this.isArchived = false;
      this.isLocked = false;
      this.isWorkingVersion = false;
      this.hasOverrideWorkflowLock = false;
      this.hasOverrideRevisionLock = false;
      this.showWorkflowState = false;
      this.itemId = this.$location.search().itemId;
      this.$scope.itemId = this.itemId;
      this.isFullView = (this.$location.search().view === 'full');
      this.tabList = [];
      this.workspaceSections;
      this.linkedToWorkspaces = new Promise(angular.noop);
      this.isItemAdded;
      this.currentStateName = '';
      this.isCreatePermitted;
      this.workspaceIcon;
      this.itemCurrLifecycleName = '';
      this.isWorkflowTransitionHidden = true;
      this.isWorkspaceWithWorkflow = false;
      this.archiveListenerId;
      this.bookmarkListenerId;
      this.updateArchiveListenerId;
      this.updateBookmarkListenerId;
      $rootScope.$on('$locationChangeSuccess', function() {
        $__2.init();
      });
      $scope.$on('$destroy', function() {
        EventService.unlisten($__2.archiveListenerId);
        EventService.unlisten($__2.bookmarkListenerId);
        EventService.unlisten($__2.updateArchiveListenerId);
        EventService.unlisten($__2.updateBookmarkListenerId);
        EventService.unlisten($__2.itemAddedToECOListenerId);
      });
      this.isDisplayed = false;
    }
    return ($traceurRuntime.createClass)(ItemViewerController, {
      navigateToRoamer: function() {
        this.$state.go('roamer', {
          itemUrn: this.itemId,
          itemTab: this.$location.search().tab
        });
      },
      init: function() {
        var $__2 = this;
        this.isFullView = (this.$location.search().view === 'full');
        this.itemId = this.$location.search().itemId;
        this.$scope.itemId = this.itemId;
        this.workspaceId = this.$stateParams.workspaceId;
        this.isDisplayed = typeof this.itemId !== 'undefined';
        this.$mdComponentRegistry.when('item-content').then(function(itemContent) {
          $__2.isOpen = angular.bind(itemContent, itemContent.isOpen);
          $__2.togglePanel = angular.bind(itemContent, itemContent.toggle);
          $__2.openPanel = angular.bind(itemContent, itemContent.open);
          $__2.closePanel = angular.bind(itemContent, itemContent.close);
          $__2.$mdDialog.cancel();
          $__2.openPanel();
          $__2.initPanel();
        });
        var workspacesListenerId = this.EventService.listen('workspaces:all:done', function(event, WorkspacesObj) {
          $__2.EventService.unlisten(workspacesListenerId);
          $__2.workspaceSections = WorkspacesObj.getFullList().sections;
        });
        this.ModelsManager.getWorkspaces('workspaces:all:get');
        var updateHeaderItemListenerId = this.EventService.listen('itemViewer:setNewItem', function(event, itemId) {
          $__2.initPanel(itemId);
        });
        this.itemAddedToECOListenerId = this.EventService.listen('itemAddedToECO:done', function() {});
      },
      initPanelAndReload: function() {
        this.initPanel();
        this.$state.reload(this.$state.current.name);
      },
      isArchiveDisabled: function() {
        return !((this.hasOverrideWorkflowLock || !this.isLocked) && (this.hasOverrideRevisionLock || this.isWorkingVersion));
      },
      initPanel: function(itemId) {
        var $__2 = this;
        if (!angular.isDefined(itemId) && !angular.isDefined(this.$location.search().itemId)) {
          return;
        }
        this.itemId = angular.isDefined(itemId) ? itemId : this.$location.search().itemId;
        this.headerText = '';
        var itemListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, itemObj) {
          $__2.EventService.unlisten(itemListenerId);
          $__2.selectedRevision = null;
          $__2.isCreatePermitted = false;
          $__2.currentStateName = itemObj.getFullList().currentState ? itemObj.getFullList().currentState.title || 'Not Found' : undefined;
          $__2.isArchived = itemObj.getFullList().deleted;
          $__2.isLocked = itemObj.getFullList().itemLocked;
          $__2.isWorkingVersion = itemObj.isWorking();
          var userPermissionsListenerId = $__2.EventService.listen(("userPermissions:" + $__2.workspaceId + "~*:done"), function(event, userPermissionsObj) {
            $__2.EventService.unlisten(userPermissionsListenerId);
            $__2.hasDeletePermission = userPermissionsObj.hasPermission($__2.PLMPermissions.DELETE_ITEMS);
            $__2.hasOverrideWorkflowLock = userPermissionsObj.hasPermission($__2.PLMPermissions.ADMIN_OVERRIDE_WORKFLOW_LOCKS);
            $__2.hasOverrideRevisionLock = userPermissionsObj.hasPermission($__2.PLMPermissions.OVERRIDE_REVISION_CONTROL_LOCKS);
          });
          $__2.currentWorkspaceObj = itemObj.getWorkspaceObj();
          var currentUserListenerId = $__2.EventService.listen('currentUser:currentUser:done', function(event, userObj) {
            $__2.EventService.unlisten(currentUserListenerId);
            $__2.dateFormat = userObj.getDateFormat();
          });
          $__2.ModelsManager.getCurrentUser();
          if ($__2.currentWorkspaceObj.getId() !== $__2.workspaceId) {
            $__2.workspaceId = $__2.currentWorkspaceObj.getId();
            $__2.EventService.send(("reloadWorkspaceItems:" + $__2.workspaceId + ":get"), [$__2.workspaceId, $__2.currentWorkspaceObj.getDisplayName()]);
          }
          $__2.selectedEffectivity = null;
          $__2.itemCurrLifecycleName = null;
          $__2.currentItemObj = itemObj;
          var iconWorkspaceListenerId = $__2.EventService.listen('workspaces:all:done', function(event, WorkspacesObj) {
            var categoryInfo = WorkspacesObj.getSimpleList().filter(function(workspace) {
              return workspace.id === parseInt($__2.workspaceId);
            }).shift();
            $__2.workspaceIcon = categoryInfo ? categoryInfo.icon : null;
            $__2.EventService.unlisten(iconWorkspaceListenerId);
          });
          $__2.ModelsManager.getWorkspaces('workspaces:all:get');
          var tabsListenerId = $__2.EventService.listen(("itemTabs:" + $__2.workspaceId + ":done"), function(event, tabsObj) {
            $__2.EventService.unlisten(tabsListenerId);
            $__2.tabList.splice(0, $__2.tabList.length);
            $__2._.each(tabsObj.getFullList(), function(tab, tabIndex) {
              var actionNameStripped = tab.actionName.substr(1);
              var foundTab = $__2._.find(TABMAPPING, function(foundTab, foundTabEl) {
                return foundTabEl === actionNameStripped;
              });
              if (angular.isDefined(foundTab)) {
                if (actionNameStripped === $__2.TabActionNameTypes.NAMED_RELATIONSHIPS) {
                  actionNameStripped = tab.key;
                }
                var tabName = (tab.name === null) ? tab.key : tab.name;
                $__2.tabList.push({
                  name: tabName,
                  id: actionNameStripped,
                  active: foundTab.active,
                  viewLink: (foundTab.active + "-view"),
                  editLink: (foundTab.active + "-edit"),
                  link: foundTab.link,
                  icon: foundTab.icon
                });
              }
            });
          });
          $__2.ModelsManager.getTabs($__2.workspaceId);
          $__2.workspaceTypeId = parseInt(itemObj.getWorkspaceObj().getTypeId());
          $__2.headerText = itemObj.getFullList().title;
          $__2.showWorkflowState = (($__2.workspaceTypeId === $__2.WorkspaceTypes.BASIC_WORKSPACE_WITH_WORKFLOW) || ($__2.workspaceTypeId === $__2.WorkspaceTypes.REVISIONING_WORKSPACE) || ($__2.workspaceTypeId === $__2.WorkspaceTypes.SUPPLIER_WITH_WORKFLOW)) && ($__2.currentStateName !== undefined);
          $__2.LocalizationService.init().then(function() {
            $__2.bundle = $__2.$rootScope.bundle;
            switch ($__2.workspaceTypeId) {
              case 2:
              case 7:
              case 8:
                $__2.displayRevisionsDropdown = false;
                $__2.isWorkspaceWithWorkflow = true;
                var availableTransitionsListenerId = $__2.EventService.listen(("itemTransitions:" + $__2.itemId + ":done"), function(event, data) {
                  $__2.isWorkflowTransitionAvailable = data.transitions.length ? true : false;
                  $__2.EventService.unlisten(availableTransitionsListenerId);
                });
                $__2.ModelsManager.getTransitionsByLink($__2.itemId, itemObj.getTransitionsLink());
                break;
              case 6:
                $__2.displayRevisionsDropdown = true;
                $__2.isWorkspaceWithWorkflow = false;
                var revisioningTranslationKeys = {
                  OBSOLETE: $__2.bundle.revision.obsolete,
                  PENDING: $__2.bundle.revision.pending,
                  LATEST: $__2.bundle.revision.latest,
                  SUPERSEDED: $__2.bundle.revision.superseded,
                  UNRELEASED: $__2.bundle.revision.unreleased,
                  WORKING: $__2.bundle.revision.working
                };
                var itemRevisionsListenerId = $__2.EventService.listen('itemRevisions:*:done', function(event, revisionsObj) {
                  $__2.EventService.unlisten(itemRevisionsListenerId);
                  var getEffectivityStatusText = function(effectivity) {
                    return effectivity.status === 'PENDING' ? $__2.$rootScope.bundle.revision.pending : $__2.$rootScope.bundle.revision.neverInEffect;
                  };
                  var getEffectivityDateText = function(effectivity) {
                    var dateFilter = $__2.$filter('date');
                    var text = dateFilter(effectivity.startDate, $__2.dateFormat);
                    return text + (effectivity.endDate ? ' - ' + dateFilter(effectivity.endDate, $__2.dateFormat) : '');
                  };
                  var getEffectivityText = function(effectivity) {
                    if (!effectivity || (!effectivity.status && !effectivity.startDate)) {
                      return null;
                    }
                    return (effectivity.status) ? getEffectivityStatusText(effectivity) : getEffectivityDateText(effectivity);
                  };
                  $__2.revisionDropdownArr = $__2._.map(revisionsObj.json.versions, function(value, index) {
                    var itemLinkId = value.__self__.substr(value.__self__.indexOf('versions/') + 9);
                    var obj = {
                      id: itemLinkId,
                      description: '',
                      label: value.item.version,
                      href: $__2.$state.href($__2.$state.current.name, {
                        tab: $__2.$location.search().tab,
                        view: $__2.$location.search().view,
                        mode: 'view',
                        itemId: $__2.UrnParser.encode(value.item.urn)
                      }),
                      effectivity: value.effectivity ? getEffectivityText(value.effectivity) : null,
                      lifecycle: ''
                    };
                    switch (value.status) {
                      case 'UNRELEASED':
                      case 'WORKING':
                        obj.description += revisioningTranslationKeys[value.status];
                        obj.lifecycle = revisioningTranslationKeys[value.status];
                        break;
                      default:
                        obj.lifecycle = value.lifecycle.title;
                        obj.description += (value.lifecycle.title + " " + value.version + " (" + revisioningTranslationKeys[value.status] + ")");
                        break;
                    }
                    return obj;
                  });
                  $__2.selectedRevision = $__2._.find($__2.revisionDropdownArr, function(value, index) {
                    return itemObj.getId().toString() === value.id;
                  });
                  $__2.itemCurrLifecycleName = $__2.selectedRevision ? $__2.selectedRevision.lifecycle : '';
                }, true);
                $__2.ModelsManager.getRevisions($__2.workspaceId, $__2.itemId);
                break;
              case 1:
              case 3:
              default:
                $__2.displayRevisionsDropdown = false;
                $__2.isWorkspaceWithWorkflow = false;
                break;
            }
          });
          $__2.updateInContextualCreateLinkState(itemObj);
        });
        this.bookmarkListenerId = this.EventService.listen('bookmarkedItems:load:done', function(event, BookmarkedObj) {
          $__2.isBookmarked = BookmarkedObj.isItemBookmarked($__2.itemId);
        }, true);
        this.ModelsManager.getBookmarkedItems('bookmarkedItems:load:get');
        this.updateArchiveListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":done"), function(event, itemObj) {
          $__2.isArchived = itemObj.getFullList().deleted;
        }, true);
        this.archiveListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":setArchiveDone"), function(event) {
          $__2.NotificationService.showNotifications();
          $__2.ModelsManager.resetModels();
          $__2.ModelsManager.getItem($__2.itemId);
        });
        this.updateBookmarkListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":setBookmarkDone"), function(event) {
          $__2.NotificationService.showNotifications();
          $__2.ModelsManager.resetModels();
          $__2.ModelsManager.getBookmarkedItems('bookmarkedItems:load:get');
        });
        this.ModelsManager.getItem(this.itemId);
      },
      updateInContextualCreateLinkState: function(itemObj) {
        var $__2 = this;
        var workspaceTypeId = parseInt(itemObj.workspaceObj.getTypeId());
        var isRevisionControlledWorkspace = workspaceTypeId === this.WorkspaceTypes.REVISION_CONTROLLED_WORKSPACE;
        this.isItemAdded = itemObj.getFullList().workflowReference || !itemObj.getFullList().workingVersion;
        if (!isRevisionControlledWorkspace) {
          return;
        }
        var linkedToWorkspacesListenerId = this.EventService.listen(("linkedToWorkspaces:" + itemObj.workspaceObj.getId() + ":done"), function(event, linkedToWorkspacesObj) {
          $__2.EventService.unlisten(linkedToWorkspacesListenerId);
          var linkedToRevisioningWorkspaces = linkedToWorkspacesObj.getRevisioningWorkspaces();
          var permissionPromises = _.map(linkedToRevisioningWorkspaces, function(workspace) {
            return new Promise(function(resolve, reject) {
              var workspaceId = workspace.link.split('/').pop();
              var workspaceListenerId = $__2.EventService.listen(("workspaceInstance:" + workspaceId + ":done"), function(event, workspaceObj) {
                $__2.EventService.unlisten(workspaceListenerId);
                $__2.PermissionService.hasPermissions([$__2.PLMPermissions.VIEW_ITEMS, $__2.PLMPermissions.ADD_ITEMS, $__2.PLMPermissions.VIEW_WORKFLOW_ITEMS, $__2.PLMPermissions.EDIT_WORKFLOW_ITEMS, $__2.PLMPermissions.ADD_WORKFLOW_ITEMS], workspaceObj.getId()).then(function(hasPermission) {
                  if (hasPermission) {
                    resolve(workspaceObj);
                  } else {
                    resolve(false);
                  }
                });
              });
              $__2.ModelsManager.getWorkspace(workspaceId);
            });
          });
          $__2.linkedToWorkspaces = Promise.all(permissionPromises).then($__2._.filter);
          $__2.linkedToWorkspaces.then(function(workspaces) {
            return $__2.isCreatePermitted = $__2._.some(workspaces);
          });
        });
        this.ModelsManager.getAffectedItemLinkedToWorkspaces(itemObj.workspaceObj.getId());
      },
      getTabLink: function(tabActiveId, tabLinkId, tabItemId, tabId) {
        return this.$state.href(tabLinkId, {
          tab: tabLinkId,
          view: this.$location.search().view,
          mode: 'view',
          itemId: tabItemId,
          relationshipKey: tabId
        });
      },
      goToTab: function(tabActiveId, tabLinkId) {
        var $__2 = this;
        var tabString = 'workspace-item-details';
        this._.each(this.$state.get(), function(val) {
          if (val.name === ("workspace-item-" + tabActiveId) && val.views) {
            tabString = ("workspace-item-" + tabActiveId);
          } else if (val.name === tabLinkId && val.views) {
            tabString = tabLinkId;
          }
        });
        this.$timeout(function() {
          $__2.$location.search({
            tab: tabString,
            view: $__2.$location.search().view,
            mode: 'view',
            itemId: $__2.$location.search().itemId
          });
        }, 300);
      },
      getActiveTab: function() {
        var tabActiveId = arguments[0] !== (void 0) ? arguments[0] : null;
        var tabLinkId = arguments[1] !== (void 0) ? arguments[1] : null;
        var tabId = arguments[2] !== (void 0) ? arguments[2] : null;
        if (tabActiveId !== null && tabLinkId !== null) {
          var tabString = '';
          this._.each(this.$state.get(), function(val) {
            if (val.name === ("workspace-item-" + tabActiveId) && val.views) {
              tabString = ("workspace-item-" + tabActiveId);
            } else if (tabLinkId === 'named-relationships' && tabId !== null) {
              tabString = tabId;
            } else if (val.name === tabLinkId && val.views) {
              tabString = tabLinkId;
            }
          });
          return tabString;
        } else {
          if (this.$location.search().tab === 'named-relationships') {
            return this.$location.search().relationshipKey;
          }
          return this.$location.search().tab;
        }
      },
      openPanel: function() {},
      closePanel: function() {},
      gotoItemsList: function() {
        var $__2 = this;
        if (this.$location.search().view === 'split') {
          this.closePanel();
          this.$location.search({});
        } else {
          this.$state.current.reloadOnSearch = true;
          this.$state.transitionTo('workspace-items-list', {workspaceId: this.workspaceId}, {
            location: true,
            reload: true,
            inherit: false
          });
          this.$timeout(function() {
            $__2.$state.current.reloadOnSearch = false;
          }, 2000);
        }
      },
      showTransitions: function() {
        var $__2 = this;
        var flyoutInstance = this.FlyoutService.open({
          templateUrl: 'build/components/itemHeader/workflowTransition.html',
          scope: this.$scope,
          anchorEl: document.getElementById('itemviewer-menu-dropdown-button'),
          placement: 'center-center',
          flyoutClass: 'workflow-flyout',
          controller: 'WorkflowTransitionController',
          resolve: {
            AnchorElWidth: function() {
              return document.getElementById('itemviewer-menu-dropdown-button').clientWidth;
            },
            ParentController: function() {
              return $__2;
            },
            ItemObj: function() {
              return $__2.currentItemObj;
            }
          }
        });
      },
      proceedTransition: function(result, selectedTransitionId) {
        var $__2 = this;
        var deferred = this.$q.defer();
        this.processingTransition = true;
        this.EventService.send(("itemInstance:" + this.itemId + ":performTransition"), [this.currentItemObj, result.transition, result.comments, result.selectedUserImpersonation]);
        var performTransitionListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":performTransitionDone"), function(event, flag) {
          $__2.EventService.unlisten(performTransitionListenerId);
          $__2.EventService.unlisten(performTransitionBadRequestListenerId);
          if (flag) {
            $__2.processingTransition = false;
            $__2.initPanel();
            $__2.NotificationService.addNotification($__2.NotificationTypes.SUCCESS, ("" + $__2.$rootScope.bundle.transition.success));
            deferred.resolve();
          } else {
            $__2.processingTransition = false;
            $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ("" + $__2.$rootScope.bundle.transition.error));
            deferred.reject('');
          }
          $__2.EventService.send(("transitions:" + selectedTransitionId + ":done"), flag);
        });
        var performTransitionBadRequestListenerId = this.EventService.listen(("itemInstance:" + this.itemId + ":performTransitionBadRequest"), function(event, errorDetails) {
          $__2.EventService.unlisten(performTransitionListenerId);
          $__2.EventService.unlisten(performTransitionBadRequestListenerId);
          $__2.NotificationService.addNotification($__2.NotificationTypes.ERROR, ($__2.$rootScope.bundle.transition.error + ": " + errorDetails.message));
          deferred.reject(errorDetails.message);
        });
        return deferred.promise;
      },
      triggerArchive: function(flag) {
        this.EventService.send(("itemInstance:" + this.itemId + ":setArchive"), this.currentItemObj, flag);
        if (flag) {
          this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, ("" + this.currentItemObj.getItemTitle() + this.$rootScope.bundle.notification.archive.success));
        } else {
          this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, ("" + this.currentItemObj.getItemTitle() + this.$rootScope.bundle.notification.unarchive.success));
        }
      },
      close: function() {
        var $__2 = this;
        this.isFullView ? this.$state.go('workspace-items-list', {workspaceId: this.workspaceId}) : this.closePanel().then(function() {
          return $__2.$state.go('^.^');
        });
      },
      changeViewMode: function() {
        var mode = arguments[0] !== (void 0) ? arguments[0] : 'full';
        this.$state.go(this.$state.current, {view: mode}, {
          location: true,
          inherit: true,
          notify: true,
          reload: false
        });
        this.isFullView = mode === 'full';
      },
      triggerBookmark: function(target, flag) {
        this.EventService.send(("itemInstance:" + this.itemId + ":setBookmark"), this.currentItemObj, flag);
        if (flag) {
          this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, ("" + this.currentItemObj.getItemTitle() + this.$rootScope.bundle.notification.bookmark.success));
        } else {
          this.NotificationService.addNotification(this.NotificationTypes.SUCCESS, ("" + this.currentItemObj.getItemTitle() + this.$rootScope.bundle.notification.removeBookmark.success));
        }
        angular.element(document.getElementById(target)).blur();
      },
      triggerCreate: function() {
        var $__2 = this;
        this.$mdDialog.show({
          controller: 'CreateItemDialogController',
          controllerAs: 'createItemDialogCtrl',
          templateUrl: 'build/components/createItem/createItemDialog.html',
          locals: {createType: this.CreateTypes.CONTEXTUAL},
          resolve: {
            CurrentItem: function() {
              return $__2.currentItemObj;
            },
            CurrentWorkspace: function() {
              return $__2.currentItemObj.getWorkspaceObj();
            },
            WorkspaceSections: function() {
              return $__2.workspaceSections;
            },
            AddWorkspaceList: function() {
              return $__2.linkedToWorkspaces;
            }
          }
        });
      },
      isViewState: function() {
        return (this.$location.search().mode === 'view');
      },
      isSeparatorNeeded: function() {
        var $__2 = this;
        var args = Array.prototype.slice.call(arguments);
        var isSeparatorNeeded = false;
        args.every(function(ngIfExpression) {
          if (($__2._.isBoolean(ngIfExpression) && ngIfExpression) || (angular.isObject(ngIfExpression) && (ngIfExpression !== null))) {
            isSeparatorNeeded = true;
            return false;
          }
          return true;
        });
        return isSeparatorNeeded;
      }
    }, {});
  }();
  var $__default = ItemViewerController;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/components/itemViewer/itemViewer.controller.js
