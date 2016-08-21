'use strict';

angular.module('plm360.mockData').value('MockBomItemNumberData', {
	
	newData: {
		fieldPropertyId: 'BOM_ITEM_NUMBER',
		fieldTab: 'SYSTEM',
		value: {
			depth: 2,
			itemNumber: 1315
		}
	},
	
	directiveData: {
		itemNumberField: {
			fieldPropertyId: 'BOM_ITEM_NUMBER',
			fieldTab: 'SYSTEM',
			value: {
				depth: 2,
				itemNumber: 20
			}
		},
		editView: false,
		isExpandable: true,
		isCollapsed: false,
		editOnclick: true,
		directiveHtml: 
		    '<bom-item-number \
				field-data="itemNumberData"\
				expand-row="expanRow" \
				collapse-row="collpaseRow" \
				is-expandable="isExpandable" \
				is-collapsed="isCollapsed" \
				edit-on-click="{{editOnclick}}" \
				on-edit-end="onEditEnd" \
				edit-view="{{editView}}">\
			</bom-item-number>'
	}
});