'use strict';

angular.module('plm360.mockData').value('MockViewSourcingsData', [{
    "__self__" : "/api/v3/workspaces/9/items/3908/sourcings",
    "sourcings" : [ {
      "__self__" : "/api/v3/workspaces/9/items/3908/sourcings/44",
      "urn" : "urn:adsk.plm:tenant.workspace.item.sourcing:SELENIUM.9.3908.44",
      "supplier" : {
        "link" : "/api/v3/workspaces/16/items/3900",
        "title" : "PERM-SUPPLIER-1"
      },
      "supplierPartNumber" : "1000",
      "manufacturer" : "Mfr_1",
      "manufacturerPartNumber" : "10001000",
      "sourcingComment" : "Added by JLVR",
      "metaFieldsMap" : {
        "META_FIELD_2" : null,
        "META_FIELD_1" : null
      },
      "quotes" : {
        "__self__" : "/api/v3/workspaces/9/items/3908/sourcings/44/quotes",
      }
    }, {
      "__self__" : "/api/v3/workspaces/9/items/3908/sourcings/45",
      "urn" : "urn:adsk.plm:tenant.workspace.item.sourcing:SELENIUM.9.3908.45",
      "supplier" : {
        "link" : "/api/v3/workspaces/16/items/3901",
        "title" : "PERM-SUPPLIER-2"
      },
      "supplierPartNumber" : "2000",
      "manufacturer" : "Mfr_2",
      "manufacturerPartNumber" : "10011001",
      "sourcingComment" : "Added by JLVR",
      "metaFieldsMap" : {
        "META_FIELD_2" : null,
        "META_FIELD_1" : null
      },
      "quotes" : {
        "__self__" : "/api/v3/workspaces/9/items/3908/sourcings/45/quotes"
      }
    } ]
}]);
