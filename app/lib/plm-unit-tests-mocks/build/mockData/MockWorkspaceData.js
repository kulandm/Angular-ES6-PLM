'use strict';

angular.module('plm360.mockData').value('MockWorkspaceData', [
	{
		section: {
			id: 19,
			displayName: 'Change Management',
			iconResourceUrl: 'icon-plm-stamp'
		},
		workspace: {
			id: 111,
			url: 'api\/v2\/workspaces\/111',
			displayName: 'Change Orders',
			systemName: 'WS_CHANGE_ORDERS_3',
			description: '',
			workspaceTypeId: 'REVISIONING',
			onCreateScriptId: null,
			onEditScriptId: null,
			onDemandScriptIds: null,
			link: 'api\/v2\/workspaces\/111'
		},
		json: {
			id: 111,
			displayName: 'Change Orders',
			systemName: 'WS_CHANGE_ORDERS_3',
			workspaceTypeId: 'REVISIONING',
			itemFieldDefinitions: [{
				id: 'RELATED_SUPPLIERS',
				displayName: 'Related Suppliers',
				description: '',
				fieldTypeId: 'PICK_LIST_LINKED',
				unitOfMeasure: null,
				displayLength: 50,
				fieldLength: null,
				editable: 'ALWAYS',
				visible: 'ALWAYS',
				defaultValue: null,
				fieldPrecision: null,
				isDerived: false,
				pivotFieldDefinitionId: null,
				sourceFieldDefinitionId: null,
				picklistId: 'CUSTOM_LOOKUP_WS_SUPPLIERS',
				picklistFieldDefinitionId: 'DESCRIPTOR',
				triggerAjax: false,
				sentToAjax: false,
				validations: null
			}, {
				id: 'NUMBER',
				displayName: 'Number',
				description: '',
				fieldTypeId: 'AUTO_NUMBER',
				unitOfMeasure: null,
				displayLength: null,
				fieldLength: null,
				editable: 'NEVER',
				visible: 'ALWAYS',
				defaultValue: null,
				fieldPrecision: null,
				isDerived: false,
				pivotFieldDefinitionId: null,
				sourceFieldDefinitionId: null,
				picklistId: null,
				picklistFieldDefinitionId: null,
				triggerAjax: false,
				sentToAjax: false,
				validations: null
			}],
			itemSections: [{
				id: 214,
				displayName: 'Summary',
				descrption: '',
				fieldDefinitionIds: ['RELATED_SUPPLIERS', 'NUMBER', 'TITLE', 'TYPE'],
				collapsable: false,
				layout: {
					matrices: [],
					elements: [{
					id: 'RELATED_SUPPLIERS',
						type: 'FIELD'
					}, {
						id: 'NUMBER',
						type: 'FIELD'
					}, {
						id: 'TITLE',
						type: 'FIELD'
					}, {
						id: 'TYPE',
						type: 'FIELD'
					}]
				},
				canEditFieldValues: true,
				sectionType: 0,
				sectionUrn: 'urn:adsk.plm:tenant.workspace:STANDARDDEMO/111',
				classificationURL: null
			}, {
				id: 216,
				displayName: 'Details',
				descrption: '',
				fieldDefinitionIds: ['CHANGE_REASON_CODE', 'DESCRIPTION_OF_CHANGE'],
				collapsable: false,
				layout: {
					matrices: [],
					elements: [{
						id: 'CHANGE_REASON_CODE',
						type: 'FIELD'
					}, {
						id: 'DESCRIPTION_OF_CHANGE',
						type: 'FIELD'
					}]
				},
				canEditFieldValues: true,
				sectionType: 0,
				sectionUrn: 'urn:adsk.plm:tenant.workspace:STANDARDDEMO/111',
				classificationURL: null
			}],
			descriptorFields: ['NUMBER', 'TITLE'],
			canAddItems: true,
			canEditItems: true,
			canDeleteItems: true,
			canAddAttachments: true,
			canEditAttachments: true,
			canDeleteAttachments: true,
			tabs: {
				PART_HISTORY: {
					name: 'Change Log'
				},
				ACTIONS_NOTIFICATIONS: {
					name: 'Actions Notifications'
				},
				SOURCING: {
					name: 'Sourcing'
				},
				WORKFLOW_ACTIONS: {
					name: 'Workflow Actions'
				},
				BOM_WHERE_USED: {
					name: 'Where Used'
				},
				WORKFLOW_REFERENCES: {
					name: 'Workflow'
				},
				PROJECT_MANAGEMENT: {
					name: 'Change Tasks'
				},
				PART_ATTACHMENTS: {
					name: 'Attachments'
				},
				PART_MILESTONES: {
					name: 'Milestones'
				},
				ITEM_DETAILS: {
					name: 'Details'
				},
				BOM_FLAT: {
					name: 'Flat BOM'
				},
				LINKEDITEMS: {
					name: 'Affected Items'
				},
				RELATIONSHIPS: {
					name: 'Relationships'
				},
				BOM_LIST: {
					name: 'Bill of Materials'
				},
				SUPPLIED_PART: {
					name: 'Supplied Items'
				},
				PART_GRID: {
					name: 'Material Disposition'
				}
			},
			route: 'api\/v2\/workspaces\/111',
			reqParams: null,
			fromServer: true,
			parentResource: null,
			restangularCollection: false,
			urn: 'urn:adsk.plm:tenant.workspace:STANDARDDEMO.111' 
		},
		views: {
			link: 'api\/rest\/v1\/workspaces\/111\/views.json'
		},
		item: {
			link: 'api\/v3\/workspaces\/111\/items\/[dmsId]\/views\/1'
		},
		tabs: {
			link: 'api\/v3\/workspaces\/111\/tabs'
		},
		userPermissions: {
			link: 'api\/v3\/workspaces\/111\/users\/[userId]\/permissions'
		},
		relatedWorkspaces: {
			link: 'api\/v3\/workspaces\/111\/views\/100\/related-workspaces'
		}
	},
	{
		section: {
			id: 19,
			displayName: 'Change Management',
			iconResourceUrl: 'icon-plm-stamp'
		},
		workspace: {
			id: 200,
			url: 'api\/v2\/workspaces\/200',
			displayName: 'Change Request',
			systemName: 'WS_CHANGE_ORDERS_3',
			description: '',
			workspaceTypeId: 'REVISIONING',
			onCreateScriptId: null,
			onEditScriptId: null,
			onDemandScriptIds: null,
			link: 'api\/v2\/workspaces\/200'
		},
		json: {
			id: 200,
			displayName: 'Change Request',
			systemName: 'WS_CHANGE_ORDERS_3',
			workspaceTypeId: 'REVISIONING',
			itemFieldDefinitions: [{
				id: 'RELATED_SUPPLIERS',
				displayName: 'Related Suppliers',
				description: '',
				fieldTypeId: 'PICK_LIST_LINKED',
				unitOfMeasure: null,
				displayLength: 50,
				fieldLength: null,
				editable: 'ALWAYS',
				visible: 'ALWAYS',
				defaultValue: null,
				fieldPrecision: null,
				isDerived: false,
				pivotFieldDefinitionId: null,
				sourceFieldDefinitionId: null,
				picklistId: 'CUSTOM_LOOKUP_WS_SUPPLIERS',
				picklistFieldDefinitionId: 'DESCRIPTOR',
				triggerAjax: false,
				sentToAjax: false,
				validations: null
			}, {
				id: 'NUMBER',
				displayName: 'Number',
				description: '',
				fieldTypeId: 'AUTO_NUMBER',
				unitOfMeasure: null,
				displayLength: null,
				fieldLength: null,
				editable: 'NEVER',
				visible: 'ALWAYS',
				defaultValue: null,
				fieldPrecision: null,
				isDerived: false,
				pivotFieldDefinitionId: null,
				sourceFieldDefinitionId: null,
				picklistId: null,
				picklistFieldDefinitionId: null,
				triggerAjax: false,
				sentToAjax: false,
				validations: null
			}],
			itemSections: [{
				id: 214,
				displayName: 'Summary',
				descrption: '',
				fieldDefinitionIds: ['RELATED_SUPPLIERS', 'NUMBER', 'TITLE', 'TYPE'],
				collapsable: false,
				layout: {
					matrices: [],
					elements: [{
						id: 'RELATED_SUPPLIERS',
						type: 'FIELD'
					}, {
						id: 'NUMBER',
						type: 'FIELD'
					}, {
						id: 'TITLE',
						type: 'FIELD'
					}, {
						id: 'TYPE',
						type: 'FIELD'
					}]
				},
				canEditFieldValues: true,
				sectionType: 0,
				sectionUrn: 'urn:adsk.plm:tenant.workspace:STANDARDDEMO/200',
				classificationURL: null
			}, {
				id: 216,
				displayName: 'Details',
				descrption: '',
				fieldDefinitionIds: ['CHANGE_REASON_CODE', 'DESCRIPTION_OF_CHANGE'],
				collapsable: false,
				layout: {
					matrices: [],
					elements: [{
						id: 'CHANGE_REASON_CODE',
						type: 'FIELD'
					}, {
						id: 'DESCRIPTION_OF_CHANGE',
						type: 'FIELD'
					}]
				},
				canEditFieldValues: true,
				sectionType: 0,
				sectionUrn: 'urn:adsk.plm:tenant.workspace:STANDARDDEMO/200',
				classificationURL: null
			}],
			descriptorFields: ['NUMBER', 'TITLE'],
			canAddItems: true,
			canEditItems: true,
			canDeleteItems: true,
			canAddAttachments: true,
			canEditAttachments: true,
			canDeleteAttachments: true,
			tabs: {
				PART_HISTORY: {
					name: 'Change Log'
				},
				ACTIONS_NOTIFICATIONS: {
					name: 'Actions Notifications'
				},
				SOURCING: {
					name: 'Sourcing'
				},
				WORKFLOW_ACTIONS: {
					name: 'Workflow Actions'
				},
				BOM_WHERE_USED: {
					name: 'Where Used'
				},
				WORKFLOW_REFERENCES: {
					name: 'Workflow'
				},
				PROJCT_MANAGEMENT: {
					name: 'Change Tasks'
				},
				PART_ATTACHMENTS: {
					name: 'Attachments'
				},
				PART_MILESTONES: {
					name: 'Milestones'
				},
				ITEM_DETAILS: {
					name: 'Details'
				},
				BOM_FLAT: {
					name: 'Flat BOM'
				},
				LINKEDITEMS: {
					name: 'Affected Items'
				},
				RELATIONSHIPS: {
					name: 'Relationships'
				},
				BOM_LIST: {
					name: 'Bill of Materials'
				},
				SUPPLIED_PART: {
					name: 'Supplied Items'
				},
				PART_GRID: {
					name: 'Material Disposition'
				}
			},
			route: 'api\/v2\/workspaces\/200',
			reqParams: null,
			fromServer: true,
			parentResource: null,
			restangularCollection: false
		},
		views: {
			link: 'api\/rest\/v1\/workspaces\/200\/views.json'
		},
		item: {
			link: 'api\/v3\/workspaces\/200\/items\/[dmsId]\/views\/1'
		},
		tabs: {
			link: 'api\/v3\/workspaces\/200\/tabs'
		},
		userPermissions: {
			link: 'api\/v3\/workspaces\/200\/users\/[userId]\/permissions'
		},
		relatedWorkspaces: {
			link: 'api\/v3\/workspaces\/200\/views\/100\/related-workspaces'
		}
	}
]);
