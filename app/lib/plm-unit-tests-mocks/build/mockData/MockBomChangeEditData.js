'use strict';

angular.module('plm360.mockData').value('MockBomChangeEditData', {
	edge1: {
		fields: [
			{
				edits: [
					{
						raw: {
							edgeId: '112',
							targetFieldData: {
								getFieldId: () => {
									return 'TESTING_FIELD';
								},
								getViewDefFieldInfo: () => {
									return {
										link: 'someLink'
									};
								},
								getFieldSemantics: () => {
									return '$$BASIC';
								},
								originalValue: '111'
							},
							currentValue: '125'
						},
						payload: {
							metaData: {
								link: 'someLink'
							},
							value: '125'
						}
					},
					{
						raw: {
							edgeId: '112',
							targetFieldData: {
								getFieldId: () => {
									return 'TESTING_FIELD';
								},
								getViewDefFieldInfo: () => {
									return {
										link: 'someLink'
									};
								},
								getFieldSemantics: () => {
									return '$$BASIC';
								},
								originalValue: '111'
							},
							currentValue: '1009'
						},
						payload: {
							metaData: {
								link: 'someLink'
							},
							value: '1009'
						}
					},
					{
						raw: {
							edgeId: '112',
							targetFieldData: {
								getFieldId: () => {
									return 'TESTING_FIELD';
								},
								getViewDefFieldInfo: () => {
									return {
										link: 'someLink'
									};
								},
								getFieldSemantics: () => {
									return '$$BASIC';
								},
								originalValue: '1.00'
							},
							currentValue: '1.00'
						},
						payload: {
							metaData: {
								link: 'someLink'
							},
							value: '1.00'
						}
					}
				]
			},
			{
				edits: [{
					raw: {
						edgeId: '112',
						targetFieldData: {
							getFieldId: () => {
								return 'TESTING_FIELD2';
							},
							getViewDefFieldInfo: () => {
								return {
									link: 'someOtherLink'
								};
							},
							getFieldSemantics: () => {
								return '$$BASIC';
							},
							originalValue: '1.00'
						},
						currentValue: '---'
					},
					payload: {
						metaData: {
							link: 'someOtherLink'
						},
						value: '---'
					}
				}]
			},
			{
				edits: [{
					raw: {
						edgeId: '112',
						targetFieldData: {
							getFieldId: () => {
								return 'QUANTITY';
							},
							getFieldSemantics: () => {
								return '$$QUANTITY';
							},
							originalValue: '2.00'
						},
						currentValue: '2.00'
					}
				}]
			},
			{
				edits: [{
					raw: {
						edgeId: '112',
						targetFieldData: {
							getFieldId: () => {
								return 'PIN';
							},
							getFieldSemantics: () => {
								return '$$PINNING';
							},
							originalValue: 'false'
						},
						currentValue: 'true',
						revisionField: {
							getFieldId: () => {
								return 'REVISION';
							},
							getFieldSemantics: () => {
								return '$$REVISION';
							},
							originalValue: {
								title: 'A',
								version: {
									item: {
										link: 'Some link'
									}
								}
							}
						},
						currentRevision: {
							title: 'B',
							version: {
								item: {
									link: 'Some Other link'
								}
							}
						}
					}
				}, {
					raw: {
						edgeId: '112',
						targetFieldData: {
							getFieldId: () => {
								return 'PINNING';
							},
							getFieldSemantics: () => {
								return '$$PINNING';
							},
							originalValue: 'false'
						},
						currentValue: 'true',
						targetItem: {
							link: 'Some Other link'
						}
					}
				}]
			},
			{
				edits: [{
					raw: {
						edgeId: '112',
						targetFieldData: {
							getFieldId: () => {
								return 'BOM_ITEM_NUMBER';
							},
							getFieldSemantics: () => {
								return '$$BOM_ITEM_NUMBER';
							},
							originalValue: {
								itemNumber: '1'
							}
						},
						currentValue: {
							itemNumber: '2'
						}
					}
				}]
			}
		]
	},
	edge2: {
		fields: [
			{
				edits: [{
					raw: {
						edgeId: '113',
						targetFieldData: {
							getFieldId: () => {
								return 'TESTING_FIELD';
							},
							getViewDefFieldInfo: () => {
								return {
									link: 'someLink'
								};
							},
							getFieldSemantics: () => {
								return '$$BASIC';
							},
							originalValue: '1.00'
						},
						currentValue: '13413'
					},
					payload: {
						metaData: {
							link: 'someLink'
						},
						value: '13413'
					}
				}]
			}
		]
	}
});
