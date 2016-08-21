(function(module) {
    'use strict';

    module.value('MockViewDefinitionFieldData', {
        systemField: {
            "__self__" : {
                "link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/1",
                "urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.1",
                "permissions" : [ ]
            },
            "type" : {
                "link" : "/api/v3/field-types/4",
                "title" : "Alpha Numeric",
                "urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
                "permissions" : [ ]
            },
            "htmlDisplayId" : 1,
            "name" : "Descriptor",
            "isDefault" : true,
            "viewDefFieldId" : 1,
            "isTransient" : false,
            "description" : null,
            "defaultValue" : null,
            "unitOfMeasure" : null,
            "fieldLength" : null,
            "fieldPrecision" : null,
            "displayOrder" : 1,
            "displayLength" : 10,
            "editability" : null,
            "visibility" : null,
            "derived" : null,
            "fieldTab" : "SYSTEM",
            "label" : null,
            "visibleOnPreview" : null,
            "fieldId" : "DESCRIPTOR"
        },
        itemDetailsField: {
            "__self__" : {
                "link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/7",
                "urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.7",
                "permissions" : [ ]
            },
            "type" : {
                "link" : "/api/v3/field-types/28",
                "title" : "BOM UOM Pick List",
                "urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.28",
                "permissions" : [ ]
            },
            "htmlDisplayId" : null,
            "name" : "Unit of Measure",
            "isDefault" : null,
            "viewDefFieldId" : 7,
            "isTransient" : null,
            "description" : "",
            "defaultValue" : null,
            "unitOfMeasure" : null,
            "fieldLength" : null,
            "fieldPrecision" : null,
            "displayOrder" : 4,
            "displayLength" : null,
            "editability" : "ALWAYS",
            "visibility" : "ALWAYS",
            "derived" : false,
            "fieldTab" : "ITEM_DETAIL",
            "label" : null,
            "visibleOnPreview" : false,
            "fieldId" : "UNIT_OF_MEASURE"
        },
        customBomField: {
            "__self__" : {
                "link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/8",
                "urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.8",
                "permissions" : [ ]
            },
            "type" : {
                "link" : "/api/v3/field-types/4",
                "title" : "Editable on Create Field",
                "urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
                "permissions" : [ ]
            },
            "htmlDisplayId" : null,
            "name" : "Editable on Create Field",
            "isDefault" : null,
            "viewDefFieldId" : 7,
            "isTransient" : null,
            "description" : "",
            "defaultValue" : null,
            "unitOfMeasure" : null,
            "fieldLength" : null,
            "fieldPrecision" : null,
            "displayOrder" : 4,
            "displayLength" : null,
            "editability" : "CREATE_ONLY",
            "visibility" : "ALWAYS",
            "derived" : false,
            "fieldTab" : "CUSTOM_BOM",
            "label" : null,
            "visibleOnPreview" : false,
            "fieldId" : "EDITABLE_ON_CREATE_FIELD"
        },
        editableField: {
            "__self__" : {
                "link" : "/api/v3/workspaces/8/views/5/viewdef/1/fields/9",
                "urn" : "urn:adsk.plm:tenant.workspace.view.viewdef.field:DEVINDMACHINE1003.8.5.1.8",
                "permissions" : [ ]
            },
            "type" : {
                "link" : "/api/v3/field-types/4",
                "title" : "Editable Field",
                "urn" : "urn:adsk.plm:tenant.field-type:DEVINDMACHINE1003.4",
                "permissions" : [ ]
            },
            "htmlDisplayId" : null,
            "name" : "Editable Field",
            "isDefault" : null,
            "viewDefFieldId" : 7,
            "isTransient" : null,
            "description" : "",
            "defaultValue" : null,
            "unitOfMeasure" : null,
            "fieldLength" : null,
            "fieldPrecision" : null,
            "displayOrder" : 4,
            "displayLength" : null,
            "editability" : "ALWAYS",
            "visibility" : "ALWAYS",
            "derived" : false,
            "fieldTab" : "CUSTOM_BOM",
            "label" : null,
            "visibleOnPreview" : false,
            "fieldId" : "EDITABLE_FIELD"
        }
    });
}(angular.module('plm360.mockData')));
