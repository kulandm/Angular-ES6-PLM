'use strict';

/**
 * MockFilteredPicklistFieldWorkspaceOptionsData
 *
 * This data is used in FilteredPicklistFieldDirectiveSpec
 */

angular.module('plm360.mockData').value('MockFilteredPicklistFieldWorkspaceOptionsData', [{
    "__self__" : "/api/v3/workspaces/47/views/1/fields/FPL1/options",
    "offset" : 0,
    "limit" : 10,
    "totalCount" : 3,
    "first" : {
    "link" : "/api/v3/workspaces/47/views/1/fields/FPL1/options",
        "title" : "First",
        "count" : 3,
        "permissions" : [ ]
    },
    "last" : {
    "link" : "/api/v3/workspaces/47/views/1/fields/FPL1/options",
        "title" : "Last",
        "count" : 3,
        "permissions" : [ ]
    },
    "items": ["Cosmetic Quality", "Customer Complaint", "DFM  / DFA Issue", "Functional Fix", "Functional Quality Issue", "Mfg Yield Improvement", "Performance Enhancement", "Safety Issue"]
}]);