'use strict';

angular.module('plm360.mockData')
	.value('MockViewDetailsData', {
		data: {
			__self__: '/api/v3/workspaces/23/items/4807',
			urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.23.4807',
			workspace: {
				link: '/api/v3/workspaces/23',
				title: 'R_Lock_N_Script',
				urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE1001.23',
				permissions: []
			},
			root: {
				link: '/api/v3/workspaces/23/items/4807',
				title: '  eco in lock state',
				urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.23.4807',
				permissions: []
			},
			title: '  eco in lock state',
			deleted: false,
			latestRelease: true,
			workingVersion: true,
			itemLocked: true,
			workflowReference: false,
			workingHasChanged: false,
			currentState: {
				link: '/api/v3/workspaces/23/workflows/1/states/27',
				title: 'lock state',
				urn: 'urn:adsk.plm:tenant.workspace.workflow.state:DEVINDMACHINE1001.23.1.27',
				permissions: []
			},
			lifecycle: {
				link: '/api/v3/workflows/9223372036854775807/states/0',
				title: 'Unreleased',
				urn: 'urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1001.9223372036854775807.0',
				permissions: []
			},
			bom: {
				link: '/api/v3/workspaces/23/items/4807/bom',
				permissions: []
			},
			nestedBom: {
				link: '/api/v3/workspaces/23/items/4807/bom-items',
				count: 0,
				permissions: []
			},
			whereUsed: {
				link: '/api/v3/workspaces/23/items/4807/where-used',
				count: {
					value: 0,
					type: 'EXACT'
				}
			},
			sections: [{
				link: '/api/v3/workspaces/23/items/4807/views/1/sections/32',
				title: 'Ipitempe Details Fields',
				sectionLocked: false,
				fields: [{
					__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/NUMBER2',
					urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.NUMBER2',
					title: 'Number2',
					type: {
						link: '/api/v3/field-types/30',
						title: 'Integer',
						urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.30',
						permissions: []
					},
					value: null,
					defaultValue: '',
					metadata: {
						dataTypeId: 30
					}
				}]
			}, {
				link: '/api/v3/workspaces/23/items/4807/views/1/sections/27',
				title: 'Section 1',
				sectionLocked: true,
				fields: [{
					__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/NUMBER',
					urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.NUMBER',
					title: 'Number',
					type: {
						link: '/api/v3/field-types/4',
						title: 'Single Line Text',
						urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.4',
						permissions: []
					},
					value: null,
					defaultValue: '',
					metadata: {
						dataTypeId: 4
					}
				}, {
					__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/NAME',
					urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.NAME',
					title: 'name',
					type: {
						link: '/api/v3/field-types/4',
						title: 'Single Line Text',
						urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.4',
						permissions: []
					},
					value: 'eco in lock state',
					defaultValue: '',
					metadata: {
						dataTypeId: 4
					}
				}, {
					__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/COMMENT',
					urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.COMMENT',
					title: 'COMMENT',
					type: {
						link: '/api/v3/field-types/4',
						title: 'Single Line Text',
						urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.4',
						permissions: []
					},
					value: null,
					defaultValue: '',
					metadata: {
						dataTypeId: 4
					}
				}]
			}],
			milestones: {
				link: '/api/v3/workspaces/23/items/4807/views/17',
				permissions: []
			},
			originalElement: {
				__self__: '/api/v3/workspaces/23/items/4807',
				urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.23.4807',
				workspace: {
					link: '/api/v3/workspaces/23',
					title: 'R_Lock_N_Script',
					urn: 'urn:adsk.plm:tenant.workspace:DEVINDMACHINE1001.23',
					permissions: []
				},
				root: {
					link: '/api/v3/workspaces/23/items/4807',
					title: '  eco in lock state',
					urn: 'urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.23.4807',
					permissions: []
				},
				title: '  eco in lock state',
				deleted: false,
				latestRelease: true,
				workingVersion: true,
				itemLocked: true,
				workflowReference: false,
				orkingHasChanged: false,
				currentState: {
					link: '/api/v3/workspaces/23/workflows/1/states/27',
					title: 'lock state',
					urn: 'urn:adsk.plm:tenant.workspace.workflow.state:DEVINDMACHINE1001.23.1.27',
					permissions: []
				},
				lifecycle: {
					link: '/api/v3/workflows/9223372036854775807/states/0',
					title: 'Unreleased',
					urn: 'urn:adsk.plm:tenant.workflow.state:DEVINDMACHINE1001.9223372036854775807.0',
					permissions: []
				},
				bom: {
					link: '/api/v3/workspaces/23/items/4807/bom',
					permissions: []
				},
				nestedBom: {
					link: '/api/v3/workspaces/23/items/4807/bom-items',
					count: 0,
					permissions: []
				},
				whereUsed: {
					link: '/api/v3/workspaces/23/items/4807/where-used',
					count: {
						value: 0,
						type: 'EXACT'
					}
				},
				sections: [{
					link: '/api/v3/workspaces/23/items/4807/views/1/sections/32',
					title: 'Ipitempe Details Fields',
					sectionLocked: false,
					fields: [{
						__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/NUMBER2',
						urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.NUMBER2',
						title: 'Number2',
						type: {
							link: '/api/v3/field-types/30',
							title: 'Integer',
							urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.30',
							permissions: []
						},
						value: null,
						defaultValue: ''
					}]
				}, {
					link: '/api/v3/workspaces/23/items/4807/views/1/sections/27',
					title: 'Section 1',
					sectionLocked: true,
					fields: [{
						__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/NUMBER',
						urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.NUMBER',
						title: 'Number',
						type: {
							link: '/api/v3/field-types/4',
							title: 'Single Line Text',
							urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.4',
							permissions: []
						},
						value: null,
						defaultValue: ''
					}, {
						__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/NAME',
						urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.NAME',
						title: 'name',
						type: {
							link: '/api/v3/field-types/4',
							title: 'Single Line Text',
							urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.4',
							permissions: []
						},
						value: 'eco in lock state',
						defaultValue: ''
					}, {
						__self__: '/api/v3/workspaces/23/items/4807/views/1/fields/COMMENT',
						urn: 'urn:adsk.plm:tenant.workspace.item.view.field:DEVINDMACHINE1001.23.4807.1.COMMENT',
						title: 'COMMENT',
						type: {
							link: '/api/v3/field-types/4',
							title: 'Single Line Text',
							urn: 'urn:adsk.plm:tenant.field-type:DEVINDMACHINE1001.4',
							permissions: []
						},
						value: null,
						defaultValue: ''
					}]
				}],
				milestones: {
					link: '/api/v3/workspaces/23/items/4807/views/17',
					permissions: []
				}
			},
			restangularEtag: '\'TBAHjW/iRWZCHfzGKqiNxzxkNYk=\'',
			route: 'api/v3/urn:adsk.plm:tenant.workspace.item:DEVINDMACHINE1001.23.4807',
			reqParams: null,
			fromServer: true,
			parentResource: null,
			restangularCollection: false,
			id: '4807'
		}
	});
