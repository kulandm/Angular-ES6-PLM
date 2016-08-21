'use strict';

angular.module('plm360.mockData').value('MockRadioFieldData', [{
	data: {
		fieldMetadata: {
			unitOfMeasure: 'uom'
		},
		link: "/api/v3/workspaces/47/views/1/fields/TEST",
		metadata: {
			dataTypeId: 10
		},
		options: {
			__self__: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
			first: {
				count: 2,
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
				permissions: [],
				title: "First",
				urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO",
			},
			items: [{
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
				title: "Yes"
			}, {
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/2",
				title: "No"
			}],
			last: {
				count: 2,
				link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO?offset=0&limit=10",
				permissions: [],
				title: "Last",
				urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO"
			},
			limit: 10,
			offset: 0,
			totalCount: 2,
			urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO"
		},
		permissions: [],
		title: "test",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.47.1.TEST",
		value: {
			link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/1",
			permissions: [],
			title: "Yes",
			urn: "urn:adsk.plm:tenant.lookup.option:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO.1"
		}
	},
	meta: {
		defaultValue: {
			link: "/api/v3/lookups/CUSTOM_LOOKUP_YES_NO/options/2",
			permissions: [],
			title: "No",
			urn: "urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_YES_NO.2"
		},
		derived: false,
		description: "",
		displayLength: null,
		displayOrder: 1,
		editability: "ALWAYS",
		fieldLength: null,
		fieldPrecision: null,
		label: null,
		name: "test",
		picklist: "/api/v3/picklists/CUSTOM_LOOKUP_YES_NO",
		picklistFieldDefinition: null,
		type: {
			link: "/api/v3/field-types/10",
			permissions: [],
			title: "Radio Button",
			urn: "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.10"
		},
		unitOfMeasure: null,
		validators: null,
		visibility: "ALWAYS",
		visibleOnPreview: false
	}
},{
	data: {
		link: "/api/v3/workspaces/51/views/1/fields/RADIOPL2",
		metadata: {
			dataTypeId: 10
		},
		options: {
		  __self__: '/api/v3/lookups/CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE?offset=0&limit=10',
		  urn: 'urn:adsk.plm:tenant.lookup:GDFPCWS.CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE',
		  offset: 0,
		  limit: 10,
		  totalCount: 10,
		  first: {
		    'link': '/api/v3/lookups/CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE?offset=0&limit=10',
		    'title': 'First',
		    'count': 10,
		    'urn': 'urn:adsk.plm:tenant.lookup:GDFPCWS.CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE',
		    'permissions': [ ]
		  },
		  next: {
			    link: '/api/v3/lookups/CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE?offset=10&limit=10',
			    title: 'Next',
			    count: 10,
			    urn: 'urn:adsk.plm:tenant.lookup:GDFPCWS.CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE',
			    permissions: [ ]
		  },
		  last: {
		    link: '/api/v3/lookups/CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE?offset=110&limit=10',
		    title: 'Last',
		    count: 9,
		    urn: 'urn:adsk.plm:tenant.lookup:DEVINDMACHINE.CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE',
		    permissions: [ ]
		  },
		  items: [{
		    link: '/api/v3/workspaces/51/items/5315',
		    title: '001 - SEMICONDUCTORS AND ACTIVES - GPU',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5315',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5314',
		    title: '011 - SEMICONDUCTORS AND ACTIVES - AMPLIFIERS, BUFFER',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5314',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5313',
		    title: '012 - SEMICONDUCTORS AND ACTIVES - CLOCK, TIMING',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5313',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5312',
		    title: '013 - SEMICONDUCTORS AND ACTIVES - DIGITAL POTENTIOMETER',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5312',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5316',
		    title: '015 - CABLES AND WIRE - AUDIO',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5316',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5311',
		    title: '016 - CABLES AND WIRE - CABLE ASSEMBLY',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5311',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5310',
		    title: '017 - CABLES AND WIRE - COAXIAL',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5310',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5309',
		    title: '018 - CABLES AND WIRE - FIBER OPTIC',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5309',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5308',
		    title: '019 - CABLES AND WIRE - FLAT FLEX',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5308',
		    permissions: [ ]
		  }, {
		    link: '/api/v3/workspaces/51/items/5307',
		    title: '020 - CABLES AND WIRE - MULTI-CONDUCTOR',
		    urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5307',
		    permissions: [ ]
		  }]
		},
		permissions: [],
		title: "Radio Picklist 2",
		type: 'FIELD',
		urn: "urn:adsk.plm:tenant.workspace.view.field:DEVINDMACHINETEST.51.1.RADIOPL2",
		value: {
			link: "/api/v3/workspaces/51/items/5315",
			title: "001 - SEMICONDUCTORS AND ACTIVES - GPU",
			urn: "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5315",
			permissions: []
		}
	},
	meta: {
		__self__: "/api/v3/workspaces/70/views/1/fields/RADIOPL2",
		name: "Radio Picklist 2",
		description: "",
		type: {
			link: "/api/v3/field-types/10",
			title: "Radio Button",
			urn: "urn:adsk.plm:tenant.field-type:DEVINDMACHINE.10",
			permissions: [ ]
		},
		defaultValue: {
			link: "/api/v3/workspaces/51/items/5315",
			title: "001 - SEMICONDUCTORS AND ACTIVES - GPU",
			urn: "urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE.51.5315",
			permissions: [ ]
		},
		unitOfMeasure: null,
		fieldLength: null,
		fieldPrecision: null,
		displayOrder: 2,
		displayLength: null,
		editability: "ALWAYS",
		visibility: "ALWAYS",
		derived: false,
		picklist: "/api/v3/lookups/CUSTOM_LOOKUP_WS_CLASSIFICATION_STRUCTURE",
		validators: null,
		visibleOnPreview: false,
		label: null,
		picklistFieldDefinition: "/api/v3/workspaces/51/views/1/fields/DESCRIPTOR"
	}
}]);
