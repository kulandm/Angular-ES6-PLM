'use strict';

/**
 * MockMatrixFieldsMetadata
 * This represents a collection of fields within a matrix structure, used in viewDetails.controller
 */
angular.module('plm360.mockData').value('MockMatrixFieldsMetadata', [
    [
        {
            "link":"/api/v3/workspaces/47/views/1/fields/MATRIX_DATE_FIELD",
            "title":"Matrix Date Field",
            "type":"FIELD",
            "urn":"urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.1.MATRIX_DATE_FIELD",
            "permissions":[

            ],
            "fieldMetadata":{
                "__self__":"/api/v3/workspaces/47/views/1/fields/MATRIX_DATE_FIELD",
                "name":"Matrix Date Field",
                "description":"",
                "type":{
                    "link":"/api/v3/field-types/3",
                    "title":"Date",
                    "urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.3",
                    "permissions":[

                    ]
                },
                "defaultValue":null,
                "unitOfMeasure":null,
                "fieldLength":null,
                "fieldPrecision":null,
                "displayOrder":8,
                "displayLength":null,
                "editability":"ALWAYS",
                "visibility":"ALWAYS",
                "derived":false,
                "picklist":null,
                "validators":"/api/v3/workspaces/47/views/1/fields/MATRIX_DATE_FIELD/validators",
                "label":null,
                "picklistFieldDefinition":null,
                "visibleOnPreview":false,
                "readOnly":false
            },
            "value":"2015-12-18T03:00:00.000Z",
            "metadata":{
                "dataTypeId":3
            },
            "$invalid":false
        },
        {
            "link":"/api/v3/workspaces/47/views/1/fields/MATRIX_DESCRIPTION",
            "title":"Matrix Description",
            "type":"FIELD",
            "urn":"urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.1.MATRIX_DESCRIPTION",
            "permissions":[

            ],
            "fieldMetadata":{
                "__self__":"/api/v3/workspaces/47/views/1/fields/MATRIX_DESCRIPTION",
                "name":"Matrix Description",
                "description":"",
                "type":{
                    "link":"/api/v3/field-types/4",
                    "title":"Single Line Text",
                    "urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4",
                    "permissions":[

                    ]
                },
                "defaultValue":"",
                "unitOfMeasure":null,
                "fieldLength":150,
                "fieldPrecision":null,
                "displayOrder":9,
                "displayLength":50,
                "editability":"ALWAYS",
                "visibility":"ALWAYS",
                "derived":false,
                "picklist":null,
                "validators":null,
                "label":null,
                "picklistFieldDefinition":null,
                "visibleOnPreview":false,
                "readOnly":false
            },
            "value":null,
            "metadata":{
                "dataTypeId":4
            },
            "$invalid":false
        },
        null
    ],
    [
        null,
        {
            "link":"/api/v3/workspaces/47/views/1/fields/MATRIXNUMBER",
            "title":"Matrix Number",
            "type":"FIELD",
            "urn":"urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.1.MATRIXNUMBER",
            "permissions":[

            ],
            "fieldMetadata":{
                "__self__":"/api/v3/workspaces/47/views/1/fields/MATRIXNUMBER",
                "name":"Matrix Number",
                "description":"The item number will automatically be assigned based on the item category chosen.",
                "type":{
                    "link":"/api/v3/field-types/4",
                    "title":"Single Line Text",
                    "urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.4",
                    "permissions":[

                    ]
                },
                "defaultValue":"",
                "unitOfMeasure":"KG",
                "fieldLength":25,
                "fieldPrecision":null,
                "displayOrder":10,
                "displayLength":25,
                "editability":"ALWAYS",
                "visibility":"ALWAYS",
                "derived":false,
                "picklist":null,
                "validators":"/api/v3/workspaces/47/views/1/fields/MATRIXNUMBER/validators",
                "label":null,
                "picklistFieldDefinition":null,
                "visibleOnPreview":false,
                "readOnly":false
            },
            "value":"sdf",
            "metadata":{
                "dataTypeId":4
            },
            "$invalid":false
        },
        {
            "link":"/api/v3/workspaces/47/views/1/fields/MATRIX_INTEGER",
            "title":"Matrix Integer",
            "type":"FIELD",
            "urn":"urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINE1002.47.1.MATRIX_INTEGER",
            "permissions":[

            ],
            "fieldMetadata":{
                "__self__":"/api/v3/workspaces/47/views/1/fields/MATRIX_INTEGER",
                "name":"Matrix Integer",
                "description":"",
                "type":{
                    "link":"/api/v3/field-types/30",
                    "title":"Integer",
                    "urn":"urn:adsk.plm:tenant.field-type:DEVINDMACHINE1002.30",
                    "permissions":[

                    ]
                },
                "defaultValue":"",
                "unitOfMeasure":"KG",
                "fieldLength":5,
                "fieldPrecision":null,
                "displayOrder":11,
                "displayLength":5,
                "editability":"ALWAYS",
                "visibility":"ALWAYS",
                "derived":false,
                "picklist":null,
                "validators":"/api/v3/workspaces/47/views/1/fields/MATRIX_INTEGER/validators",
                "label":null,
                "picklistFieldDefinition":null,
                "visibleOnPreview":false,
                "readOnly":false
            },
            "value": "77",
            "metadata":{
                "dataTypeId":30
            },
            "$invalid":false
        }
    ]
]);
