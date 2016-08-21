import ViewAttachmentsController from './viewAttachments.controller.js';
import 'com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js';
import 'com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js';
import 'com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js';

angular.module(__moduleName, [
	'com/autodesk/components/classicAttachmentsGrid/classicAttachmentsGrid.js',
	'com/autodesk/components/classicAttachmentsDialog/classicAttachmentsDialog.js',
	'com/autodesk/components/classicAttachmentsActionButton/classicAttachmentsActionButton.js'
])
.controller('ViewAttachmentsController', ViewAttachmentsController);
