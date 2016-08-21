System.registerModule("com/autodesk/ClassicRedirector.js", [], function() {
  "use strict";
  var __moduleName = "com/autodesk/ClassicRedirector.js";
  var TABMAPPING = {
    'workspace-item-details': 'itemdetails',
    'workspace-item-affected-items': 'linkeditems',
    'workspace-item-grid': 'griddetails',
    'project-management': 'projectmanagement',
    attachments: 'partattachment',
    'workflow-map': 'workflowactions',
    'workspace-item-bom': 'bomviewnested',
    'workspace-item-where-used': 'bomviewwhereused',
    'workspace-item-sourcing': 'sourcing',
    'workspace-item-supplied-items': 'sourcingsupplieditems',
    'workspace-item-relationships': 'relatinoship',
    workflow: 'linkeditemsreferences',
    'workspace-item-milestones': 'milestonesdetails',
    'change-log': 'parthistory'
  };
  var ClassicRedirector = function() {
    function ClassicRedirector() {}
    return ($traceurRuntime.createClass)(ClassicRedirector, {getUrl: function(state, location) {
        var destinationUrl = '/';
        var stateName = state.current.name;
        var parentName = state.current.parent;
        var queryParams = location.search();
        switch (stateName) {
          case 'dashboard':
            break;
          case 'workspace-items-list':
            var workspaceId = state.params.workspaceId;
            destinationUrl = '/workspace#workspaceid=' + workspaceId;
            if (queryParams.itemId) {
              var idParam = queryParams.itemId;
              var workspaceId$__2 = '';
              var itemId = '';
              if (idParam.indexOf('@') > -1) {
                var parts = idParam.split('@');
                workspaceId$__2 = parts[0];
                itemId = parts[1];
              } else {
                var parts$__3 = idParam.split(',');
                workspaceId$__2 = parts$__3[parts$__3.length - 2];
                itemId = parts$__3[parts$__3.length - 1];
              }
              var stateNameAsKey = queryParams.tab;
              destinationUrl = '/workspace#workspaceid=' + workspaceId$__2 + '&dmsid=' + itemId + '&tab=' + TABMAPPING[stateNameAsKey];
            }
            break;
          default:
        }
        return destinationUrl;
      }}, {});
  }();
  var $__default = angular.module(__moduleName, []).factory('ClassicRedirector', [function() {
    return new ClassicRedirector();
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=com/autodesk/ClassicRedirector.js
