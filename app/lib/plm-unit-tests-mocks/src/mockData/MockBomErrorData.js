/*
	Mock payload of for failures from edits
*/
'use strict';

angular.module('plm360.mockData').value('MockBomErrorData', {
	editErrors: [
		{
			'code': 'error.oneortheothernotboth',
			'arguments': [
                'Text box alpha-numeric',
                'Text box float'
            ],
			'field': {
				'__self__': '/api/v3/workspaces/9/views/5/fields/TEXT_BOX_ALPHA',
				'urn': 'urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_ALPHA',
				'title': 'Text box alpha-numeric',
				'type': {
					'link': '/api/v3/field-types/4',
					'title': 'Single Line Text',
					'urn': 'urn:adsk.plm:tenant.field-type:SELENIUM.4',
					'permissions': []
				},
				'value': 'some other text'
			}
        },
		{
			'code': 'errors.float',
			'arguments': [
                'Text box alpha-numeric'
            ],
			'field': {
				'__self__': '/api/v3/workspaces/9/views/5/fields/TEXT_BOX_ALPHA',
				'urn': 'urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_ALPHA',
				'title': 'Text box alpha-numeric',
				'type': {
					'link': '/api/v3/field-types/4',
					'title': 'Single Line Text',
					'urn': 'urn:adsk.plm:tenant.field-type:SELENIUM.4',
					'permissions': []
				},
				'value': 'some other text'
			}
        },
		{
			'code': 'errors.float',
			'arguments': [
                'Text box alpha-numeric'
            ],
			'field': {
				'__self__': '/api/v3/workspaces/9/views/5/fields/TEXT_BOX_BETA',
				'urn': 'urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_BETA',
				'title': 'Text box alpha-numeric',
				'type': {
					'link': '/api/v3/field-types/4',
					'title': 'Single Line Text',
					'urn': 'urn:adsk.plm:tenant.field-type:SELENIUM.4',
					'permissions': []
				},
				'value': 'some other other text'
			}
        }
    ],
	addErrors: [
		{
			"message": "{0} cannot be greater than {1} characters.",
			"code": "errors.maxlength",
			"arguments": [
            "Text box float",
            "5"
        ],
			"field": {
				"__self__": "/api/v3/workspaces/9/views/5/fields/TEXT_BOX_FLOAT",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_FLOAT",
				"title": "Text box float",
				"type": {
					"link": "/api/v3/field-types/2",
					"title": "Float",
					"urn": "urn:adsk.plm:tenant.field-type:SELENIUM.2",
					"permissions": []
				},
				"value": "3.14159F02"
			}
    },
		{
			"message": "{0} cannot be greater than {1} characters.",
			"code": "errors.maxlength",
			"arguments": [
            "Text box alpha-numeric",
            "50"
        ],
			"field": {
				"__self__": "/api/v3/workspaces/9/views/5/fields/TEXT_BOX_ALPHA",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_ALPHA",
				"title": "Text box alpha-numeric",
				"type": {
					"link": "/api/v3/field-types/4",
					"title": "Single Line Text",
					"urn": "urn:adsk.plm:tenant.field-type:SELENIUM.4",
					"permissions": []
				},
				"value": "some text way too loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong"
			}
    }
],
	editErrorMultiple: [
		{
			"message": "{0} is not in the range {1} through {2}.",
			"code": "errors.range",
			"arguments": [
            "Text box integer",
            "0",
            "10"
        ],
			"field": {
				"__self__": "/api/v3/workspaces/9/views/5/fields/TEXT_BOX_INT",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_INT",
				"title": "Text box integer",
				"type": {
					"link": "/api/v3/field-types/30",
					"title": "Integer",
					"urn": "urn:adsk.plm:tenant.field-type:SELENIUM.30",
					"permissions": []
				},
				"value": "110"
			}
    },
		{
			"message": "{0} cannot be greater than {1} characters.",
			"code": "errors.maxlength",
			"arguments": [
            "Text box alpha-numeric",
            "1"
        ],
			"field": {
				"__self__": "/api/v3/workspaces/9/views/5/fields/TEXT_BOX_ALPHA",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_ALPHA",
				"title": "Text box alpha-numeric",
				"type": {
					"link": "/api/v3/field-types/4",
					"title": "Single Line Text",
					"urn": "urn:adsk.plm:tenant.field-type:SELENIUM.4",
					"permissions": []
				},
				"value": "some other text"
			}
    },
		{
			"message": "{0} format is invalid.",
			"code": "error.invalid",
			"arguments": [
            "Text box alpha-numeric",
            "aa"
        ],
			"field": {
				"__self__": "/api/v3/workspaces/9/views/5/fields/TEXT_BOX_ALPHA",
				"urn": "urn:adsk.plm:tenant.workspace.view.field:SELENIUM.9.5.TEXT_BOX_ALPHA",
				"title": "Text box alpha-numeric",
				"type": {
					"link": "/api/v3/field-types/4",
					"title": "Single Line Text",
					"urn": "urn:adsk.plm:tenant.field-type:SELENIUM.4",
					"permissions": []
				},
				"value": "some other text"
			}
    }
]
});