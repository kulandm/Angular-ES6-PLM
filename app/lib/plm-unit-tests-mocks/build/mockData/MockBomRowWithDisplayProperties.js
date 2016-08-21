'use strict';

angular.module('plm360.mockData').value('MockBomRowWithDisplayProperties', {
  edits: [{
    "changeType": "fieldEdit",
    "serverError": null,
    "changeId": 0,
    "edgeId": "279",
    "targetFieldData": {
      "value": {
        "depth": 1,
        "itemNumber": "21"
      },
      "originalValue": {
        "depth": 1,
        "itemNumber": "2"
      },
      "typeId": 0,
      "fieldMetadata": {},
      "metadata": {},
      "$invalid": false,
      "getFieldId": () => {
        return "$$BOM_ITEM_NUMBER";
      },
      "getFieldSemantics": () => {
        return "$$BOM_ITEM_NUMBER";
      }
    },
    "currentValue": {
      "depth": 1,
      "itemNumber": "21"
    }
  }, {
    "changeType": "fieldEdit",
    "serverError": null,
    "changeId": 1,
    "edgeId": "279",
    "targetFieldData": {
      "value": "test@email.com",
      "originalValue": "",
      "typeId": 18,
      "fieldMetadata": {},
      "metadata": {},
      "$invalid": false,
      "getFieldId": () => {
        return "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.248";
      },
      "getFieldSemantics": () => {
        return "$$BASIC";
      }
    },
    "currentValue": "test@email.com"
  }, {
    "changeType": "fieldEdit",
    "serverError": null,
    "changeId": 2,
    "edgeId": "279",
    "targetFieldData": {
      "value": "inValidField",
      "originalValue": "",
      "typeId": 4,
      "fieldMetadata": {},
      "metadata": {},
      "$invalid": false,
      "getFieldId": () => {
        return "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.228";
      },
      "getFieldSemantics": () => {
        return "$$BASIC";
      }
    },
    "currentValue": "inValidField"
  }, {
    "changeType": "fieldEdit",
    "serverError": null,
    "changeId": 3,
    "edgeId": "279",
    "targetFieldData": {
      "value": "testField",
      "originalValue": "",
      "typeId": 4,
      "fieldMetadata": {},
      "metadata": {},
      "$invalid": false,
      "getFieldId": () => {
        return "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.227";
      },
      "getFieldSemantics": () => {
        return "$$BASIC";
      }
    },
    "currentValue": "testField"
  }, {
    "changeType": "fieldEdit",
    "serverError": null,
    "changeId": 4,
    "edgeId": "279",
    "targetFieldData": {
      "value": "true",
      "originalValue": "false",
      "typeId": 5,
      "fieldMetadata": {},
      "metadata": {},
      "getFieldId": () => {
        return "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.3";
      },
      "getFieldSemantics": () => {
        return "$$PINNING";
      }
    },
    "currentValue": "true",
    "revisionField": {
      "getFieldId": () => {
        return "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.2";
      },
      "value": {
        "title": "A",
        "version": {
          "__self__": "/api/v3/workspaces/8/items/2838/versions/2763",
          "urn": "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.8.2838.2763",
          "item": {
            "link": "/api/v3/workspaces/8/items/2763",
            "title": "402-0002-000 - TABLE Project 622",
            "version": "[REV:sA]",
            "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2763",
            "permissions": []
          },
          "version": "A",
          "status": "SUPERSEDED",
          "lifecycle": {
            "link": "/api/v3/workspaces/8/items/2763/workflows/workspace-types/states",
            "title": "Production",
            "permissions": []
          },
          "effectivity": {
            "startDate": "2013-01-02T00:00:00.000-05:00",
            "endDate": "2013-04-23T00:00:00.000-04:00"
          },
          "supersededBy": {
            "link": "/api/v3/workspaces/8/items/2838/versions/2838",
            "title": "402-0002-000 - TABLE Project 622",
            "urn": "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.8.2838.2838",
            "permissions": []
          },
          "versionNumber": 1
        }
      },
      "originalValue": {
        "title": "B"
      },
      "typeId": 700,
      "fieldMetadata": {},
      "metadata": {},
      "options": [],
      "uid": 1459396253614
    },
    "currentRevision": {
      "title": "A",
      "version": {
        "__self__": "/api/v3/workspaces/8/items/2838/versions/2763",
        "urn": "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.8.2838.2763",
        "item": {
          "link": "/api/v3/workspaces/8/items/2763",
          "title": "402-0002-000 - TABLE Project 622",
          "version": "[REV:sA]",
          "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2763",
          "permissions": []
        },
        "version": "A",
        "status": "SUPERSEDED",
        "lifecycle": {
          "link": "/api/v3/workspaces/8/items/2763/workflows/workspace-types/states",
          "title": "Production",
          "permissions": []
        },
        "effectivity": {
          "startDate": "2013-01-02T00:00:00.000-05:00",
          "endDate": "2013-04-23T00:00:00.000-04:00"
        },
        "supersededBy": {
          "link": "/api/v3/workspaces/8/items/2838/versions/2838",
          "title": "402-0002-000 - TABLE Project 622",
          "urn": "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.8.2838.2838",
          "permissions": []
        },
        "versionNumber": 1
      }
    }
  }],
  row: {
    "isExpandable": false,
    "isCollapsed": true,
    "hasFetchedChildren": false,
    "path": {
      "edges": [
        "279"
      ]
    },
    "depth": 1,
    "item": {
      "link": "/api/v3/workspaces/8/items/2838",
      "title": "402-0002-000 - TABLE Project 622",
      "version": "B",
      "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2838",
      "permissions": []
    },
    "itemNumber": 2,
    "displayProperties": {
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.1": {
        "value": {
          "descriptor": "402-0002-000 - TABLE Project 622 [REV:B]",
          "href": "/app/workspaces/8/items/itemDetails?view=full&tab=details&mode=view&itemId=urn%60adsk%2Cplm%60tenant%2Cworkspace%2Citem%60DEVINDMACHINE1003%2C8%2C2838"
        },
        "originalValue": {
          "descriptor": "402-0002-000 - TABLE Project 622 [REV:B]",
          "href": "/app/workspaces/8/items/itemDetails?view=full&tab=details&mode=view&itemId=urn%60adsk%2Cplm%60tenant%2Cworkspace%2Citem%60DEVINDMACHINE1003%2C8%2C2838"
        },
        "typeId": 4,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.2": {
        "value": {
          "title": "A",
          "version": {
            "__self__": "/api/v3/workspaces/8/items/2838/versions/2763",
            "urn": "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.8.2838.2763",
            "item": {
              "link": "/api/v3/workspaces/8/items/2763",
              "title": "402-0002-000 - TABLE Project 622",
              "version": "[REV:sA]",
              "urn": "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1003.8.2763",
              "permissions": []
            },
            "version": "A",
            "status": "SUPERSEDED",
            "lifecycle": {
              "link": "/api/v3/workspaces/8/items/2763/workflows/workspace-types/states",
              "title": "Production",
              "permissions": []
            },
            "effectivity": {
              "startDate": "2013-01-02T00:00:00.000-05:00",
              "endDate": "2013-04-23T00:00:00.000-04:00"
            },
            "supersededBy": {
              "link": "/api/v3/workspaces/8/items/2838/versions/2838",
              "title": "402-0002-000 - TABLE Project 622",
              "urn": "urn:adsk.plm:tenant.workspace.item.version:DEVINDMACHINE1003.8.2838.2838",
              "permissions": []
            },
            "versionNumber": 1
          }
        },
        "originalValue": {
          "title": "B"
        },
        "typeId": 700,
        "fieldMetadata": {},
        "metadata": {},
        "options": [],
        "uid": 1459396253614
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.4": {
        "value": 1,
        "originalValue": 1,
        "typeId": 5,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.8": {
        "value": "",
        "originalValue": "",
        "typeId": 5,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.5": {
        "value": "Production",
        "originalValue": "Production",
        "typeId": 4,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.7": {
        "value": "1",
        "originalValue": "1",
        "typeId": 28,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.27": {
        "value": "",
        "originalValue": "",
        "typeId": 2,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.9": {
        "value": "",
        "originalValue": "",
        "typeId": 4,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.10": {
        "value": "0.00",
        "originalValue": "0.00",
        "typeId": 2,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.11": {
        "value": 0,
        "originalValue": 0,
        "typeId": 2,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.258": {
        "value": "",
        "originalValue": "",
        "typeId": 20,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.248": {
        "value": "test@email.com",
        "originalValue": "",
        "typeId": 18,
        "fieldMetadata": {},
        "metadata": {},
        "$invalid": false
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.228": {
        "value": "inValidField",
        "originalValue": "",
        "typeId": 4,
        "fieldMetadata": {},
        "metadata": {},
        "$invalid": false
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.227": {
        "value": "testField",
        "originalValue": "",
        "typeId": 4,
        "fieldMetadata": {},
        "metadata": {},
        "$invalid": false
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.3": {
        "value": "true",
        "originalValue": "false",
        "typeId": 5,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.6": {
        "value": "1.0",
        "originalValue": "1.0",
        "typeId": 2,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.13": {
        "value": "",
        "originalValue": "",
        "typeId": 2,
        "fieldMetadata": {},
        "metadata": {}
      },
      "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.14": {
        "value": "",
        "originalValue": "",
        "typeId": 19,
        "fieldMetadata": {},
        "metadata": {}
      },
      "$$BOM_ITEM_NUMBER": {
        "value": {
          "depth": 1,
          "itemNumber": "21"
        },
        "originalValue": {
          "depth": 1,
          "itemNumber": "2"
        },
        "typeId": 0,
        "fieldMetadata": {},
        "metadata": {}
      }
    },
    "edgeId": "279",
    "nodeId": "8@2838",
    "rowId": "1.2",
    "clickHandler": null,
    "isChecked": false,
    "isCheckable": true,
    "isNewlyAdded": false,
    "addOrder": null
  }
});
