import ViewWipAttachmentsController from './viewWipAttachments.controller.js';

import 'com/autodesk/cpdm.js';
import 'com/autodesk/WipApiService.js';
import 'com/autodesk/wipFileBrowser.js';
import 'com/autodesk/services/cpdmAttachmentsService.js';
import 'com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js';
import 'com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js';
import 'com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js';
import 'com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js';

angular.module(__moduleName, [
	'com/autodesk/fileOverview.js',
	'com/autodesk/WipApiService.js',
	'com/autodesk/RESTWrapperService.js',
	'com/autodesk/wipFileBrowser.js',
	'com/autodesk/cpdm.js',
	'com/autodesk/services/cpdmAttachmentsService.js',
	'com/autodesk/components/wipAttachmentsGrid/wipAttachmentsGrid.js',
	'com/autodesk/components/wipAttachmentsTooltip/wipAttachmentTooltip.js',
	'com/autodesk/components/wipFileBrowserDialog/wipFileBrowserDialog.js',
	'com/autodesk/components/wipAttachmentsDeleteDialog/wipAttachmentsDeleteDialog.js'
])
.controller('ViewWipAttachmentsController', ViewWipAttachmentsController);
