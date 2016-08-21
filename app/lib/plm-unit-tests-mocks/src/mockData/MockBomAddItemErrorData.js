(function (module) {
	'use strict';

	/**
	 * Mock errors that can be returned by the add to Bom endpoint
	 * Mock Data Sets Available
	 * maxLengthError - A list with one error, specifying that a field was too long
	 
	 *
	 */
	module.value('MockBomAddItemErrorData', {
		maxLengthError: [
			{
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
		]
	});
}(angular.module('plm360.mockData')));