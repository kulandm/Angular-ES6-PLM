System.registerModule("com/autodesk/App.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/App.js";
  var App = function() {
    this.enabledFeatures = {link: 'api/v3/tenant/enabled-features'};
    this.outstandingWork = {link: 'api/v3/users/[userId]/outstanding-work'};
    this.bookmarkedItems = {link: 'api/v3/users/[userId]/bookmarks'};
    this.recentlyViewed = {link: 'api/v3/users/[userId]/recently-viewed'};
    this.user = {
      link: 'api/v3/users/',
      linkV2: 'api/v2/users/'
    };
    this.userTenantPermissions = {link: 'api/v3/users/[userId]/permissions'};
    this.users = {link: 'api/v2/users'};
    this.groups = {
      link: 'api/v2/groups',
      linkV3: 'api/v3/groups'
    };
    this.userProfile = {link: 'api/v2/users/profile'};
    this.userGroups = {link: 'api/rest/v1/users/[userId]/groups'};
    this.reports = {link: 'api/rest/v1/reports/dashboard'};
    this.configurations = {link: 'api/v3/configurations'};
    this.workspaces = {link: 'api/v3/workspaces'};
    this.workspaceType = {link: 'api/v3/workspace-types/[typeId]'};
    this.menu = {link: 'api/v2/menu'};
    this.picklistWorkspaceOptions = {link: 'api/v3/workspaces/[wsId]/views/1/fields/[picklistId]/options'};
    this.picklistOptions = {link: 'api/v3/workspaces/[wsId]/items/[itemId]/views/1/fields/[picklistId]/options'};
    this.picklistSelection = {link: 'api/v3/workspaces/[wsId]/items/[itemId]/views/1/fields/[picklistId]/selection'};
    this.hubs = {link: 'api/v3/hubs?edition=business'};
    this.wipBase = {link: 'api/v3/configurations/wipBaseUrl'};
    this.workspaceTableaus = {link: 'api/v3/workspaces/[wsId]/tableaus'};
  };
  App.prototype = {
    getOutstandingWorkLink: function(userId) {
      return this.outstandingWork.link.replace('[userId]', userId);
    },
    getBookmarkedItemsLink: function(userId) {
      return this.bookmarkedItems.link.replace('[userId]', userId);
    },
    getRecentlyViewedLink: function(userId) {
      return this.recentlyViewed.link.replace('[userId]', userId);
    },
    getReportsLink: function() {
      return this.reports.link;
    },
    getUserProfileLink: function() {
      return this.userProfile.link;
    },
    getUserLink: function(userId) {
      return this.user.link + userId;
    },
    getUserGroupsLink: function(userId) {
      return this.userGroups.link.replace('[userId]', userId);
    },
    getUserDefaultInterfaceLink: function(userId) {
      return this.user.link + userId;
    },
    getUserDefaultInterfaceLinkV2: function(userId) {
      return this.user.linkV2 + userId;
    },
    getUsersLink: function() {
      return this.users.link;
    },
    getGroupsLink: function() {
      return this.groups.link;
    },
    getGroupsLinkV3: function() {
      return this.groups.linkV3;
    },
    getUserTenantPermissionsLink: function(userId) {
      return this.userTenantPermissions.link.replace('[userId]', userId);
    },
    getMenuLink: function() {
      return this.menu.link;
    },
    getWorkspacesLink: function() {
      return this.workspaces.link;
    },
    getWorkspaceTypeLink: function(typeId) {
      return this.workspaceType.link.replace('[typeId]', typeId);
    },
    getEnabledFeaturesLink: function() {
      return this.enabledFeatures.link;
    },
    getConfigurationsLink: function() {
      return this.configurations.link;
    },
    getPicklistWorkspaceOptionsLink: function(workspaceId, picklistId) {
      if (!workspaceId || !picklistId) {
        return null;
      }
      var link = this.picklistWorkspaceOptions.link.replace('[wsId]', workspaceId);
      return link.replace('[picklistId]', picklistId);
    },
    getPicklistWorkspaceSelectionLink: function(workspaceId, picklistId) {
      if (!workspaceId || !picklistId) {
        return null;
      }
      var link = this.picklistWorkspaceSelection.link.replace('[wsId]', workspaceId);
      return link.replace('[picklistId]', picklistId);
    },
    getPicklistOptionsLink: function(itemUrn, picklistId) {
      if (!itemUrn || !picklistId) {
        return null;
      }
      var urnArray = itemUrn.split(',');
      var itemId = urnArray.splice(urnArray.length - 1, 1)[0];
      var wsId = urnArray.splice(urnArray.length - 1, 1)[0];
      var link = this.picklistOptions.link.replace('[wsId]', wsId);
      link = link.replace('[itemId]', itemId);
      return link.replace('[picklistId]', picklistId);
    },
    getPicklistSelectionLink: function(itemUrn, picklistId) {
      if (!itemUrn || !picklistId) {
        return null;
      }
      var urnArray = itemUrn.split(',');
      var itemId = urnArray.splice(urnArray.length - 1, 1)[0];
      var wsId = urnArray.splice(urnArray.length - 1, 1)[0];
      var link = this.picklistSelection.link.replace('[wsId]', wsId);
      link = link.replace('[itemId]', itemId);
      return link.replace('[picklistId]', picklistId);
    },
    getDataTabUri: function(hubs) {
      if (hubs.hasOwnProperty('items') && hubs.items.length) {
        return (hubs.items[0].links.link.href + "/g/all_projects/active");
      }
      return null;
    },
    getWorkspaceTableau: function(workspaceId) {
      return this.workspaceTableaus.link.replace('[wsId]', workspaceId);
    }
  };
  var $__default = App;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/App.js
;

System.registerModule("com/autodesk/ModelsManager.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/ModelsManager.js";
  function ModelsManager(RESTWrapperService, EventService, App, ClassicRedirector, $location, $state, $q, $log, $filter, _) {
    var root = new App();
    var models = {app: {
        workspaces: {workspace: {
            items: {item: {
                changeLog: {},
                boms: {
                  bomRoot: {},
                  bomNested: {bomNestedItems: {}}
                },
                grid: {},
                bomNested: {},
                state: {},
                revisions: {},
                transitions: {transition: {}}
              }},
            views: {view: {}},
            viewDefinitions: {viewDefinition: {}},
            tabs: {},
            tableau: {}
          }},
        outstandingWork: {},
        bookmarkedItems: {},
        recentlyViewed: {},
        reports: {report: {}},
        user: {},
        configurations: {}
      }};
    var initModels = function(models) {
      _.each(models, function(model, key) {
        if (key !== 'objects') {
          model.objects = {};
          initModels(model);
        }
      });
    };
    initModels(models);
    var findModel = function(models, modelId) {
      var ret;
      _.each(models, function(model, modelKey) {
        if (modelKey !== 'objects') {
          _.each(model.objects, function(modelObject, key) {
            if (modelId === key) {
              ret = modelObject;
            }
          });
          if (!angular.isDefined(ret)) {
            ret = findModel(model, modelId);
          }
        }
      });
      return ret;
    };
    var findParent = function(models, modelName, parentName) {
      var ret;
      _.each(models, function(model, modelKey) {
        if (modelKey !== 'objects') {
          if (modelName === modelKey) {
            ret = parentName;
          }
          if (!angular.isDefined(ret)) {
            ret = findParent(model, modelName, modelKey);
          }
        }
      });
      return ret;
    };
    var addModel = function(models, modelName, modelId, modelObject) {
      var inserted = false;
      _.each(models, function(model, key) {
        if (key !== 'objects') {
          if (modelName === key) {
            model.objects[modelId] = modelObject;
            inserted = true;
          }
          if (!inserted) {
            inserted = addModel(model, modelName, modelId, modelObject);
          }
        }
      });
      return inserted;
    };
    return {
      getAppModel: function() {
        return root;
      },
      resetModels: function() {
        initModels(models);
      },
      getOutstandingWork: function(event, recalculate) {
        var app = this.getAppModel();
        var doneEvent = event.substring(0, event.lastIndexOf(':')) + ':done';
        var modelObject = findModel(models, app.getOutstandingWorkLink());
        if (modelObject) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(usrEvent, userObj) {
          EventService.unlisten(currentUserListenerId);
          var outstandingWorkListener = EventService.listen(doneEvent, function(event, obj) {
            EventService.unlisten(outstandingWorkListener);
            addModel(models, 'outstandingWork', app.getOutstandingWorkLink(), obj);
          });
          EventService.send(event, app.getOutstandingWorkLink(userObj.getId()), recalculate);
        }, true);
        this.getCurrentUser();
      },
      getBookmarkedItems: function(event) {
        var app = this.getAppModel();
        var doneEvent = event.substring(0, event.lastIndexOf(':')) + ':done';
        var modelObject = findModel(models, app.getBookmarkedItemsLink());
        if (modelObject) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(usrEvent, userObj) {
          EventService.unlisten(currentUserListenerId);
          var bookmarkedItemsListener = EventService.listen(doneEvent, function(bookmarkedEvent, obj) {
            EventService.unlisten(bookmarkedItemsListener);
            addModel(models, 'bookmarkedItems', app.getBookmarkedItemsLink(), obj);
          });
          EventService.send(event, app.getBookmarkedItemsLink(userObj.getId()));
        }, true);
        this.getCurrentUser();
      },
      getRecentlyViewedItems: function(event) {
        var app = this.getAppModel();
        var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event3, userObj) {
          EventService.unlisten(currentUserListenerId);
          EventService.send(event, app.getRecentlyViewedLink(userObj.getId()));
        }, true);
        this.getCurrentUser();
      },
      getReports: function(event) {
        var app = this.getAppModel();
        EventService.send(event, app.getReportsLink());
      },
      getReport: function(reportId) {
        this.getReports('reports:' + reportId + ':get');
        EventService.listen('reports:' + reportId + ':done', function(event, reportsObj) {
          EventService.send('report:' + reportId + ':get', reportsObj.getReportLink(reportId));
        }, true);
      },
      getCurrentUser: function() {
        var that = this;
        var app = this.getAppModel();
        var doneEvent = 'currentUser:currentUser:done';
        var handleResponse = function(id) {
          var userListenerId = EventService.listen('user:' + id + ':done', function(event, obj) {
            EventService.send('currentUser:currentUser:done', obj);
            EventService.unlisten(userListenerId);
            var queryString = $location.search();
            if (queryString.noAnimations) {
              sessionStorage.setItem('inTest', 1);
            }
            if (obj.getInterfaceStyle() === 'ClassicPLM360' && !$state.current.abstract && !queryString.noAnimations && !sessionStorage.getItem('inTest')) {
              window.location.href = ClassicRedirector.getUrl($state, $location);
            }
          }, true);
          that.getUser(id);
        };
        var modelObject = findModel(models, app.getUserProfileLink());
        if (modelObject) {
          handleResponse(modelObject.id);
          return;
        }
        RESTWrapperService.get(app.getUserProfileLink(), null, null).then(function(profileObj) {
          addModel(models, 'user', app.getUserProfileLink(), profileObj);
          handleResponse(profileObj.id);
        });
      },
      setCurrentUserDefInterface: function(interfaceName) {
        var app = this.getAppModel();
        var currentUserListener = EventService.listen('currentUser:currentUser:done', function(event, userObj) {
          EventService.unlisten(currentUserListener);
          userObj.setDefaultInterface(interfaceName, app.getUserDefaultInterfaceLink(userObj.getId())).then(function() {
            EventService.send('currentUser:definterface:done');
          }, function() {
            EventService.send('currentUser:definterface:error');
          });
        });
        this.getCurrentUser();
      },
      setCurrentUserDefInterfaceV2: function(interfaceName) {
        var app = this.getAppModel();
        RESTWrapperService.get('api/v2/users/profile', null, null).then(function(userObj) {
          var data = [{
            op: 'replace',
            path: '/interfaceStyle',
            value: interfaceName
          }];
          var headers = {'Content-Type': 'application/json-patch+json'};
          return RESTWrapperService.patch(data, app.getUserDefaultInterfaceLinkV2(userObj.id), null, null, headers).then(function() {
            return EventService.send('currentUser:definterface:done');
          });
        });
      },
      getUser: function(id) {
        var app = this.getAppModel();
        var doneEvent = 'user:' + id + ':done';
        var modelObject = findModel(models, app.getUserLink(id));
        if (modelObject) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        EventService.send('user:' + id + ':get', app.getUserLink(id));
        var userListenerId = EventService.listen(doneEvent, function(event, obj) {
          EventService.unlisten(userListenerId);
          addModel(models, 'user', app.getUserLink(id), obj);
        }, true);
      },
      getUserProfile: function() {
        RESTWrapperService.get(this.getAppModel().getUserProfileLink(), null, null).then(function(profileObj) {
          EventService.send('userProfile:userProfile:done', profileObj);
        });
      },
      getUserGroups: function(userId) {
        RESTWrapperService.get(this.getAppModel().getUserGroupsLink(userId), null, null).then(function(userGroupsObj) {
          EventService.send('userGroups:' + userId + ':done', userGroupsObj);
        });
      },
      getWorkspaces: function(event) {
        var app = this.getAppModel();
        var doneEvent = event.substring(0, event.lastIndexOf(':')) + ':done';
        var modelObject = findModel(models, app.getWorkspacesLink());
        if (modelObject) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        EventService.send(event, [app.getMenuLink(), app.getWorkspacesLink()]);
        var listenerId = EventService.listen(doneEvent, function(event, obj) {
          EventService.unlisten(listenerId);
          addModel(models, 'workspaces', app.getWorkspacesLink(), obj);
        }, true);
      },
      getWorkspace: function(workspaceId) {
        var that = this;
        var workspacesListenerId = EventService.listen('workspaces:' + workspaceId + ':done', function(event1, workspacesObj) {
          EventService.unlisten(workspacesListenerId);
          if (workspacesObj.getWorkspaceLink(workspaceId)) {
            var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event2, obj) {
              EventService.unlisten(workspaceListenerId);
              var currentUserListenerId = EventService.listen('currentUser:currentUser:done', function(event3, userObj) {
                EventService.unlisten(currentUserListenerId);
                var userPermissionsListenerId = EventService.listen('userPermissions:' + obj.getId() + '~' + userObj.getId() + ':done', function(event4, userPermissionsObj) {
                  EventService.unlisten(userPermissionsListenerId);
                  userObj.setPermissions(userPermissionsObj);
                }, true);
                that.getUserPermissions(obj, userObj.getId());
              }, true);
              that.getCurrentUser();
            }, true);
            EventService.send('workspaceInstance:' + workspaceId + ':get', workspacesObj.getWorkspaceLink(workspaceId), workspaceId, workspacesObj);
          } else {
            EventService.send('workspaceInstance:' + workspaceId + ':permissionError', workspaceId);
          }
        }, true);
        this.getWorkspaces('workspaces:' + workspaceId + ':get');
      },
      getWorkspaceType: function(typeId) {
        var app = this.getAppModel();
        var doneEvent = 'workspace:type:' + typeId + ':done';
        var modelObject = findModel(models, app.getWorkspaceTypeLink(typeId));
        if (modelObject) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        RESTWrapperService.get(app.getWorkspaceTypeLink(typeId), null, null).then(function(obj) {
          addModel(models, 'workspaceType', app.getWorkspaceTypeLink(typeId), obj);
          EventService.send(doneEvent, obj);
        });
      },
      getUserPermissions: function(workspaceObj, userId) {
        var app = this.getAppModel();
        EventService.send('userPermissions:' + workspaceObj.getId() + '~' + userId + ':get', workspaceObj.getUserPermissionsLink(userId));
      },
      getUserTenantPermissions: function(userId) {
        RESTWrapperService.get(this.getAppModel().getUserTenantPermissionsLink(userId), null, null).then(function(userPermissionsObj) {
          EventService.send('userTenantPermissions:' + userId + ':get', userPermissionsObj);
        });
      },
      getTabs: function(workspaceId) {
        this.getWorkspace(workspaceId);
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          EventService.send('itemTabs:' + workspaceId + ':get', workspaceObj.getTabsLink(workspaceId));
        }, true);
      },
      getItems: function(workspaceId, viewId, sortOrder, columnId, pageNumber, itemQuantity) {
        var that = this;
        var params = {};
        if (angular.isDefined(sortOrder)) {
          params[sortOrder] = columnId;
        }
        params.page = (angular.isUndefined(pageNumber)) ? 1 : pageNumber;
        params.size = (angular.isUndefined(itemQuantity)) ? 100 : itemQuantity;
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          var tableauListenerId = EventService.listen('workspaceTableau:' + workspaceId + ':getAllTableauDone', function(event, viewsObj) {
            EventService.unlisten(tableauListenerId);
            var tableau = _.find(viewsObj.tableaus, function(tableau) {
              return (parseInt(tableau.link.split('/').pop()) === viewId);
            });
            EventService.send('items:' + workspaceId + ':get', tableau.link, params, tableau);
          }, true);
          that.getAllWorkspaceTableaus(workspaceId);
        }, true);
        this.getWorkspace(workspaceId);
      },
      getItem: function(resourceId, isEdit, cached) {
        var that = this;
        var doneEvent = 'itemInstance:' + resourceId + ':done';
        isEdit = false;
        cached = angular.isDefined(cached) && cached === false ? false : true;
        var modelObject = findModel(models, resourceId + isEdit);
        if (modelObject && cached) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        var listenerId = EventService.listen('preItemInstance:' + resourceId + ':done', function(event, obj) {
          EventService.unlisten(listenerId);
          var workspaceId = obj.json.workspace.link.substring(obj.json.workspace.link.lastIndexOf('/') + 1);
          var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
            EventService.unlisten(workspaceListenerId);
            workspaceObj.getSectionsMeta(isEdit).then(function() {
              obj.workspaceObj = angular.copy(workspaceObj);
              addModel(models, 'items', resourceId + isEdit, obj);
              EventService.send(doneEvent, obj);
            });
          });
          that.getWorkspace(workspaceId);
        }, true);
        var notFoundListenerId = EventService.listen('preItemInstance:' + resourceId + ':notFound', function() {
          EventService.unlisten(notFoundListenerId);
          $state.go('not-found');
        });
        EventService.send('preItemInstance:' + resourceId + ':get', [resourceId, isEdit]);
      },
      getOwnership: function(dmsId) {
        var that = this;
        var ownershipListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(ownershipListenerId);
          that.getOwnershipByLink(dmsId, itemObj.getOwnershipLink());
        });
        this.getItem(dmsId);
      },
      getOwnershipByLink: function(dmsId, link) {
        EventService.send('ownership:' + dmsId + ':get', link);
      },
      getAffectedItems: function(dmsId) {
        var that = this;
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          that.getAffectedItemsByLink(dmsId, itemObj.getAffectedItemsLink());
        });
        this.getItem(dmsId);
      },
      getAffectedItemsByLink: function(dmsId, affectedItemsLink) {
        EventService.send('affectedItems:' + dmsId + ':get', affectedItemsLink);
      },
      getAffectedItem: function(affectedItemsObject, itemId) {
        var foundItem = affectedItemsObject.find(itemId);
        if (foundItem) {
          var uniqueId = foundItem.getSelfLink();
          EventService.send('affectedItem:' + itemId + ':get', uniqueId);
        }
      },
      getAffectedItemsTransitions: function(itemId, availableTransitionsLink) {
        EventService.send('affectedItemTransitions:' + itemId + ':get', availableTransitionsLink);
      },
      getGroups: function() {
        var app = this.getAppModel();
        EventService.send('groups', app.getGroupsLink());
      },
      getUsers: function(workspaceId) {
        var app = this.getAppModel();
        EventService.send('user:' + workspaceId + ':get', app.getUsersLink());
      },
      getWorkflowStates: function(workspaceId) {
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          EventService.send('itemState:' + workspaceId + ':get', workspaceObj.getWorkflowStatesLink(workspaceId));
        }, true);
        this.getWorkspace(workspaceId);
      },
      getWorkflowTransitions: function(workspaceId) {
        this.getWorkspace(workspaceId);
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          EventService.send('itemTransitions:' + workspaceId + ':get', workspaceObj.getWorkflowTransitionsLink(workspaceId));
        }, true);
      },
      getRelatedItems: function(dmsId) {
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('relatedItems:' + dmsId + ':get', itemObj.getRelatedItemsLink());
        });
        this.getItem(dmsId);
      },
      getNamedRelationships: function(dmsId, namedRelationshipsKey, pageOffset, itemQuantity) {
        var params = {};
        params.offset = (angular.isUndefined(pageOffset)) ? 0 : pageOffset;
        params.limit = (angular.isUndefined(itemQuantity)) ? 1000 : itemQuantity;
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('namedRelations:' + dmsId + '~' + namedRelationshipsKey + ':get', itemObj.getNamedRelationshipsLink(namedRelationshipsKey), params);
        });
        this.getItem(dmsId);
      },
      getRelatedItem: function(relatedItemsObject, itemId) {
        var foundItem = relatedItemsObject.find(itemId);
        if (foundItem) {
          var uniqueId = foundItem.getSelfLink();
          EventService.send('relatedItem:' + itemId + ':get', uniqueId);
        }
      },
      getChangeLog: function(workspaceId, dmsId, sortOrder, columnId, pageNumber, itemQuantity) {
        var params = {};
        if (angular.isDefined(sortOrder)) {
          params[sortOrder] = columnId;
        }
        params.page = (angular.isUndefined(pageNumber)) ? 1 : pageNumber;
        params.size = (angular.isUndefined(itemQuantity)) ? 100 : itemQuantity;
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('changeLog:' + dmsId + ':get', itemObj.getChangeLogLink(), params);
        });
        this.getItem(dmsId);
      },
      getWorkflow: function(dmsId, sortOrder, columnId) {
        var params = {};
        if (angular.isDefined(sortOrder)) {
          params[sortOrder] = columnId;
        }
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('workflow:' + dmsId + ':get', itemObj.getWorkflowLink(), params);
        });
        this.getItem(dmsId);
      },
      getActionNotifications: function(workspaceId, dmsId, sortOrder, columnId) {
        var params = {};
        if (angular.isDefined(sortOrder)) {
          params[sortOrder] = columnId;
        }
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('actionNotification:' + dmsId + ':get', itemObj.getActionNotificationsLink(), params);
        });
        this.getItem(dmsId);
      },
      getGrid: function(workspaceId, dmsId, sortOrder, columnId, pageNumber, itemQuantity) {
        var params = {};
        if (angular.isDefined(sortOrder)) {
          params[sortOrder] = columnId;
        }
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('grid:' + dmsId + ':get', itemObj.getGridLink(), params);
        });
        this.getItem(dmsId);
      },
      getGridMeta: function(workspaceId, dmsId) {
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('gridMeta:' + dmsId + ':get', itemObj.getGridMetaLink());
        });
        this.getItem(dmsId);
      },
      getAffectedItemsMeta: function(dmsId) {
        var that = this;
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          that.getAffectedItemsMetaByLink(dmsId, itemObj.getAffectedItemsMetaLink());
        });
        this.getItem(dmsId);
      },
      getAffectedItemsMetaByLink: function(dmsId, metaLink) {
        EventService.send('affectedItemsMeta:' + dmsId + ':get', metaLink);
      },
      getTransitions: function(itemId) {
        var that = this;
        var itemListenerId = EventService.listen('itemInstance:' + itemId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          that.getTransitionsByLink(itemId, itemObj.getTransitionsLink());
        });
        this.getItem(itemId);
      },
      getTransitionsByLink: function(eventIdentifier, transitionLink) {
        EventService.send('itemTransitions:' + eventIdentifier + ':get', transitionLink);
      },
      getRevisions: function(workspaceId, dmsId) {
        var that = this;
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          that.getRevisionsByLink(dmsId, itemObj.getRevisionsLink());
        });
        this.getItem(dmsId);
      },
      getRevisionsByLink: function(dmsId, revisionsLink) {
        EventService.send('itemRevisions:' + dmsId + ':get', revisionsLink);
      },
      getState: function(workspaceId, dmsId, stateId) {
        this.getTransitions(workspaceId, dmsId);
        var itemTransitionsListenerId = EventService.listen('itemTransitions:' + dmsId + ':done', function(event, transitionsObj) {
          EventService.unlisten(itemTransitionsListenerId);
          this.getStateByLink(dmsId + '~' + stateId, transitionsObj.getStateLink(workspaceId, dmsId, stateId));
        });
      },
      getStateByLink: function(eventIdentifier, stateLink) {
        EventService.send('itemState:' + eventIdentifier + ':get', stateLink);
      },
      getViews: function(event, workspaceId) {
        this.getWorkspace(workspaceId);
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(ev, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          EventService.send(event, workspaceObj.getViewsLink());
        });
      },
      getView: function(workspaceId, viewId) {
        this.getViews('views:' + workspaceId + ':get', workspaceId);
        var viewsListenerId = EventService.listen('views:' + workspaceId + ':done', function(event, viewsObj) {
          EventService.unlisten(viewsListenerId);
          EventService.send('viewInstance:' + viewId + ':done', viewsObj.getView(viewId));
        }, true);
      },
      getViewDefs: function(workspaceId) {
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(ev, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          EventService.send('viewDefinitions:' + workspaceId + ':get', workspaceObj.getViewDefsLink());
        });
        this.getWorkspace(workspaceId);
      },
      getViewDef: function(workspaceId, viewId) {
        var viewDefsListenerId = EventService.listen('viewDefinitions:' + workspaceId + ':done', function(event, viewDefsObj) {
          EventService.unlisten(viewDefsListenerId);
          EventService.send('viewDefinition:' + workspaceId + '@' + viewId + ':get', viewDefsObj.find(viewId).link);
        }, true);
        this.getViewDefs(workspaceId);
      },
      getBomRoot: function(itemId, params) {
        var params = params || {};
        var itemListenerId = EventService.listen('itemInstance:' + itemId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          var queryParams = {};
          queryParams.rootId = (angular.isUndefined(params.rootId)) ? null : params.rootId;
          queryParams.revisionBias = (angular.isUndefined(params.revisionBias)) ? null : params.revisionBias;
          queryParams.effectiveDate = (angular.isUndefined(params.effectiveDate)) ? null : params.effectiveDate;
          queryParams.viewDefId = (angular.isUndefined(params.viewDefId)) ? null : params.viewDefId;
          EventService.send('bomRoot:' + itemId + ':get', itemObj.getBomRootLink(), queryParams);
        });
        this.getItem(itemId);
      },
      getBomNested: function(itemId, params) {
        var params = params || {};
        var itemListenerId = EventService.listen('itemInstance:' + itemId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          var queryParams = {};
          queryParams.offset = (angular.isUndefined(params.offset)) ? 0 : params.offset;
          if (itemObj.json.nestedBom) {
            queryParams.limit = (angular.isUndefined(params.limit)) ? itemObj.json.nestedBom.count + 1 : params.limit;
          } else {
            queryParams.limit = (angular.isUndefined(params.limit)) ? 1 : params.limit;
          }
          queryParams.rootItem = itemObj.getId();
          queryParams.revisionBias = (angular.isUndefined(params.revisionBias)) ? null : params.revisionBias;
          queryParams.effectiveDate = (angular.isUndefined(params.effectiveDate)) ? null : params.effectiveDate;
          queryParams.viewDefId = (angular.isUndefined(params.viewDefId)) ? null : params.viewDefId;
          EventService.send('bomNested:' + itemId + ':get', itemObj.getBomNestedLink(), queryParams);
        });
        this.getItem(itemId, false, false);
      },
      getBomNestedItem: function(bomNestedObj, itemId, bomId, params) {
        var params = params || {};
        var foundItem = bomNestedObj.find(bomId);
        if (foundItem) {
          var queryParams = {};
          queryParams.rootItem = itemId;
          queryParams.revisionBias = (angular.isUndefined(params.revisionBias)) ? null : params.revisionBias;
          queryParams.effectiveDate = (angular.isUndefined(params.effectiveDate)) ? null : params.effectiveDate;
          queryParams.viewDefId = (angular.isUndefined(params.viewDefId)) ? null : params.viewDefId;
          EventService.send('bomNestedItem:' + bomId + ':get', foundItem.link.replace(/^\//, ''), queryParams);
        }
      },
      getExistingLinkedItems: function(dmsId, itemsType, options) {
        options = options || {};
        var params = {};
        if (options.relatedWorkspaceId) {
          params.relatedWorkspaceId = options.relatedWorkspaceId;
        }
        params.offset = (angular.isUndefined(options.offset)) ? 0 : options.offset;
        params.limit = (angular.isUndefined(options.limit)) ? 100 : options.limit;
        params.search = (angular.isUndefined(options.search)) ? '' : options.search;
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          if (itemsType === 'affectedItems') {
            EventService.send('linkableItems:' + dmsId + ':get', itemObj.getAffectedItemLinkableItemsLink(), params);
          } else if (itemsType === 'projectItems') {
            EventService.send('linkableItems:' + dmsId + ':get', itemObj.getProjectItemLinkableItemsLink(), params);
          } else if (itemsType === 'relationshipItems') {
            EventService.send('linkableItems:' + dmsId + ':get', itemObj.getRelationshipItemLinkableItemsLink(), params);
          } else if (itemsType === 'bomItems') {
            EventService.send('linkableItems:' + dmsId + ':get', itemObj.getBomItemLinkableItemsLink(), params);
          } else if (itemsType.match(/namedRelationshipItems/)) {
            EventService.send('linkableItems:' + dmsId + ':get', itemObj.getNamedRelationshipItemsLink(itemsType.match(/namedRelationshipItems~(.+)/)[1]), params);
          }
        });
        this.getItem(dmsId);
      },
      getAffectedItemLinkedToWorkspaces: function(workspaceId) {
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          EventService.send('linkedToWorkspaces:' + workspaceId + ':get', workspaceObj.getLinkedToWorkspacesLink());
        });
        this.getWorkspace(workspaceId);
      },
      getAffectedItemRelatedWorkspaces: function(workspaceId) {
        var that = this;
        this.getWorkspace(workspaceId);
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          that.getRelatedWorkspaces(workspaceId, workspaceObj.getAffectedItemRelatedWorkspacesLink());
        });
      },
      getRelationshipRelatedWorkspaces: function(workspaceId) {
        var that = this;
        this.getWorkspace(workspaceId);
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          that.getRelatedWorkspaces(workspaceId, workspaceObj.getRelationshipRelatedWorkspacesLink());
        });
      },
      getBomRelatedWorkspaces: function(workspaceId) {
        var that = this;
        this.getWorkspace(workspaceId);
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          that.getRelatedWorkspaces(workspaceId, workspaceObj.getBomRelatedWorkspacesLink());
        });
      },
      getNamedRelationshipRelatedWorkspaces: function(workspaceId, namedRelationshipId) {
        var $__9 = this;
        var workspaceListenerId = EventService.listen('workspaceInstance:' + workspaceId + ':done', function(event, workspaceObj) {
          EventService.unlisten(workspaceListenerId);
          $__9.getRelatedWorkspaces(workspaceId, workspaceObj.getNamedRelationshipRelatedWorkspacesLink(namedRelationshipId));
        });
        this.getWorkspace(workspaceId);
      },
      getRelatedWorkspaces: function(workspaceId, relatedWorkspacesLink) {
        EventService.send('relatedWorkspaces:' + workspaceId + ':get', relatedWorkspacesLink);
      },
      getProjectItems: function(dmsId, isMilestoneType) {
        var params = {};
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          if (isMilestoneType) {
            EventService.send('milestoneProjectItems:' + dmsId + ':get', itemObj.getMilestonesLink(), params);
          } else {
            EventService.send('projectItems:' + dmsId + ':get', itemObj.getProjectItemsLink(), params);
          }
        });
        this.getItem(dmsId);
      },
      getMilestones: function(dmsId) {
        var params = {};
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('milestones:' + dmsId + ':get', itemObj.getMilestonesLink(), params);
        });
        this.getItem(dmsId);
      },
      getDirectChildrenBOMItems: function(dmsId) {
        var params = {};
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('relatedBomItems:' + dmsId + ':get', itemObj.getRelatedBomItemsLink(), params);
        });
        this.getItem(dmsId);
      },
      getAllChildrenBOMItems: function(dmsId) {
        var params = {};
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('relatedBomItemsAllChildren:' + dmsId + ':get', itemObj.getRelatedBomItemsLink(), params);
        });
        this.getItem(dmsId);
      },
      getRelatedParentBOMItems: function(dmsId) {
        var params = {};
        var itemListenerId = EventService.listen('itemInstance:' + dmsId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('relatedBomItems:' + dmsId + ':get', itemObj.getWhereUsedLink(), params);
        });
        this.getItem(dmsId);
      },
      getSourcings: function(itemId) {
        var itemListenerId = EventService.listen('itemInstance:' + itemId + ':done', function(event, itemObj) {
          EventService.unlisten(itemListenerId);
          EventService.send('sourcings:' + itemId + ':get', itemObj.getSourcingsLink());
        });
        this.getItem(itemId);
      },
      getSourcingQuotes: function(itemId, link) {
        var itemListenerId = EventService.listen('itemInstance:' + itemId + ':done', function() {
          EventService.unlisten(itemListenerId);
          EventService.send('sourcingQuotes:' + itemId + ':get', link);
        });
        this.getItem(itemId);
      },
      getEnabledFeatures: function() {
        var app = this.getAppModel();
        EventService.send('enabledFeatures:tenant:get', app.getEnabledFeaturesLink());
      },
      getPicklistWorkspaceOptions: function(workspaceId, picklistId, requestParams) {
        var app = this.getAppModel();
        EventService.send('picklistWorkspaceOptions:' + picklistId + ':get', app.getPicklistWorkspaceOptionsLink(workspaceId, picklistId), requestParams);
      },
      getPicklistWorkspaceSelection: function(workspaceId, picklistId, requestParams) {
        var app = this.getAppModel();
        EventService.send('picklistWorkspaceSelected:' + picklistId + ':get', app.getPicklistWorkspaceSelectionLink(workspaceId, picklistId), requestParams);
      },
      getPicklistOptions: function(itemUrn, picklistId, requestParams) {
        var app = this.getAppModel();
        EventService.send('picklistoptions:' + picklistId + ':get', app.getPicklistOptionsLink(itemUrn, picklistId), requestParams);
      },
      getPicklistSelection: function(itemUrn, picklistId, requestParams) {
        var app = this.getAppModel();
        EventService.send('picklistselection:' + picklistId + ':get', app.getPicklistSelectionLink(itemUrn, picklistId), requestParams);
      },
      getConfigurations: function() {
        var app = this.getAppModel();
        var modelObject = findModel(models, app.getConfigurationsLink());
        if (modelObject) {
          EventService.send('configurations:tenant:done', modelObject);
        } else {
          var doneListenersId = EventService.listen('configurations:tenant:done', function(event, obj) {
            EventService.unlisten(doneListenersId);
            addModel(models, 'configurations', app.getConfigurationsLink(), obj);
          });
          EventService.send('configurations:tenant:get', app.getConfigurationsLink());
        }
      },
      getWorkspaceTableau: function(workspaceId, viewId, cached) {
        var modelObject = null;
        var app = this.getAppModel();
        var doneEvent = 'workspaceTableau:' + workspaceId + '@' + viewId + ':getTableauDone';
        var link = app.getWorkspaceTableau(workspaceId);
        cached = angular.isDefined(cached) && cached === false ? false : true;
        modelObject = findModel(models, workspaceId);
        if (modelObject && cached) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        EventService.send('workspaceTableau:' + workspaceId + '@' + viewId + ':getTableau', [link, viewId]);
      },
      getAllWorkspaceTableaus: function(workspaceId, cached) {
        var modelObject = null;
        var app = this.getAppModel();
        var doneEvent = 'workspaceTableau:' + workspaceId + ':getAllTableauDone';
        var link = app.getWorkspaceTableau(workspaceId);
        cached = angular.isDefined(cached) && cached === false ? false : true;
        modelObject = findModel(models, workspaceId);
        if (modelObject && cached) {
          EventService.send(doneEvent, modelObject);
          return;
        }
        EventService.send('workspaceTableau:' + workspaceId + ':getAllTableau', [link]);
      }
    };
  }
  var $__default = ModelsManager;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/ModelsManager.js
;

System.registerModule("com/autodesk/apiModelsManager.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/apiModelsManager.js";
  var RESTWrapperService = System.get("com/autodesk/RESTWrapperService.js").default;
  var EventService = System.get("com/autodesk/EventService.js").default;
  var ClassicRedirector = System.get("com/autodesk/ClassicRedirector.js").default;
  var UnderscoreService = System.get("com/autodesk/UnderscoreService.js").default;
  var ModelsManager = System.get("com/autodesk/ModelsManager.js").default;
  var App = System.get("com/autodesk/App.js").default;
  angular.module(__moduleName, ['com/autodesk/RESTWrapperService.js', 'com/autodesk/EventService.js', 'com/autodesk/ClassicRedirector.js', 'com/autodesk/UnderscoreService.js']).provider('ModelsManager', function() {
    this.$get = ['RESTWrapperService', 'EventService', 'App', 'ClassicRedirector', '$location', '$state', '$q', '$log', '$filter', '_', function(RESTWrapperService, EventService, App, ClassicRedirector, $location, $state, $q, $log, $filter, _) {
      return new ModelsManager(RESTWrapperService, EventService, App, ClassicRedirector, $location, $state, $q, $log, $filter, _);
    }];
  }).factory('App', [function() {
    return App;
  }]);
  return {};
});
//# sourceURL=com/autodesk/apiModelsManager.js
