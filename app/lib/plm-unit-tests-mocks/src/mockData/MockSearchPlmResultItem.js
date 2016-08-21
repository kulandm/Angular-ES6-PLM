'use strict';

/**
 * Search PLM response item object
 */
angular.module('plm360.mockData').value('MockSearchPlmResultItem', {
	'descriptor' : 'Descriptor field',
	'owner' : 'Owner name',
	'urn' : 'urn:adsk.plm:tenant.workspace.item:SELENIUM.1.1234',
	'category' : 'Category Name',
	'creator' : 'Creator name',
	'workspaceShortName' : 'Workspace short name',
	'workspaceLongName' : 'Workspace long name',
	'categoryThumbnailSmall' : '/images/home/icon.png',
	'categoryThumbnail' : '/images/home/icon.png',
	'__self__' : '/api/v3/workspaces/1/items/1234'
});