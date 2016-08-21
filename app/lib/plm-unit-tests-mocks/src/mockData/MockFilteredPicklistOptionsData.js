'use strict';

/**
 * MockFilteredPicklistFieldOptionsData
 *
 * This data is used in FilteredPicklistFieldDirectiveSpec
 */

angular.module('plm360.mockData').value('MockFilteredPicklistFieldOptionsData', [{
    "__self__" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL1/options",
    "offset" : 0,
    "limit" : 10,
    "totalCount" : 3,
    "first" : {
    "link" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL1/options",
        "title" : "First",
        "count" : 3,
        "permissions" : [ ]
    },
    "last" : {
    "link" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL1/options",
        "title" : "Last",
        "count" : 3,
        "permissions" : [ ]
    },
        "items" : [ "1 - Low", "2 - Medium", "3 - High" ]
    }, {
        "__self__" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL2/options",
        "offset" : 0,
        "limit" : 10,
        "totalCount" : 2,
        "first" : {
            "link" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL2/options",
            "title" : "First",
            "count" : 2,
            "permissions" : [ ]
        },
        "last" : {
            "link" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL2/options",
            "title" : "Last",
            "count" : 2,
            "permissions" : [ ]
        },
        "items" : [ "1 - Engineering", "2 - Manufacturing" ]
    }, {
        "__self__" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL3/options",
        "offset" : 0,
        "limit" : 10,
        "totalCount" : 8,
        "first" : {
            "link" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL3/options",
            "title" : "First",
            "count" : 8,
            "permissions" : [ ]
        },
        "last" : {
            "link" : "/api/v3/workspaces/47/items/2948/views/1/fields/FPL3/options",
            "title" : "Last",
            "count" : 8,
            "permissions" : [ ]
        },
        "items" : [ "Cosmetic Quality", "Customer Complaint", "DFM  / DFA Issue", "Functional Fix", "Functional Quality Issue", "Mfg Yield Improvement", "Performance Enhancement", "Safety Issue" ]
    }]);