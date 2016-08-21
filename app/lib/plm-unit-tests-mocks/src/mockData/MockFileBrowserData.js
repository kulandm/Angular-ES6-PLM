'use strict';

angular.module('plm360.mockData').value('MockFileBrowserData', {
	versionedFiles: [
		{
			lineage: {
				urn: 'urn:adsk.wipqa:dm.lineage:7ulxP4myRBKlPdSHTG99MA'
			},
			versionedFile: {
				fileType: 'dwg',
				title: 'title',
				createUserName: 'User Name',
				fileSize: 7478,
				lastModifiedTime: '2016-01-29T02:53:23+0000'
			}
		}
	],
	folders: [
		{
			urn: 'urn:adsk.wipqa:fs.folder:co.GSsjMg0NR6uKPWhZqLCB_g',
			name: 'Folder Name',
			title: 'Folder Title',
			createUserName : 'User Name',
			lastModifiedTime: '2016-01-22T07:09:35+0000'
		}
	]
});